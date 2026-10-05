import "server-only";

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  attachments?: { filename: string; content: Buffer }[];
}

/**
 * Canal d'envoi des notifications.
 * - `ResendMailer` si RESEND_API_KEY est défini (https://resend.com — appel HTTP, sans dépendance)
 * - sinon `ConsoleMailer` : affiche les emails dans la console du serveur (développement)
 *
 * Pour un autre fournisseur (Brevo, Postmark, SMTP…), il suffit d'ajouter une classe implémentant `Mailer`.
 */
export interface Mailer {
  readonly configured: boolean;
  send(message: EmailMessage): Promise<void>;
}

class ConsoleMailer implements Mailer {
  readonly configured = false;
  async send(message: EmailMessage) {
    console.info(
      `\n✉️  [email non envoyé — RESEND_API_KEY absent]\n   À : ${message.to}\n   Objet : ${message.subject}\n   Pièces jointes : ${message.attachments?.length ?? 0}\n${message.text
        .split("\n")
        .map((l) => `   │ ${l}`)
        .join("\n")}\n`,
    );
  }
}

class ResendMailer implements Mailer {
  readonly configured = true;
  constructor(
    private apiKey: string,
    private from: string,
  ) {}

  async send(message: EmailMessage) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${this.apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: this.from,
        to: [message.to],
        subject: message.subject,
        html: message.html,
        text: message.text,
        reply_to: message.replyTo,
        attachments: message.attachments?.map((a) => ({ filename: a.filename, content: a.content.toString("base64") })),
      }),
    });
    if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
  }
}

export function getMailer(): Mailer {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  return key && from ? new ResendMailer(key, from) : new ConsoleMailer();
}

/** Adresse de Roza Bakery qui reçoit les demandes (variable d'environnement). */
export function bakeryInbox(): string | null {
  return process.env.BAKERY_NOTIFICATION_EMAIL || null;
}

"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error ?? "Envoi impossible.");
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Envoi impossible.");
    }
  }

  if (status === "sent") {
    return (
      <div className="animate-fade-up rounded-[1.6rem] bg-paper p-8 text-center" role="status">
        <p className="script text-4xl text-rose-deep">merci</p>
        <p className="mt-3 font-serif text-2xl">Votre message est bien parti ♡</p>
        <p className="mt-2 text-sm text-cocoa">Roza Bakery vous répondra dès que possible.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-[1.6rem] bg-paper p-6 ring-1 ring-chocolate/5 md:p-9">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="c-name" className="mb-2 block text-sm font-semibold">
            Nom
          </label>
          <input id="c-name" name="name" required autoComplete="name" maxLength={120} className="field" />
        </div>
        <div>
          <label htmlFor="c-phone" className="mb-2 block text-sm font-semibold">
            Téléphone <span className="font-normal text-cocoa">(facultatif)</span>
          </label>
          <input id="c-phone" name="phone" type="tel" autoComplete="tel" maxLength={30} className="field" />
        </div>
      </div>
      <div>
        <label htmlFor="c-email" className="mb-2 block text-sm font-semibold">
          Email
        </label>
        <input id="c-email" name="email" type="email" required autoComplete="email" maxLength={160} className="field" />
      </div>
      <div>
        <label htmlFor="c-message" className="mb-2 block text-sm font-semibold">
          Message
        </label>
        <textarea id="c-message" name="message" required minLength={5} maxLength={3000} rows={5} className="field resize-y" />
      </div>
      <div aria-hidden className="absolute -left-[9999px]">
        <input name="website" tabIndex={-1} autoComplete="off" />
      </div>
      {status === "error" && (
        <p role="alert" className="text-sm text-berry">
          {message}
        </p>
      )}
      <Button type="submit" size="lg" arrow disabled={status === "sending"} className="w-full sm:w-auto">
        {status === "sending" ? "Envoi…" : "Envoyer mon message"}
      </Button>
    </form>
  );
}

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { isAdmin } from "@/server/auth";
import { adminConfigured } from "@/server/auth/session";

export const metadata: Metadata = { title: "Connexion" };
export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ suite?: string }> }) {
  const { suite } = await searchParams;
  if (adminConfigured() && (await isAdmin())) redirect("/admin");

  return (
    <div className="flex min-h-dvh items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <p className="font-serif text-5xl italic">Roza</p>
          <p className="mt-1 text-[0.625rem] font-semibold uppercase tracking-[0.4em] text-cocoa">Administration</p>
        </div>
        <div className="mt-10 rounded-[1.6rem] bg-paper p-7 shadow-[0_30px_60px_-40px_rgba(58,37,32,0.5)] ring-1 ring-chocolate/5">
          {adminConfigured() ? (
            <LoginForm suite={suite} />
          ) : (
            <div className="text-sm leading-relaxed text-cocoa">
              <p className="font-serif text-2xl text-chocolate">Accès non configuré</p>
              <p className="mt-3">
                Ajoutez un mot de passe dans le fichier <code className="rounded bg-ivory px-1">.env.local</code> puis redémarrez le
                serveur :
              </p>
              <pre className="mt-3 overflow-x-auto rounded-xl bg-ivory p-3 text-xs">ADMIN_PASSWORD=un-mot-de-passe-solide</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

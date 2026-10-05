"use client";

import { useActionState } from "react";
import { login } from "@/app/admin/actions";
import { inputClass } from "./ui";

export function LoginForm({ suite }: { suite?: string }) {
  const [state, action, pending] = useActionState(login, undefined);
  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="suite" value={suite ?? ""} />
      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-semibold">
          Mot de passe
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          className={inputClass}
          aria-invalid={state?.error ? true : undefined}
          aria-describedby={state?.error ? "login-error" : undefined}
        />
        {state?.error && (
          <p id="login-error" role="alert" className="mt-2 text-sm text-berry">
            {state.error}
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={pending}
        className="min-h-12 w-full rounded-full bg-chocolate text-sm font-semibold text-cream transition active:scale-[0.98] disabled:opacity-60"
      >
        {pending ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}

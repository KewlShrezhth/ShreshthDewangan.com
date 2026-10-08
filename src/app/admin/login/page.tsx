"use client";

import { useActionState } from "react";
import { login } from "./actions";

export default function LoginPage() {
  const [error, formAction, pending] = useActionState(login, undefined);

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <form action={formAction} className="w-full max-w-sm">
        <p className="font-display text-sm text-gold tracking-widest mb-2">Admin</p>
        <h1 className="font-display text-3xl uppercase tracking-tight text-ink mb-6">
          Sign in
        </h1>

        <label className="block text-sm text-ink-soft mb-2" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoFocus
          required
          className="w-full rounded-sm border border-line bg-surface px-4 py-2.5 text-ink outline-none transition-colors focus:border-accent"
        />

        {error && <p className="mt-3 text-sm text-accent">{error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="hover-lift mt-6 w-full rounded-sm bg-accent px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-paper shadow-soft hover:shadow-lift disabled:opacity-60"
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}

"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { importSeedProperties, restoreRevision } from "@/app/admin/actions";

const primaryButton =
  "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-[14px] font-semibold text-on-primary transition hover:opacity-90 disabled:opacity-40";
const field =
  "w-full rounded-md border border-outline-variant bg-white px-3 py-2 text-[15px] text-primary outline-none focus:border-muted-azure-dim focus:ring-2 focus:ring-muted-azure/30";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        start(async () => {
          const supabase = createBrowserSupabase();
          const { error: err } = await supabase.auth.signInWithPassword({ email, password });
          if (err) {
            setError(
              err.message === "Invalid login credentials"
                ? "That email and password do not match."
                : err.message,
            );
            return;
          }
          const next = params.get("next");
          router.replace(next && next.startsWith("/admin") ? next : "/admin");
          router.refresh();
        });
      }}
    >
      <div>
        <label htmlFor="email" className="text-[13px] font-semibold text-primary">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="username"
          required
          className={field}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password" className="text-[13px] font-semibold text-primary">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          className={field}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && (
        <p role="alert" className="text-[14px] text-red-700">
          {error}
        </p>
      )}
      <button type="submit" disabled={pending} className={`${primaryButton} w-full`}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

export function PasswordForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();

  return (
    <form
      className="max-w-sm space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (password.length < 10) {
          setStatus({ ok: false, text: "Use at least 10 characters." });
          return;
        }
        if (password !== confirm) {
          setStatus({ ok: false, text: "The two passwords do not match." });
          return;
        }
        start(async () => {
          const { error } = await createBrowserSupabase().auth.updateUser({ password });
          if (error) setStatus({ ok: false, text: error.message });
          else {
            setStatus({ ok: true, text: "Password changed." });
            setPassword("");
            setConfirm("");
          }
        });
      }}
    >
      <div>
        <label htmlFor="new-password" className="text-[13px] font-semibold text-primary">
          New password
        </label>
        <input
          id="new-password"
          type="password"
          autoComplete="new-password"
          className={field}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="confirm-password" className="text-[13px] font-semibold text-primary">
          Repeat it
        </label>
        <input
          id="confirm-password"
          type="password"
          autoComplete="new-password"
          className={field}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
      </div>
      {status && (
        <p role="status" className={`text-[14px] ${status.ok ? "text-emerald-700" : "text-red-700"}`}>
          {status.text}
        </p>
      )}
      <button type="submit" disabled={pending} className={primaryButton}>
        {pending ? "Saving…" : "Change password"}
      </button>
    </form>
  );
}

export function ImportSeedButton({ count }: { count: number }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        disabled={pending}
        className={primaryButton}
        onClick={() =>
          start(async () => {
            const r = await importSeedProperties();
            setMessage(r.ok ? (r.message ?? "Imported.") : r.message);
            router.refresh();
          })
        }
      >
        {pending ? "Importing…" : `Import the ${count} properties from the website`}
      </button>
      {message && <span className="text-[14px] text-primary">{message}</span>}
    </div>
  );
}

export function RestoreButton({ id, label }: { id: number; label: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      className="inline-flex items-center rounded-md border border-outline-variant bg-white px-3 py-1.5 text-[13px] font-medium text-primary transition hover:bg-surface-container-low disabled:opacity-40"
      onClick={() => {
        if (!confirm(`Put back this earlier version of ${label}? It goes live immediately.`)) return;
        start(async () => {
          const r = await restoreRevision(id);
          alert(r.ok ? (r.message ?? "Restored.") : r.message);
          router.refresh();
        });
      }}
    >
      {pending ? "Restoring…" : "Restore this version"}
    </button>
  );
}

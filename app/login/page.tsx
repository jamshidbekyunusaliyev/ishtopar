"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    const data = new FormData(event.currentTarget);
    const result = await signIn("credentials", { email: data.get("email"), password: data.get("password"), redirect: false });
    setBusy(false);
    if (result?.error) {
      setError("Email or password is incorrect, or this account is temporarily limited.");
      return;
    }
    window.location.assign(result?.url ?? "/");
  }

  return <main className="auth-page"><section className="auth-panel"><Link href="/" className="brand"><span className="brand-mark"><span /></span><span>hirely<span className="brand-dot">.</span></span></Link><span className="section-kicker">WELCOME BACK</span><h1>Good to see you.</h1><p>Sign in to continue your search.</p><form onSubmit={submit}><label>Email address<input name="email" type="email" autoComplete="email" required /></label><label>Password<input name="password" type="password" autoComplete="current-password" required /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="filter-submit" disabled={busy}>{busy ? "Signing in..." : "Log in"}</button></form><p className="auth-switch">New to Hirely? <Link href="/signup">Create an account</Link></p><p className="auth-demo">Demo seeker: seeker@example.com · Password123!</p></section></main>;
}
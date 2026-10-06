"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";

export default function SignupPage() {
  const [role, setRole] = useState<"SEEKER" | "EMPLOYER">("SEEKER");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(form)) });
    const result = await response.json();
    if (!response.ok) {
      setError(result.error ?? "Unable to create account.");
      setBusy(false);
      return;
    }
    const login = await signIn("credentials", { email: form.get("email"), password: form.get("password"), redirect: false });
    if (login?.error) {
      setError("Account created. Please sign in to continue.");
      setBusy(false);
      return;
    }
    window.location.assign(role === "EMPLOYER" ? "/employer/dashboard" : "/seeker/dashboard");
  }

  return <main className="auth-page"><section className="auth-panel"><Link href="/" className="brand"><span className="brand-mark"><span /></span><span>hirely<span className="brand-dot">.</span></span></Link><span className="section-kicker">START SOMETHING GOOD</span><h1>Create your account.</h1><p>One profile, more ways forward.</p><div className="role-switch"><button type="button" className={role === "SEEKER" ? "active" : ""} onClick={() => setRole("SEEKER")}>I'm looking for work</button><button type="button" className={role === "EMPLOYER" ? "active" : ""} onClick={() => setRole("EMPLOYER")}>I'm hiring</button></div><form onSubmit={submit}><input type="hidden" name="role" value={role} /><label>Your name<input name="name" autoComplete="name" minLength={2} required /></label>{role === "EMPLOYER" && <label>Company name<input name="companyName" minLength={2} required /></label>}<label>Email address<input name="email" type="email" autoComplete="email" required /></label><label>Password<input name="password" type="password" autoComplete="new-password" minLength={8} required /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="filter-submit" disabled={busy}>{busy ? "Creating account..." : "Create account"}</button></form><p className="auth-switch">Already have an account? <Link href="/login">Log in</Link></p></section></main>;
}
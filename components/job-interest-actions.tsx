"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Role = "SEEKER" | "EMPLOYER" | "ADMIN" | null;

export default function JobInterestActions({ jobId, role, isSaved, hasApplied }: { jobId: string; role: Role; isSaved: boolean; hasApplied: boolean }) {
  const router = useRouter();
  const [saved, setSaved] = useState(isSaved);
  const [applied, setApplied] = useState(hasApplied);
  const [coverLetter, setCoverLetter] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  async function saveJob() {
    if (role !== "SEEKER") {
      router.push("/login");
      return;
    }
    setBusy(true);
    setError("");
    const response = await fetch("/api/seeker/saved", { method: saved ? "DELETE" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ jobId }) });
    const result = await response.json();
    if (!response.ok) setError(result.error ?? "Unable to update saved jobs.");
    else setSaved(Boolean(result.saved));
    setBusy(false);
  }

  async function apply() {
    if (role !== "SEEKER") {
      router.push("/login");
      return;
    }
    if (applied) return;
    setBusy(true);
    setError("");
    const response = await fetch("/api/seeker/applications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ jobId, coverLetter }) });
    const result = await response.json();
    if (!response.ok) setError(result.error ?? "Unable to submit your application.");
    else {
      setApplied(true);
      setNotice("Application sent. The employer has been notified.");
    }
    setBusy(false);
  }

  async function messageEmployer() {
    if (role !== "SEEKER") {
      router.push("/login");
      return;
    }
    setBusy(true);
    setError("");
    const response = await fetch("/api/messages/conversations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ jobId }) });
    const result = await response.json();
    if (!response.ok) {
      setError(result.error ?? "Unable to start a conversation.");
      setBusy(false);
      return;
    }
    router.push(`/messages?conversation=${result.conversation.id}`);
  }

  return <div className="interest-actions"><button type="button" className="detail-apply" onClick={apply} disabled={busy || applied}>{applied ? "Applied" : busy ? "Please wait..." : "Apply now"} <span>↗</span></button><button type="button" className={`save-job${saved ? " is-saved" : ""}`} onClick={saveJob} disabled={busy} aria-label={saved ? "Remove saved job" : "Save job"}>{saved ? "♥" : "♡"}</button><button type="button" className="message-employer" onClick={messageEmployer} disabled={busy}>Message employer</button><label className="cover-letter-field">Add a short note <textarea rows={3} maxLength={4000} value={coverLetter} onChange={(event) => setCoverLetter(event.target.value)} placeholder="Optional cover letter" /></label>{error && <p className="form-error" role="alert">{error}</p>}{notice && <p className="form-success" role="status">{notice}</p>}</div>;
}
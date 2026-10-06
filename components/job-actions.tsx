"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function JobActions({ id, status, isUrgent }: { id: string; status: string; isUrgent: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function update(values: Record<string, unknown>) {
    setBusy(true);
    setError("");
    const response = await fetch(`/api/employer/jobs/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
    const result = await response.json();
    if (!response.ok) setError(result.error ?? "Unable to update this job.");
    else router.refresh();
    setBusy(false);
  }

  async function remove() {
    if (!window.confirm("Delete this job and its applications? This cannot be undone.")) return;
    setBusy(true);
    const response = await fetch(`/api/employer/jobs/${id}`, { method: "DELETE" });
    if (response.ok) router.refresh();
    else setError("Unable to delete this job.");
    setBusy(false);
  }

  return <div className="job-actions"><button type="button" disabled={busy} onClick={() => update({ status: status === "OPEN" ? "CLOSED" : "OPEN" })}>{status === "OPEN" ? "Close" : "Reopen"}</button><button type="button" disabled={busy} onClick={() => update({ isUrgent: !isUrgent })}>{isUrgent ? "Remove urgent" : "Mark urgent"}</button><button type="button" disabled={busy} onClick={remove}>Delete</button>{error && <span role="alert">{error}</span>}</div>;
}
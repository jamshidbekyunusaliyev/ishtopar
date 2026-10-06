"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ApplicationStatusControl({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  async function update(nextStatus: "VIEWED" | "ACCEPTED" | "REJECTED") {
    setError("");
    const response = await fetch(`/api/employer/applications/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: nextStatus }) });
    const result = await response.json();
    if (!response.ok) setError(result.error ?? "Unable to update status.");
    else router.refresh();
  }
  return <div className="status-actions">{status === "PENDING" && <button onClick={() => update("VIEWED")}>Mark viewed</button>}<button onClick={() => update("ACCEPTED")}>Accept</button><button onClick={() => update("REJECTED")}>Reject</button>{error && <span role="alert">{error}</span>}</div>;
}
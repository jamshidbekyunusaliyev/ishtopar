"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function JobEditor() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const payload = {
      ...values,
      salaryMin: values.salaryMin ? Number(values.salaryMin) : null,
      salaryMax: values.salaryMax ? Number(values.salaryMax) : null,
    };
    const response = await fetch("/api/employer/jobs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const result = await response.json();
    if (!response.ok) {
      setError(result.error ?? "Unable to publish this job.");
      setBusy(false);
      return;
    }
    router.push("/employer/dashboard");
    router.refresh();
  }

  return <form className="editor-form" onSubmit={submit}><label>Job title<input name="title" minLength={3} maxLength={120} required placeholder="e.g. Product Designer" /></label><label>Job description<textarea name="description" minLength={30} maxLength={12000} rows={7} required placeholder="Describe the role, team and what success looks like." /></label><div className="editor-row"><label>Category<input name="category" required placeholder="Design" /></label><label>Location<input name="location" required placeholder="City or Remote" /></label></div><div className="editor-row"><label>Job type<select name="jobType" defaultValue="FULL_TIME"><option value="FULL_TIME">Full-time</option><option value="PART_TIME">Part-time</option><option value="REMOTE">Remote</option><option value="INTERNSHIP">Internship</option></select></label><label>Experience level<select name="level" defaultValue="INTERMEDIATE"><option value="BEGINNER">Beginner</option><option value="INTERMEDIATE">Intermediate</option><option value="SENIOR">Senior</option></select></label></div><div className="editor-row"><label>Minimum salary<input name="salaryMin" type="number" min="1" placeholder="80000" /></label><label>Maximum salary<input name="salaryMax" type="number" min="1" placeholder="120000" /></label></div>{error && <p className="form-error" role="alert">{error}</p>}<button className="filter-submit" disabled={busy}>{busy ? "Publishing..." : "Publish job"}</button></form>;
}
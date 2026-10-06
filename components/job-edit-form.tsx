"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type EditableJob = { id: string; title: string; description: string; category: string; location: string; jobType: string; level: string; salaryMin: number | null; salaryMax: number | null };

export default function JobEditForm({ job }: { job: EditableJob }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const response = await fetch(`/api/employer/jobs/${job.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...values, salaryMin: values.salaryMin ? Number(values.salaryMin) : null, salaryMax: values.salaryMax ? Number(values.salaryMax) : null }) });
    const result = await response.json();
    if (!response.ok) {
      setError(result.error ?? "Unable to save changes.");
      setBusy(false);
      return;
    }
    router.push("/employer/dashboard");
    router.refresh();
  }
  return <form className="editor-form" onSubmit={submit}><label>Job title<input name="title" defaultValue={job.title} minLength={3} maxLength={120} required /></label><label>Job description<textarea name="description" defaultValue={job.description} minLength={30} maxLength={12000} rows={7} required /></label><div className="editor-row"><label>Category<input name="category" defaultValue={job.category} required /></label><label>Location<input name="location" defaultValue={job.location} required /></label></div><div className="editor-row"><label>Job type<select name="jobType" defaultValue={job.jobType}><option value="FULL_TIME">Full-time</option><option value="PART_TIME">Part-time</option><option value="REMOTE">Remote</option><option value="INTERNSHIP">Internship</option></select></label><label>Experience level<select name="level" defaultValue={job.level}><option value="BEGINNER">Beginner</option><option value="INTERMEDIATE">Intermediate</option><option value="SENIOR">Senior</option></select></label></div><div className="editor-row"><label>Minimum salary<input name="salaryMin" type="number" min="1" defaultValue={job.salaryMin ?? ""} /></label><label>Maximum salary<input name="salaryMax" type="number" min="1" defaultValue={job.salaryMax ?? ""} /></label></div>{error && <p className="form-error" role="alert">{error}</p>}<button className="filter-submit" disabled={busy}>{busy ? "Saving..." : "Save changes"}</button></form>;
}
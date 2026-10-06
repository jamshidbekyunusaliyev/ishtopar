import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Saved jobs" };

export default async function SavedJobsPage() {
  const session = await auth();
  if (!session?.user) return null;
  const saved = await prisma.savedJob.findMany({ where: { userId: session.user.id }, include: { job: { include: { company: true } } }, orderBy: { createdAt: "desc" } });
  return <main className="dash-page"><header className="dash-header"><Link href="/" className="brand"><span className="brand-mark"><span /></span><span>hirely<span className="brand-dot">.</span></span></Link><nav><Link href="/seeker/dashboard">Dashboard</Link><Link href="/seeker/applications">Applications</Link></nav></header><section className="dash-content"><div className="dash-title"><span className="section-kicker">YOUR SEARCH</span><h1>Saved jobs</h1><p>Roles you want to come back to.</p></div><div className="listing-table">{saved.length ? saved.map(({ job }) => <article key={job.id}><div><Link href={`/jobs/${job.id}`}><h3>{job.title}</h3></Link><p>{job.company.name} · {job.location}</p></div><span className={`status-pill status-${job.status.toLowerCase()}`}>{job.status}</span><Link className="company-link" href={`/jobs/${job.id}`}>View role ↗</Link></article>) : <div className="dash-empty"><h3>Nothing saved yet</h3><p>Save a role to keep it close while you decide.</p><Link href="/" className="company-link">Find a job ↗</Link></div>}</div></section></main>;
}
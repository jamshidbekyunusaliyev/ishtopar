import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "My applications" };

export default async function SeekerApplicationsPage() {
  const session = await auth();
  if (!session?.user) return null;
  const applications = await prisma.application.findMany({ where: { seekerId: session.user.id }, include: { job: { include: { company: true } } }, orderBy: { createdAt: "desc" } });
  return <main className="dash-page"><header className="dash-header"><Link href="/" className="brand"><span className="brand-mark"><span /></span><span>hirely<span className="brand-dot">.</span></span></Link><nav><Link href="/seeker/dashboard">Dashboard</Link><Link href="/seeker/saved">Saved jobs</Link></nav></header><section className="dash-content"><div className="dash-title"><span className="section-kicker">YOUR SEARCH</span><h1>Applications</h1><p>Keep an eye on every opportunity you have applied to.</p></div><div className="listing-table">{applications.length ? applications.map((application) => <article key={application.id}><div><Link href={`/jobs/${application.jobId}`}><h3>{application.job.title}</h3></Link><p>{application.job.company.name} · {application.job.location}</p></div><span className={`status-pill status-${application.status.toLowerCase()}`}>{application.status}</span><span className="listing-count">Applied {application.createdAt.toLocaleDateString()}</span><Link className="company-link" href={`/jobs/${application.jobId}`}>View role ↗</Link></article>) : <div className="dash-empty"><h3>Your next opportunity is out there</h3><p>When you apply to a role, it will be listed here.</p><Link href="/" className="company-link">Explore open jobs ↗</Link></div>}</div></section></main>;
}
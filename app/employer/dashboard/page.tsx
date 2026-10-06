import Link from "next/link";
import { auth } from "@/auth";
import JobActions from "@/components/job-actions";
import { formatSalary } from "@/lib/jobs";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Employer dashboard" };

export default async function EmployerDashboard() {
  const session = await auth();
  if (!session?.user) return null;
  const companyIds = await prisma.company.findMany({ where: { ownerId: session.user.id }, select: { id: true } });
  const ids = companyIds.map((company) => company.id);
  const [jobCount, applications, unreadMessages, ownJobs] = await Promise.all([
    prisma.job.count({ where: { companyId: { in: ids } } }),
    prisma.application.count({ where: { job: { companyId: { in: ids } } } }),
    prisma.message.count({ where: { readAt: null, senderId: { not: session.user.id }, conversation: { employerId: session.user.id } } }),
    prisma.job.findMany({ where: { companyId: { in: ids } }, include: { company: true, _count: { select: { applications: true } } }, orderBy: { createdAt: "desc" }, take: 20 }),
  ]);
  return <main className="dash-page"><header className="dash-header"><Link href="/" className="brand"><span className="brand-mark"><span /></span><span>hirely<span className="brand-dot">.</span></span></Link><nav><Link href="/messages">Messages</Link><Link href="/">View jobs</Link></nav></header><section className="dash-content"><div className="dash-title"><span className="section-kicker">EMPLOYER WORKSPACE</span><h1>Good work starts here.</h1><p>Welcome back, {session.user.name ?? "there"}.</p></div><div className="stats-grid"><article><span>Active listings</span><strong>{jobCount}</strong><small>Across your companies</small></article><article><span>Total applications</span><strong>{applications}</strong><small>From job seekers</small></article><article><span>Unread messages</span><strong>{unreadMessages}</strong><small>Waiting for your reply</small></article></div><div className="dash-section-heading"><div><h2>Your job listings</h2><p>Manage openings and review candidates.</p></div><Link href="/employer/jobs/new" className="detail-apply">+ Post a job</Link></div><div className="listing-table">{ownJobs.length ? ownJobs.map((job) => <article key={job.id}><div><Link href={`/employer/jobs/${job.id}/applications`}><h3>{job.title}</h3></Link><p>{job.company.name} · {job.location}</p></div><span className={`status-pill status-${job.status.toLowerCase()}`}>{job.status === "OPEN" ? "Open" : job.status}</span><span className="listing-count">{job._count.applications} applications</span><strong>{job.salaryMin && job.salaryMax ? formatSalary(job.salaryMin, job.salaryMax) : "Salary not listed"}</strong><Link href={`/employer/jobs/${job.id}/edit`} className="company-link">Edit</Link><JobActions id={job.id} status={job.status} isUrgent={job.isUrgent} /></article>) : <div className="dash-empty"><h3>No jobs posted yet</h3><p>Your openings will show up here as soon as you publish them.</p><Link href="/employer/jobs/new" className="company-link">Post your first job ↗</Link></div>}</div></section></main>;
}
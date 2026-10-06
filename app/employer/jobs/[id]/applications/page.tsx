
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import ApplicationStatusControl from "@/components/application-status-control";

type Props = { params: Promise<{ id: string }> };
export const metadata = { title: "Job applications" };

export default async function JobApplicationsPage({ params }: Props) {
  const session = await auth();
  const { id } = await params;
  if (!session?.user) return null;
  const job = await prisma.job.findFirst({ where: { id, company: { ownerId: session.user.id } }, include: { applications: { include: { seeker: { include: { profile: true } } }, orderBy: { createdAt: "desc" } } } });
  if (!job) notFound();
  return <main className="dash-page"><header className="dash-header"><Link href="/" className="brand"><span className="brand-mark"><span /></span><span>hirely<span className="brand-dot">.</span></span></Link><Link href="/employer/dashboard" className="back-link">← Dashboard</Link></header><section className="dash-content"><div className="dash-title"><span className="section-kicker">CANDIDATES</span><h1>{job.title}</h1><p>{job.applications.length} applications for this opening.</p></div><div className="candidate-list">{job.applications.length ? job.applications.map((application) => { const skills = JSON.parse(application.seeker.profile?.skills ?? "[]") as string[]; return <article key={application.id}><div className="candidate-head"><div className="candidate-avatar">{application.seeker.name.slice(0, 1).toUpperCase()}</div><div><h2>{application.seeker.name}</h2><p>{application.seeker.profile?.headline ?? "Job seeker"}{application.seeker.profile?.location ? ` · ${application.seeker.profile.location}` : ""}</p></div><span className={`status-pill status-${application.status.toLowerCase()}`}>{application.status}</span></div>{application.coverLetter && <p className="cover-letter">{application.coverLetter}</p>}<div className="candidate-meta">{skills.map((skill) => <span key={skill}>{skill}</span>)}{application.seeker.profile?.resumeUrl && <a href={application.seeker.profile.resumeUrl} target="_blank" rel="noreferrer">View resume ↗</a>}</div><ApplicationStatusControl id={application.id} status={application.status} /></article>; }) : <div className="dash-empty"><h3>No applications yet</h3><p>New candidates will appear here.</p></div>}</div></section></main>;
}
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { formatSalary, getJob, jobs } from "@/lib/jobs";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const job = getJob(id);
  if (!job) return { title: "Job not found | Hirely" };
  return { title: `${job.title} at ${job.company} | Hirely`, description: `${job.title} in ${job.location}. ${formatSalary(job.salaryMin, job.salaryMax)} per year. Explore the role and apply on Hirely.` };
}

export default async function JobDetails({ params }: Props) {
  const { id } = await params;
  const job = getJob(id);
  if (!job) notFound();
  const similarJobs = jobs.filter((other) => other.id !== id && other.category === job.category).slice(0, 3);
  return (
    <main className="detail-page"><header className="detail-header"><Link href="/" className="brand"><span className="brand-mark"><span /></span><span>hirely<span className="brand-dot">.</span></span></Link><Link href="/" className="back-link">← <span>All jobs</span></Link><Link href="/login" className="login-button">Log in <span>↗</span></Link></header>
      <div className="detail-wrap"><div className="detail-breadcrumb"><Link href="/">Jobs</Link><span>/</span><span>{job.category}</span></div>
        <section className="detail-hero"><div className="company-logo detail-logo" style={{ "--logo-color": job.color } as CSSProperties}>{job.logo}</div><div className="detail-title"><span className="section-kicker">{job.company} <span>·</span> {job.location}</span><h1>{job.title}</h1><div className="job-tags"><span>{job.type}</span><span>{job.level}</span><span>Posted {job.postedDays === 0 ? "today" : `${job.postedDays} days ago`}</span></div></div><div className="detail-actions"><Link href="/login" className="detail-apply">Apply now <span>↗</span></Link><Link href="/login" className="save-job" aria-label="Save job">♡</Link></div></section>
        <div className="detail-content"><article className="description-panel"><div className="description-heading"><h2>About this role</h2><span>{formatSalary(job.salaryMin, job.salaryMax)} / year</span></div><p>{job.description}</p><h3>What you will bring</h3><p>We value thoughtful collaboration, a willingness to learn, and care for the people who use what we build. You will help the team turn ambitious ideas into clear, useful outcomes.</p><ul>{job.skills.map((skill) => <li key={skill}>{skill}</li>)}</ul><h3>About {job.company}</h3><p>{job.company} is a people-first team creating tools that make work more thoughtful. We believe great teams are built on trust, useful feedback, and room to do your best work.</p></article>
          <aside className="detail-aside"><div className="company-panel"><span className="section-kicker">THE COMPANY</span><h3>{job.company}</h3><p>A team building thoughtful products for the way people work today.</p><Link href="/companies" className="company-link">View company <span>↗</span></Link></div><div className="detail-facts"><div><span>Location</span><strong>{job.location}</strong></div><div><span>Employment</span><strong>{job.type}</strong></div><div><span>Experience</span><strong>{job.level}</strong></div><div><span>Salary</span><strong>{formatSalary(job.salaryMin, job.salaryMax)}</strong></div></div></aside></div>
        <section className="similar-section"><div className="section-heading"><div><span className="section-kicker">KEEP EXPLORING</span><h2>Similar roles<span>.</span></h2></div><Link href={`/?category=${encodeURIComponent(job.category)}`} className="view-all">View all jobs <span>↗</span></Link></div><div className="similar-grid">{similarJobs.map((similar) => <article className="similar-card" key={similar.id}><div className="company-logo" style={{ "--logo-color": similar.color } as CSSProperties}>{similar.logo}</div><div><Link href={`/jobs/${similar.id}`}><h3>{similar.title}</h3></Link><p>{similar.company} · {similar.location}</p></div><span>{formatSalary(similar.salaryMin, similar.salaryMax)}</span></article>)}</div></section>
      </div>
    </main>
  );
}

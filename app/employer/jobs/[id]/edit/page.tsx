import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import JobEditForm from "@/components/job-edit-form";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ id: string }> };
export const metadata = { title: "Edit job" };

export default async function EditJobPage({ params }: Props) {
  const session = await auth();
  const { id } = await params;
  if (!session?.user) return null;
  const job = await prisma.job.findFirst({ where: { id, company: { ownerId: session.user.id } } });
  if (!job) notFound();
  return <main className="dash-page"><header className="dash-header"><Link href="/" className="brand"><span className="brand-mark"><span /></span><span>hirely<span className="brand-dot">.</span></span></Link><Link href="/employer/dashboard" className="back-link">← Dashboard</Link></header><section className="dash-content"><div className="dash-title"><span className="section-kicker">EMPLOYER WORKSPACE</span><h1>Edit job</h1><p>Only your company can update this listing.</p></div><JobEditForm job={job} /></section></main>;
}
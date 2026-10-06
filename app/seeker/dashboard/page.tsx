import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Seeker dashboard" };

export default async function SeekerDashboard() {
  const session = await auth();
  if (!session?.user) return null;
  const [applicationCount, savedCount, profile] = await Promise.all([
    prisma.application.count({ where: { seekerId: session.user.id } }),
    prisma.savedJob.count({ where: { userId: session.user.id } }),
    prisma.seekerProfile.findUnique({ where: { userId: session.user.id } }),
  ]);
  return <main className="dash-page"><header className="dash-header"><Link href="/" className="brand"><span className="brand-mark"><span /></span><span>hirely<span className="brand-dot">.</span></span></Link><nav><Link href="/seeker/applications">Applications</Link><Link href="/seeker/saved">Saved jobs</Link><Link href="/seeker/profile">Profile</Link><Link href="/messages">Messages</Link></nav></header><section className="dash-content"><div className="dash-title"><span className="section-kicker">YOUR SEARCH</span><h1>Welcome, {session.user.name ?? "job seeker"}.</h1><p>{profile?.headline ?? "Add a headline to help employers get to know you."}</p></div><div className="stats-grid"><article><span>Applications</span><strong>{applicationCount}</strong><small>Roles you have applied for</small></article><article><span>Saved jobs</span><strong>{savedCount}</strong><small>Worth another look</small></article><article><span>Profile</span><strong>{profile?.resumeUrl ? "Ready" : "In progress"}</strong><small>Keep your details current</small></article></div><div className="dash-section-heading"><div><h2>Make your next move</h2><p>Discover roles chosen for your interests.</p></div><Link href="/" className="detail-apply">Explore jobs <span>↗</span></Link></div><div className="seeker-links"><Link href="/seeker/applications">View applications <span>↗</span></Link><Link href="/seeker/saved">Open saved jobs <span>↗</span></Link><Link href="/seeker/profile">Update your profile <span>↗</span></Link></div></section></main>;
}
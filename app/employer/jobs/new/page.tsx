import Link from "next/link";
import JobEditor from "@/components/job-editor";

export const metadata = { title: "Post a job" };

export default function NewJobPage() {
  return <main className="dash-page"><header className="dash-header"><Link href="/" className="brand"><span className="brand-mark"><span /></span><span>hirely<span className="brand-dot">.</span></span></Link><Link href="/employer/dashboard" className="back-link">← Dashboard</Link></header><section className="dash-content"><div className="dash-title"><span className="section-kicker">EMPLOYER WORKSPACE</span><h1>Post a new job</h1><p>Share a clear description so the right people can find you.</p></div><JobEditor /></section></main>;
}
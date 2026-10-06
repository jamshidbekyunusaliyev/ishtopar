'use client';

import Link from "next/link";
import type { CSSProperties } from "react";
import type { Job, JobLevel, JobType } from "@/lib/jobs";
import { formatSalary } from "@/lib/jobs";

type Props = {
  jobs: Job[];
  categories: string[];
  types: JobType[];
  levels: JobLevel[];
  selected: {
    q: string;
    location: string;
    categories: string[];
    types: string[];
    levels: string[];
    minSalary: string;
    maxSalary: string;
    sort: string;
  };
};

function Brand() {
  return <Link href="/" className="brand" aria-label="Hirely home"><span className="brand-mark" aria-hidden="true"><span /></span><span>hirely<span className="brand-dot">.</span></span></Link>;
}

function JobCard({ job }: { job: Job }) {
  return (
    <article className="job-card">
      <div className="job-card-top"><div className="company-logo" style={{ "--logo-color": job.color } as CSSProperties}>{job.logo}</div><span className="posted-label">{job.postedDays === 0 ? "Today" : `${job.postedDays}d ago`}</span></div>
      <Link href={`/jobs/${job.id}`} className="job-title-link"><h3>{job.title}</h3></Link>
      <p className="company-name">{job.company}<span> · </span>{job.location}</p>
      <div className="job-tags"><span>{job.type}</span><span>{job.level}</span></div>
      <div className="job-card-bottom"><strong>{formatSalary(job.salaryMin, job.salaryMax)}<small> / year</small></strong><Link href={`/jobs/${job.id}`} className="arrow-link" aria-label={`View ${job.title}`}>↗</Link></div>
    </article>
  );
}

function FilterGroup({ title, name, options, selected }: { title: string; name: string; options: string[]; selected: string[] }) {
  return <fieldset className="filter-group"><legend>{title}</legend>{options.map((option) => <label className="check-row" key={option}><input type="checkbox" name={name} value={option} defaultChecked={selected.includes(option)} /><span>{option}</span></label>)}</fieldset>;
}

export default function JobPortal({ jobs, categories, types, levels, selected }: Props) {
  const companies = ["Layers", "Sisyphus", "Circooles", "Catalog", "Quotient"];
  return (
    <>
      <header className="site-header"><div className="header-inner"><Brand /><nav className="main-nav" aria-label="Main navigation"><Link href="/#jobs">Find a job</Link><Link href="/employer/dashboard">For employers</Link></nav><div className="header-actions"><Link href="/employer/login" className="recruiter-link">Recruiter login</Link><Link href="/login" className="login-button">Log in <span>↗</span></Link></div></div></header>
      <main>
        <section className="hero"><div className="hero-inner">
          <div className="hero-copy"><span className="eyebrow"><span className="eyebrow-dot" /> A better way to work</span><h1>Over <span>10,000+</span><br />jobs to apply</h1><p>Find the role that fits your life. Good work starts with a good search.</p><div className="hero-proof"><div className="proof-avatars"><span>J</span><span>M</span><span>A</span><span>+</span></div><span><strong>4.9/5</strong> from 2,400+ job seekers</span></div></div>
          <div className="hero-orbit orbit-one" aria-hidden="true" /><div className="hero-orbit orbit-two" aria-hidden="true" /><div className="hero-note"><span className="note-spark">✳</span><span>Find your<br /><strong>next chapter</strong></span></div>
          <form className="search-panel" action="/" method="get"><label className="search-field"><span className="field-icon">⌕</span><span className="field-copy"><span>What are you looking for?</span><input name="q" defaultValue={selected.q} placeholder="Job title or keyword" /></span></label><span className="search-divider" /><label className="search-field location-field"><span className="field-icon pin-icon">⌖</span><span className="field-copy"><span>Where?</span><input name="location" defaultValue={selected.location} placeholder="City or remote" /></span></label><button type="submit" className="search-button">Search jobs <span>↗</span></button></form>
        </div></section>
        <section className="trusted-row" aria-label="Trusted companies"><span className="trusted-label">Trusted by teams at</span><div className="trusted-logos">{companies.map((company, index) => <span className={`trusted-logo trusted-${index}`} key={company}>{company}</span>)}</div></section>
        <section className="jobs-section" id="jobs"><div className="section-heading"><div><span className="section-kicker">OPPORTUNITIES, CURATED</span><h2>Find your next move<span>.</span></h2></div><p>Thoughtful work from teams building what comes next.</p></div>
          <div className="jobs-layout">
            <form id="job-filters" action="/" method="get" className="filters-panel"><div className="filters-heading"><h3>Filters</h3><Link href="/">Clear all</Link></div><input type="hidden" name="q" value={selected.q} /><input type="hidden" name="location" value={selected.location} /><input type="hidden" name="sort" value={selected.sort} />
              <FilterGroup title="Category" name="category" options={categories} selected={selected.categories} /><FilterGroup title="Job type" name="type" options={types} selected={selected.types} /><FilterGroup title="Experience" name="level" options={levels} selected={selected.levels} />
              <fieldset className="filter-group salary-group"><legend>Salary range <span>USD / year</span></legend><div className="salary-fields"><label><span>Min</span><input name="minSalary" type="number" min="0" placeholder="40,000" defaultValue={selected.minSalary} /></label><span className="salary-dash">—</span><label><span>Max</span><input name="maxSalary" type="number" min="0" placeholder="200,000" defaultValue={selected.maxSalary} /></label></div></fieldset>
              <button type="submit" className="filter-submit">Apply filters</button><p className="filters-hint">Choose a few filters to narrow your search.</p>
            </form>
            <div className="results-column"><div className="results-toolbar"><div><h3>Latest jobs <span>{jobs.length}</span></h3><p>Fresh opportunities picked for you</p></div><label className="sort-control"><span>Sort by</span><select name="sort" form="job-filters" defaultValue={selected.sort} onChange={(event) => event.currentTarget.form?.requestSubmit()}><option value="newest">Newest</option><option value="salary">Salary: high to low</option></select></label><button className="mobile-filter-button" type="submit" form="job-filters">Apply filters</button></div>
              <div className="job-grid">{jobs.length ? jobs.map((job) => <JobCard job={job} key={job.id} />) : <div className="empty-state"><span className="empty-icon">⌕</span><h3>No roles found just yet</h3><p>Try a broader search or remove a filter to see more opportunities.</p><Link href="/" className="empty-link">Clear search <span>↗</span></Link></div>}</div>
              {jobs.length > 0 && <div className="results-footer"><span>Showing <strong>{jobs.length}</strong> of <strong>20</strong> opportunities</span><span className="pagination-mark">01 <i /> 02 <i /> 03 <b>→</b></span></div>}
            </div>
          </div>
        </section>
      </main>
      <footer className="site-footer"><Brand /><span>Good work, in good company.</span><span>© 2026 Hirely</span></footer>
    </>
  );
}

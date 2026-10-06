import JobPortal from "@/components/job-portal";
import { jobs, jobCategories, jobLevels, jobTypes } from "@/lib/jobs";

type SearchValue = string | string[] | undefined;
type SearchParams = Record<string, SearchValue>;

function values(value: SearchValue) {
  return value ? (Array.isArray(value) ? value : [value]) : [];
}

export default async function Home({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.trim().toLowerCase() : "";
  const location = typeof params.location === "string" ? params.location.trim().toLowerCase() : "";
  const categories = values(params.category);
  const types = values(params.type);
  const levels = values(params.level);
  const minSalary = Number(params.minSalary) || 0;
  const maxSalary = Number(params.maxSalary) || Infinity;
  const sort = params.sort === "salary" ? "salary" : "newest";

  const filteredJobs = jobs
    .filter((job) =>
      (!query || `${job.title} ${job.company} ${job.category}`.toLowerCase().includes(query)) &&
      (!location || job.location.toLowerCase().includes(location)) &&
      (!categories.length || categories.includes(job.category)) &&
      (!types.length || types.includes(job.type)) &&
      (!levels.length || levels.includes(job.level)) &&
      job.salaryMax >= minSalary && job.salaryMin <= maxSalary,
    )
    .sort((first, second) => sort === "salary" ? second.salaryMax - first.salaryMax : first.postedDays - second.postedDays);

  return <JobPortal jobs={filteredJobs} categories={jobCategories} types={jobTypes} levels={jobLevels} selected={{
    q: typeof params.q === "string" ? params.q : "",
    location: typeof params.location === "string" ? params.location : "",
    categories, types, levels,
    minSalary: typeof params.minSalary === "string" ? params.minSalary : "",
    maxSalary: typeof params.maxSalary === "string" ? params.maxSalary : "",
    sort,
  }} />;
}

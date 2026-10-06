import type { Job as PrismaJob, JobLevel as PrismaJobLevel, JobType as PrismaJobType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { jobs, type Job, type JobLevel, type JobType } from "@/lib/jobs";

type JobRecord = PrismaJob & { company: { name: string; logo: string | null } };

const typeLabels: Record<PrismaJobType, JobType> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  REMOTE: "Remote",
  INTERNSHIP: "Internship",
};

const levelLabels: Record<PrismaJobLevel, JobLevel> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  SENIOR: "Senior",
};

const logoColors = ["#7955d9", "#25243a", "#087e78", "#df7744", "#4354bc"];

export function presentJob(record: JobRecord): Job {
  const postedDays = Math.max(0, Math.floor((Date.now() - record.createdAt.getTime()) / 86_400_000));
  const hash = Array.from(record.company.name).reduce((value, char) => value + char.charCodeAt(0), 0);
  return {
    id: record.id,
    title: record.title,
    company: record.company.name,
    logo: record.company.logo || record.company.name.slice(0, 1).toUpperCase(),
    color: logoColors[hash % logoColors.length],
    category: record.category,
    location: record.location,
    type: typeLabels[record.jobType],
    level: levelLabels[record.level],
    salaryMin: record.salaryMin ?? 0,
    salaryMax: record.salaryMax ?? 0,
    postedDays,
    description: record.description,
    skills: [],
    isUrgent: record.isUrgent,
    isNew: record.isNew,
  };
}

export async function getOpenJobs(): Promise<Job[]> {
  try {
    const records = await prisma.job.findMany({ where: { status: "OPEN" }, include: { company: { select: { name: true, logo: true } } }, orderBy: { createdAt: "desc" }, take: 100 });
    return records.length ? records.map(presentJob) : jobs;
  } catch {
    return jobs;
  }
}

export async function getPortalJob(id: string): Promise<Job | undefined> {
  try {
    const record = await prisma.job.findUnique({ where: { id }, include: { company: { select: { name: true, logo: true } } } });
    if (record) return presentJob(record);
  } catch {
    return jobs.find((job) => job.id === id);
  }
  return jobs.find((job) => job.id === id);
}

export async function getSimilarJobs(job: Job) {
  try {
    const records = await prisma.job.findMany({ where: { status: "OPEN", category: job.category, id: { not: job.id } }, include: { company: { select: { name: true, logo: true } } }, orderBy: { createdAt: "desc" }, take: 3 });
    if (records.length) return records.map(presentJob);
  } catch {
    return jobs.filter((other) => other.id !== job.id && other.category === job.category).slice(0, 3);
  }
  return jobs.filter((other) => other.id !== job.id && other.category === job.category).slice(0, 3);
}
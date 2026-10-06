import { PrismaClient, type JobLevel, type JobType as PrismaJobType } from "@prisma/client";
import bcrypt from "bcryptjs";
import { jobs } from "../lib/jobs";

const prisma = new PrismaClient();
const jobTypeMap: Record<string, PrismaJobType> = {
  "Full-time": "FULL_TIME",
  "Part-time": "PART_TIME",
  Remote: "REMOTE",
  Internship: "INTERNSHIP",
};

async function main() {
  const passwordHash = await bcrypt.hash("Password123!", 12);
  const seeker = await prisma.user.upsert({
    where: { email: "seeker@example.com" },
    update: {},
    create: {
      name: "Jordan Lee",
      email: "seeker@example.com",
      passwordHash,
      role: "SEEKER",
      profile: {
        create: {
          headline: "Product designer looking for meaningful work",
          bio: "Curious designer who enjoys making complex products feel simple.",
          skills: JSON.stringify(["Figma", "Research", "Prototyping"]),
          location: "New York, NY",
          experienceLevel: "INTERMEDIATE",
        },
      },
    },
  });

  const employer = await prisma.user.upsert({
    where: { email: "employer@example.com" },
    update: {},
    create: {
      name: "Taylor Morgan",
      email: "employer@example.com",
      passwordHash,
      role: "EMPLOYER",
    },
  });

  const companyInfo = [
    { name: "Layers", logo: "L", website: "https://layers.example", location: "New York, NY" },
    { name: "Sisyphus", logo: "S", website: "https://sisyphus.example", location: "Remote" },
    { name: "Circooles", logo: "C", website: "https://circooles.example", location: "Austin, TX" },
    { name: "Catalog", logo: "◈", website: "https://catalog.example", location: "Chicago, IL" },
    { name: "Quotient", logo: "Q", website: "https://quotient.example", location: "Boston, MA" },
  ];

  const companies = new Map<string, string>();
  for (const info of companyInfo) {
    const company = await prisma.company.findFirst({ where: { name: info.name, ownerId: employer.id } });
    const saved = company ?? await prisma.company.create({
      data: { ...info, ownerId: employer.id, description: `${info.name} is a people-first team building useful products for modern work.` },
    });
    companies.set(info.name, saved.id);
  }

  for (const job of jobs) {
    await prisma.job.upsert({
      where: { id: job.id },
      update: {},
      create: {
        id: job.id,
        companyId: companies.get(job.company)!,
        title: job.title,
        description: job.description,
        category: job.category,
        location: job.location,
        jobType: jobTypeMap[job.type],
        level: job.level.toUpperCase() as JobLevel,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        currency: "USD",
        status: "OPEN",
        isNew: job.postedDays <= 2,
        createdAt: new Date(Date.now() - job.postedDays * 24 * 60 * 60 * 1000),
      },
    });
  }

  console.info(`Seeded ${companyInfo.length} companies and ${jobs.length} jobs.`);
  console.info(`Test seeker: ${seeker.email} / Password123!`);
  console.info(`Test employer: ${employer.email} / Password123!`);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
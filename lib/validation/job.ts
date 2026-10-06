import { z } from "zod";

export const jobSchema = z.object({
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().min(30).max(12000),
  category: z.string().trim().min(2).max(60),
  location: z.string().trim().min(2).max(100),
  jobType: z.enum(["FULL_TIME", "PART_TIME", "REMOTE", "INTERNSHIP"]),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "SENIOR"]),
  salaryMin: z.number().int().positive().nullable(),
  salaryMax: z.number().int().positive().nullable(),
  currency: z.string().length(3).default("USD"),
}).refine((job) => !job.salaryMin || !job.salaryMax || job.salaryMin <= job.salaryMax, {
  path: ["salaryMax"],
  message: "Maximum salary must be greater than minimum salary.",
});

export const jobUpdateSchema = jobSchema.partial().extend({
  status: z.enum(["OPEN", "CLOSED"]).optional(),
  isUrgent: z.boolean().optional(),
  isNew: z.boolean().optional(),
});
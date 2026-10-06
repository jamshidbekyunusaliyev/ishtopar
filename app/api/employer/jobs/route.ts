import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { jobSchema } from "@/lib/validation/job";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "EMPLOYER") return NextResponse.json({ error: "Employer access required." }, { status: 403 });
  const parsed = jobSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Check the job details." }, { status: 400 });
  const company = await prisma.company.findFirst({ where: { ownerId: session.user.id }, select: { id: true } });
  if (!company) return NextResponse.json({ error: "Create a company profile before posting a job." }, { status: 400 });
  const job = await prisma.job.create({ data: { ...parsed.data, companyId: company.id } });
  return NextResponse.json({ job }, { status: 201 });
}
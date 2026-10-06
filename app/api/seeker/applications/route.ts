import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const applicationSchema = z.object({ jobId: z.string().min(1), coverLetter: z.string().trim().max(4000).optional() });

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "SEEKER") return NextResponse.json({ error: "Seeker access required." }, { status: 403 });
  const parsed = applicationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Check your application details." }, { status: 400 });
  const job = await prisma.job.findUnique({ where: { id: parsed.data.jobId }, include: { company: { select: { ownerId: true, name: true } } } });
  if (!job || job.status !== "OPEN") return NextResponse.json({ error: "This job is no longer accepting applications." }, { status: 404 });
  try {
    const application = await prisma.application.create({ data: { jobId: job.id, seekerId: session.user.id, coverLetter: parsed.data.coverLetter || null } });
    await prisma.notification.create({ data: { userId: job.company.ownerId, type: "APPLICATION_RECEIVED", text: `A new application arrived for ${job.title}.` } });
    return NextResponse.json({ application }, { status: 201 });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") return NextResponse.json({ error: "You have already applied for this job." }, { status: 409 });
    return NextResponse.json({ error: "Unable to submit your application." }, { status: 500 });
  }
}
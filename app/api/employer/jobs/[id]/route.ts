import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { jobUpdateSchema } from "@/lib/validation/job";

type Context = { params: Promise<{ id: string }> };

async function ownedJob(id: string, ownerId: string) {
  return prisma.job.findFirst({ where: { id, company: { ownerId } }, select: { id: true } });
}

export async function PATCH(request: Request, { params }: Context) {
  const session = await auth();
  if (!session?.user || session.user.role !== "EMPLOYER") return NextResponse.json({ error: "Employer access required." }, { status: 403 });
  const { id } = await params;
  if (!(await ownedJob(id, session.user.id))) return NextResponse.json({ error: "Job not found." }, { status: 404 });
  const parsed = jobUpdateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Check the job details." }, { status: 400 });
  const job = await prisma.job.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ job });
}

export async function DELETE(_request: Request, { params }: Context) {
  const session = await auth();
  if (!session?.user || session.user.role !== "EMPLOYER") return NextResponse.json({ error: "Employer access required." }, { status: 403 });
  const { id } = await params;
  if (!(await ownedJob(id, session.user.id))) return NextResponse.json({ error: "Job not found." }, { status: 404 });
  await prisma.job.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
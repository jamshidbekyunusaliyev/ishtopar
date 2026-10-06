import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const statusSchema = z.object({ status: z.enum(["VIEWED", "ACCEPTED", "REJECTED"]) });
type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Context) {
  const session = await auth();
  if (!session?.user || session.user.role !== "EMPLOYER") return NextResponse.json({ error: "Employer access required." }, { status: 403 });
  const parsed = statusSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid application status." }, { status: 400 });
  const { id } = await params;
  const application = await prisma.application.findFirst({ where: { id, job: { company: { ownerId: session.user.id } } }, select: { id: true, seekerId: true, job: { select: { title: true } } } });
  if (!application) return NextResponse.json({ error: "Application not found." }, { status: 404 });
  const updated = await prisma.application.update({ where: { id }, data: { status: parsed.data.status } });
  await prisma.notification.create({ data: { userId: application.seekerId, type: "APPLICATION_STATUS", text: `Your application for ${application.job.title} is now ${parsed.data.status.toLowerCase()}.` } });
  return NextResponse.json({ application: updated });
}
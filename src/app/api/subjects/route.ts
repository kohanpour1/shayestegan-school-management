import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const subjects = await prisma.subject.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(subjects);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, hourlyRate, description } = body;
    if (!name || hourlyRate == null) {
      return NextResponse.json({ error: "نام و نرخ ساعتی الزامی است" }, { status: 400 });
    }
    const subject = await prisma.subject.create({
      data: { name, hourlyRate: Number(hourlyRate), description },
    });
    return NextResponse.json(subject, { status: 201 });
  } catch {
    return NextResponse.json({ error: "خطا در ایجاد درس" }, { status: 500 });
  }
}

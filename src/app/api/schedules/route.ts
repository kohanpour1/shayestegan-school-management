import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const schedules = await prisma.schedule.findMany({
    where: { active: true },
    include: { class: true, teacher: true, subject: true },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
  });
  return NextResponse.json(schedules);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { classId, subjectId, teacherId, dayOfWeek, startTime, endTime, room } = body;
    if (!classId || !subjectId || !teacherId || dayOfWeek == null || !startTime || !endTime) {
      return NextResponse.json({ error: "فیلدهای الزامی را پر کنید" }, { status: 400 });
    }
    const schedule = await prisma.schedule.create({
      data: {
        classId,
        subjectId,
        teacherId,
        dayOfWeek: Number(dayOfWeek),
        startTime,
        endTime,
        room: room || null,
      },
    });
    return NextResponse.json(schedule, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "خطا در ایجاد برنامه" }, { status: 500 });
  }
}

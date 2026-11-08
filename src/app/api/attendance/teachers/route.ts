import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateTeachingHours } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { scheduleId, date, present, notes } = body;

    if (!scheduleId || !date) {
      return NextResponse.json({ error: "برنامه و تاریخ الزامی است" }, { status: 400 });
    }

    const schedule = await prisma.schedule.findUnique({
      where: { id: scheduleId },
      include: { subject: true },
    });

    if (!schedule) {
      return NextResponse.json({ error: "برنامه یافت نشد" }, { status: 404 });
    }

    const hours = present ? calculateTeachingHours(schedule.startTime, schedule.endTime) : 0;

    const attendance = await prisma.teacherAttendance.upsert({
      where: {
        scheduleId_date: {
          scheduleId,
          date: new Date(date),
        },
      },
      update: {
        present: Boolean(present),
        calculatedHours: hours,
        notes: notes || null,
        teacherId: schedule.teacherId,
      },
      create: {
        scheduleId,
        teacherId: schedule.teacherId,
        date: new Date(date),
        present: Boolean(present),
        calculatedHours: hours,
        notes: notes || null,
      },
    });

    return NextResponse.json(attendance, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "خطا در ثبت حضور" }, { status: 500 });
  }
}

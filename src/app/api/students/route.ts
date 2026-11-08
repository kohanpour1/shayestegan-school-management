import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const classId = req.nextUrl.searchParams.get("classId");
  const students = await prisma.student.findMany({
    where: classId ? { classId } : undefined,
    include: { class: true },
    orderBy: { lastName: "asc" },
  });
  return NextResponse.json(students);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, nationalId, phone, parentPhone, classId } = body;
    if (!firstName || !lastName || !classId) {
      return NextResponse.json({ error: "نام، نام خانوادگی و کلاس الزامی است" }, { status: 400 });
    }
    const student = await prisma.student.create({
      data: {
        firstName,
        lastName,
        nationalId: nationalId || null,
        phone: phone || null,
        parentPhone: parentPhone || null,
        classId,
      },
    });
    return NextResponse.json(student, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "کد ملی تکراری است" }, { status: 400 });
    }
    return NextResponse.json({ error: "خطا در ایجاد دانش‌آموز" }, { status: 500 });
  }
}

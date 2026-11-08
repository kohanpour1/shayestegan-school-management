import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const classes = await prisma.class.findMany({
    include: { _count: { select: { students: true } } },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(classes);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, grade, major, tuition, capacity } = body;
    if (!name || !grade) {
      return NextResponse.json({ error: "نام و پایه الزامی است" }, { status: 400 });
    }
    const newClass = await prisma.class.create({
      data: {
        name,
        grade,
        major: major || null,
        tuition: tuition || 0,
        capacity: capacity || 30,
      },
    });
    return NextResponse.json(newClass, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "خطا در ایجاد کلاس" }, { status: 500 });
  }
}

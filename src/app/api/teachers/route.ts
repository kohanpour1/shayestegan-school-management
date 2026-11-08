import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const teachers = await prisma.teacher.findMany({ orderBy: { lastName: "asc" } });
  return NextResponse.json(teachers);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, nationalId, phone, email, bankAccount } = body;
    if (!firstName || !lastName) {
      return NextResponse.json({ error: "نام و نام خانوادگی الزامی است" }, { status: 400 });
    }
    const teacher = await prisma.teacher.create({
      data: {
        firstName,
        lastName,
        nationalId: nationalId || null,
        phone: phone || null,
        email: email || null,
        bankAccount: bankAccount || null,
      },
    });
    return NextResponse.json(teacher, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "کد ملی تکراری است" }, { status: 400 });
    }
    return NextResponse.json({ error: "خطا در ایجاد معلم" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { teacherId, amount, description, type } = body;
    if (!teacherId || !amount) {
      return NextResponse.json({ error: "معلم و مبلغ الزامی است" }, { status: 400 });
    }
    const deduction = await prisma.teacherDeduction.create({
      data: {
        teacherId,
        amount: Number(amount),
        description: description || null,
        type: type || "advance",
      },
    });
    return NextResponse.json(deduction, { status: 201 });
  } catch {
    return NextResponse.json({ error: "خطا در ثبت کسر" }, { status: 500 });
  }
}

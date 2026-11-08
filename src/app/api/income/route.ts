import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { studentId, amount, description, category, date } = body;
    if (!amount) return NextResponse.json({ error: "مبلغ الزامی است" }, { status: 400 });
    const income = await prisma.income.create({
      data: {
        studentId: studentId || null,
        amount: Number(amount),
        description: description || null,
        category: category || "tuition",
        date: date ? new Date(date) : new Date(),
      },
    });
    return NextResponse.json(income, { status: 201 });
  } catch {
    return NextResponse.json({ error: "خطا" }, { status: 500 });
  }
}

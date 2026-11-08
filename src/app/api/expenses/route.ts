import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, category, description, date } = body;
    if (!amount) return NextResponse.json({ error: "مبلغ الزامی است" }, { status: 400 });
    const expense = await prisma.expense.create({
      data: {
        amount: Number(amount),
        category: category || "other",
        description: description || null,
        date: date ? new Date(date) : new Date(),
      },
    });
    return NextResponse.json(expense, { status: 201 });
  } catch {
    return NextResponse.json({ error: "خطا" }, { status: 500 });
  }
}

import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { Users, GraduationCap, UserCheck, Wallet, BookOpen, Calendar } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getStats() {
  const [
    classCount,
    studentCount,
    teacherCount,
    subjectCount,
    scheduleCount,
    totalIncome,
    totalExpense,
  ] = await Promise.all([
    prisma.class.count(),
    prisma.student.count({ where: { active: true } }),
    prisma.teacher.count({ where: { active: true } }),
    prisma.subject.count(),
    prisma.schedule.count({ where: { active: true } }),
    prisma.income.aggregate({ _sum: { amount: true } }),
    prisma.expense.aggregate({ _sum: { amount: true } }),
  ]);

  return {
    classCount,
    studentCount,
    teacherCount,
    subjectCount,
    scheduleCount,
    totalIncome: totalIncome._sum.amount || 0,
    totalExpense: totalExpense._sum.amount || 0,
  };
}

export default async function DashboardPage() {
  const stats = await getStats();

  const cards = [
    { label: "کلاس‌ها", value: stats.classCount, icon: GraduationCap, href: "/classes", color: "bg-blue-500" },
    { label: "دانش‌آموزان فعال", value: stats.studentCount, icon: Users, href: "/students", color: "bg-green-500" },
    { label: "معلمان فعال", value: stats.teacherCount, icon: UserCheck, href: "/teachers", color: "bg-purple-500" },
    { label: "دروس", value: stats.subjectCount, icon: BookOpen, href: "/subjects", color: "bg-orange-500" },
    { label: "برنامه‌های فعال", value: stats.scheduleCount, icon: Calendar, href: "/schedules", color: "bg-teal-500" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">داشبورد مدیریت</h1>
        <p className="text-slate-500 mt-1">خلاصه وضعیت دبیرستان شایستگان</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.href} href={card.href} className="card hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className={`${card.color} p-3 rounded-lg text-white`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">{card.label}</p>
                  <p className="text-2xl font-bold text-slate-800">{card.value}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <Wallet className="w-6 h-6 text-green-600" />
            <h2 className="text-lg font-semibold">خلاصه مالی</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-600">مجموع درآمدها</span>
              <span className="font-bold text-green-600">{formatCurrency(stats.totalIncome)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-600">مجموع هزینه‌ها</span>
              <span className="font-bold text-red-600">{formatCurrency(stats.totalExpense)}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-800 font-medium">مانده</span>
              <span className={`font-bold text-lg ${stats.totalIncome - stats.totalExpense >= 0 ? "text-green-700" : "text-red-700"}`}>
                {formatCurrency(stats.totalIncome - stats.totalExpense)}
              </span>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Link href="/finance/income" className="btn-primary text-sm">ثبت درآمد</Link>
            <Link href="/finance/expenses" className="btn-secondary text-sm">ثبت هزینه</Link>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">دسترسی سریع</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/schedules" className="btn-secondary text-center text-sm">برنامه کلاسی</Link>
            <Link href="/attendance/teachers" className="btn-secondary text-center text-sm">حضور معلمان</Link>
            <Link href="/finance/payments" className="btn-secondary text-center text-sm">پرداخت معلمان</Link>
            <Link href="/students" className="btn-secondary text-center text-sm">دانش‌آموزان</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

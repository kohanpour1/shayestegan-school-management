import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import ClassForm from "@/components/ClassForm";

export const dynamic = "force-dynamic";

export default async function ClassesPage() {
  const classes = await prisma.class.findMany({
    include: {
      _count: { select: { students: true, schedules: true } },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">کلاس‌ها</h1>
          <p className="text-slate-500">مدیریت کلاس‌های دبیرستان</p>
        </div>
      </div>

      <ClassForm />

      <div className="card overflow-hidden p-0">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>نام کلاس</th>
                <th>پایه</th>
                <th>رشته</th>
                <th>شهریه ماهانه</th>
                <th>ظرفیت</th>
                <th>تعداد دانش‌آموز</th>
                <th>تعداد برنامه</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    هنوز کلاسی ثبت نشده است
                  </td>
                </tr>
              ) : (
                classes.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="font-medium">{c.name}</td>
                    <td>{c.grade}</td>
                    <td>{c.major || "—"}</td>
                    <td>{formatCurrency(c.tuition)}</td>
                    <td>{c.capacity}</td>
                    <td>
                      <Link href={`/students?classId=${c.id}`} className="text-primary-600 hover:underline">
                        {c._count.students}
                      </Link>
                    </td>
                    <td>{c._count.schedules}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

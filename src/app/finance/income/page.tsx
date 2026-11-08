import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import IncomeForm from "@/components/IncomeForm";

export const dynamic = "force-dynamic";

export default async function IncomePage() {
  const [incomes, students] = await Promise.all([
    prisma.income.findMany({
      include: { student: true },
      orderBy: { date: "desc" },
      take: 100,
    }),
    prisma.student.findMany({ where: { active: true }, orderBy: { lastName: "asc" } }),
  ]);

  const total = incomes.reduce((s, i) => s + i.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">درآمدها</h1>
          <p className="text-slate-500">ثبت شهریه و سایر درآمدها</p>
        </div>
        <div className="text-left">
          <p className="text-sm text-slate-500">مجموع نمایش داده‌شده</p>
          <p className="text-xl font-bold text-green-600">{formatCurrency(total)}</p>
        </div>
      </div>

      <IncomeForm students={students} />

      <div className="card overflow-hidden p-0">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>تاریخ</th>
                <th>دانش‌آموز</th>
                <th>مبلغ</th>
                <th>دسته‌بندی</th>
                <th>توضیحات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {incomes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-400">هنوز درآمدی ثبت نشده</td>
                </tr>
              ) : (
                incomes.map((i) => (
                  <tr key={i.id} className="hover:bg-slate-50">
                    <td>{new Date(i.date).toLocaleDateString("fa-IR")}</td>
                    <td>
                      {i.student ? `${i.student.firstName} ${i.student.lastName}` : "—"}
                    </td>
                    <td className="font-medium text-green-700">{formatCurrency(i.amount)}</td>
                    <td>{i.category === "tuition" ? "شهریه" : "سایر"}</td>
                    <td className="text-slate-500">{i.description || "—"}</td>
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

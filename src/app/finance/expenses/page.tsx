import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import ExpenseForm from "@/components/ExpenseForm";

export const dynamic = "force-dynamic";

export default async function ExpensesPage() {
  const expenses = await prisma.expense.findMany({
    orderBy: { date: "desc" },
    take: 100,
  });
  const total = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">هزینه‌ها</h1>
          <p className="text-slate-500">ثبت هزینه‌های مدرسه</p>
        </div>
        <div className="text-left">
          <p className="text-sm text-slate-500">مجموع نمایش داده‌شده</p>
          <p className="text-xl font-bold text-red-600">{formatCurrency(total)}</p>
        </div>
      </div>

      <ExpenseForm />

      <div className="card overflow-hidden p-0">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>تاریخ</th>
                <th>مبلغ</th>
                <th>دسته‌بندی</th>
                <th>توضیحات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-slate-400">هنوز هزینه‌ای ثبت نشده</td>
                </tr>
              ) : (
                expenses.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50">
                    <td>{new Date(e.date).toLocaleDateString("fa-IR")}</td>
                    <td className="font-medium text-red-600">{formatCurrency(e.amount)}</td>
                    <td>{e.category}</td>
                    <td className="text-slate-500">{e.description || "—"}</td>
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

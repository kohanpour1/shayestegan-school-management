import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import DeductionForm from "@/components/DeductionForm";

export const dynamic = "force-dynamic";

export default async function PaymentsPage() {
  const teachers = await prisma.teacher.findMany({
    where: { active: true },
    include: {
      attendances: {
        where: { present: true },
        include: {
          schedule: { include: { subject: true } },
        },
      },
      deductions: {
        where: { settled: false },
      },
    },
    orderBy: { lastName: "asc" },
  });

  const rows = teachers.map((t) => {
    let totalHours = 0;
    let totalGross = 0;
    for (const a of t.attendances) {
      totalHours += a.calculatedHours;
      totalGross += a.calculatedHours * a.schedule.subject.hourlyRate;
    }
    const totalDeduction = t.deductions.reduce((sum, d) => sum + d.amount, 0);
    const net = Math.round(totalGross) - totalDeduction;
    return {
      teacher: t,
      totalHours: Math.round(totalHours * 100) / 100,
      totalGross: Math.round(totalGross),
      totalDeduction,
      net,
      deductions: t.deductions,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">پرداخت معلمان</h1>
        <p className="text-slate-500">
          محاسبه خودکار بر اساس ساعات حضور ثبت‌شده × نرخ درس − کسورات (مساعده و ...)
        </p>
      </div>

      <DeductionForm teachers={teachers.map((t) => ({ id: t.id, firstName: t.firstName, lastName: t.lastName }))} />

      <div className="card overflow-hidden p-0">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>معلم</th>
                <th>مجموع ساعت تدریس</th>
                <th>مبلغ ناخالص</th>
                <th>کسورات (مساعده و ...)</th>
                <th>مبلغ نهایی قابل پرداخت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-400">
                    هنوز داده‌ای وجود ندارد
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.teacher.id} className="hover:bg-slate-50">
                    <td className="font-medium">
                      {r.teacher.firstName} {r.teacher.lastName}
                    </td>
                    <td>
                      <span className="bg-primary-50 text-primary-700 px-2 py-0.5 rounded text-sm font-medium">
                        {r.totalHours} ساعت
                      </span>
                    </td>
                    <td>{formatCurrency(r.totalGross)}</td>
                    <td className="text-red-600">
                      {r.totalDeduction > 0 ? formatCurrency(r.totalDeduction) : "—"}
                      {r.deductions.length > 0 && (
                        <ul className="text-xs text-slate-500 mt-1">
                          {r.deductions.map((d) => (
                            <li key={d.id}>
                              {d.description || d.type}: {formatCurrency(d.amount)}
                            </li>
                          ))}
                        </ul>
                      )}
                    </td>
                    <td className="font-bold text-lg text-green-700">
                      {formatCurrency(r.net)}
                    </td>
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

import { prisma } from "@/lib/prisma";
import TeacherForm from "@/components/TeacherForm";

export const dynamic = "force-dynamic";

export default async function TeachersPage() {
  const teachers = await prisma.teacher.findMany({
    include: {
      _count: { select: { schedules: true, attendances: true } },
    },
    orderBy: { lastName: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">معلمان</h1>
        <p className="text-slate-500">لیست معلمان و اطلاعات تماس</p>
      </div>

      <TeacherForm />

      <div className="card overflow-hidden p-0">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>نام و نام خانوادگی</th>
                <th>کد ملی</th>
                <th>تلفن</th>
                <th>شماره حساب</th>
                <th>تعداد درس</th>
                <th>وضعیت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {teachers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">
                    هنوز معلمی ثبت نشده است
                  </td>
                </tr>
              ) : (
                teachers.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50">
                    <td className="font-medium">
                      {t.firstName} {t.lastName}
                    </td>
                    <td>{t.nationalId || "—"}</td>
                    <td>{t.phone || "—"}</td>
                    <td className="text-xs font-mono">{t.bankAccount || "—"}</td>
                    <td>{t._count.schedules}</td>
                    <td>
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                          t.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {t.active ? "فعال" : "غیرفعال"}
                      </span>
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

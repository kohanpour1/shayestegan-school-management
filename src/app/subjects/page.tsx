import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import SubjectForm from "@/components/SubjectForm";

export const dynamic = "force-dynamic";

export default async function SubjectsPage() {
  const subjects = await prisma.subject.findMany({
    include: { _count: { select: { schedules: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">دروس و حق‌التدریس</h1>
        <p className="text-slate-500">تعریف دروس و نرخ ساعتی هر درس (هر ساعت = ۴۵ دقیقه)</p>
      </div>

      <SubjectForm />

      <div className="card overflow-hidden p-0">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>نام درس</th>
                <th>حق‌التدریس هر ساعت</th>
                <th>توضیحات</th>
                <th>تعداد برنامه</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subjects.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-slate-400">
                    هنوز درسی ثبت نشده است
                  </td>
                </tr>
              ) : (
                subjects.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="font-medium">{s.name}</td>
                    <td className="text-primary-700 font-semibold">{formatCurrency(s.hourlyRate)}</td>
                    <td className="text-slate-500">{s.description || "—"}</td>
                    <td>{s._count.schedules}</td>
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

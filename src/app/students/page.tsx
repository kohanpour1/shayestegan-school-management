import { prisma } from "@/lib/prisma";
import StudentForm from "@/components/StudentForm";

export const dynamic = "force-dynamic";

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: { classId?: string };
}) {
  const classId = searchParams.classId;
  const [students, classes] = await Promise.all([
    prisma.student.findMany({
      where: classId ? { classId } : undefined,
      include: { class: true },
      orderBy: [{ class: { name: "asc" } }, { lastName: "asc" }],
    }),
    prisma.class.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">دانش‌آموزان</h1>
        <p className="text-slate-500">مدیریت دانش‌آموزان و انتساب به کلاس</p>
      </div>

      <StudentForm classes={classes} />

      <div className="card overflow-hidden p-0">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>نام و نام خانوادگی</th>
                <th>کلاس</th>
                <th>کد ملی</th>
                <th>تلفن</th>
                <th>تلفن والدین</th>
                <th>وضعیت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">
                    هنوز دانش‌آموزی ثبت نشده است
                  </td>
                </tr>
              ) : (
                students.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="font-medium">
                      {s.firstName} {s.lastName}
                    </td>
                    <td>{s.class.name}</td>
                    <td>{s.nationalId || "—"}</td>
                    <td>{s.phone || "—"}</td>
                    <td>{s.parentPhone || "—"}</td>
                    <td>
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                          s.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {s.active ? "فعال" : "غیرفعال"}
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

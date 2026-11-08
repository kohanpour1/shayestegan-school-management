import { prisma } from "@/lib/prisma";
import { getDayLabel, calculateTeachingHours, formatCurrency } from "@/lib/utils";
import TeacherAttendanceForm from "@/components/TeacherAttendanceForm";

export const dynamic = "force-dynamic";

export default async function TeacherAttendancePage() {
  const [schedules, recentAttendances] = await Promise.all([
    prisma.schedule.findMany({
      where: { active: true },
      include: {
        class: true,
        teacher: true,
        subject: true,
      },
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    }),
    prisma.teacherAttendance.findMany({
      take: 50,
      orderBy: { date: "desc" },
      include: {
        schedule: {
          include: { class: true, subject: true },
        },
        teacher: true,
      },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">حضور و غیاب معلمان</h1>
        <p className="text-slate-500">
          با ثبت حضور معلم طبق برنامه، ساعت تدریس و مبلغ قابل پرداخت به صورت خودکار محاسبه می‌شود.
        </p>
      </div>

      <TeacherAttendanceForm schedules={schedules} />

      <div className="card overflow-hidden p-0">
        <div className="p-4 border-b border-slate-100">
          <h2 className="font-semibold">آخرین حضورهای ثبت‌شده</h2>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>تاریخ</th>
                <th>معلم</th>
                <th>کلاس / درس</th>
                <th>ساعت برنامه</th>
                <th>ساعت تدریس</th>
                <th>وضعیت</th>
                <th>مبلغ تقریبی</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentAttendances.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    هنوز حضوری ثبت نشده است
                  </td>
                </tr>
              ) : (
                recentAttendances.map((a) => {
                  const hours = a.calculatedHours;
                  const rate = a.schedule.subject.hourlyRate;
                  const amount = Math.round(hours * rate);
                  return (
                    <tr key={a.id} className="hover:bg-slate-50">
                      <td>{new Date(a.date).toLocaleDateString("fa-IR")}</td>
                      <td className="font-medium">
                        {a.teacher.firstName} {a.teacher.lastName}
                      </td>
                      <td>
                        {a.schedule.class.name} / {a.schedule.subject.name}
                      </td>
                      <td className="font-mono text-sm">
                        {a.schedule.startTime}–{a.schedule.endTime}
                      </td>
                      <td>
                        <span className="bg-primary-50 text-primary-700 px-2 py-0.5 rounded text-sm">
                          {hours} ساعت
                        </span>
                      </td>
                      <td>
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                            a.present ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          }`}
                        >
                          {a.present ? "حاضر" : "غایب"}
                        </span>
                      </td>
                      <td className="font-medium text-green-700">
                        {a.present ? formatCurrency(amount) : "—"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

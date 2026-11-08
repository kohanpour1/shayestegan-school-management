import { prisma } from "@/lib/prisma";
import { getDayLabel, calculateTeachingHours } from "@/lib/utils";
import ScheduleForm from "@/components/ScheduleForm";

export const dynamic = "force-dynamic";

export default async function SchedulesPage() {
  const [schedules, classes, teachers, subjects] = await Promise.all([
    prisma.schedule.findMany({
      where: { active: true },
      include: {
        class: true,
        teacher: true,
        subject: true,
      },
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    }),
    prisma.class.findMany({ orderBy: { name: "asc" } }),
    prisma.teacher.findMany({ where: { active: true }, orderBy: { lastName: "asc" } }),
    prisma.subject.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">برنامه کلاسی</h1>
        <p className="text-slate-500">
          ثبت زمان هر کلاس (ساعت شروع و پایان). هر ۴۵ دقیقه = ۱ ساعت تدریس محاسبه می‌شود.
        </p>
      </div>

      <ScheduleForm classes={classes} teachers={teachers} subjects={subjects} />

      <div className="card overflow-hidden p-0">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>روز</th>
                <th>ساعت</th>
                <th>کلاس</th>
                <th>درس</th>
                <th>معلم</th>
                <th>ساعت تدریس</th>
                <th>اتاق</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {schedules.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    هنوز برنامه‌ای ثبت نشده است
                  </td>
                </tr>
              ) : (
                schedules.map((s) => {
                  const hours = calculateTeachingHours(s.startTime, s.endTime);
                  return (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="font-medium">{getDayLabel(s.dayOfWeek)}</td>
                      <td className="font-mono">
                        {s.startTime} – {s.endTime}
                      </td>
                      <td>{s.class.name}</td>
                      <td>{s.subject.name}</td>
                      <td>
                        {s.teacher.firstName} {s.teacher.lastName}
                      </td>
                      <td>
                        <span className="bg-primary-50 text-primary-700 px-2 py-0.5 rounded text-sm font-medium">
                          {hours} ساعت
                        </span>
                      </td>
                      <td>{s.room || "—"}</td>
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

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function StudentAttendancePage() {
  const classes = await prisma.class.findMany({
    include: {
      students: { where: { active: true } },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">حضور و غیاب دانش‌آموزان</h1>
        <p className="text-slate-500">
          این بخش برای ثبت حضور روزانه دانش‌آموزان طراحی شده است. می‌توانید در نسخه‌های بعدی فرم ثبت سریع اضافه کنید.
        </p>
      </div>

      <div className="grid gap-4">
        {classes.map((c) => (
          <div key={c.id} className="card">
            <h3 className="font-semibold text-lg mb-2">{c.name}</h3>
            <p className="text-sm text-slate-500 mb-3">{c.students.length} دانش‌آموز فعال</p>
            <div className="flex flex-wrap gap-2">
              {c.students.map((s) => (
                <span key={s.id} className="bg-slate-100 px-3 py-1 rounded-full text-sm">
                  {s.firstName} {s.lastName}
                </span>
              ))}
              {c.students.length === 0 && (
                <span className="text-slate-400 text-sm">دانش‌آموزی در این کلاس نیست</span>
              )}
            </div>
          </div>
        ))}
        {classes.length === 0 && (
          <div className="card text-center text-slate-400 py-12">
            ابتدا کلاس و دانش‌آموز تعریف کنید
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getDayLabel, calculateTeachingHours } from "@/lib/utils";

type Schedule = {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  class: { name: string };
  teacher: { id: string; firstName: string; lastName: string };
  subject: { name: string; hourlyRate: number };
};

export default function TeacherAttendanceForm({ schedules }: { schedules: Schedule[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    scheduleId: "",
    date: new Date().toISOString().slice(0, 10),
    present: true,
    notes: "",
  });

  const selected = schedules.find((s) => s.id === form.scheduleId);
  const hours = selected ? calculateTeachingHours(selected.startTime, selected.endTime) : 0;
  const amount = selected ? Math.round(hours * selected.subject.hourlyRate) : 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.scheduleId) return;
    setLoading(true);
    try {
      const res = await fetch("/api/attendance/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setForm({ ...form, scheduleId: "", notes: "" });
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "خطا در ثبت حضور");
      }
    } catch {
      alert("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h3 className="font-semibold mb-4">ثبت حضور معلم</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <label className="label">انتخاب برنامه *</label>
          <select
            className="input"
            required
            value={form.scheduleId}
            onChange={(e) => setForm({ ...form, scheduleId: e.target.value })}
          >
            <option value="">انتخاب برنامه کلاسی</option>
            {schedules.map((s) => (
              <option key={s.id} value={s.id}>
                {getDayLabel(s.dayOfWeek)} {s.startTime}–{s.endTime} | {s.class.name} | {s.subject.name} | {s.teacher.firstName} {s.teacher.lastName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">تاریخ *</label>
          <input
            className="input"
            type="date"
            required
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </div>
        <div>
          <label className="label">وضعیت</label>
          <select
            className="input"
            value={form.present ? "1" : "0"}
            onChange={(e) => setForm({ ...form, present: e.target.value === "1" })}
          >
            <option value="1">حاضر</option>
            <option value="0">غایب</option>
          </select>
        </div>
        {selected && (
          <div className="md:col-span-2 lg:col-span-4 bg-slate-50 rounded-lg p-3 text-sm">
            <span className="text-slate-600">ساعت تدریس محاسبه شده: </span>
            <strong className="text-primary-700">{hours} ساعت</strong>
            {form.present && (
              <>
                <span className="mx-2 text-slate-400">|</span>
                <span className="text-slate-600">مبلغ تقریبی: </span>
                <strong className="text-green-700">{amount.toLocaleString("fa-IR")} ریال</strong>
              </>
            )}
          </div>
        )}
        <div className="md:col-span-2">
          <label className="label">یادداشت</label>
          <input
            className="input"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="اختیاری"
          />
        </div>
        <div className="flex items-end">
          <button type="submit" disabled={loading || !form.scheduleId} className="btn-primary w-full">
            {loading ? "در حال ثبت..." : "ثبت حضور"}
          </button>
        </div>
      </form>
    </div>
  );
}

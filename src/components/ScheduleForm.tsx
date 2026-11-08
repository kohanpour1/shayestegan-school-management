"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DAYS_OF_WEEK, calculateTeachingHours } from "@/lib/utils";

type Option = { id: string; name?: string; firstName?: string; lastName?: string };

export default function ScheduleForm({
  classes,
  teachers,
  subjects,
}: {
  classes: Option[];
  teachers: Option[];
  subjects: Option[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    classId: "",
    subjectId: "",
    teacherId: "",
    dayOfWeek: "0",
    startTime: "08:00",
    endTime: "09:30",
    room: "",
  });

  const previewHours = calculateTeachingHours(form.startTime, form.endTime);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          dayOfWeek: parseInt(form.dayOfWeek),
        }),
      });
      if (res.ok) {
        setForm({
          classId: "",
          subjectId: "",
          teacherId: "",
          dayOfWeek: "0",
          startTime: "08:00",
          endTime: "09:30",
          room: "",
        });
        setOpen(false);
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "خطا در ثبت برنامه");
      }
    } catch {
      alert("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="btn-primary">
        + افزودن برنامه کلاسی
      </button>
    );
  }

  return (
    <div className="card">
      <h3 className="font-semibold mb-4">افزودن برنامه کلاسی جدید</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="label">کلاس *</label>
          <select className="input" required value={form.classId} onChange={(e) => setForm({ ...form, classId: e.target.value })}>
            <option value="">انتخاب کلاس</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">درس *</label>
          <select className="input" required value={form.subjectId} onChange={(e) => setForm({ ...form, subjectId: e.target.value })}>
            <option value="">انتخاب درس</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">معلم *</label>
          <select className="input" required value={form.teacherId} onChange={(e) => setForm({ ...form, teacherId: e.target.value })}>
            <option value="">انتخاب معلم</option>
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">روز هفته *</label>
          <select className="input" value={form.dayOfWeek} onChange={(e) => setForm({ ...form, dayOfWeek: e.target.value })}>
            {DAYS_OF_WEEK.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">ساعت شروع *</label>
          <input className="input" type="time" required value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
        </div>
        <div>
          <label className="label">ساعت پایان *</label>
          <input className="input" type="time" required value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
        </div>
        <div>
          <label className="label">اتاق / کلاس فیزیکی</label>
          <input className="input" value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} />
        </div>
        <div className="flex items-center">
          <div className="bg-primary-50 text-primary-700 px-3 py-2 rounded-lg text-sm">
            ساعت تدریس محاسبه شده: <strong>{previewHours}</strong> ساعت
          </div>
        </div>
        <div className="flex items-end gap-2">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "در حال ثبت..." : "ثبت برنامه"}
          </button>
          <button type="button" onClick={() => setOpen(false)} className="btn-secondary">
            انصراف
          </button>
        </div>
      </form>
    </div>
  );
}

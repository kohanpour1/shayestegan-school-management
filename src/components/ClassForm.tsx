"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ClassForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    grade: "دهم",
    major: "",
    tuition: "",
    capacity: "30",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          tuition: parseInt(form.tuition) || 0,
          capacity: parseInt(form.capacity) || 30,
        }),
      });
      if (res.ok) {
        setForm({ name: "", grade: "دهم", major: "", tuition: "", capacity: "30" });
        setOpen(false);
        router.refresh();
      } else {
        alert("خطا در ثبت کلاس");
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
        + افزودن کلاس جدید
      </button>
    );
  }

  return (
    <div className="card">
      <h3 className="font-semibold mb-4">افزودن کلاس جدید</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="label">نام کلاس *</label>
          <input
            className="input"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="مثال: دهم تجربی الف"
          />
        </div>
        <div>
          <label className="label">پایه *</label>
          <select
            className="input"
            value={form.grade}
            onChange={(e) => setForm({ ...form, grade: e.target.value })}
          >
            <option>دهم</option>
            <option>یازدهم</option>
            <option>دوازدهم</option>
          </select>
        </div>
        <div>
          <label className="label">رشته</label>
          <select
            className="input"
            value={form.major}
            onChange={(e) => setForm({ ...form, major: e.target.value })}
          >
            <option value="">انتخاب کنید</option>
            <option>تجربی</option>
            <option>ریاضی</option>
            <option>انسانی</option>
          </select>
        </div>
        <div>
          <label className="label">شهریه ماهانه (ریال)</label>
          <input
            className="input"
            type="number"
            value={form.tuition}
            onChange={(e) => setForm({ ...form, tuition: e.target.value })}
            placeholder="0"
          />
        </div>
        <div>
          <label className="label">ظرفیت</label>
          <input
            className="input"
            type="number"
            value={form.capacity}
            onChange={(e) => setForm({ ...form, capacity: e.target.value })}
          />
        </div>
        <div className="flex items-end gap-2">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "در حال ثبت..." : "ثبت کلاس"}
          </button>
          <button type="button" onClick={() => setOpen(false)} className="btn-secondary">
            انصراف
          </button>
        </div>
      </form>
    </div>
  );
}

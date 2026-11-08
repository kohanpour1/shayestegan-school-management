"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Student = { id: string; firstName: string; lastName: string };

export default function IncomeForm({ students }: { students: Student[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    studentId: "",
    amount: "",
    description: "",
    category: "tuition",
    date: new Date().toISOString().slice(0, 10),
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/income", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, amount: parseInt(form.amount) || 0 }),
      });
      if (res.ok) {
        setForm({ studentId: "", amount: "", description: "", category: "tuition", date: new Date().toISOString().slice(0, 10) });
        setOpen(false);
        router.refresh();
      } else alert("خطا");
    } catch {
      alert("خطا");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return <button onClick={() => setOpen(true)} className="btn-primary">+ ثبت درآمد</button>;

  return (
    <div className="card">
      <h3 className="font-semibold mb-4">ثبت درآمد جدید</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="label">دانش‌آموز</label>
          <select className="input" value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })}>
            <option value="">بدون دانش‌آموز (عمومی)</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">مبلغ (ریال) *</label>
          <input className="input" type="number" required value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
        </div>
        <div>
          <label className="label">تاریخ</label>
          <input className="input" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        </div>
        <div>
          <label className="label">دسته‌بندی</label>
          <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            <option value="tuition">شهریه</option>
            <option value="other">سایر</option>
          </select>
        </div>
        <div>
          <label className="label">توضیحات</label>
          <input className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="flex items-end gap-2">
          <button type="submit" disabled={loading} className="btn-primary">{loading ? "..." : "ثبت"}</button>
          <button type="button" onClick={() => setOpen(false)} className="btn-secondary">انصراف</button>
        </div>
      </form>
    </div>
  );
}

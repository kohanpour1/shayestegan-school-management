"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Teacher = { id: string; firstName: string; lastName: string };

export default function DeductionForm({ teachers }: { teachers: Teacher[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    teacherId: "",
    amount: "",
    description: "",
    type: "advance",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/deductions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          amount: parseInt(form.amount) || 0,
        }),
      });
      if (res.ok) {
        setForm({ teacherId: "", amount: "", description: "", type: "advance" });
        setOpen(false);
        router.refresh();
      } else {
        alert("خطا در ثبت کسر");
      }
    } catch {
      alert("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="btn-secondary">
        + ثبت کسر / مساعده
      </button>
    );
  }

  return (
    <div className="card">
      <h3 className="font-semibold mb-4">ثبت کسر از حقوق معلم (مساعده و ...)</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
          <label className="label">مبلغ (ریال) *</label>
          <input className="input" type="number" required value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
        </div>
        <div>
          <label className="label">نوع</label>
          <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option value="advance">مساعده</option>
            <option value="insurance">بیمه</option>
            <option value="other">سایر</option>
          </select>
        </div>
        <div>
          <label className="label">توضیحات</label>
          <input className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="flex items-end gap-2">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "..." : "ثبت کسر"}
          </button>
          <button type="button" onClick={() => setOpen(false)} className="btn-secondary">
            انصراف
          </button>
        </div>
      </form>
    </div>
  );
}

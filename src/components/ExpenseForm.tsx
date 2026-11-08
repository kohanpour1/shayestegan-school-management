"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ExpenseForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    amount: "",
    category: "other",
    description: "",
    date: new Date().toISOString().slice(0, 10),
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, amount: parseInt(form.amount) || 0 }),
      });
      if (res.ok) {
        setForm({ amount: "", category: "other", description: "", date: new Date().toISOString().slice(0, 10) });
        setOpen(false);
        router.refresh();
      } else alert("خطا");
    } catch {
      alert("خطا");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return <button onClick={() => setOpen(true)} className="btn-primary">+ ثبت هزینه</button>;

  return (
    <div className="card">
      <h3 className="font-semibold mb-4">ثبت هزینه جدید</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="label">مبلغ (ریال) *</label>
          <input className="input" type="number" required value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
        </div>
        <div>
          <label className="label">دسته‌بندی</label>
          <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            <option value="rent">اجاره</option>
            <option value="utility">آب و برق و گاز</option>
            <option value="salary">حقوق کارکنان</option>
            <option value="other">سایر</option>
          </select>
        </div>
        <div>
          <label className="label">تاریخ</label>
          <input className="input" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        </div>
        <div className="md:col-span-2">
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

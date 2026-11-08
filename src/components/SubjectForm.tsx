"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SubjectForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", hourlyRate: "", description: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          hourlyRate: parseInt(form.hourlyRate) || 0,
          description: form.description || null,
        }),
      });
      if (res.ok) {
        setForm({ name: "", hourlyRate: "", description: "" });
        setOpen(false);
        router.refresh();
      } else {
        alert("خطا در ثبت درس");
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
        + افزودن درس جدید
      </button>
    );
  }

  return (
    <div className="card">
      <h3 className="font-semibold mb-4">افزودن درس جدید</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="label">نام درس *</label>
          <input className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="ریاضی، فیزیک، ..." />
        </div>
        <div>
          <label className="label">حق‌التدریس هر ساعت (ریال) *</label>
          <input className="input" type="number" required value={form.hourlyRate} onChange={(e) => setForm({ ...form, hourlyRate: e.target.value })} placeholder="مثال: 250000" />
        </div>
        <div>
          <label className="label">توضیحات</label>
          <input className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="flex items-end gap-2">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "در حال ثبت..." : "ثبت درس"}
          </button>
          <button type="button" onClick={() => setOpen(false)} className="btn-secondary">
            انصراف
          </button>
        </div>
      </form>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TeacherForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    nationalId: "",
    phone: "",
    email: "",
    bankAccount: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setForm({ firstName: "", lastName: "", nationalId: "", phone: "", email: "", bankAccount: "" });
        setOpen(false);
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "خطا در ثبت معلم");
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
        + افزودن معلم جدید
      </button>
    );
  }

  return (
    <div className="card">
      <h3 className="font-semibold mb-4">افزودن معلم جدید</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="label">نام *</label>
          <input className="input" required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
        </div>
        <div>
          <label className="label">نام خانوادگی *</label>
          <input className="input" required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
        </div>
        <div>
          <label className="label">کد ملی</label>
          <input className="input" value={form.nationalId} onChange={(e) => setForm({ ...form, nationalId: e.target.value })} />
        </div>
        <div>
          <label className="label">تلفن</label>
          <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div>
          <label className="label">ایمیل</label>
          <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <label className="label">شماره شبا / کارت</label>
          <input className="input" value={form.bankAccount} onChange={(e) => setForm({ ...form, bankAccount: e.target.value })} />
        </div>
        <div className="flex items-end gap-2 md:col-span-3">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "در حال ثبت..." : "ثبت معلم"}
          </button>
          <button type="button" onClick={() => setOpen(false)} className="btn-secondary">
            انصراف
          </button>
        </div>
      </form>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ClassOption = { id: string; name: string };

export default function StudentForm({ classes }: { classes: ClassOption[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    nationalId: "",
    phone: "",
    parentPhone: "",
    classId: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setForm({ firstName: "", lastName: "", nationalId: "", phone: "", parentPhone: "", classId: "" });
        setOpen(false);
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "خطا در ثبت دانش‌آموز");
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
        + افزودن دانش‌آموز
      </button>
    );
  }

  return (
    <div className="card">
      <h3 className="font-semibold mb-4">افزودن دانش‌آموز جدید</h3>
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
          <label className="label">کلاس *</label>
          <select className="input" required value={form.classId} onChange={(e) => setForm({ ...form, classId: e.target.value })}>
            <option value="">انتخاب کلاس</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
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
          <label className="label">تلفن والدین</label>
          <input className="input" value={form.parentPhone} onChange={(e) => setForm({ ...form, parentPhone: e.target.value })} />
        </div>
        <div className="flex items-end gap-2">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "..." : "ثبت"}
          </button>
          <button type="button" onClick={() => setOpen(false)} className="btn-secondary">
            انصراف
          </button>
        </div>
      </form>
    </div>
  );
}

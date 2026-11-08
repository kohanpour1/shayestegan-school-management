"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  ClipboardCheck,
  Wallet,
  Receipt,
  UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { href: "/", label: "داشبورد", icon: LayoutDashboard },
  { href: "/classes", label: "کلاس‌ها", icon: GraduationCap },
  { href: "/students", label: "دانش‌آموزان", icon: Users },
  { href: "/teachers", label: "معلمان", icon: UserCheck },
  { href: "/subjects", label: "دروس و حق‌التدریس", icon: BookOpen },
  { href: "/schedules", label: "برنامه کلاسی", icon: Calendar },
  { href: "/attendance/teachers", label: "حضور معلمان", icon: ClipboardCheck },
  { href: "/attendance/students", label: "حضور دانش‌آموزان", icon: ClipboardCheck },
  { href: "/finance/income", label: "درآمدها", icon: Wallet },
  { href: "/finance/expenses", label: "هزینه‌ها", icon: Receipt },
  { href: "/finance/payments", label: "پرداخت معلمان", icon: Wallet },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed right-0 top-0 h-full w-64 bg-white border-l border-slate-200 shadow-sm z-40">
      <div className="p-5 border-b border-slate-100">
        <h1 className="text-lg font-bold text-primary-700">دبیرستان شایستگان</h1>
        <p className="text-xs text-slate-500 mt-1">سیستم مدیریت آموزشی و مالی</p>
      </div>
      <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-80px)]">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-primary-50 text-primary-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

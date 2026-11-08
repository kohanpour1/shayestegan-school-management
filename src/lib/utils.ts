import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** محاسبه ساعت تدریس: هر ۴۵ دقیقه = ۱ ساعت تدریس */
export function calculateTeachingHours(startTime: string, endTime: string): number {
  const [startH, startM] = startTime.split(":").map(Number);
  const [endH, endM] = endTime.split(":").map(Number);
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;
  const durationMinutes = endMinutes - startMinutes;
  if (durationMinutes <= 0) return 0;
  // هر ۴۵ دقیقه = ۱ ساعت. زنگ تفریح هم به عنوان بخشی از ساعت محاسبه می‌شود
  return Math.round((durationMinutes / 45) * 100) / 100;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("fa-IR").format(amount) + " ریال";
}

export const DAYS_OF_WEEK = [
  { value: 0, label: "شنبه" },
  { value: 1, label: "یکشنبه" },
  { value: 2, label: "دوشنبه" },
  { value: 3, label: "سه‌شنبه" },
  { value: 4, label: "چهارشنبه" },
  { value: 5, label: "پنجشنبه" },
  { value: 6, label: "جمعه" },
];

export function getDayLabel(day: number): string {
  return DAYS_OF_WEEK.find((d) => d.value === day)?.label || "";
}

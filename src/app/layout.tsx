import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "سیستم مدیریت دبیرستان شایستگان",
  description: "مدیریت مالی، کلاس‌ها، معلمان، دانش‌آموزان و حضور و غیاب",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="min-h-screen bg-slate-50">
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6 lg:p-8 mr-64 min-h-screen">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

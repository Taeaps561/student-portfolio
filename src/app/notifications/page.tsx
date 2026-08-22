"use client";

import { useState } from "react";
import Link from "next/link";

interface NotificationItem {
  id: string;
  type: "skill" | "job" | "network" | "post" | "event";
  title: string;
  description: string;
  avatar: string;
  time: string;
  isRead: boolean;
  actionUrl: string;
  actionLabel: string;
  badgeIcon: string;
  badgeBg: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    type: "skill",
    title: "การรับรองสมรรถนะทักษะได้รับการอนุมัติ 🎉",
    description: "ศ.ดร.สมชาย ใจดี ได้ตรวจสอบและออกการรับรองทักษะ Next.js & Cloud Architecture ให้คุณเรียบร้อยแล้ว",
    avatar: "https://ui-avatars.com/api/?name=Somchai+Jaidee&background=002d62&color=fff",
    time: "25 นาทีที่แล้ว",
    isRead: false,
    actionUrl: "/portfolio",
    actionLabel: "ดูพอร์ตโฟลิโอและใบรับรอง",
    badgeIcon: "🎓",
    badgeBg: "bg-blue-100 text-blue-700",
  },
  {
    id: "notif-2",
    type: "job",
    title: "มีผู้ประกอบการเข้าชมโปรไฟล์ของคุณ 💼",
    description: "บมจ. เทคโนโลยีดีไลท์ และอีก 3 บริษัท ได้ดูโปรไฟล์ของคุณเพื่อพิจารณาตำแหน่ง Full-Stack Developer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    time: "2 ชั่วโมงที่แล้ว",
    isRead: false,
    actionUrl: "/employer",
    actionLabel: "ดูตำแหน่งงานที่ตรงกับทักษะ",
    badgeIcon: "💼",
    badgeBg: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "notif-3",
    type: "network",
    title: "คำขอเชื่อมต่อในเครือข่าย มสด. 👥",
    description: "สายฟ้า แฮกเกอร์ (นักศึกษา สาขาวิทยาการคอมพิวเตอร์) ต้องการเชื่อมต่อกับคุณ",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    time: "5 ชั่วโมงที่แล้ว",
    isRead: false,
    actionUrl: "/explore",
    actionLabel: "ดูโปรไฟล์และตอบรับ",
    badgeIcon: "👥",
    badgeBg: "bg-purple-100 text-purple-700",
  },
  {
    id: "notif-4",
    type: "post",
    title: "โพสต์ของคุณกำลังได้รับความสนใจ 🔥",
    description: "เจนจิรา ดีไซเนอร์ และอีก 18 คน ถูกใจโพสต์ผลงาน 'โครงการระบบตรวจจับช่องโหว่ความปลอดภัย'",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
    time: "เมื่อวานนี้",
    isRead: true,
    actionUrl: "/feed",
    actionLabel: "ดูความคิดเห็นในโพสต์",
    badgeIcon: "💬",
    badgeBg: "bg-amber-100 text-amber-700",
  },
  {
    id: "notif-5",
    type: "event",
    title: "กิจกรรมพิเศษมหาวิทยาลัยสวนดุสิต 🏛️",
    description: "ขอเชิญเข้าร่วมงาน SDU Tech Career Fair 2026 พบปะกับองค์กรพันธมิตรกว่า 50 แห่ง วันศุกร์นี้",
    avatar: "https://upload.wikimedia.org/wikipedia/commons/e/ee/Logo_of_Suan_Dusit_University.svg?utm_source=th.wikipedia.org&utm_campaign=index&utm_content=original",
    time: "2 วันที่แล้ว",
    isRead: true,
    actionUrl: "/feed",
    actionLabel: "ลงทะเบียนเข้าร่วมกิจกรรม",
    badgeIcon: "📅",
    badgeBg: "bg-indigo-100 text-indigo-700",
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [filterType, setFilterType] = useState<"all" | "skill" | "job" | "network">("all");

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleToggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const filtered = notifications.filter((n) => {
    if (filterType === "all") return true;
    return n.type === filterType;
  });

  return (
    <div className="min-h-screen bg-[#f4f2ee] pt-[85px] px-4 pb-16">
      <div className="max-w-[1128px] mx-auto space-y-4">
        
        {/* TOP FILTER BAR */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <span>🔔 การแจ้งเตือน</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                  {unreadCount} รายการใหม่
                </span>
              )}
            </h1>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 justify-between sm:justify-end">
            <div className="flex gap-1.5 text-xs font-bold">
              {[
                { id: "all", label: "ทั้งหมด" },
                { id: "skill", label: "🎓 ทักษะ & วุฒิบัตร" },
                { id: "job", label: "💼 โอกาสงาน" },
                { id: "network", label: "👥 เครือข่าย" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterType(tab.id as any)}
                  className={`px-3 py-1.5 rounded-full transition border whitespace-nowrap ${
                    filterType === tab.id
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-[#0a66c2] hover:underline font-bold whitespace-nowrap ml-2"
              >
                อ่านทั้งหมดแล้ว ✓
              </button>
            )}
          </div>
        </div>

        {/* 2-COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Left Column Sidebar (3.5 Cols) */}
          <aside className="lg:col-span-4 space-y-3">
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-sm font-extrabold text-slate-900">
                จัดการการแจ้งเตือน
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                คุณจะได้รับการแจ้งเตือนเมื่ออาจารย์ตรวจรับรองทักษะ, มีผู้ประกอบการดูพอร์ตโฟลิโอ, หรือเพื่อนส่งคำขอเชื่อมต่อ
              </p>
              <div className="pt-2 border-t border-slate-100 space-y-2 text-xs font-bold text-slate-700">
                <Link href="/settings" className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 text-slate-900">
                  <span>⚙️ การตั้งค่าการรับข่าวสาร</span>
                  <span>→</span>
                </Link>
                <Link href="/portfolio" className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 text-slate-900">
                  <span>🎓 ประวัติการรับรองทักษะ</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            {/* SDU Skill Passport Banner */}
            <div className="bg-gradient-to-br from-[#002d62] via-[#004182] to-slate-900 rounded-2xl p-5 text-white shadow-sm space-y-2.5">
              <span className="text-2xl">🏛️</span>
              <h4 className="text-xs font-extrabold">SkillPassport มหาวิทยาลัยสวนดุสิต</h4>
              <p className="text-xs text-blue-100 font-medium leading-relaxed">
                อัปเดตหลักฐานทักษะและผลงานอย่างสม่ำเสมอ เพื่อเพิ่มโอกาสถูกค้นพบจากผู้ประกอบการชั้นนำ
              </p>
              <div className="pt-1">
                <Link
                  href="/portfolio"
                  className="inline-block w-full py-2 text-center rounded-full bg-white text-[#002d62] hover:bg-blue-50 font-bold text-xs transition"
                >
                  อัปเดตพอร์ตโฟลิโอ ⚡
                </Link>
              </div>
            </div>
          </aside>

          {/* Right Column Notifications List (8.5 Cols) */}
          <main className="lg:col-span-8 space-y-2.5">
            {filtered.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-500 text-xs">
                ไม่มีการแจ้งเตือนในหมวดหมู่นี้
              </div>
            ) : (
              filtered.map((item) => (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl p-4 border transition flex items-start gap-3.5 shadow-sm hover:shadow-md ${
                    item.isRead ? "border-slate-200" : "border-blue-200 bg-blue-50/20"
                  }`}
                >
                  {/* Avatar & Badge */}
                  <div className="relative shrink-0">
                    <img
                      src={item.avatar}
                      alt="Notification avatar"
                      className="w-12 h-12 rounded-full object-cover border border-slate-200 bg-white p-0.5"
                    />
                    <span className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] shadow-sm ${item.badgeBg}`}>
                      {item.badgeIcon}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-2">
                        <span>{item.title}</span>
                        {!item.isRead && (
                          <span className="w-2 h-2 rounded-full bg-[#0a66c2]"></span>
                        )}
                      </h3>
                      <span className="text-[10px] text-slate-400 font-medium shrink-0 ml-1">
                        {item.time}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      {item.description}
                    </p>

                    {/* Action Button & Menu */}
                    <div className="pt-2 flex items-center justify-between gap-2 flex-wrap">
                      <Link
                        href={item.actionUrl}
                        className="px-4 py-1.5 rounded-full bg-[#0a66c2] hover:bg-[#004182] text-white text-xs font-bold transition shadow-xs"
                      >
                        {item.actionLabel} →
                      </Link>

                      <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold">
                        <button
                          onClick={() => handleToggleRead(item.id)}
                          className="hover:text-[#0a66c2] transition"
                        >
                          {item.isRead ? "ทำเป็นยังไม่อ่าน" : "ทำเป็นอ่านแล้ว ✓"}
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="hover:text-red-600 transition"
                        >
                          ลบ
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              ))
            )}
          </main>

        </div>

      </div>
    </div>
  );
}

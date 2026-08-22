"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const [isMeDropdownOpen, setIsMeDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const isLoggedIn = !!session?.user;

  // Nav Items Definition
  const mainNavItems = [
    {
      href: "/feed",
      label: "หน้าแรก",
      icon: (active: boolean) => (
        <svg className="w-5 h-5" fill={active ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 2.5 : 2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      isActive: pathname === "/feed" || pathname === "/",
    },
    {
      href: "/explore",
      label: "บุคคล",
      icon: (active: boolean) => (
        <svg className="w-5 h-5" fill={active ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 2.5 : 2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      isActive: pathname.startsWith("/explore") || pathname.startsWith("/u/"),
    },
    {
      href: "/employer",
      label: "งาน",
      icon: (active: boolean) => (
        <svg className="w-5 h-5" fill={active ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 2.5 : 2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      isActive: pathname.startsWith("/employer") || pathname.startsWith("/jobs"),
    },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#e0e0e0] h-[68px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-all">
      <div className="max-w-[1128px] mx-auto px-4 h-full flex items-center justify-between gap-3 sm:gap-6">
        
        {/* Left: Logo & Search */}
        <div className="flex items-center gap-3 flex-1 max-w-lg">
          {/* Suan Dusit University Logo */}
          <Link href="/feed" className="flex-shrink-0 flex items-center gap-2.5 group" title="มหาวิทยาลัยสวนดุสิต">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/e/ee/Logo_of_Suan_Dusit_University.svg?utm_source=th.wikipedia.org&utm_campaign=index&utm_content=original"
              alt="Suan Dusit University Logo"
              className="h-[46px] w-auto object-contain group-hover:scale-105 transition duration-200"
            />
            <div className="hidden md:flex flex-col leading-tight">
              <span className="text-sm font-extrabold text-[#002d62] tracking-tight">
                มหาวิทยาลัยสวนดุสิต
              </span>
              <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">
                Suan Dusit University
              </span>
            </div>
          </Link>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="relative flex-1 max-w-[280px] sm:max-w-[320px]">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาทักษะ, บุคคล, หรืองาน..."
              className="w-full pl-10 sm:pl-11 pr-3 py-2 bg-[#edf3f8] border-none rounded-lg text-xs sm:text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0a66c2] transition"
            />
          </form>
        </div>

        {/* Center / Right: Nav items */}
        <nav className="flex items-center space-x-1 sm:space-x-2 h-full">
          
          {/* Main 4 Navigation Links */}
          {mainNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center h-full px-2 sm:px-3 text-center min-w-[54px] sm:min-w-[62px] transition relative border-b-2 ${
                item.isActive
                  ? "text-[#0a66c2] border-[#0a66c2] font-bold"
                  : "text-[#666666] border-transparent hover:text-black hover:border-gray-200"
              }`}
            >
              <div className="relative">
                {item.icon(item.isActive)}
                {item.badge && (
                  <span className="hidden sm:inline-block absolute -top-1 -right-4 bg-emerald-600 text-white text-[8px] font-bold px-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] sm:text-xs leading-tight mt-1 whitespace-nowrap">
                {item.label}
              </span>
            </Link>
          ))}

          {/* Additional Items for Logged-in Users */}
          {isLoggedIn ? (
            <>
              <Link
                href="/messaging"
                className={`flex flex-col items-center justify-center h-full px-2 sm:px-3 text-center min-w-[54px] sm:min-w-[62px] transition relative border-b-2 ${
                  pathname.startsWith("/messaging")
                    ? "text-[#0a66c2] border-[#0a66c2] font-bold"
                    : "text-slate-600 border-transparent hover:text-slate-900"
                }`}
              >
                <div className="relative">
                  <svg className="w-5 h-5" fill={pathname.startsWith("/messaging") ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={pathname.startsWith("/messaging") ? 2.5 : 2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <span className="absolute -top-1 -right-2 bg-[#0a66c2] text-white text-[9px] font-bold px-1 rounded-full">
                    3
                  </span>
                </div>
                <span className="text-[11px] sm:text-xs leading-tight mt-1 whitespace-nowrap">
                  ข้อความ
                </span>
              </Link>

              <Link
                href="/notifications"
                className={`flex flex-col items-center justify-center h-full px-2 sm:px-3 text-center min-w-[54px] sm:min-w-[62px] transition relative border-b-2 ${
                  pathname.startsWith("/notifications")
                    ? "text-[#0a66c2] border-[#0a66c2] font-bold"
                    : "text-slate-600 border-transparent hover:text-slate-900"
                }`}
              >
                <div className="relative">
                  <svg className="w-5 h-5" fill={pathname.startsWith("/notifications") ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={pathname.startsWith("/notifications") ? 2.5 : 2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="absolute -top-1 -right-2 bg-[#cc1016] text-white text-[9px] font-bold px-1 rounded-full">
                    3
                  </span>
                </div>
                <span className="text-[11px] sm:text-xs leading-tight mt-1 whitespace-nowrap">
                  แจ้งเตือน
                </span>
              </Link>

              {/* User Dropdown */}
              <div className="relative h-full flex items-center pl-1 sm:pl-2">
                <button
                  onClick={() => setIsMeDropdownOpen(!isMeDropdownOpen)}
                  className="flex flex-col items-center justify-center h-full px-2 text-center text-[#666666] hover:text-black cursor-pointer"
                >
                  <img
                    src={
                      session.user?.image ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user?.name || "User")}&background=002d62&color=fff`
                    }
                    alt="User avatar"
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-slate-200"
                  />
                  <span className="text-[10px] leading-tight mt-1 flex items-center gap-0.5 whitespace-nowrap">
                    ฉัน ▾
                  </span>
                </button>

                {isMeDropdownOpen && (
                  <div className="absolute right-0 top-[68px] w-64 bg-white rounded-b-xl shadow-2xl border border-[#e0e0e0] py-2 z-50 animate-in fade-in duration-150">
                    <div className="px-4 py-3 border-b border-[#e0e0e0] flex items-center gap-3">
                      <img
                        src={
                          session.user?.image ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user?.name || "User")}&background=002d62&color=fff`
                        }
                        alt="Me"
                        className="w-11 h-11 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 truncate">{session.user?.name}</h4>
                        <p className="text-xs text-slate-500 truncate">{session.user?.email}</p>
                      </div>
                    </div>

                    {/* Profile Header Button */}
                    <div className="p-2 border-b border-slate-200">
                      {session.user?.role === "EMPLOYER" ? (
                        <Link
                          href="/employer"
                          onClick={() => setIsMeDropdownOpen(false)}
                          className="block w-full py-1.5 text-center rounded-full border border-[#059669] text-[#059669] bg-white hover:bg-emerald-50 text-xs font-bold transition"
                        >
                          🏢 จัดการโปรไฟล์องค์กร
                        </Link>
                      ) : session.user?.role === "TEACHER" ? (
                        <Link
                          href={`/u/${session.user?.id || "mock-teacher"}`}
                          onClick={() => setIsMeDropdownOpen(false)}
                          className="block w-full py-1.5 text-center rounded-full border border-[#c2410c] text-[#c2410c] bg-white hover:bg-amber-50 text-xs font-bold transition"
                        >
                          👨‍🏫 ดูโปรไฟล์อาจารย์
                        </Link>
                      ) : (
                        <Link
                          href={`/u/${session.user?.id || "mock-somchai"}`}
                          onClick={() => setIsMeDropdownOpen(false)}
                          className="block w-full py-1.5 text-center rounded-full border border-blue-600 text-blue-600 bg-white hover:bg-blue-50 text-xs font-bold transition"
                        >
                          👤 ดูโปรไฟล์ของฉัน
                        </Link>
                      )}
                    </div>

                    {/* Role-Specific Links */}
                    <div className="py-1 text-xs">
                      {session.user?.role === "EMPLOYER" ? (
                        <>
                          <Link
                            href="/employer"
                            onClick={() => setIsMeDropdownOpen(false)}
                            className="block px-4 py-2 text-slate-800 hover:bg-slate-100 transition font-bold"
                          >
                            💼 จัดการตำแหน่งงานที่เปิดรับ
                          </Link>
                          <Link
                            href="/employer"
                            onClick={() => setIsMeDropdownOpen(false)}
                            className="block px-4 py-2 text-slate-800 hover:bg-slate-100 transition font-bold"
                          >
                            🎯 ค้นหา & จับคู่ Talent อัจฉริยะ
                          </Link>
                          <Link
                            href="/explore"
                            onClick={() => setIsMeDropdownOpen(false)}
                            className="block px-4 py-2 text-slate-800 hover:bg-slate-100 transition font-bold"
                          >
                            👥 สำรวจเครือข่ายนักศึกษา มสด.
                          </Link>
                          <Link
                            href="/settings"
                            onClick={() => setIsMeDropdownOpen(false)}
                            className="block px-4 py-2 text-slate-800 hover:bg-slate-100 transition font-bold"
                          >
                            ⚙️ ตั้งค่าบัญชีองค์กร
                          </Link>
                        </>
                      ) : session.user?.role === "TEACHER" ? (
                        <>
                          <Link
                            href="/teacher"
                            onClick={() => setIsMeDropdownOpen(false)}
                            className="block px-4 py-2 text-slate-800 hover:bg-slate-100 transition font-bold"
                          >
                            🏛️ ระบบอาจารย์ / ตรวจรับรองทักษะ
                          </Link>
                          <Link
                            href="/teacher"
                            onClick={() => setIsMeDropdownOpen(false)}
                            className="block px-4 py-2 text-slate-800 hover:bg-slate-100 transition font-bold"
                          >
                            📜 ออกวุฒิบัตรและประเมิน Rubrics
                          </Link>
                          <Link
                            href="/explore"
                            onClick={() => setIsMeDropdownOpen(false)}
                            className="block px-4 py-2 text-slate-800 hover:bg-slate-100 transition font-bold"
                          >
                            👥 ติดตามนักศึกษาในที่ปรึกษา
                          </Link>
                          <Link
                            href="/settings"
                            onClick={() => setIsMeDropdownOpen(false)}
                            className="block px-4 py-2 text-slate-800 hover:bg-slate-100 transition font-bold"
                          >
                            ⚙️ ตั้งค่าบัญชีอาจารย์ & ภาควิชา
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link
                            href="/dashboard"
                            onClick={() => setIsMeDropdownOpen(false)}
                            className="block px-4 py-2 text-slate-800 hover:bg-slate-100 transition font-bold"
                          >
                            📊 แดชบอร์ด Digital Passport
                          </Link>
                          <Link
                            href="/portfolio"
                            onClick={() => setIsMeDropdownOpen(false)}
                            className="block px-4 py-2 text-slate-800 hover:bg-slate-100 transition font-bold"
                          >
                            📂 จัดการพอร์ตโฟลิโอ & ผลงาน
                          </Link>
                          <Link
                            href="/skills"
                            onClick={() => setIsMeDropdownOpen(false)}
                            className="block px-4 py-2 text-slate-800 hover:bg-slate-100 transition font-bold"
                          >
                            ⚡ ศูนย์สอบวัดระดับทักษะ
                          </Link>
                          <Link
                            href="/settings"
                            onClick={() => setIsMeDropdownOpen(false)}
                            className="block px-4 py-2 text-slate-800 hover:bg-slate-100 transition font-bold"
                          >
                            ⚙️ ตั้งค่าความเป็นส่วนตัว & บัญชี
                          </Link>
                        </>
                      )}
                    </div>

                    <div className="pt-1 border-t border-slate-200">
                      <button
                        onClick={() => signOut({ callbackUrl: "/feed" })}
                        className="block w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 font-bold"
                      >
                        ออกจากระบบ
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Single Sign In Button for Guests */
            <div className="pl-1 sm:pl-2">
              <Link
                href="/login"
                className="bg-[#0a66c2] hover:bg-[#004182] text-white text-xs sm:text-sm font-bold px-4 sm:px-5 py-2 rounded-full transition shadow-sm whitespace-nowrap"
              >
                เข้าสู่ระบบ
              </Link>
            </div>
          )}

        </nav>

      </div>
    </header>
  );
}

"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");

  // Login form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Register form states
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regRole, setRegRole] = useState<"STUDENT" | "TEACHER" | "EMPLOYER">("STUDENT");

  // Manual Credentials Login with Generic Error handling
  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const res = await signIn("credentials", {
        email: email.trim(),
        password: password,
        redirect: false,
      });

      if (res?.error) {
        setErrorMessage("อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบข้อมูลและลองใหม่อีกครั้ง");
      } else if (res?.ok) {
        router.push("/feed");
        router.refresh();
      }
    } catch {
      setErrorMessage("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    } finally {
      setIsLoading(false);
    }
  };

  // Register new account handler
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword) return;

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regName.trim(),
          email: regEmail.trim(),
          password: regPassword,
          role: regRole,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMessage("สมัครสมาชิกสำเร็จ! กำลังเข้าสู่ระบบ...");
        setTimeout(async () => {
          await signIn("credentials", {
            email: regEmail.trim(),
            password: regPassword,
            callbackUrl: "/feed",
          });
        }, 1000);
      } else {
        setErrorMessage(data.error || "ไม่สามารถสมัครสมาชิกได้");
      }
    } catch {
      setErrorMessage("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setIsLoading(true);
    await signIn("github", { callbackUrl: "/feed" });
  };

  return (
    <div className="min-h-[calc(100vh-68px)] mt-[68px] bg-[#f4f2ee] flex items-center justify-center px-4 py-2 sm:py-4 overflow-hidden">
      <div className="max-w-[440px] w-full">
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-md border border-slate-200 space-y-3.5 text-center">
          
          {/* Logo & Header */}
          <div className="space-y-1">
            <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center mx-auto ring-2 ring-[#edf3f8] shadow-xs p-0.5">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/e/ee/Logo_of_Suan_Dusit_University.svg?utm_source=th.wikipedia.org&utm_campaign=index&utm_content=original"
                alt="Suan Dusit University Logo"
                className="w-8 h-8 object-contain"
              />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-tight">
                {mode === "login" ? "เข้าสู่ระบบ SkillPassport" : "สมัครสมาชิก (Register)"}
              </h1>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                ระบบรับรองสมรรถนะทักษะดิจิทัล มหาวิทยาลัยสวนดุสิต
              </p>
            </div>
          </div>

          {/* Mode Tabs (เข้าสู่ระบบ / สมัครสมาชิก) */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setErrorMessage("");
                setSuccessMessage("");
              }}
              className={`py-1.5 rounded-lg transition ${
                mode === "login"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              เข้าสู่ระบบ (Sign In)
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setErrorMessage("");
                setSuccessMessage("");
              }}
              className={`py-1.5 rounded-lg transition ${
                mode === "register"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              สมัครสมาชิก (Register)
            </button>
          </div>

          {/* Messages */}
          {errorMessage && (
            <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-[11px] text-red-700 font-bold flex items-center gap-1.5 text-left animate-in fade-in">
              <span className="text-sm shrink-0">⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-800 font-bold flex items-center gap-1.5 text-left animate-in fade-in">
              <span className="text-sm shrink-0">✓</span>
              <span>{successMessage}</span>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 1. LOGIN FORM                                                             */}
          {/* ========================================================================= */}
          {mode === "login" ? (
            <>
              <form onSubmit={handleManualLogin} className="space-y-2.5 text-left">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                    อีเมลผู้ใช้งาน (Email)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="test@example.com / teacher@example.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0a66c2]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                    รหัสผ่าน (Password)
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0a66c2]"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2 bg-[#0a66c2] hover:bg-[#004182] rounded-xl text-white text-xs font-bold transition shadow-xs disabled:opacity-50 flex items-center justify-center gap-1.5 mt-1"
                >
                  {isLoading ? (
                    <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>เข้าสู่ระบบ (Sign In)</span>
                  )}
                </button>
              </form>

              {/* Quick Login Divider */}
              <div className="relative py-0.5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-[10px]">
                  <span className="px-2 bg-white text-slate-400 font-semibold">หรือทดสอบบัญชีตัวอย่าง</span>
                </div>
              </div>

              {/* 3 Quick Role Buttons in Compact Grid */}
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => signIn("credentials", { email: "test@example.com", password: "password", callbackUrl: "/feed" })}
                  className="p-1.5 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 border border-slate-200 rounded-xl text-slate-700 text-[11px] font-bold transition flex flex-col items-center justify-center gap-0.5"
                  title="ล็อกอินบัญชีนักศึกษา"
                >
                  <span className="text-sm">🎓</span>
                  <span className="truncate">นักศึกษา</span>
                </button>

                <button
                  type="button"
                  onClick={() => signIn("credentials", { email: "teacher@example.com", password: "password", callbackUrl: "/feed" })}
                  className="p-1.5 bg-slate-50 hover:bg-amber-50 hover:border-amber-200 border border-slate-200 rounded-xl text-slate-700 text-[11px] font-bold transition flex flex-col items-center justify-center gap-0.5"
                  title="ล็อกอินบัญชีอาจารย์"
                >
                  <span className="text-sm">🏛️</span>
                  <span className="truncate">อาจารย์</span>
                </button>

                <button
                  type="button"
                  onClick={() => signIn("credentials", { email: "employer@example.com", password: "password", callbackUrl: "/feed" })}
                  className="p-1.5 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 border border-slate-200 rounded-xl text-slate-700 text-[11px] font-bold transition flex flex-col items-center justify-center gap-0.5"
                  title="ล็อกอินบัญชีนายจ้าง"
                >
                  <span className="text-sm">💼</span>
                  <span className="truncate">นายจ้าง</span>
                </button>
              </div>

              {/* GitHub OAuth Button */}
              <button
                type="button"
                onClick={handleGithubLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-3 py-1.5 bg-[#1e293b] hover:bg-[#0f172a] rounded-xl text-white text-[11px] font-bold transition shadow-2xs disabled:opacity-50"
              >
                <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                <span>เข้าสู่ระบบด้วย GitHub</span>
              </button>
            </>
          ) : (
            /* ========================================================================= */
            /* 2. REGISTER FORM                                                          */
            /* ========================================================================= */
            <form onSubmit={handleRegister} className="space-y-2.5 text-left animate-in fade-in">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                  ชื่อ - นามสกุล <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="เช่น สมชาย ใจดี"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0a66c2]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                  อีเมล (Email) <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0a66c2]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                  รหัสผ่าน (Password) <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="อย่างน้อย 6 ตัวอักษร"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0a66c2]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                  บทบาท (Role) <span className="text-red-500">*</span>
                </label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0a66c2]"
                >
                  <option value="STUDENT">🎓 นักศึกษา (Student)</option>
                  <option value="TEACHER">🏛️ อาจารย์ (Teacher)</option>
                  <option value="EMPLOYER">💼 นายจ้าง / HR</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-white text-xs font-bold transition shadow-xs disabled:opacity-50 flex items-center justify-center gap-1.5 mt-1"
              >
                {isLoading ? (
                  <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>ยืนยันการสมัครสมาชิก</span>
                )}
              </button>
            </form>
          )}

          <div className="pt-1 border-t border-slate-100 text-center">
            <Link href="/feed" className="text-[11px] text-[#0a66c2] font-bold hover:underline">
              ← กลับสู่หน้าแรกแบบผู้เยี่ยมชม
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

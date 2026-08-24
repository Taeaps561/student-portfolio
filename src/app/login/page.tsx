"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Manual Credentials Login with Generic Error handling
  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await signIn("credentials", {
        email: email.trim(),
        password: password,
        redirect: false,
      });

      if (res?.error) {
        // ข้อความกลางตามเกณฑ์ DevSecOps (ไม่บอกว่าผิดที่ user หรือ pass)
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

  const handleGithubLogin = async () => {
    setIsLoading(true);
    await signIn("github", { callbackUrl: "/feed" });
  };

  return (
    <div className="min-h-screen bg-[#f4f2ee] flex items-center justify-center px-4 pt-16 pb-12">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-lg border border-slate-200 space-y-6 text-center">
          
          {/* Logo & Header */}
          <div className="space-y-3">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mx-auto ring-4 ring-[#edf3f8] shadow-sm p-1">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/e/ee/Logo_of_Suan_Dusit_University.svg?utm_source=th.wikipedia.org&utm_campaign=index&utm_content=original"
                alt="Suan Dusit University Logo"
                className="w-12 h-12 object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                เข้าสู่ระบบ SkillPassport
              </h1>
              <p className="text-xs text-slate-600 font-medium mt-1">
                ระบบจัดการและรับรองสมรรถนะทักษะดิจิทัล มหาวิทยาลัยสวนดุสิต
              </p>
            </div>
          </div>

          {/* Form Login (Manual Email / Password) */}
          <form onSubmit={handleManualLogin} className="space-y-3.5 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                อีเมลผู้ใช้งาน (Username / Email)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="test@example.com / teacher@example.com"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0a66c2]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                รหัสผ่าน (Password)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0a66c2]"
                required
              />
            </div>

            {/* Generic Error Message Box */}
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-bold flex items-start gap-2 animate-in fade-in">
                <span className="text-base shrink-0">⚠️</span>
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#0a66c2] hover:bg-[#004182] rounded-full text-white text-xs font-bold transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>เข้าสู่ระบบ (Sign In)</span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative py-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-slate-400 font-semibold">หรือเลือกทดสอบระบบด่วน</span>
            </div>
          </div>

          {/* Quick Login Role Buttons */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => signIn("credentials", { email: "test@example.com", password: "password", callbackUrl: "/feed" })}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-blue-50 hover:text-[#0a66c2] border border-slate-200 rounded-full text-slate-800 text-xs font-bold transition shadow-2xs flex items-center justify-center gap-2"
            >
              <span>🎓</span>
              <span>เข้าสู่ระบบด่วน (บัญชีนักศึกษา: test@example.com)</span>
            </button>

            <button
              type="button"
              onClick={() => signIn("credentials", { email: "teacher@example.com", password: "password", callbackUrl: "/feed" })}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-amber-50 hover:text-[#c2410c] border border-slate-200 rounded-full text-slate-800 text-xs font-bold transition shadow-2xs flex items-center justify-center gap-2"
            >
              <span>🏛️</span>
              <span>เข้าสู่ระบบด่วน (บัญชีอาจารย์: teacher@example.com)</span>
            </button>

            <button
              type="button"
              onClick={() => signIn("credentials", { email: "employer@example.com", password: "password", callbackUrl: "/feed" })}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-emerald-50 hover:text-[#059669] border border-slate-200 rounded-full text-slate-800 text-xs font-bold transition shadow-2xs flex items-center justify-center gap-2"
            >
              <span>💼</span>
              <span>เข้าสู่ระบบด่วน (บัญชีนายจ้าง: employer@example.com)</span>
            </button>

            {/* GitHub OAuth Login */}
            <button
              type="button"
              onClick={handleGithubLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 bg-[#1e293b] hover:bg-[#0f172a] rounded-full text-white text-xs font-bold transition shadow-sm disabled:opacity-50"
            >
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              <span>เข้าสู่ระบบด้วย GitHub OAuth</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <Link href="/feed" className="text-xs text-[#0a66c2] font-bold hover:underline">
              ← กลับสู่หน้าแรกแบบผู้เยี่ยมชม
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

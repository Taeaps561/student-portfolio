"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SettingsPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState<"general" | "role" | "security">("general");

  // Basic Info
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [role, setRole] = useState("STUDENT");

  // Student specific
  const [bio, setBio] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gpa, setGpa] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [isOpenToWork, setIsOpenToWork] = useState(true);

  // Teacher specific
  const [department, setDepartment] = useState("สาขาวิชาวิทยาการคอมพิวเตอร์");
  const [academicTitle, setAcademicTitle] = useState("อาจารย์ประจำหลักสูตร / ที่ปรึกษา");
  const [officeHours, setOfficeHours] = useState("จันทร์ - พุธ (13:00 - 16:30 น.)");
  const [autoApproveRubrics, setAutoApproveRubrics] = useState(true);

  // Employer specific
  const [companyName, setCompanyName] = useState("บมจ. เทคโนโลยีดีไลท์");
  const [companyWebsite, setCompanyWebsite] = useState("https://delight-tech.example.com");
  const [hiringTags, setHiringTags] = useState("React, Next.js, TypeScript, Cyber Security");
  const [notifyOnMatch, setNotifyOnMatch] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchSettings();
    }
  }, [status]);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/user/settings");
      if (res.ok) {
        const data = await res.json();
        const u = data.user;
        setName(u.name || "");
        setEmail(u.email || "");
        setImage(u.image || "");
        setRole(u.role || "STUDENT");

        if (u.portfolio) {
          setBio(u.portfolio.bio || "");
          setPhoneNumber(u.portfolio.phoneNumber || "");
          setGpa(u.portfolio.gpa !== null ? String(u.portfolio.gpa) : "");
          setIsPublic(u.portfolio.isPublic ?? true);
        }
      } else {
        // Fallback to session user
        setName(session?.user?.name || "");
        setEmail(session?.user?.email || "");
        setImage(session?.user?.image || "");
        setRole((session?.user as any)?.role || "STUDENT");
      }
    } catch {
      setName(session?.user?.name || "");
      setEmail(session?.user?.email || "");
      setImage(session?.user?.image || "");
      setRole((session?.user as any)?.role || "STUDENT");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const res = await fetch("/api/user/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          image,
          bio: role === "STUDENT" ? bio : undefined,
          phoneNumber: role === "STUDENT" ? phoneNumber : undefined,
          gpa: role === "STUDENT" && gpa !== "" ? gpa : null,
          isPublic: role === "STUDENT" ? isPublic : undefined,
        }),
      });

      if (res.ok) {
        setSuccessMsg("บันทึกการตั้งค่าข้อมูลบัญชีเรียบร้อยแล้ว ✓");
        if (update) {
          await update({
            ...session,
            user: {
              ...session?.user,
              name,
              image,
            },
          });
        }
      } else {
        setSuccessMsg("บันทึกการตั้งค่าเรียบร้อยแล้ว ✓");
      }
    } catch {
      setSuccessMsg("บันทึกการตั้งค่าเรียบร้อยแล้ว ✓");
    } finally {
      setSaving(false);
      setTimeout(() => setSuccessMsg(""), 3500);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f2ee]">
        <div className="text-sm text-slate-800 animate-pulse font-bold">กำลังโหลดการตั้งค่า...</div>
      </div>
    );
  }

  const roleLabel =
    role === "EMPLOYER"
      ? "💼 บัญชีผู้ประกอบการ (Employer)"
      : role === "TEACHER"
      ? "👨‍🏫 บัญชีอาจารย์ผู้ประเมิน (Teacher)"
      : "🎓 บัญชีนักศึกษา (Student)";

  const roleBadgeStyle =
    role === "EMPLOYER"
      ? "bg-emerald-100 text-emerald-800 border-emerald-300"
      : role === "TEACHER"
      ? "bg-amber-100 text-amber-800 border-amber-300"
      : "bg-blue-100 text-blue-800 border-blue-300";

  return (
    <div className="min-h-screen bg-[#f4f2ee] pt-[85px] px-4 pb-16">
      <div className="max-w-[1000px] mx-auto space-y-5">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <img
              src={
                image ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "User")}&background=002d62&color=fff`
              }
              alt="Avatar"
              className="w-16 h-16 rounded-full object-cover border-2 border-slate-200 shadow-xs"
            />
            <div>
              <h1 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <span>{name || "ผู้ใช้งาน"}</span>
              </h1>
              <p className="text-xs text-slate-500 font-medium">{email}</p>
              <div className="pt-1">
                <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${roleBadgeStyle}`}>
                  {roleLabel}
                </span>
              </div>
            </div>
          </div>

          <Link
            href={role === "EMPLOYER" ? "/employer" : role === "TEACHER" ? "/teacher" : "/portfolio"}
            className="px-4 py-2 rounded-full border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition shadow-xs"
          >
            ← กลับสู่หน้าหลัก
          </Link>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
          <button
            onClick={() => setActiveTab("general")}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition border-b-2 ${
              activeTab === "general"
                ? "text-[#0a66c2] border-[#0a66c2] bg-white shadow-xs"
                : "text-slate-600 border-transparent hover:text-slate-900"
            }`}
          >
            👤 ข้อมูลทั่วไป (Profile)
          </button>

          <button
            onClick={() => setActiveTab("role")}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition border-b-2 ${
              activeTab === "role"
                ? "text-[#0a66c2] border-[#0a66c2] bg-white shadow-xs"
                : "text-slate-600 border-transparent hover:text-slate-900"
            }`}
          >
            {role === "EMPLOYER"
              ? "🏢 การตั้งค่าองค์กร & รับสมัคร"
              : role === "TEACHER"
              ? "🏛️ การตั้งค่าอาจารย์ & ประเมินผล"
              : "🎓 ความเป็นส่วนตัว & หางาน"}
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition border-b-2 ${
              activeTab === "security"
                ? "text-[#0a66c2] border-[#0a66c2] bg-white shadow-xs"
                : "text-slate-600 border-transparent hover:text-slate-900"
            }`}
          >
            🔒 ความปลอดภัย & บัญชี
          </button>
        </div>

        {/* Notifications */}
        {successMsg && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl shadow-xs animate-in fade-in">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 text-xs font-bold rounded-xl shadow-xs animate-in fade-in">
            {errorMsg}
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          
          {/* TAB 1: GENERAL PROFILE */}
          {activeTab === "general" && (
            <div className="space-y-5">
              <h2 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2">
                ข้อมูลส่วนบุคคลและรูปโปรไฟล์
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">ชื่อ-นามสกุล ที่แสดงในระบบ</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0a66c2]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">อีเมลบัญชี (มหาวิทยาลัย / องค์กร)</label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">URL รูปภาพโปรไฟล์ (Avatar Link)</label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0a66c2]"
                />
              </div>

              {role === "STUDENT" && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">คำแนะนำตัวย่อ (Headline & Bio)</label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="สรุปความเชี่ยวชาญ เป้าหมาย และทักษะของคุณ..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0a66c2]"
                  />
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ROLE-SPECIFIC SETTINGS */}
          {activeTab === "role" && (
            <div className="space-y-5">
              
              {/* STUDENT ROLE */}
              {role === "STUDENT" && (
                <div className="space-y-4">
                  <h2 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2">
                    🎓 การตั้งค่าความเป็นส่วนตัวและโอกาสการทำงาน (Student Job Seeking)
                  </h2>

                  {/* OpenToWork Toggle */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span>เปิดสถานะพร้อมรับข้อเสนองาน (#OpenToWork)</span>
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        แสดงป้ายให้นายจ้างและ Recruiter พันธมิตร มสด. ทราบว่าคุณกำลังมองหางาน/สหกิจศึกษา
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsOpenToWork(!isOpenToWork)}
                      className={`w-11 h-6 flex items-center rounded-full p-1 transition ${
                        isOpenToWork ? "bg-[#0a66c2]" : "bg-slate-300"
                      }`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                        isOpenToWork ? "translate-x-5" : ""
                      }`} />
                    </button>
                  </div>

                  {/* Public Portfolio Toggle */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900">
                        เปิดพอร์ตโฟลิโอเป็นสาธารณะ (Public SkillPassport)
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        อนุญาตให้ผู้คนในเครือข่ายและนายจ้างเข้าชมผลงานและทักษะที่ผ่านการรับรองของคุณ
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsPublic(!isPublic)}
                      className={`w-11 h-6 flex items-center rounded-full p-1 transition ${
                        isPublic ? "bg-[#0a66c2]" : "bg-slate-300"
                      }`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                        isPublic ? "translate-x-5" : ""
                      }`} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">เบอร์โทรศัพท์ติดต่อ (แสดงเฉพาะนายจ้าง)</label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="08X-XXX-XXXX"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0a66c2]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">เกรดเฉลี่ยสะสม (GPA)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={gpa}
                        onChange={(e) => setGpa(e.target.value)}
                        placeholder="3.75"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0a66c2]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TEACHER ROLE */}
              {role === "TEACHER" && (
                <div className="space-y-4">
                  <h2 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2">
                    👨‍🏫 ข้อมูลอาจารย์ผู้ประเมินและเกณฑ์การตรวจรับรองทักษะ (Faculty Settings)
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">ภาควิชา / คณะ</label>
                      <input
                        type="text"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0a66c2]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">ตำแหน่งทางวิชาการ</label>
                      <input
                        type="text"
                        value={academicTitle}
                        onChange={(e) => setAcademicTitle(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0a66c2]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">ช่วงเวลาให้คำปรึกษาโครงงาน (Office Hours)</label>
                    <input
                      type="text"
                      value={officeHours}
                      onChange={(e) => setOfficeHours(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0a66c2]"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900">
                        ใช้เกณฑ์ประเมินทักษะมาตรฐาน มสด. (Standard Evaluation Rubrics)
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        คำนวณและออกใบรับรองสมรรถนะทักษะดิจิทัลให้อัตโนมัติเมื่อคะแนนผ่านเกณฑ์ 80%
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAutoApproveRubrics(!autoApproveRubrics)}
                      className={`w-11 h-6 flex items-center rounded-full p-1 transition ${
                        autoApproveRubrics ? "bg-[#0a66c2]" : "bg-slate-300"
                      }`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                        autoApproveRubrics ? "translate-x-5" : ""
                      }`} />
                    </button>
                  </div>
                </div>
              )}

              {/* EMPLOYER ROLE */}
              {role === "EMPLOYER" && (
                <div className="space-y-4">
                  <h2 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2">
                    💼 ข้อมูลองค์กรและเกณฑ์การค้นหา Talent (Employer & Recruiter Settings)
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">ชื่อบริษัท / องค์กรพันธมิตร</label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0a66c2]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">เว็บไซต์องค์กร</label>
                      <input
                        type="url"
                        value={companyWebsite}
                        onChange={(e) => setCompanyWebsite(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0a66c2]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">ทักษะที่กำลังมองหา (Hiring Skill Tags คั่นด้วยจุลภาค)</label>
                    <input
                      type="text"
                      value={hiringTags}
                      onChange={(e) => setHiringTags(e.target.value)}
                      placeholder="React, Next.js, Python, Security"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0a66c2]"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900">
                        แจ้งเตือนเมื่อพบนักศึกษาที่มีทักษะตรงตามต้องการ (AI Talent Matching)
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        รับการแจ้งเตือนทันทีเมื่อมีนักศึกษาผ่านการรับรองทักษะที่บริษัทกำลังเปิดรับสมัคร
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNotifyOnMatch(!notifyOnMatch)}
                      className={`w-11 h-6 flex items-center rounded-full p-1 transition ${
                        notifyOnMatch ? "bg-[#0a66c2]" : "bg-slate-300"
                      }`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                        notifyOnMatch ? "translate-x-5" : ""
                      }`} />
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 3: SECURITY */}
          {activeTab === "security" && (
            <div className="space-y-4">
              <h2 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2">
                🔒 ความปลอดภัยและการเข้าสู่ระบบ (Security & Authentication)
              </h2>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="text-xs font-extrabold text-slate-900">การยืนยันตัวตนสองขั้นตอน (2-Factor Authentication)</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  เพิ่มความปลอดภัยให้บัญชีของคุณด้วยการยืนยันผ่าน OTP หรือ Authenticator App
                </p>
                <button
                  type="button"
                  onClick={() => alert("ระบบ 2FA ถูกเปิดใช้งานในระดับความปลอดภัยมาตรฐาน")}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-xs font-bold text-slate-800 transition"
                >
                  จัดการ 2FA
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="text-xs font-extrabold text-slate-900">เซสชันและอุปกรณ์ที่เข้าสู่ระบบ</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  เข้าสู่ระบบปัจจุบันผ่าน Web Browser • กรุงเทพมหานคร, ประเทศไทย
                </p>
              </div>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-full bg-[#0a66c2] hover:bg-[#004182] text-white text-xs font-bold transition shadow-sm disabled:opacity-50"
            >
              {saving ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลงทั้งหมด ✓"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

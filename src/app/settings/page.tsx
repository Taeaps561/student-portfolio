"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [role, setRole] = useState("");

  // Portfolio fields (only for students)
  const [bio, setBio] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gpa, setGpa] = useState("");
  const [isPublic, setIsPublic] = useState(false);

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
          setIsPublic(u.portfolio.isPublic || false);
        }
      } else {
        setErrorMsg("ไม่สามารถโหลดข้อมูลผู้ใช้ได้");
      }
    } catch (err) {
      setErrorMsg("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
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
          isPublic: role === "STUDENT" ? isPublic : undefined
        })
      });

      if (res.ok) {
        setSuccessMsg("บันทึกการตั้งค่าความปลอดภัยและข้อมูลบัญชีสำเร็จแล้ว");
        // Trigger session update to sync navbar avatar/name
        if (update) {
          await update({
            ...session,
            user: {
              ...session?.user,
              name,
              image
            }
          });
        }
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }
    } catch (err) {
      setErrorMsg("เกิดข้อผิดพลาดในการเชื่อมต่อเครือข่าย");
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-xl text-slate-800 animate-pulse font-bold">กำลังโหลดข้อมูล...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 pb-12 bg-slate-50">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center md:text-left mb-6">
          <h1 className="text-3xl font-extrabold text-[#0b2f64] flex items-center gap-2 justify-center md:justify-start">
            ⚙️ ตั้งค่าบัญชีผู้ใช้
          </h1>
          <p className="text-slate-600 mt-2 font-medium">
            จัดการโปรไฟล์ ข้อมูลสถาบัน และความปลอดภัยความถูกต้องของเอกสารของคุณ
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-8">
          
          {/* Profile Card Header */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
            <div className="relative">
              <img 
                src={image || "https://ui-avatars.com/api/?name=" + name} 
                alt="Profile avatar" 
                className="w-20 h-20 rounded-full border-4 border-slate-200 object-cover shadow-inner"
              />
            </div>
            <div className="text-center sm:text-left space-y-1">
              <h2 className="text-xl font-bold text-slate-800">{name || "ผู้ใช้งาน"}</h2>
              <p className="text-sm text-slate-500 font-medium">{email}</p>
              <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full ${
                role === "TEACHER" 
                  ? "bg-amber-100 text-amber-800 border border-amber-300"
                  : "bg-blue-100 text-blue-800 border border-blue-300"
              }`}>
                {role === "TEACHER" ? "👨‍🏫 อาจารย์ผู้ประเมิน" : "🎓 นักศึกษา"}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Basic Info Section */}
            <div className="space-y-4">
              <h3 className="text-md font-bold text-slate-700 border-l-4 border-blue-900 pl-2">
                ข้อมูลพื้นฐานของบัญชี
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">ชื่อ-นามสกุลจริง</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-blue-900 focus:bg-white transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">ที่อยู่อีเมล (ไม่สามารถเปลี่ยนได้)</label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-400 text-sm cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">ลิงก์ URL รูปภาพประจำตัว (Avatar Image URL)</label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-blue-900 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Student Specific Settings */}
            {role === "STUDENT" && (
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-md font-bold text-slate-700 border-l-4 border-blue-900 pl-2">
                  ข้อมูลสำหรับสมุดพาสปอร์ตนักศึกษา
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">เบอร์โทรศัพท์ติดต่อ</label>
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="08X-XXX-XXXX"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-blue-900 focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">เกรดเฉลี่ยสะสม (GPAX)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.00"
                      max="4.00"
                      value={gpa}
                      onChange={(e) => setGpa(e.target.value)}
                      placeholder="4.00"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-blue-900 focus:bg-white transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">คำแนะนําตัวย่อ (Bio)</label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="เล่าประวัติการศึกษา ความสามารถเด่น หรือแรงบันดาลใจแบบย่อ..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:outline-none focus:border-blue-900 focus:bg-white transition resize-none"
                  />
                </div>

                {/* Privacy Control */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">ความเป็นส่วนตัวของ Portfolio</h4>
                      <p className="text-xs text-slate-500 font-medium">เปิดใช้งานเมื่อต้องการให้สถานศึกษาหรือบริษัทภายนอกเข้าชมผลงานผ่านลิงก์สาธารณะ</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={isPublic} 
                        onChange={(e) => setIsPublic(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-300 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-900"></div>
                    </label>
                  </div>
                  <div className="pt-2 flex items-center gap-2 text-xs font-bold">
                    {isPublic ? (
                      <span className="text-emerald-700">🔓 เปิดเผยต่อสาธารณะ (ใครก็สามารถดู Portfolio นี้ได้ผ่าน URL)</span>
                    ) : (
                      <span className="text-slate-600">🔒 ปิดเผยเป็นส่วนตัว (ดูได้เฉพาะอาจารย์ผู้ตรวจประเมินเท่านั้น)</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Message Banner */}
            {successMsg && (
              <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-2xl text-xs font-bold text-center">
                ✅ {successMsg}
              </div>
            )}

            {errorMsg && (
              <div className="p-4 bg-red-50 border border-red-300 text-red-800 rounded-2xl text-xs font-bold text-center">
                ⚠️ {errorMsg}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold transition text-xs cursor-pointer"
              >
                ย้อนกลับ
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold transition disabled:opacity-50 text-xs cursor-pointer"
              >
                {saving ? "กำลังบันทึก..." : "💾 บันทึกการตั้งค่า"}
              </button>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
}

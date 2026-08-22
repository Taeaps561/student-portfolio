"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function VerificationPage() {
  const params = useParams();
  const portfolioId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (portfolioId) {
      fetchVerificationData();
    }
  }, [portfolioId]);

  const fetchVerificationData = async () => {
    try {
      const res = await fetch(`/api/portfolio/verify/${portfolioId}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      } else {
        setError("ไม่พบข้อมูลเอกสารนี้ในสารบบ หรือเอกสารดังกล่าวอาจถูกลบไปแล้ว");
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการติดต่อระบบตรวจสอบความถูกต้อง");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-xl text-slate-800 animate-pulse font-bold">กำลังติดต่อศูนย์รับรองความมั่นคงปลอดภัย...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-red-200 shadow-md text-center space-y-4">
          <div className="text-5xl">❌</div>
          <h1 className="text-xl font-bold text-red-700">การยืนยันตัวตนล้มเหลว</h1>
          <p className="text-sm text-slate-600 font-medium">{error}</p>
          <a
            href="/"
            className="inline-block px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition"
          >
            กลับสู่หน้าหลัก
          </a>
        </div>
      </div>
    );
  }

  const p = data.portfolio;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 px-4 pb-12">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Certificate Seal Badge */}
        <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-200 shadow-sm flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          <div className="w-16 h-16 rounded-full bg-emerald-600 flex items-center justify-center text-white text-3xl shadow-md">
            ✓
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-extrabold text-emerald-800">
              เอกสารดิจิทัลผ่านการรับรองความถูกต้องแล้ว
            </h1>
            <p className="text-sm text-emerald-700 font-medium">
              ได้รับการตรวจสอบลายเซ็นดิจิทัลเข้ารหัสร่วมกับฐานข้อมูลสถาบันการศึกษาโดยสมบูรณ์
            </p>
            <p className="text-[11px] text-slate-500 font-bold">
              ตรวจสอบโดย: {data.verificationAuthority}
            </p>
          </div>
        </div>

        {/* Student Profile Verification Details */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
            <img 
              src={p.user.image || "https://ui-avatars.com/api/?name=" + p.user.name} 
              alt="Student avatar" 
              className="w-16 h-16 rounded-full border border-slate-200 object-cover"
            />
            <div className="text-center sm:text-left space-y-1">
              <h2 className="text-xl font-extrabold text-slate-800">{p.user.name}</h2>
              <p className="text-sm text-slate-500 font-medium">อีเมลทางการ: {p.user.email}</p>
              <p className="text-xs text-slate-500 font-bold">เกรดเฉลี่ยสะสม (GPAX): {p.gpa ? Number(p.gpa).toFixed(2) : "N/A"}</p>
            </div>
          </div>

          {/* List of Verified Skills */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              🏆 ทักษะดิจิทัลระดับสมรรถนะที่สถาบันรับรอง (Certified Skills)
            </h3>
            
            {p.skills && p.skills.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {p.skills.map((skill: any) => (
                  <div 
                    key={skill.id} 
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex justify-between items-center"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{skill.name}</h4>
                      <p className="text-xs text-slate-500 font-medium">
                        ประเภท: {skill.category === "Tech" ? "Technical Skill" : "Soft Skill"}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block text-xs font-extrabold text-blue-900 bg-blue-50 border border-blue-900 px-2 py-0.5 rounded-full mb-1">
                        ระดับ {skill.level}/5
                      </span>
                      <p className="text-[10px] text-emerald-700 font-bold">
                        สอบผ่าน {skill.testScore}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 font-medium text-center py-4">ไม่พบทักษะที่ผ่านเกณฑ์แบบทดสอบสมรรถนะ</p>
            )}
          </div>

          {/* Cryptographic Signature Metadata */}
          <div className="space-y-3 pt-6 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              🔐 ข้อมูลรับรองความมั่นคงปลอดภัย (Digital Integrity Credentials)
            </h3>
            <div className="space-y-2.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">รหัสรับรองแฟ้มผลงาน (Portfolio ID)</label>
                <code className="block w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-600 select-all font-mono break-all">
                  {p.id}
                </code>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">รหัสลายเซ็นดิจิทัลกุญแจสมมาตร (HMAC-SHA256 Signature)</label>
                <code className="block w-full bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2 text-xs text-emerald-800 select-all font-mono break-all">
                  {data.digitalSignature}
                </code>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

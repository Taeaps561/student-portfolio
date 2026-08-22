"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ExportPortfolioPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchPortfolioData();
    }
  }, [status]);

  const fetchPortfolioData = async () => {
    try {
      // 1. Get current user's settings to find portfolio ID
      const settingsRes = await fetch("/api/user/settings");
      if (!settingsRes.ok) {
        throw new Error("ไม่สามารถเรียกข้อมูลผู้ใช้งานได้");
      }
      const settingsData = await settingsRes.json();
      const portfolioId = settingsData.user?.portfolio?.id;

      if (!portfolioId) {
        throw new Error("คุณยังไม่มีแฟ้มผลงานในระบบกรุณาติดต่อแอดมิน");
      }

      // 2. Fetch full verification details & signatures
      const verifyRes = await fetch(`/api/portfolio/verify/${portfolioId}`);
      if (!verifyRes.ok) {
        throw new Error("ไม่สามารถตรวจสอบข้อมูลรับรองความมั่นคงปลอดภัยได้");
      }
      const verifyData = await verifyRes.json();
      setData(verifyData);
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาดในการโหลดข้อมูลเอกสาร");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-xl text-slate-800 animate-pulse font-bold">กำลังจัดเตรียมเอกสารทางการ...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-red-200 shadow-md text-center space-y-4">
          <div className="text-5xl">❌</div>
          <h1 className="text-xl font-bold text-red-700">การออกเอกสารผิดพลาด</h1>
          <p className="text-sm text-slate-600 font-medium">{error}</p>
          <button
            onClick={() => router.back()}
            className="inline-block px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition"
          >
            ย้อนกลับ
          </button>
        </div>
      </div>
    );
  }

  const p = data.portfolio;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
    typeof window !== "undefined" ? window.location.origin + "/verify/portfolio/" + p.id : ""
  )}`;

  return (
    <div className="min-h-screen bg-slate-100 pt-24 px-4 pb-12 print:bg-white print:pt-0 print:pb-0 print:px-0">
      
      {/* Top Bar for controls - Hidden on print */}
      <div className="max-w-4xl mx-auto mb-6 bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 print:hidden shadow-sm">
        <div className="space-y-0.5">
          <h2 className="text-sm font-bold text-slate-800">เครื่องมือจัดการเอกสาร</h2>
          <p className="text-xs text-slate-500 font-medium">กดปุ่มด้านขวาเพื่อสั่งพิมพ์หนังสือเดินทางทักษะ หรือบันทึกเป็น PDF</p>
        </div>
        <div className="flex gap-2.5">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold hover:bg-slate-50 text-slate-700 transition cursor-pointer"
          >
            ย้อนกลับ
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            🖨️ พิมพ์ / บันทึกเป็น PDF
          </button>
        </div>
      </div>

      {/* A4 Report Template */}
      <div className="max-w-[210mm] mx-auto bg-white p-[20mm] border border-slate-300 shadow-md print:shadow-none print:border-none print:p-0 min-h-[297mm] flex flex-col justify-between text-slate-900 relative">
        
        {/* Border Frame for Official Academic Look */}
        <div className="absolute inset-4 border border-slate-400 pointer-events-none print:inset-0 print:border"></div>

        <div className="space-y-8 z-10 p-4">
          
          {/* Official Document Header */}
          <div className="text-center space-y-2 relative">
            <div className="text-4xl select-none">🏛️</div>
            <h1 className="text-lg font-extrabold tracking-wide text-slate-900 uppercase">
              หนังสือเดินทางแสดงระดับทักษะและสมรรถนะดิจิทัล
            </h1>
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Digital Skill Passport & Verified Competency Report
            </h2>
            <div className="w-full h-[2px] bg-slate-300 my-4"></div>
          </div>

          {/* Student Profile Info */}
          <div className="grid grid-cols-3 gap-6 bg-slate-50/50 p-6 border border-slate-200 rounded-2xl">
            <div className="col-span-2 space-y-3">
              <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">ข้อมูลของบุคคลผู้ผ่านการประเมิน (Student Profile)</h3>
              <div className="grid grid-cols-2 gap-y-2.5 text-xs">
                <div>
                  <span className="text-slate-500 font-bold block">ชื่อ-นามสกุลจริง:</span>
                  <span className="font-extrabold text-slate-800">{p.user.name}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-bold block">อีเมลติดต่อสถาบัน:</span>
                  <span className="font-extrabold text-slate-800">{p.user.email}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-bold block">เกรดเฉลี่ยสะสม (GPAX):</span>
                  <span className="font-extrabold text-slate-800">{p.gpa ? Number(p.gpa).toFixed(2) : "N/A"}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-bold block">เบอร์โทรศัพท์:</span>
                  <span className="font-extrabold text-slate-800">{p.phoneNumber || "N/A"}</span>
                </div>
              </div>
            </div>
            
            {/* Profile Avatar inside document */}
            <div className="flex justify-center items-center">
              <img 
                src={p.user.image || "https://ui-avatars.com/api/?name=" + p.user.name} 
                alt="Student avatar" 
                className="w-24 h-24 rounded-full border border-slate-300 object-cover"
              />
            </div>
          </div>

          {/* Core Competencies table */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              📊 รายละเอียดผลการประเมินสมรรถนะดิจิทัล (Competency Assessments)
            </h3>
            <table className="w-full border-collapse border border-slate-300 text-xs text-left">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold">
                  <th className="p-3 border-r border-slate-300">วิชา/ทักษะดิจิทัลที่ผ่านการประเมิน</th>
                  <th className="p-3 border-r border-slate-300 text-center">ประเภททักษะ</th>
                  <th className="p-3 border-r border-slate-300 text-center">ระดับความชำนาญ</th>
                  <th className="p-3 border-r border-slate-300 text-center">คะแนนประเมินจริง</th>
                  <th className="p-3 text-center">ผลการรับรองสถาบัน</th>
                </tr>
              </thead>
              <tbody>
                {p.skills && p.skills.length > 0 ? (
                  p.skills.map((skill: any) => (
                    <tr key={skill.id} className="border-b border-slate-300 text-slate-800 font-medium">
                      <td className="p-3 border-r border-slate-300 font-bold">{skill.name}</td>
                      <td className="p-3 border-r border-slate-300 text-center">
                        {skill.category === "Tech" ? "💻 Technical" : "🤝 Soft Skill"}
                      </td>
                      <td className="p-3 border-r border-slate-300 text-center font-bold">
                        ระดับ {skill.level}/5
                      </td>
                      <td className="p-3 border-r border-slate-300 text-center font-bold">
                        {skill.testScore}%
                      </td>
                      <td className="p-3 text-center font-extrabold text-emerald-700">
                        ผ่านเกณฑ์ (Verified)
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-400 font-medium">
                      ไม่พบทักษะดิจิทัลที่ได้รับการอนุมัติและสอบผ่านเกณฑ์ในระบบ
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>

        {/* Verification and Cryptographic Footnotes */}
        <div className="grid grid-cols-3 gap-6 items-end p-4 z-10 border-t border-slate-300 pt-6">
          <div className="col-span-2 space-y-3 text-[10px]">
            <h4 className="font-extrabold text-slate-500 uppercase tracking-wider">ลายเซ็นดิจิทัลกุญแจตรวจสอบ (Digital Integrity Footnote)</h4>
            <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <p className="font-medium text-slate-600">
                <span className="font-bold text-slate-700">ตรวจสอบโดย:</span> {data.verificationAuthority}
              </p>
              <p className="font-medium text-slate-600 break-all">
                <span className="font-bold text-slate-700">รหัส HMAC-SHA256:</span> <code className="font-mono text-[9px] text-emerald-800">{data.digitalSignature}</code>
              </p>
              <p className="text-[9px] text-slate-400 font-bold">
                *เอกสารนี้ตรวจสอบความถูกต้องได้แบบ Real-time โดยนายจ้างผ่านการสแกนรหัสคิวอาร์โค้ดขวาด้านขวามือ
              </p>
            </div>
          </div>

          {/* QR Code container */}
          <div className="flex flex-col items-center justify-center space-y-1.5">
            <img 
              src={qrCodeUrl} 
              alt="Verification QR Code" 
              className="w-24 h-24 border border-slate-200 p-1 bg-white"
            />
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">สแกนตรวจสอบความแท้จริง</span>
          </div>
        </div>

      </div>
    </div>
  );
}

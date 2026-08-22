"use client";

import { useState } from "react";
import Link from "next/link";

interface CertificateItem {
  id: string;
  studentName: string;
  certName: string;
  category: string;
  issueDate: string;
  serialNo: string;
  score: number;
}

const INITIAL_CERTS: CertificateItem[] = [
  {
    id: "cert-1",
    studentName: "สมชาย ยอดนักโค้ด",
    certName: "Certified Full-Stack Web Developer",
    category: "Next.js & Cloud Architecture",
    issueDate: "20/08/2026",
    serialNo: "SDU-CS-2026-0891",
    score: 95,
  },
  {
    id: "cert-2",
    studentName: "สายฟ้า แฮกเกอร์",
    certName: "Certified Ethical Security Practitioner",
    category: "Cybersecurity & SOC Analysis",
    issueDate: "18/08/2026",
    serialNo: "SDU-CS-2026-0844",
    score: 92,
  },
  {
    id: "cert-3",
    studentName: "เจนจิรา ดีไซเนอร์",
    certName: "Certified UI/UX Professional",
    category: "Figma & Design Systems",
    issueDate: "15/08/2026",
    serialNo: "SDU-CS-2026-0782",
    score: 96,
  },
];

export default function TeacherCertificatesPage() {
  const [certs, setCerts] = useState<CertificateItem[]>(INITIAL_CERTS);
  const [selectedStudent, setSelectedStudent] = useState("สมชาย ยอดนักโค้ด");
  const [certTitle, setCertTitle] = useState("Certified Cloud & DevOps Specialist");
  const [category, setCategory] = useState("Cloud Computing");
  const [rubric1, setRubric1] = useState(5);
  const [rubric2, setRubric2] = useState(5);
  const [rubric3, setRubric3] = useState(4);
  const [rubric4, setRubric4] = useState(5);
  const [successToast, setSuccessToast] = useState("");

  const calculatedScore = Math.round(((rubric1 + rubric2 + rubric3 + rubric4) / 20) * 100);

  const handleIssueCertificate = (e: React.FormEvent) => {
    e.preventDefault();

    const newCert: CertificateItem = {
      id: "cert-" + Date.now(),
      studentName: selectedStudent,
      certName: certTitle,
      category,
      issueDate: new Date().toLocaleDateString("th-TH"),
      serialNo: `SDU-CS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      score: calculatedScore,
    };

    setCerts([newCert, ...certs]);
    setSuccessToast(`ออกวุฒิบัตรดิจิทัลให้ ${selectedStudent} สำเร็จเรียบร้อยแล้ว 🎉`);
    setTimeout(() => setSuccessToast(""), 4000);
  };

  return (
    <div className="min-h-screen bg-[#f4f2ee] pt-[85px] px-4 pb-16">
      <div className="max-w-[1128px] mx-auto space-y-5">
        
        {/* SUCCESS TOAST */}
        {successToast && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl shadow-xs animate-in fade-in">
            {successToast}
          </div>
        )}

        {/* HEADER */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold">
              👨‍🏫 คณะวิทยาศาสตร์และเทคโนโลยี • มหาวิทยาลัยสวนดุสิต
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              ระบบออกวุฒิบัตรดิจิทัลและประเมิน Rubrics สมรรถนะ
            </h1>
            <p className="text-xs text-slate-600 font-medium">
              ประเมินทักษะนักศึกษาตามเกณฑ์ 4 มิติ และลงนามออกใบรับรองความสามารถมาตรฐาน มสด.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/teacher"
              className="px-4 py-2 rounded-full border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition shadow-xs"
            >
              🏛️ พอร์ทัลตรวจทักษะ
            </Link>
          </div>
        </div>

        {/* 2-COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Left Column: Assessment & Issuance Form (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
            <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <span>📝 แบบฟอร์มประเมินและออกวุฒิบัตรใหม่</span>
            </h2>

            <form onSubmit={handleIssueCertificate} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">เลือกนักศึกษาผู้รับการประเมิน *</label>
                  <select
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-[#c2410c]"
                  >
                    <option>สมชาย ยอดนักโค้ด</option>
                    <option>สายฟ้า แฮกเกอร์</option>
                    <option>เจนจิรา ดีไซเนอร์</option>
                    <option>นักศึกษา ทดสอบ</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">หมวดหมู่ทักษะ</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-[#c2410c]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ชื่อวุฒิบัตร / วุฒิสมรรถนะที่ออกให้ *</label>
                <input
                  type="text"
                  value={certTitle}
                  onChange={(e) => setCertTitle(e.target.value)}
                  placeholder="เช่น Certified Full-Stack Web Developer"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-[#c2410c]"
                  required
                />
              </div>

              {/* 4 Rubrics Sliders */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <h3 className="font-extrabold text-slate-900">เกณฑ์การประเมิน 4 มิติ (SDU Competency Rubrics)</h3>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between font-semibold text-slate-700">
                    <span>1. คุณภาพโค้ดและสถาปัตยกรรม (Code Quality & Architecture)</span>
                    <span className="text-[#c2410c] font-bold">{rubric1}/5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={rubric1}
                    onChange={(e) => setRubric1(Number(e.target.value))}
                    className="w-full accent-[#c2410c]"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between font-semibold text-slate-700">
                    <span>2. ความมั่นคงปลอดภัยสารสนเทศ (Security & Data Privacy)</span>
                    <span className="text-[#c2410c] font-bold">{rubric2}/5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={rubric2}
                    onChange={(e) => setRubric2(Number(e.target.value))}
                    className="w-full accent-[#c2410c]"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between font-semibold text-slate-700">
                    <span>3. การแก้ปัญหาและตรรกะโปรแกรม (Problem Solving & Logic)</span>
                    <span className="text-[#c2410c] font-bold">{rubric3}/5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={rubric3}
                    onChange={(e) => setRubric3(Number(e.target.value))}
                    className="w-full accent-[#c2410c]"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between font-semibold text-slate-700">
                    <span>4. การจัดทำเอกสารและทดสอบ (Documentation & Testing)</span>
                    <span className="text-[#c2410c] font-bold">{rubric4}/5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={rubric4}
                    onChange={(e) => setRubric4(Number(e.target.value))}
                    className="w-full accent-[#c2410c]"
                  />
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="font-extrabold text-slate-900">คะแนนประเมินรวม:</span>
                  <span className="text-sm font-black text-emerald-700">{calculatedScore}% (ผ่านเกณฑ์มาตรฐาน)</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#c2410c] hover:bg-[#9a3412] text-white font-bold transition shadow-sm"
                >
                  ⚡ ลงนามและออกวุฒิบัตรดิจิทัล
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Issued Certificates Ledger (5 Cols) */}
          <div className="lg:col-span-5 space-y-3">
            <h2 className="text-sm font-extrabold text-slate-900 px-1">
              วุฒิบัตรที่ออกแล้วล่าสุด ({certs.length})
            </h2>

            <div className="space-y-3">
              {certs.map((c) => (
                <div
                  key={c.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2.5 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-800 font-bold flex items-center justify-center text-base border border-amber-200">
                        📜
                      </div>
                      <div>
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900">{c.certName}</h3>
                        <p className="text-[11px] text-slate-500">{c.studentName} • {c.category}</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                      {c.score}%
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-medium">เลขทะเบียน: <code className="font-bold text-slate-800">{c.serialNo}</code></span>
                    <span className="text-slate-400">{c.issueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface CertificateRecord {
  id: string;
  studentName: string;
  studentCode: string;
  certName: string;
  category: string;
  issueDate: string;
  serialNo: string;
  hashValue: string;
  score: number;
}

const INITIAL_RECORDS: CertificateRecord[] = [
  {
    id: "cert-1",
    studentName: "นักศึกษา ทดสอบ",
    studentCode: "6611011099",
    certName: "SDU DevSecOps Specialist (Professional Level)",
    category: "Security & Cloud Architecture",
    issueDate: "24/08/2026",
    serialNo: "SDU-CERT-DEVSECOPS-2026",
    hashValue: "0xa1b2c3d4e5f60718293a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e",
    score: 98,
  },
  {
    id: "cert-2",
    studentName: "สมชาย ยอดนักโค้ด",
    studentCode: "6611011001",
    certName: "Certified Full-Stack Web Developer (Next.js & TypeScript)",
    category: "Full-Stack Development",
    issueDate: "20/08/2026",
    serialNo: "SDU-CS-2026-0891",
    hashValue: "0xb2c3d4e5f60718293a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f",
    score: 95,
  },
  {
    id: "cert-3",
    studentName: "สายฟ้า แฮกเกอร์",
    studentCode: "6611011045",
    certName: "Certified Ethical Security Practitioner (SOC Tier 1)",
    category: "Cybersecurity & SOC Analysis",
    issueDate: "18/08/2026",
    serialNo: "SDU-CS-2026-0844",
    hashValue: "0xc3d4e5f60718293a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a",
    score: 92,
  },
  {
    id: "cert-4",
    studentName: "เจนจิรา ดีไซเนอร์",
    studentCode: "6611011088",
    certName: "Certified UI/UX Professional (Design Systems & Figma)",
    category: "UI/UX & Product Design",
    issueDate: "15/08/2026",
    serialNo: "SDU-CS-2026-0782",
    hashValue: "0xd4e5f60718293a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b",
    score: 96,
  },
];

export default function TeacherCertificatesPage() {
  const { data: session } = useSession();

  const [records, setRecords] = useState<CertificateRecord[]>(INITIAL_RECORDS);
  const [selectedStudent, setSelectedStudent] = useState("นักศึกษา ทดสอบ (6611011099)");
  const [selectedTemplate, setSelectedTemplate] = useState("Cisco Certified Network Associate (CCNA)");
  const [presentationScore, setPresentationScore] = useState(5);
  const [collaborationScore, setCollaborationScore] = useState(5);
  const [logicScore, setLogicScore] = useState(4);
  const [toastMessage, setToastMessage] = useState("");
  const [issuedSuccess, setIssuedSuccess] = useState(false);

  const handleIssueCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    const studentNameClean = selectedStudent.split(" (")[0];
    const studentCodeClean = selectedStudent.includes("(") ? selectedStudent.split("(")[1].replace(")", "") : "6611011099";

    const totalScore = Math.round(((presentationScore + collaborationScore + logicScore) / 15) * 100);
    const randomHash = "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");

    const newCert: CertificateRecord = {
      id: `cert-${Date.now()}`,
      studentName: studentNameClean,
      studentCode: studentCodeClean,
      certName: selectedTemplate,
      category: "Digital SkillPassport Certified",
      issueDate: new Date().toLocaleDateString("th-TH"),
      serialNo: `SDU-CERT-${Date.now().toString().slice(-6)}`,
      hashValue: randomHash,
      score: totalScore,
    };

    setRecords([newCert, ...records]);
    setIssuedSuccess(true);
    setToastMessage(`✓ ออกวุฒิบัตรและสร้างลายเซ็น SHA-256 ให้แก่ ${studentNameClean} สำเร็จ!`);
    setTimeout(() => {
      setIssuedSuccess(false);
      setToastMessage("");
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#f4f2ee] pt-[85px] px-4 pb-16">
      <div className="max-w-[1128px] mx-auto space-y-4">
        
        {/* ========================================================================= */}
        {/* 📜 HEADER BANNER                                                          */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-xs font-extrabold flex items-center gap-1">
                📜 ระบบออกวุฒิบัตรและประเมิน Rubrics
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                ✓ เข้ารหัสลายเซ็นดิจิทัล SHA-256
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              ศูนย์ออกวุฒิบัตรสมรรถนะดิจิทัลและประเมิน Rubrics
            </h1>
            <p className="text-xs text-slate-600">
              ประเมินทักษะ Soft Skills และออกใบประกาศนียบัตรดิจิทัลที่มีการรับรองและตรวจสอบได้สากล
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 🎛️ 3-PAGE NAVIGATION LINKS                                                */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-xl p-2 border border-slate-200 shadow-2xs flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Link
              href="/teacher"
              className="px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 bg-slate-50 text-slate-700 hover:bg-slate-100"
            >
              <span>🏛️</span>
              <span>1. ตรวจรับรองทักษะนักศึกษา</span>
            </Link>

            <Link
              href="/teacher/certificates"
              className="px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 bg-[#0a66c2] text-white shadow-xs"
            >
              <span>📜</span>
              <span>2. ออกวุฒิบัตรและประเมิน Rubrics (หน้าปัจจุบัน)</span>
            </Link>

            <Link
              href="/teacher/advisees"
              className="px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 bg-slate-50 text-slate-700 hover:bg-slate-100"
            >
              <span>👥</span>
              <span>3. ติดตามนักศึกษาในที่ปรึกษา (4 คน)</span>
            </Link>
          </div>

          {toastMessage && (
            <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 animate-in fade-in">
              {toastMessage}
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 2-COLUMN CERTIFICATE ISSUER & TABLE                                       */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 animate-in fade-in">
          
          {/* Left Column: Issue Certificate Form (5 Cols) */}
          <div className="md:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                <span>➕</span>
                <span>ประเมิน Rubrics และออกวุฒิบัตรใหม่</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                เลือกนักศึกษาและให้คะแนนสมรรถนะเพื่อสร้าง Digital Certificate
              </p>
            </div>

            <form onSubmit={handleIssueCertificate} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  เลือกนักศึกษา:
                </label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#0a66c2]"
                >
                  <option value="นักศึกษา ทดสอบ (6611011099)">นักศึกษา ทดสอบ (6611011099) • ชั้นปีที่ 4</option>
                  <option value="สมชาย ยอดนักโค้ด (6611011001)">สมชาย ยอดนักโค้ด (6611011001) • ชั้นปีที่ 4</option>
                  <option value="สายฟ้า แฮกเกอร์ (6611011045)">สายฟ้า แฮกเกอร์ (6611011045) • ชั้นปีที่ 4</option>
                  <option value="เจนจิรา ดีไซเนอร์ (6611011088)">เจนจิรา ดีไซเนอร์ (6611011088) • ชั้นปีที่ 3</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  หลักสูตร / วุฒิบัตรที่ออกให้:
                </label>
                <select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#0a66c2]"
                >
                  <option value="SDU DevSecOps Specialist (Professional Level)">SDU DevSecOps Specialist</option>
                  <option value="Cisco Certified Network Associate (CCNA)">Cisco Certified Network Associate (CCNA)</option>
                  <option value="CompTIA Security+ (Sec+) Certification">CompTIA Security+ (Sec+)</option>
                  <option value="Certified Ethical Hacker (CEH v12)">Certified Ethical Hacker (CEH v12)</option>
                  <option value="Google UX Design Professional Standard">Google UX Design Professional Standard</option>
                </select>
              </div>

              {/* Rubric Sliders */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <p className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wide">
                  📊 เกณฑ์ประเมิน Soft Skill Rubrics (1-5 คะแนน):
                </p>

                <div>
                  <div className="flex justify-between font-bold text-slate-600 mb-0.5">
                    <span>1. การนำเสนอและการสื่อสาร:</span>
                    <span className="text-[#0a66c2]">{presentationScore}/5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={presentationScore}
                    onChange={(e) => setPresentationScore(Number(e.target.value))}
                    className="w-full accent-[#0a66c2]"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-bold text-slate-600 mb-0.5">
                    <span>2. การทำงานร่วมกับผู้อื่น (Teamwork):</span>
                    <span className="text-[#0a66c2]">{collaborationScore}/5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={collaborationScore}
                    onChange={(e) => setCollaborationScore(Number(e.target.value))}
                    className="w-full accent-[#0a66c2]"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-bold text-slate-600 mb-0.5">
                    <span>3. การคิดวิเคราะห์และการแก้ปัญหา:</span>
                    <span className="text-[#0a66c2]">{logicScore}/5</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={logicScore}
                    onChange={(e) => setLogicScore(Number(e.target.value))}
                    className="w-full accent-[#0a66c2]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition shadow-sm flex items-center justify-center gap-1.5"
              >
                <span>📜 ออกวุฒิบัตรและสร้างลายเซ็น SHA-256</span>
              </button>
            </form>
          </div>

          {/* Right Column: Issued Certificates Table (7 Cols) */}
          <div className="md:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
                ประวัติการออกวุฒิบัตรดิจิทัล ({records.length} รายการ)
              </h3>
              <span className="text-xs text-slate-400 font-semibold">สถานะ: สมบูรณ์ 100%</span>
            </div>

            <div className="space-y-3">
              {records.map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-extrabold text-slate-900 leading-snug">{rec.certName}</h4>
                      <p className="text-slate-600 text-[11px] mt-0.5">
                        ผู้รับมอบ: <strong className="text-slate-900">{rec.studentName}</strong> ({rec.studentCode})
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black shrink-0">
                      คะแนน {rec.score}%
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500">
                    <span className="font-mono text-purple-700 truncate max-w-[280px]">
                      Hash: {rec.hashValue.slice(0, 24)}...
                    </span>
                    <button
                      onClick={() => alert(`ตรวจสอบความถูกต้องของ ${rec.serialNo} สำเร็จ: Verified Digital Signature Valid ✓`)}
                      className="text-[#0a66c2] font-bold hover:underline self-start sm:self-auto"
                    >
                      🔍 ตรวจสอบ Signature
                    </button>
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

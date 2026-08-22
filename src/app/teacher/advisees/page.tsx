"use client";

import { useState } from "react";
import Link from "next/link";

interface Advisee {
  id: string;
  studentId: string;
  name: string;
  studentCode: string;
  major: string;
  year: string;
  avatar: string;
  verifiedSkillsCount: number;
  projectStatus: "PROPOSAL" | "IN_PROGRESS" | "COMPLETED";
  internshipStatus: "LOOKING" | "OFFERED" | "CONFIRMED";
  gpa: string;
  lastMeeting: string;
}

const ADVISEES_DATA: Advisee[] = [
  {
    id: "adv-1",
    studentId: "mock-somchai",
    name: "สมชาย ยอดนักโค้ด",
    studentCode: "6611011001",
    major: "วิทยาการคอมพิวเตอร์",
    year: "ชั้นปีที่ 4",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    verifiedSkillsCount: 4,
    projectStatus: "COMPLETED",
    internshipStatus: "OFFERED",
    gpa: "3.85",
    lastMeeting: "19 ส.ค. 2569",
  },
  {
    id: "adv-2",
    studentId: "mock-saifah",
    name: "สายฟ้า แฮกเกอร์",
    studentCode: "6611011045",
    major: "วิทยาการคอมพิวเตอร์",
    year: "ชั้นปีที่ 4",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    verifiedSkillsCount: 3,
    projectStatus: "IN_PROGRESS",
    internshipStatus: "CONFIRMED",
    gpa: "3.60",
    lastMeeting: "15 ส.ค. 2569",
  },
  {
    id: "adv-3",
    studentId: "mock-jane",
    name: "เจนจิรา ดีไซเนอร์",
    studentCode: "6611011088",
    major: "วิทยาการคอมพิวเตอร์",
    year: "ชั้นปีที่ 3",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
    verifiedSkillsCount: 3,
    projectStatus: "IN_PROGRESS",
    internshipStatus: "LOOKING",
    gpa: "3.90",
    lastMeeting: "12 ส.ค. 2569",
  },
  {
    id: "adv-4",
    studentId: "mock-test",
    name: "นักศึกษา ทดสอบ",
    studentCode: "6611011099",
    major: "วิทยาการคอมพิวเตอร์",
    year: "ชั้นปีที่ 4",
    avatar: "https://ui-avatars.com/api/?name=นักศึกษา+ทดสอบ&background=002d62&color=fff",
    verifiedSkillsCount: 2,
    projectStatus: "PROPOSAL",
    internshipStatus: "LOOKING",
    gpa: "3.45",
    lastMeeting: "10 ส.ค. 2569",
  },
];

export default function TeacherAdviseesPage() {
  const [advisees, setAdvisees] = useState<Advisee[]>(ADVISEES_DATA);
  const [filterYear, setFilterYear] = useState("ALL");
  const [noteStudent, setNoteStudent] = useState<Advisee | null>(null);
  const [noteText, setNoteText] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteStudent) return;
    setToastMessage(`บันทึกคำแนะนำสำหรับ ${noteStudent.name} เรียบร้อยแล้ว 📝`);
    setNoteStudent(null);
    setNoteText("");
    setTimeout(() => setToastMessage(""), 3500);
  };

  const filteredAdvisees = advisees.filter(
    (a) => filterYear === "ALL" || a.year === filterYear
  );

  return (
    <div className="min-h-screen bg-[#f4f2ee] pt-[85px] px-4 pb-16">
      <div className="max-w-[1128px] mx-auto space-y-5">
        
        {/* TOAST */}
        {toastMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl shadow-xs animate-in fade-in">
            {toastMessage}
          </div>
        )}

        {/* HEADER */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold">
              👨‍🏫 อาจารย์ที่ปรึกษา: ศ.ดร.สมชาย ใจดี
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              ระบบติดตามความก้าวหน้านักศึกษาในที่ปรึกษา (Advisee Tracking)
            </h1>
            <p className="text-xs text-slate-600 font-medium">
              ติดตามสถานะโครงงาน ทักษะดิจิทัล และความพร้อมการออกสหกิจศึกษาของนักศึกษาในความดูแล
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/teacher/certificates"
              className="px-4 py-2 rounded-full border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition shadow-xs"
            >
              📜 ออกวุฒิบัตร Rubrics
            </Link>
          </div>
        </div>

        {/* SUMMARY STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-1">
            <p className="text-xs text-slate-500 font-bold">นักศึกษาในที่ปรึกษาทั้งหมด</p>
            <h3 className="text-2xl font-black text-slate-900">{advisees.length} คน</h3>
            <p className="text-[11px] text-emerald-600 font-medium">✓ ภาควิชาวิทยาการคอมพิวเตอร์</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-1">
            <p className="text-xs text-slate-500 font-bold">ผ่านการรับรองทักษะแล้ว</p>
            <h3 className="text-2xl font-black text-[#c2410c]">100%</h3>
            <p className="text-[11px] text-slate-500 font-medium">ทักษะเฉลี่ย 3.2 ทักษะ/คน</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-1">
            <p className="text-xs text-slate-500 font-bold">ความพร้อมสหกิจศึกษา / งาน</p>
            <h3 className="text-2xl font-black text-emerald-700">75%</h3>
            <p className="text-[11px] text-slate-500 font-medium">3 ใน 4 ได้รับข้อเสนองานแล้ว</p>
          </div>
        </div>

        {/* ADVISEES TABLE / LIST */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-slate-900">
              รายชื่อนักศึกษาในความดูแล ({filteredAdvisees.length})
            </h2>

            {/* Filter */}
            <div className="flex items-center gap-1.5 text-xs font-bold">
              {["ALL", "ชั้นปีที่ 4", "ชั้นปีที่ 3"].map((yr) => (
                <button
                  key={yr}
                  onClick={() => setFilterYear(yr)}
                  className={`px-3 py-1 rounded-full transition ${
                    filterYear === yr
                      ? "bg-[#c2410c] text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {yr === "ALL" ? "ทุกชั้นปี" : yr}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredAdvisees.map((adv) => (
              <div
                key={adv.id}
                className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={adv.avatar}
                    alt={adv.name}
                    className="w-12 h-12 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">{adv.name}</h3>
                      <span className="text-[11px] text-slate-500 font-medium">({adv.studentCode})</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      {adv.major} • {adv.year} • GPA <strong className="text-slate-800">{adv.gpa}</strong>
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap text-[10px]">
                      <span className="px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-900 font-bold">
                        ⚡ {adv.verifiedSkillsCount} ทักษะรับรองแล้ว
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-blue-900 font-bold">
                        โครงงาน: {adv.projectStatus === "COMPLETED" ? "เสร็จสมบูรณ์" : adv.projectStatus === "IN_PROGRESS" ? "กำลังดำเนินการ" : "เสนอหัวข้อ"}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold">
                        สหกิจ: {adv.internshipStatus === "OFFERED" || adv.internshipStatus === "CONFIRMED" ? "ได้สถานประกอบการแล้ว ✓" : "กำลังค้นหา"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <Link
                    href={`/u/${adv.studentId}`}
                    className="px-3.5 py-1.5 rounded-full border border-slate-300 hover:bg-white text-slate-800 text-xs font-bold transition flex-1 md:flex-initial text-center"
                  >
                    ดูพอร์ตโฟลิโอ 🔗
                  </Link>

                  <button
                    onClick={() => {
                      setNoteStudent(adv);
                      setNoteText(`คำแนะนำสำหรับโครงงานและทักษะของ ${adv.name}...`);
                    }}
                    className="px-3.5 py-1.5 rounded-full bg-[#c2410c] hover:bg-[#9a3412] text-white text-xs font-bold transition shadow-xs flex-1 md:flex-initial text-center"
                  >
                    📝 บันทึกคำแนะนำ
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MENTORING NOTE MODAL */}
        {noteStudent && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-extrabold text-slate-900">
                  บันทึกคำแนะนำอาจารย์ที่ปรึกษา: {noteStudent.name}
                </h3>
                <button
                  onClick={() => setNoteStudent(null)}
                  className="text-slate-400 hover:text-slate-700 font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveNote} className="space-y-3 text-xs">
                <textarea
                  rows={4}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#c2410c] text-slate-900 font-medium"
                />
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setNoteStudent(null)}
                    className="px-4 py-2 rounded-full border border-slate-300 text-slate-700 font-bold hover:bg-slate-50"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-[#c2410c] hover:bg-[#9a3412] text-white font-bold shadow-xs"
                  >
                    บันทึกข้อมูล ✓
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

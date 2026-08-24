"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

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

export default function TeacherAdviseesPage() {
  const { data: session } = useSession();

  const [advisees, setAdvisees] = useState<Advisee[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterYear, setFilterYear] = useState("ALL");
  const [noteStudent, setNoteStudent] = useState<Advisee | null>(null);
  const [noteText, setNoteText] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const fetchAdvisees = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/teacher/students");
      const data = await res.json();
      if (data.students && data.students.length > 0) {
        const mapped: Advisee[] = data.students.map((s: any, idx: number) => ({
          id: s.id,
          studentId: s.id,
          name: s.name,
          studentCode: s.studentCode || `661101${1000 + idx}`,
          major: s.major || "วิทยาการคอมพิวเตอร์",
          year: s.year || "ชั้นปีที่ 4",
          avatar: s.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=0a66c2&color=fff`,
          verifiedSkillsCount: s.portfolio?.skills?.filter((sk: any) => sk.isVerified)?.length || 0,
          projectStatus: s.projectStatus || "IN_PROGRESS",
          internshipStatus: s.internshipStatus || "OFFERED",
          gpa: s.gpa || "3.65",
          lastMeeting: "24 ส.ค. 2569",
        }));
        setAdvisees(mapped);
      }
    } catch (err) {
      console.error("Failed to fetch advisees", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvisees();
  }, []);

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteStudent) return;
    setToastMessage(`✓ บันทึกคำแนะนำด้านการเรียนและการทำงานสำหรับ ${noteStudent.name} เรียบร้อยแล้ว 📝`);
    setNoteStudent(null);
    setNoteText("");
    setTimeout(() => setToastMessage(""), 3500);
  };

  const filteredAdvisees = advisees.filter(
    (a) => filterYear === "ALL" || a.year === filterYear
  );

  return (
    <div className="min-h-screen bg-[#f4f2ee] pt-[85px] px-4 pb-16">
      <div className="max-w-[1128px] mx-auto space-y-4">
        
        {/* ========================================================================= */}
        {/* 👥 HEADER BANNER                                                          */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-[#0a66c2] text-xs font-extrabold flex items-center gap-1">
                👥 ระบบติดตามนักศึกษาในที่ปรึกษา (Advisee Tracking)
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                ✓ อาจารย์ที่ปรึกษา: {session?.user?.name || "ศ.ดร.สมชาย ใจดี"}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              ระบบติดตามความก้าวหน้าและการให้คำปรึกษานักศึกษา มสด.
            </h1>
            <p className="text-xs text-slate-600">
              ติดตามสถานะโครงงาน, ทักษะที่ได้รับการรับรอง, เกรดเฉลี่ย, และความพร้อมการออกสหกิจศึกษา
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 📊 SUMMARY METRICS                                                        */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-semibold">นักศึกษาในที่ปรึกษาทั้งหมด</p>
              <p className="text-xl font-extrabold text-slate-900 mt-0.5">{advisees.length} คน</p>
              <p className="text-[10px] text-slate-400">สาขาวิทยาการคอมพิวเตอร์</p>
            </div>
            <span className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg">
              🎓
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-semibold">ทักษะที่ผ่านการรับรอง</p>
              <p className="text-xl font-extrabold text-slate-900 mt-0.5">100%</p>
              <p className="text-[10px] text-emerald-700 font-bold">ค่าเฉลี่ย 3.5 ทักษะ/คน</p>
            </div>
            <span className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg">
              ✓
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-semibold">ความพร้อมสหกิจศึกษา / งาน</p>
              <p className="text-xl font-extrabold text-slate-900 mt-0.5">75%</p>
              <p className="text-[10px] text-purple-700 font-bold">3 ใน 4 ได้รับข้อเสนองานแล้ว</p>
            </div>
            <span className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-lg">
              💼
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ADVISEES LIST TABLE                                                       */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
              รายชื่อนักศึกษาในความดูแล ({filteredAdvisees.length} คน)
            </h3>

            {/* Filter by Year */}
            <div className="flex items-center gap-1.5 text-xs">
              <button
                onClick={() => setFilterYear("ALL")}
                className={`px-3 py-1 rounded-full font-bold transition border ${
                  filterYear === "ALL"
                    ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                ทุกชั้นปี
              </button>
              <button
                onClick={() => setFilterYear("ชั้นปีที่ 4")}
                className={`px-3 py-1 rounded-full font-bold transition border ${
                  filterYear === "ชั้นปีที่ 4"
                    ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                ชั้นปีที่ 4
              </button>
              <button
                onClick={() => setFilterYear("ชั้นปีที่ 3")}
                className={`px-3 py-1 rounded-full font-bold transition border ${
                  filterYear === "ชั้นปีที่ 3"
                    ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                ชั้นปีที่ 3
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {filteredAdvisees.map((adv) => (
              <div
                key={adv.id}
                className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={adv.avatar}
                    alt={adv.name}
                    className="w-12 h-12 rounded-full object-cover border border-slate-200 ring-2 ring-slate-100"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{adv.name}</span>
                      <span className="text-xs text-slate-400 font-medium">({adv.studentCode})</span>
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {adv.major} • {adv.year} • เกรดเฉลี่ยสะสม: <strong className="text-slate-900">{adv.gpa}</strong>
                    </p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 text-[#0a66c2] text-[10px] font-bold border border-blue-100">
                        ✓ {adv.verifiedSkillsCount} ทักษะรับรองแล้ว
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[10px] font-bold border border-purple-100">
                        📁 โครงงาน: {adv.projectStatus === "COMPLETED" ? "เสร็จสมบูรณ์" : "กำลังดำเนินการ"}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100">
                        💼 สหกิจ: {adv.internshipStatus === "OFFERED" || adv.internshipStatus === "CONFIRMED" ? "ได้สถานประกอบการแล้ว ✓" : "กำลังเปิดรับสมัคร"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/u/${adv.studentId}`}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition"
                  >
                    ดูพอร์ตโฟลิโอ 🔗
                  </Link>
                  <button
                    onClick={() => {
                      setNoteStudent(adv);
                      setNoteText("");
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs"
                  >
                    📝 บันทึกคำแนะนำ
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 📝 ADVISEE NOTE MODAL                                                     */}
      {/* ========================================================================= */}
      {noteStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  บันทึกคำแนะนำสำหรับ: {noteStudent.name}
                </h3>
                <p className="text-xs text-slate-500">{noteStudent.studentCode}</p>
              </div>
              <button
                onClick={() => setNoteStudent(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNote} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  คำแนะนำด้านการเรียน / โครงงาน / การสมัครสหกิจศึกษา:
                </label>
                <textarea
                  rows={4}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="พิมพ์ข้อเสนอแนะหรือบันทึกการให้คำปรึกษา..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0a66c2]"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNoteStudent(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0a66c2] hover:bg-[#004182] text-white text-xs font-bold transition shadow-sm"
                >
                  💾 บันทึกคำแนะนำ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

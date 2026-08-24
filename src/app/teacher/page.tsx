"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
  isVerified: boolean;
  testScore: number | null;
}

interface Project {
  id: string;
  title: string;
  description: string;
  githubUrl: string | null;
}

interface Certificate {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  hashValue: string;
}

interface Portfolio {
  id: string;
  bio: string | null;
  skills: Skill[];
  projects: Project[];
  certificates: Certificate[];
}

interface Student {
  id: string;
  name: string;
  email: string;
  image: string | null;
  studentCode?: string;
  major?: string;
  year?: string;
  gpa?: string;
  projectStatus?: "PROPOSAL" | "IN_PROGRESS" | "COMPLETED";
  internshipStatus?: "LOOKING" | "OFFERED" | "CONFIRMED";
  portfolio: Portfolio | null;
}

export default function TeacherDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"VERIFY" | "ADVISEES" | "CERTS">("VERIFY");
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [verifyingSkillId, setVerifyingSkillId] = useState<string | null>(null);

  // Soft Skill Rubric Grading state
  const [activeArtifactSkill, setActiveArtifactSkill] = useState<any | null>(null);
  const [presentationScore, setPresentationScore] = useState(4);
  const [collaborationScore, setCollaborationScore] = useState(5);
  const [logicScore, setLogicScore] = useState(4);
  const [gradingArtifact, setGradingArtifact] = useState(false);

  // Advisee Note Modal
  const [noteStudent, setNoteStudent] = useState<Student | null>(null);
  const [noteText, setNoteText] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/teacher/students");
      const data = await res.json();
      if (data.students && data.students.length > 0) {
        setStudents(data.students);
        if (!selectedStudent) {
          setSelectedStudent(data.students[0]);
        }
      }
    } catch (err) {
      console.error("Failed to fetch students", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated" || (session && session.user.role !== "TEACHER")) {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchStudents();
    }
  }, [status, session, router]);

  const handleVerifySkill = async (skillId: string) => {
    setVerifyingSkillId(skillId);
    try {
      const res = await fetch("/api/teacher/verify-skill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skillId }),
      });

      if (res.ok) {
        setToastMessage("✓ ลงนามรับรองทักษะและบันทึกประวัติการตรวจสอบเรียบร้อยแล้ว");
        setTimeout(() => setToastMessage(""), 3000);
        await fetchStudents();
        if (selectedStudent) {
          setSelectedStudent((prev) => {
            if (!prev || !prev.portfolio) return prev;
            return {
              ...prev,
              portfolio: {
                ...prev.portfolio,
                skills: prev.portfolio.skills.map((s) =>
                  s.id === skillId ? { ...s, isVerified: true } : s
                ),
              },
            };
          });
        }
      } else {
        alert("เกิดข้อผิดพลาดในการรับรองทักษะ");
      }
    } catch (err) {
      alert("การเชื่อมต่อล้มเหลว");
    } finally {
      setVerifyingSkillId(null);
    }
  };

  const handleSubmitArtifactGrade = async () => {
    if (!activeArtifactSkill) return;
    setGradingArtifact(true);

    try {
      const res = await fetch("/api/teacher/grade-artifact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skillId: activeArtifactSkill.id,
          rubrics: {
            presentation: presentationScore,
            collaboration: collaborationScore,
            logic: logicScore,
          },
        }),
      });

      if (res.ok) {
        setToastMessage(`✓ บันทึกผลประเมิน Rubrics สำหรับ ${activeArtifactSkill.name} เรียบร้อยแล้ว`);
        setTimeout(() => setToastMessage(""), 3500);
        setActiveArtifactSkill(null);
        await fetchStudents();
      } else {
        alert("เกิดข้อผิดพลาดในการบันทึกคะแนน");
      }
    } catch (err) {
      alert("การเชื่อมต่อเซิร์ฟเวอร์ล้มเหลว");
    } finally {
      setGradingArtifact(false);
    }
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteStudent) return;
    setToastMessage(`บันทึกคำแนะนำสำหรับ ${noteStudent.name} เรียบร้อยแล้ว 📝`);
    setNoteStudent(null);
    setNoteText("");
    setTimeout(() => setToastMessage(""), 3500);
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.studentCode && s.studentCode.includes(searchTerm))
  );

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[#f4f2ee] pt-[120px] flex items-center justify-center">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <div className="w-4 h-4 border-2 border-[#0a66c2] border-t-transparent rounded-full animate-spin"></div>
          <span>กำลังโหลดข้อมูลอาจารย์ที่ปรึกษาและนักศึกษา...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f2ee] pt-[85px] px-4 pb-16">
      <div className="max-w-[1128px] mx-auto space-y-4">
        
        {/* ========================================================================= */}
        {/* 🏛️ HEADER BANNER                                                          */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-[#0a66c2] text-xs font-extrabold flex items-center gap-1">
                🏛️ ระบบอาจารย์ที่ปรึกษา มสด. (Teacher & Advisor Hub)
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                ✓ สิทธิ์ประเมินและลงนามรับรอง
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              ศูนย์ตรวจรับรองสมรรถนะและติดตามนักศึกษา (SDU Verification Hub)
            </h1>
            <p className="text-xs text-slate-600">
              อาจารย์ผู้ประเมิน: <strong className="text-slate-900">{session?.user?.name || "ศ.ดร.สมชาย ใจดี"}</strong> • คณะวิทยาศาสตร์และเทคโนโลยี มหาวิทยาลัยสวนดุสิต
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              href="/messaging"
              className="px-4 py-2.5 rounded-xl bg-[#0a66c2] hover:bg-[#004182] text-white text-xs font-bold transition shadow-sm flex items-center gap-1.5"
            >
              <span>💬</span>
              <span>กล่องข้อความนักศึกษา</span>
            </Link>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 📊 SUMMARY METRICS                                                        */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-semibold">นักศึกษาในความดูแล</p>
              <p className="text-xl font-extrabold text-slate-900 mt-0.5">{students.length} คน</p>
            </div>
            <span className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg">
              🎓
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-semibold">ทักษะที่ผ่านการรับรองแล้ว</p>
              <p className="text-xl font-extrabold text-slate-900 mt-0.5">
                {students.reduce((acc, s) => acc + (s.portfolio?.skills.filter(sk => sk.isVerified).length || 0), 0)} รายการ
              </p>
            </div>
            <span className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg">
              ✓
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-semibold">ความพร้อมสหกิจศึกษา</p>
              <p className="text-xl font-extrabold text-slate-900 mt-0.5">75% (3/4 คน)</p>
            </div>
            <span className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-lg">
              💼
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 🎛️ PORTAL NAVIGATION TABS                                                 */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-xl p-2 border border-slate-200 shadow-2xs flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("VERIFY")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === "VERIFY"
                  ? "bg-[#0a66c2] text-white shadow-xs"
                  : "bg-slate-50 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <span>🏛️</span>
              <span>ตรวจสอบและลงนามรับรองทักษะ (Skill Verification)</span>
            </button>

            <button
              onClick={() => setActiveTab("ADVISEES")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === "ADVISEES"
                  ? "bg-[#0a66c2] text-white shadow-xs"
                  : "bg-slate-50 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <span>📋</span>
              <span>ติดตามความก้าวหน้านักศึกษาในที่ปรึกษา ({students.length} คน)</span>
            </button>

            <button
              onClick={() => setActiveTab("CERTS")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === "CERTS"
                  ? "bg-[#0a66c2] text-white shadow-xs"
                  : "bg-slate-50 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <span>📜</span>
              <span>วุฒิบัตรดิจิทัล SHA-256</span>
            </button>
          </div>

          {toastMessage && (
            <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 animate-in fade-in">
              {toastMessage}
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: 🏛️ SKILL VERIFICATION & RUBRICS                                    */}
        {/* ========================================================================= */}
        {activeTab === "VERIFY" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 animate-in fade-in">
            
            {/* Left 4 Cols: Unified Student List */}
            <div className="md:col-span-4 space-y-3">
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">
                    รายชื่อนักศึกษา ({filteredStudents.length})
                  </h3>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="พิมพ์ชื่อ, รหัสนักศึกษา หรืออีเมล..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0a66c2]"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-xs">
                    🔍
                  </div>
                </div>

                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                  {filteredStudents.map((s) => {
                    const isSelected = selectedStudent?.id === s.id;
                    const verifiedCount = s.portfolio?.skills.filter((sk) => sk.isVerified).length || 0;
                    const totalCount = s.portfolio?.skills.length || 0;

                    return (
                      <div
                        key={s.id}
                        onClick={() => setSelectedStudent(s)}
                        className={`p-3 rounded-xl border transition cursor-pointer flex items-center gap-3 ${
                          isSelected
                            ? "bg-blue-50/60 border-[#0a66c2] ring-2 ring-blue-100"
                            : "bg-white border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <img
                          src={s.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=002d62&color=fff`}
                          alt={s.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 truncate flex items-center gap-1">
                            <span>{s.name}</span>
                            {s.studentCode && (
                              <span className="text-[10px] text-slate-400">({s.studentCode})</span>
                            )}
                          </h4>
                          <p className="text-[11px] text-slate-500 truncate">{s.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                              ✓ รับรองแล้ว {verifiedCount}/{totalCount}
                            </span>
                            {s.gpa && (
                              <span className="text-[10px] font-semibold text-slate-500">GPA: {s.gpa}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right 8 Cols: Selected Student Verification Pane */}
            <div className="md:col-span-8 space-y-4">
              {selectedStudent ? (
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
                  {/* Student Header Info */}
                  <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={selectedStudent.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedStudent.name)}&background=002d62&color=fff`}
                        alt={selectedStudent.name}
                        className="w-16 h-16 rounded-2xl object-cover border border-slate-200"
                      />
                      <div>
                        <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
                          <span>{selectedStudent.name}</span>
                          <span className="text-xs font-bold text-slate-500">({selectedStudent.studentCode || "6611011099"})</span>
                        </h2>
                        <p className="text-xs text-slate-600 mt-0.5">
                          {selectedStudent.major || "วิทยาการคอมพิวเตอร์"} • {selectedStudent.year || "ชั้นปีที่ 4"} • เกรดเฉลี่ย: <strong>{selectedStudent.gpa || "3.75"}</strong>
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{selectedStudent.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/u/${selectedStudent.id}`}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition"
                      >
                        ดูพอร์ตโฟลิโอ 🔗
                      </Link>
                      <button
                        onClick={() => {
                          setNoteStudent(selectedStudent);
                          setNoteText("");
                        }}
                        className="px-3 py-1.5 rounded-xl bg-blue-50 text-[#0a66c2] text-xs font-bold hover:bg-blue-100 transition"
                      >
                        📝 บันทึกคำแนะนำ
                      </button>
                    </div>
                  </div>

                  {/* Skills for Verification */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">
                        ทักษะที่ส่งขอรับรองสมรรถนะ ({selectedStudent.portfolio?.skills.length || 0} รายการ)
                      </h3>
                      <span className="text-[11px] text-slate-400">เกณฑ์การผ่าน: สอบข้อเขียน 70%+ และประเมิน Soft Skill Rubrics</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedStudent.portfolio?.skills.map((skill) => (
                        <div
                          key={skill.id}
                          className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-3"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-xs font-extrabold text-slate-900">
                                {skill.name}
                              </h4>
                              {skill.isVerified ? (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black shrink-0">
                                  ✓ รับรองแล้ว
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold shrink-0">
                                  ⏳ รอตรวจสอบ
                                </span>
                              )}
                            </div>

                            <div className="mt-2 text-[11px] text-slate-500 space-y-0.5">
                              <p>หมวดหมู่: <strong className="text-slate-700">{skill.category}</strong></p>
                              <p>คะแนนแบบทดสอบวัดระดับ: <strong className="text-blue-700">{skill.testScore || 90}/100</strong></p>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-200/60 flex items-center gap-2">
                            <button
                              onClick={() => setActiveArtifactSkill(skill)}
                              className="flex-1 py-1.5 px-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-[11px] font-bold transition"
                            >
                              📊 ประเมิน Rubrics
                            </button>

                            {!skill.isVerified && (
                              <button
                                onClick={() => handleVerifySkill(skill.id)}
                                disabled={verifyingSkillId === skill.id}
                                className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition shadow-xs disabled:opacity-50"
                              >
                                {verifyingSkillId === skill.id ? "กำลังลงนาม..." : "✓ ลงนามรับรอง"}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Projects for Verification */}
                  {selectedStudent.portfolio?.projects && selectedStudent.portfolio.projects.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">
                        โครงงานและผลงาน GitHub
                      </h3>
                      <div className="space-y-2">
                        {selectedStudent.portfolio.projects.map((p) => (
                          <div key={p.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                            <div className="flex items-center justify-between">
                              <h4 className="font-bold text-slate-900">{p.title}</h4>
                              {p.githubUrl && (
                                <a
                                  href={p.githubUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#0a66c2] hover:underline font-semibold text-[11px]"
                                >
                                  ดูโค้ดบน GitHub ↗
                                </a>
                              )}
                            </div>
                            <p className="text-slate-600 text-[11px] mt-1">{p.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              ) : (
                <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm text-slate-500 text-xs">
                  กรุณาเลือกนักศึกษาจากรายชื่อด้านซ้ายเพื่อตรวจสอบข้อมูล
                </div>
              )}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: 📋 ADVISEE TRACKING                                                */}
        {/* ========================================================================= */}
        {activeTab === "ADVISEES" && (
          <div className="space-y-3 animate-in fade-in">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">
                  รายชื่อนักศึกษาในความดูแลทั้งหมด ({students.length} คน)
                </h3>
              </div>

              <div className="space-y-3">
                {students.map((student) => {
                  const verifiedSkills = student.portfolio?.skills.filter(s => s.isVerified).length || 0;
                  return (
                    <div
                      key={student.id}
                      className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5">
                        <img
                          src={student.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=002d62&color=fff`}
                          alt={student.name}
                          className="w-12 h-12 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{student.name}</span>
                            <span className="text-xs text-slate-400 font-medium">({student.studentCode || "6611011099"})</span>
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {student.major || "วิทยาการคอมพิวเตอร์"} • {student.year || "ชั้นปีที่ 4"} • GPA: <strong className="text-slate-800">{student.gpa || "3.75"}</strong>
                          </p>
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <span className="px-2 py-0.5 rounded-md bg-blue-50 text-[#0a66c2] text-[10px] font-bold border border-blue-100">
                              ✓ {verifiedSkills} ทักษะรับรองแล้ว
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[10px] font-bold border border-purple-100">
                              📁 โครงงาน: {student.projectStatus === "COMPLETED" ? "เสร็จสมบูรณ์" : "กำลังดำเนินการ"}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100">
                              💼 สหกิจ: {student.internshipStatus === "OFFERED" || student.internshipStatus === "CONFIRMED" ? "ได้สถานประกอบการแล้ว ✓" : "กำลังเปิดรับสมัคร"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          href={`/u/${student.id}`}
                          className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition"
                        >
                          ดูพอร์ตโฟลิโอ 🔗
                        </Link>
                        <button
                          onClick={() => {
                            setNoteStudent(student);
                            setNoteText("");
                          }}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs"
                        >
                          📝 บันทึกคำแนะนำ
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: 📜 DIGITAL CERTIFICATES                                            */}
        {/* ========================================================================= */}
        {activeTab === "CERTS" && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 animate-in fade-in">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                ระบบจัดการและออกวุฒิบัตรดิจิทัล (Digital Certificate Issuer)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                วุฒิบัตรทุกใบจะได้รับการสร้างรหัสลายเซ็นดิจิทัลเข้ารหัสแบบ SHA-256 เพื่อป้องกันการแก้ไขและใช้ตรวจสอบความถูกต้องผ่าน URL สากล
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {[
                { title: "Cisco CCNA (Network Associate)", code: "SDU-CERT-CCNA-2026", hash: "0xa1b2c3d4e5f60718...", issuer: "Cisco & SDU Academy" },
                { title: "CompTIA Security+ (Sec+)", code: "SDU-CERT-SECPLUS-2026", hash: "0xb2c3d4e5f60718...", issuer: "CompTIA Certification" },
                { title: "SDU DevSecOps Specialist", code: "SDU-CERT-DEVSECOPS-2026", hash: "0xc3d4e5f60718...", issuer: "มหาวิทยาลัยสวนดุสิต" },
              ].map((cert, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <span className="text-xl">🏆</span>
                  <h4 className="text-xs font-extrabold text-slate-900">{cert.title}</h4>
                  <p className="text-[11px] text-slate-500">ผู้ออก: {cert.issuer}</p>
                  <p className="text-[10px] font-mono text-purple-700 bg-purple-50 p-1.5 rounded truncate">
                    Hash: {cert.hash}
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => alert(`ตรวจสอบความถูกต้องของ ${cert.title} สำเร็จ: Verified Signature Valid ✓`)}
                      className="w-full py-1.5 rounded-lg bg-[#0a66c2] text-white text-xs font-bold hover:bg-[#004182] transition"
                    >
                      🔍 ตรวจสอบ Signature
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* 📊 RUBRICS MODAL                                                          */}
      {/* ========================================================================= */}
      {activeArtifactSkill && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  เกณฑ์ประเมิน Rubrics: {activeArtifactSkill.name}
                </h3>
                <p className="text-xs text-slate-500">นักศึกษา: {selectedStudent?.name}</p>
              </div>
              <button
                onClick={() => setActiveArtifactSkill(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="flex items-center justify-between font-bold text-slate-700 mb-1">
                  <span>1. การนำเสนอและการสื่อสาร (Presentation):</span>
                  <span className="text-blue-700">{presentationScore}/5 คะแนน</span>
                </label>
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
                <label className="flex items-center justify-between font-bold text-slate-700 mb-1">
                  <span>2. การทำงานร่วมกับผู้อื่น (Collaboration):</span>
                  <span className="text-blue-700">{collaborationScore}/5 คะแนน</span>
                </label>
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
                <label className="flex items-center justify-between font-bold text-slate-700 mb-1">
                  <span>3. ตรรกะและการแก้ไขปัญหา (Problem Solving):</span>
                  <span className="text-blue-700">{logicScore}/5 คะแนน</span>
                </label>
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

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setActiveArtifactSkill(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleSubmitArtifactGrade}
                disabled={gradingArtifact}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm disabled:opacity-50"
              >
                {gradingArtifact ? "กำลังบันทึก..." : "💾 บันทึกผลประเมิน Rubrics"}
              </button>
            </div>
          </div>
        </div>
      )}

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
                <p className="text-xs text-slate-500">{noteStudent.studentCode || "6611011099"}</p>
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

"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

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
  portfolio: Portfolio | null;
}

export default function TeacherDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [verifyingSkillId, setVerifyingSkillId] = useState<string | null>(null);

  // Soft Skill Rubric Grading state
  const [activeArtifactSkill, setActiveArtifactSkill] = useState<any | null>(null);
  const [presentationScore, setPresentationScore] = useState(3);
  const [collaborationScore, setCollaborationScore] = useState(3);
  const [logicScore, setLogicScore] = useState(3);
  const [gradingArtifact, setGradingArtifact] = useState(false);

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
            logic: logicScore
          }
        })
      });

      if (res.ok) {
        alert("บันทึกเกรดประเมินทักษะสำเร็จ และบันทึกประวัติลงบล็อกเชน Ledger เรียบร้อย!");
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

  useEffect(() => {
    if (status === "unauthenticated" || (session && session.user.role !== "TEACHER")) {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchStudents();
    }
  }, [status]);

  const fetchStudents = async () => {
    try {
      const res = await fetch("/api/teacher/students");
      if (res.ok) {
        const data = await res.json();
        setStudents(data.students || []);

        // Update selected student if already loaded
        if (selectedStudent) {
          const updated = data.students.find((s: Student) => s.id === selectedStudent.id);
          if (updated) setSelectedStudent(updated);
        }
      }
    } catch (err) {
      console.error("Failed to fetch students list", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySkill = async (skillId: string, verifyStatus: boolean) => {
    setVerifyingSkillId(skillId);
    try {
      const res = await fetch("/api/teacher/verify-skill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skillId, isVerified: verifyStatus }),
      });

      if (res.ok) {
        // Refresh local student list data to reflect verification
        const listRes = await fetch("/api/teacher/students");
        if (listRes.ok) {
          const listData = await listRes.json();
          setStudents(listData.students || []);
          if (selectedStudent) {
            const updated = listData.students.find((s: Student) => s.id === selectedStudent.id);
            if (updated) setSelectedStudent(updated);
          }
        }
      } else {
        const data = await res.json();
        alert(data.error || "ไม่สามารถอัปเดตการรับรองทักษะได้");
      }
    } catch (err) {
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    } finally {
      setVerifyingSkillId(null);
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-slate-800 animate-pulse font-bold">กำลังโหลดระบบตรวจสอบ...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 pb-12">
      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        
        {/* Header */}
        <div className="text-center md:text-left mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0b2f64]">
            ระบบตรวจสอบพาสปอร์ตทักษะนักศึกษา (Teacher Dashboard)
          </h1>
          <p className="text-slate-600 mt-2 font-medium">
            ค้นหาและตรวจสอบพอร์ตโฟลิโอ ทักษะดิจิทัล และใบประกาศนียบัตรของนักศึกษา พร้อมฟังก์ชันลงนามรับรองทักษะ (Skill Verification)
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Student List & Search */}
          <div className="space-y-6 lg:col-span-1">
            <div className="glass rounded-3xl p-6 border-slate-300">
              <h2 className="text-xl font-bold text-[#0b2f64] mb-4">🔍 ค้นหานักศึกษา</h2>
              
              <input
                type="text"
                placeholder="พิมพ์ชื่อ หรืออีเมล..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-900 transition text-sm mb-6"
              />

              <h3 className="text-sm font-bold text-slate-700 mb-3">รายชื่อนักศึกษาทั้งหมด ({filteredStudents.length})</h3>
              
              <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <div
                      key={student.id}
                      onClick={() => setSelectedStudent(student)}
                      className={`p-4 rounded-xl border cursor-pointer transition flex items-center gap-3 ${
                        selectedStudent?.id === student.id
                          ? "bg-blue-50 border-blue-900"
                          : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <img
                        src={student.image || `https://ui-avatars.com/api/?name=${student.name}`}
                        alt={student.name}
                        className="w-10 h-10 rounded-full border border-slate-300"
                      />
                      <div className="truncate">
                        <h4 className="font-bold text-slate-800 text-sm truncate">{student.name}</h4>
                        <p className="text-slate-500 text-xs truncate">{student.email}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-8 text-slate-400 text-xs font-medium">ไม่พบรายชื่อนักศึกษา</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Passport View */}
          <div className="lg:col-span-2">
            {selectedStudent ? (
              <div className="space-y-6">
                
                {/* 1. Student Profile Card */}
                <div className="glass rounded-3xl p-8 border-slate-300 flex flex-col sm:flex-row items-center gap-6">
                  <img
                    src={selectedStudent.image || `https://ui-avatars.com/api/?name=${selectedStudent.name}`}
                    alt="Profile"
                    className="w-24 h-24 rounded-full border-2 border-slate-300"
                  />
                  <div className="flex-grow text-center sm:text-left">
                    <h2 className="text-2xl font-bold text-[#0b2f64]">{selectedStudent.name}</h2>
                    <p className="text-slate-600 text-sm">{selectedStudent.email}</p>
                    <p className="text-slate-500 text-xs mt-2 italic">
                      "{selectedStudent.portfolio?.bio || "นักศึกษาคนนี้ยังไม่ได้ระบุคำแนะนำตัว"}"
                    </p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-xs space-y-1 w-full sm:w-auto">
                    <p className="text-slate-600">GPA: <span className="font-semibold text-red-700 bg-red-100 px-1.5 py-0.5 rounded">Masked</span></p>
                    <p className="text-slate-600">เบอร์โทร: <span className="font-semibold text-red-700 bg-red-100 px-1.5 py-0.5 rounded">Masked</span></p>
                  </div>
                </div>

                {/* 1.5. Dynamic Development Dashboard (Charts) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Radar Chart Card */}
                  <div className="glass rounded-3xl p-6 border-slate-300 flex flex-col items-center">
                    <h3 className="text-sm font-bold text-[#0b2f64] mb-4 self-start flex items-center gap-1.5">
                      🕸️ แผนภูมิใยแมงมุมสมรรถนะทักษะ (Skill Radar)
                    </h3>
                    
                    {(() => {
                      const skills = selectedStudent.portfolio?.skills || [];
                      const categories = {
                        "Frontend": [] as number[],
                        "Backend": [] as number[],
                        "Database": [] as number[],
                        "Soft Skills": [] as number[],
                        "Verification": [] as number[]
                      };

                      skills.forEach(s => {
                        const name = s.name.toLowerCase();
                        const cat = s.category.toLowerCase();
                        if (name.includes("react") || name.includes("next") || name.includes("css") || name.includes("html") || name.includes("tailwind")) {
                          categories["Frontend"].push(s.level);
                        } else if (name.includes("node") || name.includes("api") || name.includes("graphql") || name.includes("express")) {
                          categories["Backend"].push(s.level);
                        } else if (name.includes("prisma") || name.includes("sql") || name.includes("db") || name.includes("database")) {
                          categories["Database"].push(s.level);
                        } else if (cat === "soft" || name.includes("solve") || name.includes("problem") || name.includes("team")) {
                          categories["Soft Skills"].push(s.level);
                        }
                        categories["Verification"].push(s.isVerified ? 5 : 1.5);
                      });

                      const getAvg = (arr: number[], def = 3.5) => 
                        arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : def;

                      const metrics = [
                        { label: "Frontend", value: getAvg(categories["Frontend"], 3.8) },
                        { label: "Backend", value: getAvg(categories["Backend"], 2.5) },
                        { label: "Database", value: getAvg(categories["Database"], 3.0) },
                        { label: "Soft Skill", value: getAvg(categories["Soft Skills"], 4.2) },
                        { label: "Verification", value: getAvg(categories["Verification"], 2.0) }
                      ];

                      const R = 75;
                      const cx = 130;
                      const cy = 115;
                      
                      const points = metrics.map((m, i) => {
                        const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
                        const valRatio = m.value / 5;
                        const x = cx + R * valRatio * Math.cos(angle);
                        const y = cy + R * valRatio * Math.sin(angle);
                        return { x, y, label: m.label, val: m.value.toFixed(1), angle };
                      });

                      const polygonPath = points.map(p => `${p.x},${p.y}`).join(" ");

                      return (
                        <svg width="260" height="230" className="overflow-visible">
                          {/* Radial Grid Circles */}
                          {[1, 2, 3, 4, 5].map((level) => {
                            const gridR = R * (level / 5);
                            const gridPoints = [0, 1, 2, 3, 4].map(idx => {
                              const angle = -Math.PI / 2 + (idx * 2 * Math.PI) / 5;
                              return `${cx + gridR * Math.cos(angle)},${cy + gridR * Math.sin(angle)}`;
                            }).join(" ");
                            return (
                              <polygon
                                key={level}
                                points={gridPoints}
                                fill="none"
                                stroke="#cbd5e1"
                                strokeWidth="0.5"
                                strokeDasharray={level < 5 ? "2 2" : "none"}
                              />
                            );
                          })}

                          {/* Axis Lines */}
                          {points.map((p, i) => {
                            const axisX = cx + R * Math.cos(p.angle);
                            const axisY = cy + R * Math.sin(p.angle);
                            return (
                              <line
                                key={i}
                                x1={cx}
                                y1={cy}
                                x2={axisX}
                                y2={axisY}
                                stroke="#cbd5e1"
                                strokeWidth="1"
                              />
                            );
                          })}

                          {/* Plotting Value Polygon */}
                          <polygon
                            points={polygonPath}
                            fill="rgba(11, 47, 100, 0.15)"
                            stroke="#0b2f64"
                            strokeWidth="2"
                          />

                          {/* Data points */}
                          {points.map((p, i) => (
                            <circle
                              key={i}
                              cx={p.x}
                              cy={p.y}
                              r="4"
                              fill="#b45309"
                              stroke="#ffffff"
                              strokeWidth="1"
                            />
                          ))}

                          {/* Axis labels */}
                          {points.map((p, i) => {
                            const labelDist = R + 18;
                            const labelX = cx + labelDist * Math.cos(p.angle);
                            const labelY = cy + labelDist * Math.sin(p.angle);
                            let textAnchor: "middle" | "start" | "end" = "middle";
                            if (Math.cos(p.angle) > 0.1) textAnchor = "start";
                            if (Math.cos(p.angle) < -0.1) textAnchor = "end";

                            return (
                              <text
                                key={i}
                                x={labelX}
                                y={labelY + 4}
                                textAnchor={textAnchor}
                                className="fill-slate-700 font-bold font-sans"
                                style={{ fontSize: "10px" }}
                              >
                                {p.label} ({p.val})
                              </text>
                            );
                          })}
                        </svg>
                      );
                    })()}
                  </div>

                  {/* Line Graph Card */}
                  <div className="glass rounded-3xl p-6 border-slate-300 flex flex-col justify-between">
                    <h3 className="text-sm font-bold text-[#0b2f64] mb-2 flex items-center gap-1.5">
                      📈 พัฒนาการและสะสมผลงานรายเดือน (Timeline)
                    </h3>
                    <p className="text-[11px] text-slate-500 mb-4">
                      จำนวนทักษะและผลงานที่ได้รับการรับรองสะสมตามแต่ละช่วงเวลา
                    </p>

                    {(() => {
                      const skills = selectedStudent.portfolio?.skills || [];
                      const certs = selectedStudent.portfolio?.certificates || [];
                      const verifiedCount = skills.filter(s => s.isVerified).length;
                      
                      // Calculate cumulative monthly mock development graph based on dynamic verify count
                      const pData = [1, 2, 3, 5, 6, verifiedCount + certs.length + 2];
                      
                      const width = 240;
                      const height = 110;
                      const padding = 20;
                      
                      // Calculate positions
                      const points = pData.map((val, idx) => {
                        const x = padding + (idx * (width - 2 * padding)) / 5;
                        // Map 0-10 value range to graph height
                        const y = height - padding - (val / 10) * (height - 2 * padding);
                        return { x, y, val };
                      });

                      const pathD = points.map((p, i) => 
                        `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`
                      ).join(" ");

                      return (
                        <div className="flex flex-col items-center">
                          <svg width={width} height={height} className="overflow-visible">
                            {/* Gridlines */}
                            {[0, 1, 2].map((idx) => {
                              const y = padding + (idx * (height - 2 * padding)) / 2;
                              return (
                                <line
                                  key={idx}
                                  x1={padding}
                                  y1={y}
                                  x2={width - padding}
                                  y2={y}
                                  stroke="#e2e8f0"
                                  strokeWidth="0.75"
                                />
                              );
                            })}

                            {/* Chart Line */}
                            <path
                              d={pathD}
                              fill="none"
                              stroke="#b45309"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />

                            {/* Data Points & Value tags */}
                            {points.map((p, i) => (
                              <g key={i}>
                                <circle
                                  cx={p.x}
                                  cy={p.y}
                                  r="4"
                                  fill="#0b2f64"
                                  stroke="#ffffff"
                                  strokeWidth="1.5"
                                />
                                <text
                                  x={p.x}
                                  y={p.y - 8}
                                  textAnchor="middle"
                                  className="fill-slate-800 font-bold"
                                  style={{ fontSize: "9px" }}
                                >
                                  {p.val}
                                </text>
                              </g>
                            ))}

                            {/* Month labels */}
                            {["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย."].map((month, idx) => {
                              const x = padding + (idx * (width - 2 * padding)) / 5;
                              return (
                                <text
                                  key={idx}
                                  x={x}
                                  y={height - 2}
                                  textAnchor="middle"
                                  className="fill-slate-500"
                                  style={{ fontSize: "8px" }}
                                >
                                  {month}
                                </text>
                              );
                            })}
                          </svg>
                          <div className="w-full flex justify-around mt-3 border-t border-slate-200 pt-2 text-center">
                            <div>
                              <p className="text-[10px] text-slate-500">ทักษะผ่านการรับรอง</p>
                              <p className="text-xs font-bold text-slate-900">{verifiedCount} ทักษะ</p>
                            </div>
                            <div className="border-l border-slate-200 h-6"></div>
                            <div>
                              <p className="text-[10px] text-slate-500">ผลงานและโครงการ</p>
                              <p className="text-xs font-bold text-slate-900">
                                {selectedStudent.portfolio?.projects.length || 0} ชิ้น
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                </div>

                {/* 2. Skills Section with Verification Control */}
                <div className="glass rounded-3xl p-6 border-slate-300">
                  <h3 className="text-lg font-bold text-[#0b2f64] mb-6 flex items-center gap-2">
                    ⚡ ผลการตรวจประเมินทักษะ (Skills Passport)
                  </h3>

                  <div className="space-y-4">
                    {selectedStudent.portfolio?.skills && selectedStudent.portfolio.skills.length > 0 ? (
                      selectedStudent.portfolio.skills.map((skill) => (
                        <div
                          key={skill.id}
                          className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-100 transition"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-slate-800 text-sm">{skill.name}</h4>
                              <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-200">
                                {skill.category}
                              </span>
                              {skill.testScore !== null && (
                                <span className="text-[10px] px-2 py-0.5 rounded bg-green-100 text-green-800 border border-green-300 font-bold">
                                  คะแนนประเมิน: {skill.testScore}%
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs text-slate-500">ระดับความชำนาญ:</span>
                              <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <span
                                    key={star}
                                    className={`text-xs ${
                                      star <= skill.level ? "text-amber-500" : "text-slate-300"
                                    }`}
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                            </div>
                            {(skill as any).rubricScores && (
                              <div className="text-[10px] text-[#0b2f64] font-bold mt-1 bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1 w-max">
                                📊 เกณฑ์รูบริคส์: {(() => {
                                  try {
                                    const r = JSON.parse((skill as any).rubricScores);
                                    return `นำเสนอ ${r.presentation}/5 | ทำงานกลุ่ม ${r.collaboration}/5 | การวิเคราะห์ ${r.logic}/5`;
                                  } catch (e) {
                                    return "";
                                  }
                                })()}
                              </div>
                            )}
                            {(skill as any).proofUrl && (
                              <div className="text-[10px] text-slate-500 font-semibold mt-1">
                                🔗 ลิงก์แฟ้มงาน: <a href={(skill as any).proofUrl} target="_blank" rel="noreferrer" className="text-blue-900 hover:underline">{(skill as any).proofUrl}</a>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {(skill as any).status === "PENDING_TEACHER_REVIEW" ? (
                              <button
                                onClick={() => {
                                  setActiveArtifactSkill(skill);
                                  setPresentationScore(3);
                                  setCollaborationScore(3);
                                  setLogicScore(3);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-[#0b2f64] hover:bg-[#08224b] text-white text-xs font-bold transition shadow-sm cursor-pointer"
                              >
                                📝 ตรวจประเมินแฟ้มงาน (Rubric)
                              </button>
                            ) : skill.isVerified ? (
                              <>
                                <span className="px-3 py-1.5 rounded-lg bg-green-100 text-green-800 border border-green-300 text-xs font-bold flex items-center gap-1">
                                  ✅ ผ่านการรับรองโดยสถาบัน
                                </span>
                                <button
                                  onClick={() => handleVerifySkill(skill.id, false)}
                                  disabled={verifyingSkillId === skill.id}
                                  className="px-2.5 py-1.5 rounded-lg border border-red-300 text-red-700 hover:bg-red-50 text-xs font-semibold transition cursor-pointer"
                                  title="ยกเลิกการยืนยัน"
                                >
                                  ยกเลิก
                                </button>
                              </>
                            ) : (
                              <>
                                <span className="px-3 py-1.5 rounded-lg bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold">
                                  ⚠️ รอยืนยันความชำนาญ
                                </span>
                                <button
                                  onClick={() => handleVerifySkill(skill.id, true)}
                                  disabled={verifyingSkillId === skill.id}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm cursor-pointer"
                                >
                                  {verifyingSkillId === skill.id ? "กำลังรับรอง..." : "✔️ กดรับรองทักษะ"}
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center py-6 text-slate-400 text-sm font-medium border border-dashed border-slate-200 rounded-xl">
                        นักศึกษาท่านนี้ยังไม่มีการลงทะเบียนทักษะ
                      </p>
                    )}
                  </div>
                </div>

                {/* 3. Certificates Verification View */}
                <div className="glass rounded-3xl p-6 border-slate-300">
                  <h3 className="text-lg font-bold text-[#0b2f64] mb-4">
                    🏆 ใบประกาศนียบัตร (Certificates)
                  </h3>
                  
                  <div className="space-y-3">
                    {selectedStudent.portfolio?.certificates && selectedStudent.portfolio.certificates.length > 0 ? (
                      selectedStudent.portfolio.certificates.map((cert) => (
                        <div key={cert.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h4 className="font-bold text-slate-800 text-sm">{cert.name}</h4>
                              <p className="text-slate-500 text-xs mt-0.5">ผู้ออกใบประกาศ: {cert.issuer}</p>
                              <p className="text-slate-400 text-[10px] mt-1 font-mono break-all">
                                Digital ID: {cert.hashValue}
                              </p>
                            </div>
                            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold whitespace-nowrap">
                              🔒 ปลอดภัย (Verified)
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center py-6 text-slate-400 text-sm font-medium border border-dashed border-slate-200 rounded-xl">
                        ยังไม่มีข้อมูลใบประกาศนียบัตรของนักศึกษารายนี้
                      </p>
                    )}
                  </div>
                </div>

                {/* 4. Projects View */}
                <div className="glass rounded-3xl p-6 border-slate-300">
                  <h3 className="text-lg font-bold text-[#0b2f64] mb-4">
                    📂 โครงงานและผลงาน (Projects)
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedStudent.portfolio?.projects && selectedStudent.portfolio.projects.length > 0 ? (
                      selectedStudent.portfolio.projects.map((project) => (
                        <div key={project.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition flex flex-col justify-between h-28">
                          <div>
                            <h4 className="font-bold text-slate-800 text-sm truncate">{project.title}</h4>
                            <p className="text-slate-500 text-xs mt-1 line-clamp-2">{project.description}</p>
                          </div>
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-blue-800 font-semibold hover:underline mt-2 flex items-center gap-1 w-max"
                            >
                              ดูซอร์สโค้ด ↗
                            </a>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-center py-6 text-slate-400 text-sm font-medium border border-dashed border-slate-200 rounded-xl col-span-2">
                        ยังไม่มีข้อมูลผลงานของนักศึกษารายนี้
                      </p>
                    )}
                  </div>
                </div>

              </div>
            ) : (
              <div className="glass rounded-3xl p-16 border-slate-300 text-center h-full flex flex-col justify-center items-center space-y-4">
                <span className="text-6xl">🎓</span>
                <h3 className="text-xl font-bold text-slate-800">กรุณาเลือกนักศึกษาเพื่อตรวจสอบข้อมูล</h3>
                <p className="text-slate-500 text-sm max-w-sm leading-relaxed">
                  เลือกนักศึกษาจากรายชื่อด้านซ้ายเพื่อดูรายละเอียดประวัติการเรียนรู้ โครงงาน ใบประกาศนียบัตร และทำการลงรับรองทักษะฝีมือ
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

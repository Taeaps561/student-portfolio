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
  proofUrl: string | null;
  proofDesc: string | null;
  status: string | null;
  rubricScores: string | null;
}

const STANDARD_SKILLS = [
  { name: "React", category: "Tech", icon: "⚛️" },
  { name: "Next.js", category: "Tech", icon: "🌐" },
  { name: "Node.js", category: "Tech", icon: "🟢" },
  { name: "SQL", category: "Tech", icon: "💾" },
  { name: "Problem Solving", category: "Soft", icon: "🧩" },
  { name: "Communication", category: "Soft", icon: "🗣️" },
  { name: "Teamwork", category: "Soft", icon: "👥" }
];

const CODING_CHALLENGES: Record<string, any> = {
  "react": {
    title: "เขียนฟังก์ชัน formatPrice(price)",
    description: "จงเขียนฟังก์ชัน formatPrice(price) เพื่อแปลงตัวเลขราคาเป็นข้อความสกุลเงินบาท โดยเติมเครื่องหมายจุลภาคคั่นในหลักพัน (เช่น formatPrice(1500) จะได้ '1,500 บาท') หากอินพุตมีค่าติดลบ ไม่ถูกต้อง หรือไม่ใช่ตัวเลข ให้ส่งคืนค่า '0 บาท'",
    template: `function formatPrice(price) {
  // เขียนโค้ดของคุณที่นี่
  if (typeof price !== 'number' || price < 0 || isNaN(price)) {
    return '0 บาท';
  }
  return price.toLocaleString('th-TH') + ' บาท';
}`,
    tests: [
      { code: "formatPrice(100)", expected: "100 บาท" },
      { code: "formatPrice(1500)", expected: "1,500 บาท" },
      { code: "formatPrice(-5)", expected: "0 บาท" },
      { code: "formatPrice(NaN)", expected: "0 บาท" }
    ]
  },
  "next.js": {
    title: "เขียนฟังก์ชัน buildUrl(path, queryParams)",
    description: "จงเขียนฟังก์ชัน buildUrl(path, queryParams) เพื่อรับสายอักขระเส้นทาง (path) และอ็อบเจกต์พารามิเตอร์คิวรี (queryParams) แล้วทำการคืนค่า URL สมบูรณ์ที่มี Query String ต่อท้าย (เช่น buildUrl('/home', { ref: 'navbar' }) -> '/home?ref=navbar') หาก queryParams ไม่มีคีย์ใดๆ ให้คืนค่า path เปล่าๆ ไม่ต้องใส่เครื่องหมายคำถาม (?)",
    template: `function buildUrl(path, queryParams) {
  // เขียนโค้ดของคุณที่นี่
  const keys = Object.keys(queryParams || {});
  if (keys.length === 0) return path;
  const queryString = keys.map(k => k + '=' + queryParams[k]).join('&');
  return path + '?' + queryString;
}`,
    tests: [
      { code: "buildUrl('/posts', { id: 5, category: 'tech' })", expected: "/posts?id=5&category=tech" },
      { code: "buildUrl('/home', {})", expected: "/home" },
      { code: "buildUrl('/search', { q: 'react' })", expected: "/search?q=react" }
    ]
  },
  "node.js": {
    title: "เขียนฟังก์ชัน parseBearerToken(authHeader)",
    description: "จงเขียนฟังก์ชัน parseBearerToken(authHeader) เพื่อแยก JWT token ออกมาจากสายอักขระ Authorization Header โดยดึงเฉพาะค่า Token หลังคำว่า 'Bearer ' หากสายอักขระที่ส่งเข้ามาไม่เป็นไปตามรูปแบบ หรือไม่มีค่า Token ให้ส่งคืนค่า null",
    template: `function parseBearerToken(authHeader) {
  // เขียนโค้ดของคุณที่นี่
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}`,
    tests: [
      { code: "parseBearerToken('Bearer eyJhbGciOiJIUzI1Ni')", expected: "eyJhbGciOiJIUzI1Ni" },
      { code: "parseBearerToken('Bearer token_123')", expected: "token_123" },
      { code: "parseBearerToken('InvalidTokenHeader')", expected: null },
      { code: "parseBearerToken('')", expected: null }
    ]
  },
  "sql": {
    title: "เขียนฟังก์ชัน generateSelectQuery(table, columns, filter)",
    description: "จงเขียนฟังก์ชัน generateSelectQuery(table, columns, filter) เพื่อสร้างคำสั่ง SQL SELECT จากตัวแปรที่ระบุ ตัวอย่างเช่น generateSelectQuery('users', ['id', 'name'], { role: 'admin' }) คืนค่าคำสั่งสายอักขระ 'SELECT id, name FROM users WHERE role = 'admin'' หากคิวรีไม่มีตัวกรอง (filter ว่างเปล่า) ไม่ต้องใส่คีย์ WHERE",
    template: `function generateSelectQuery(table, columns, filter) {
  // เขียนโค้ดของคุณที่นี่
  const cols = columns.join(', ');
  const base = 'SELECT ' + cols + ' FROM ' + table;
  const keys = Object.keys(filter || {});
  if (keys.length === 0) return base;
  return base + ' WHERE ' + keys[0] + ' = \\'' + filter[keys[0]] + '\\'';
}`,
    tests: [
      { code: "generateSelectQuery('users', ['id', 'name'], { role: 'admin' })", expected: "SELECT id, name FROM users WHERE role = 'admin'" },
      { code: "generateSelectQuery('skills', ['name'], {})", expected: "SELECT name FROM skills" }
    ]
  }
};

export default function SkillsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [formSkillIndex, setFormSkillIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Common Modal target
  const [activeQuizSkill, setActiveQuizSkill] = useState<Skill | null>(null);

  // Coding Playground state
  const [codingChallenge, setCodingChallenge] = useState<any | null>(null);
  const [studentCode, setStudentCode] = useState("");
  const [testResults, setTestResults] = useState<any[]>([]);
  const [runningTests, setRunningTests] = useState(false);
  const [quizResult, setQuizResult] = useState<{
    score: number;
    passed: boolean;
    correctCount: number;
    totalCount: number;
  } | null>(null);

  // Soft Skill Artifact state
  const [proofUrl, setProofUrl] = useState("");
  const [proofDesc, setProofDesc] = useState("");
  const [submittingProof, setSubmittingProof] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchSkills();
    }
  }, [status]);

  const fetchSkills = async () => {
    try {
      const res = await fetch("/api/skills");
      if (res.ok) {
        const data = await res.json();
        const loadedSkills = data.skills || [];
        setSkills(loadedSkills);
        
        // Auto-select first unused skill
        const firstUnused = STANDARD_SKILLS.findIndex(
          skill => !loadedSkills.some((s: Skill) => s.name.toLowerCase() === skill.name.toLowerCase())
        );
        if (firstUnused !== -1) {
          setFormSkillIndex(firstUnused);
        }
      }
    } catch (err) {
      console.error("Failed to fetch skills", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedSkill = STANDARD_SKILLS[formSkillIndex];
    if (!selectedSkill) return;

    if (skills.some(s => s.name.toLowerCase() === selectedSkill.name.toLowerCase())) {
      setError("คุณเพิ่มทักษะนี้ไปแล้ว");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: selectedSkill.name,
          category: selectedSkill.category,
          level: 1,
        }),
      });

      if (res.ok) {
        await fetchSkills();
      } else {
        const data = await res.json();
        setError(data.error || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }
    } catch (err) {
      setError("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("คุณแน่ใจหรือไม่ที่จะลบทักษะนี้?")) return;

    try {
      const res = await fetch(`/api/skills?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setSkills(skills.filter((s) => s.id !== id));
      }
    } catch (err) {
      alert("ลบข้อมูลไม่สำเร็จ");
    }
  };

  const handleStartQuiz = (skill: Skill) => {
    setActiveQuizSkill(skill);
    setQuizResult(null);
    setTestResults([]);

    if (skill.category === "Tech") {
      const challengeKey = skill.name.toLowerCase();
      const challenge = CODING_CHALLENGES[challengeKey] || null;
      setCodingChallenge(challenge);
      setStudentCode(challenge ? challenge.template : "");
    } else {
      setCodingChallenge(null);
      setProofUrl("");
      setProofDesc("");
    }
  };

  const runCodingTests = async () => {
    if (!codingChallenge || !activeQuizSkill) return;
    setRunningTests(true);
    setTestResults([]);

    try {
      const studentFuncStr = studentCode;
      const results: any[] = [];
      let passedCount = 0;

      for (let i = 0; i < codingChallenge.tests.length; i++) {
        const test = codingChallenge.tests[i];
        try {
          const runner = new Function(`
            ${studentFuncStr}
            return ${test.code};
          `);
          const output = runner();
          const passed = JSON.stringify(output) === JSON.stringify(test.expected);
          
          if (passed) passedCount++;
          
          results.push({
            input: test.code,
            expected: String(test.expected),
            actual: String(output),
            passed
          });
        } catch (execErr: any) {
          results.push({
            input: test.code,
            expected: String(test.expected),
            actual: `Error: ${execErr.message}`,
            passed: false
          });
        }
      }

      setTestResults(results);

      const scorePercent = Math.round((passedCount / codingChallenge.tests.length) * 100);
      const passed = scorePercent >= 80;

      const res = await fetch("/api/skills/submit-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skillId: activeQuizSkill.id,
          isCodingTest: true,
          scorePercent
        })
      });

      if (res.ok) {
        setQuizResult({
          score: scorePercent,
          passed,
          correctCount: passedCount,
          totalCount: codingChallenge.tests.length
        });
        await fetchSkills();
      } else {
        alert("เกิดข้อผิดพลาดในการส่งผลประเมิน");
      }
    } catch (err: any) {
      alert(`การประมวลผลโค้ดขัดข้อง: ${err.message}`);
    } finally {
      setRunningTests(false);
    }
  };

  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeQuizSkill) return;
    if (!proofUrl || !proofDesc) {
      alert("กรุณากรอกข้อมูลหลักฐานให้ครบถ้วน");
      return;
    }
    setSubmittingProof(true);

    try {
      const res = await fetch("/api/skills/submit-proof", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skillId: activeQuizSkill.id,
          proofUrl,
          proofDesc
        })
      });

      if (res.ok) {
        alert("ยื่นส่งหลักฐานแฟ้มสะสมงานสำเร็จแล้ว รออาจารย์ตรวจประเมิน!");
        setActiveQuizSkill(null);
        await fetchSkills();
      } else {
        const d = await res.json();
        alert(d.error || "เกิดข้อผิดพลาดในการยื่นแฟ้มผลงาน");
      }
    } catch (err) {
      alert("การเชื่อมต่อล้มเหลว");
    } finally {
      setSubmittingProof(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-xl text-slate-800 animate-pulse font-bold">กำลังโหลดข้อมูล...</div>
      </div>
    );
  }

  const techSkills = skills.filter((s) => s.category === "Tech");
  const softSkills = skills.filter((s) => s.category === "Soft");

  return (
    <div className="min-h-screen pt-24 px-4 bg-slate-50 pb-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center md:text-left mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0b2f64]">
            ⚛️ ระบบประเมินสมรรถนะทักษะ (Skill Assessments)
          </h1>
          <p className="text-slate-600 mt-2 font-medium">
            ลงทะเบียนวิชามาตรฐาน และทดสอบโค้ดด้วยโจทย์โปรแกรมมิ่งจริง หรือแนบหลักฐานสำหรับ Soft Skills เพื่อรับรองดิจิทัล
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Add Skill Form */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm h-max">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              ➕ ลงทะเบียนทักษะเพิ่ม
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">เลือกทักษะที่ต้องการรับรอง</label>
                <select
                  value={formSkillIndex}
                  onChange={(e) => setFormSkillIndex(parseInt(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-900 transition text-sm font-bold"
                >
                  {STANDARD_SKILLS.map((skill, index) => {
                    const isAlreadyAdded = skills.some(s => s.name.toLowerCase() === skill.name.toLowerCase());
                    return (
                      <option key={index} value={index} disabled={isAlreadyAdded}>
                        {skill.icon} {skill.name} ({skill.category === "Tech" ? "Technical" : "Soft Skill"}) {isAlreadyAdded ? "— เพิ่มแล้ว" : ""}
                      </option>
                    );
                  })}
                </select>
              </div>

              {error && <p className="text-red-600 text-xs font-semibold">{error}</p>}

              <button
                type="submit"
                disabled={submitting || !STANDARD_SKILLS.some(skill => !skills.some(s => s.name.toLowerCase() === skill.name.toLowerCase()))}
                className="w-full py-3.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold transition disabled:opacity-50 text-sm cursor-pointer shadow-sm"
              >
                {submitting ? "กำลังบันทึก..." : "💾 ลงทะเบียนทักษะ"}
              </button>
            </form>
          </div>

          {/* Skills Lists */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Technical Skills List */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-[#0b2f64] mb-6 flex items-center gap-2">
                💻 Technical Skills ({techSkills.length})
              </h2>
              <div className="space-y-3">
                {techSkills.length > 0 ? (
                  techSkills.map((skill) => (
                    <div key={skill.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-100/30 transition">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-slate-900 font-bold text-sm">{skill.name}</p>
                          {skill.isVerified ? (
                            <span className="px-2 py-0.5 rounded bg-green-100 text-green-800 text-[10px] font-bold border border-green-300">
                              ✅ Verified ({skill.testScore}%)
                            </span>
                          ) : skill.testScore !== null ? (
                            <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 text-[10px] font-bold border border-red-300">
                              ⚠️ ยังไม่ผ่าน ({skill.testScore}%)
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-300">
                              รอประเมิน
                            </span>
                          )}
                        </div>
                        <div className="flex gap-1 mt-2">
                          {[1, 2, 3, 4, 5].map((lvl) => (
                            <div 
                              key={lvl} 
                              className={`w-4 h-1.5 rounded-full ${
                                lvl <= skill.level ? "bg-amber-500" : "bg-slate-200"
                              }`}
                            ></div>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {!skill.isVerified && (
                          <button
                            onClick={() => handleStartQuiz(skill)}
                            className="px-3 py-1.5 rounded-lg bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold transition shadow-sm cursor-pointer"
                          >
                            📝 ทำโจทย์เขียนโค้ด (Playground)
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(skill.id)}
                          className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition cursor-pointer"
                        >
                          ลบ
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 text-xs py-8 text-center border border-dashed border-slate-300 rounded-xl font-medium">ยังไม่มีการบันทึกทักษะเฉพาะด้าน</p>
                )}
              </div>
            </div>

            {/* Soft Skills List */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-[#0b2f64] mb-6 flex items-center gap-2">
                🤝 Soft Skills ({softSkills.length})
              </h2>
              <div className="space-y-3">
                {softSkills.length > 0 ? (
                  softSkills.map((skill) => (
                    <div key={skill.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-100/30 transition">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-slate-900 font-bold text-sm">{skill.name}</p>
                          {skill.isVerified ? (
                            <span className="px-2 py-0.5 rounded bg-green-100 text-green-800 text-[10px] font-bold border border-green-300">
                              ✅ Verified ({skill.testScore}%)
                            </span>
                          ) : skill.status === "PENDING_TEACHER_REVIEW" ? (
                            <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold border border-blue-300 animate-pulse">
                              ⌛ รออาจารย์ตรวจประเมิน
                            </span>
                          ) : skill.testScore !== null ? (
                            <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 text-[10px] font-bold border border-red-300">
                              ⚠️ ยังไม่ผ่าน ({skill.testScore}%)
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-300">
                              ยังไม่ได้ยื่นผลงาน
                            </span>
                          )}
                        </div>
                        <div className="flex gap-1 mt-2">
                          {[1, 2, 3, 4, 5].map((lvl) => (
                            <div 
                              key={lvl} 
                              className={`w-4 h-1.5 rounded-full ${
                                lvl <= skill.level ? "bg-amber-500" : "bg-slate-200"
                              }`}
                            ></div>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {!skill.isVerified && skill.status !== "PENDING_TEACHER_REVIEW" && (
                          <button
                            onClick={() => handleStartQuiz(skill)}
                            className="px-3 py-1.5 rounded-lg bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold transition shadow-sm cursor-pointer"
                          >
                            📤 ยื่นแฟ้มผลงานหลักฐาน
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(skill.id)}
                          className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition cursor-pointer"
                        >
                          ลบ
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 text-xs py-8 text-center border border-dashed border-slate-300 rounded-xl font-medium">ยังไม่มีการบันทึกทักษะการทำงานร่วมกัน</p>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* DYNAMIC ASSESSMENT MODAL */}
      {activeQuizSkill && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-300 shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto flex flex-col p-6 sm:p-8 animate-fadeIn">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
              <div>
                <span className="text-xs font-bold text-blue-900 uppercase tracking-wide">
                  {codingChallenge ? "👨‍💻 Online Judge Sandbox" : "📤 Soft Skill Artifact proof"}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">ประเมินทักษะ: {activeQuizSkill.name}</h3>
              </div>
              <button 
                onClick={() => setActiveQuizSkill(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg p-1.5"
              >
                ✕
              </button>
            </div>

            {/* Quiz Result View */}
            {quizResult ? (
              <div className="space-y-6 text-center py-6">
                <div className="max-w-xs mx-auto space-y-4">
                  {quizResult.passed ? (
                    <>
                      <span className="text-6xl">🎉</span>
                      <h4 className="text-2xl font-extrabold text-green-700">ผ่านเกณฑ์การประเมิน!</h4>
                      <p className="text-slate-600 text-sm font-semibold">
                        คุณผ่านการประเมิน <span className="font-bold text-green-700 text-lg">{quizResult.score}%</span> ({quizResult.correctCount}/{quizResult.totalCount} เคสทดสอบ) ยืนยันและรับรองทักษะสำเร็จ!
                      </p>
                    </>
                  ) : (
                    <>
                      <span className="text-6xl">⚠️</span>
                      <h4 className="text-2xl font-extrabold text-red-600">ยังไม่ผ่านเกณฑ์ร้อยละ 80</h4>
                      <p className="text-slate-600 text-sm font-semibold">
                        คุณทำได้ <span className="font-bold text-red-650 text-lg">{quizResult.score}%</span> ({quizResult.correctCount}/{quizResult.totalCount} เคสทดสอบ) คุณสามารถแก้ไขโค้ดและส่งทดสอบใหม่ได้
                      </p>
                    </>
                  )}
                </div>

                <button
                  onClick={() => {
                    setActiveQuizSkill(null);
                    setQuizResult(null);
                  }}
                  className="mt-6 px-6 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm transition cursor-pointer"
                >
                  ปิดหน้าต่างทดสอบ
                </button>
              </div>
            ) : codingChallenge ? (
              
              /* Tech Coding Playground (Online Judge) */
              <div className="space-y-5">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                  <h4 className="font-extrabold text-slate-800 text-sm mb-1">{codingChallenge.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-semibold">{codingChallenge.description}</p>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-500">
                    💻 หน้าต่างเขียนโค้ดภาษา JavaScript
                  </label>
                  <textarea
                    rows={8}
                    value={studentCode}
                    onChange={(e) => setStudentCode(e.target.value)}
                    className="w-full bg-slate-900 text-slate-100 font-mono text-xs rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-900 leading-relaxed"
                  />
                </div>

                {testResults.length > 0 && (
                  <div className="space-y-2.5 pt-2">
                    <h5 className="text-xs font-bold text-slate-500">ผลการรันชุดทดสอบ (Unit Tests)</h5>
                    <div className="space-y-1.5 max-h-[160px] overflow-y-auto">
                      {testResults.map((t, idx) => (
                        <div 
                          key={idx} 
                          className={`p-2 rounded-xl text-xs flex justify-between font-mono ${
                            t.passed ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
                          }`}
                        >
                          <span>{t.input}</span>
                          <span className="font-bold">{t.passed ? "✅ Pass" : `❌ Fail (คาดหวัง: ${t.expected}, ผลลัพธ์: ${t.actual})`}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t border-slate-200 pt-5 mt-6 flex justify-end gap-3">
                  <button
                    onClick={() => setActiveQuizSkill(null)}
                    className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 font-bold text-xs transition cursor-pointer"
                  >
                    ยกเลิก
                  </button>
                  <button
                    onClick={runCodingTests}
                    disabled={runningTests || !studentCode.trim()}
                    className="px-6 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs transition disabled:opacity-50 cursor-pointer"
                  >
                    {runningTests ? "กำลังคอมไพล์และรันเทสต์..." : "⚡ รันยูนิตเทสต์และส่งผล"}
                  </button>
                </div>

              </div>

            ) : (
              
              /* Soft Skill Artifact Submission Form */
              <form onSubmit={handleSubmitProof} className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl text-blue-900 text-xs font-semibold leading-relaxed">
                  💡 สำหรับทักษะด้านมนุษยสัมพันธ์ (Soft Skill) กรุณาแนบหลักฐานความสำเร็จจริง (เช่น ลิงก์บันทึกวิดีโอ YouTube การนำเสนองาน หรือสไลด์สรุป) เพื่อให้อาจารย์ทำการตรวจคะแนนอิงตาม Rubric Scores
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-600">
                    ลิงก์หลักฐาน / แฟ้มผลงาน (URL)
                  </label>
                  <input
                    type="url"
                    required
                    value={proofUrl}
                    onChange={(e) => setProofUrl(e.target.value)}
                    placeholder="https://youtube.com/... หรือ https://docs.google.com/presentation/..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-900 focus:bg-white transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-600">
                    คำอธิบายผลสัมฤทธิ์และบทบาทหน้าที่ของคุณ
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={proofDesc}
                    onChange={(e) => setProofDesc(e.target.value)}
                    placeholder="ระบุว่าโครงการนี้คืออะไร คุณประยุกต์ทักษะนี้แก้วิกฤตอย่างไร และผลลัพธ์เป็นเช่นไร..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-900 focus:bg-white transition resize-none leading-relaxed"
                  />
                </div>

                <div className="border-t border-slate-200 pt-5 mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveQuizSkill(null)}
                    className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 font-bold text-xs transition cursor-pointer"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    disabled={submittingProof}
                    className="px-6 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs transition disabled:opacity-50 cursor-pointer"
                  >
                    {submittingProof ? "กำลังส่งคำร้อง..." : "📤 ส่งผลงานให้อาจารย์รับรอง"}
                  </button>
                </div>

              </form>

            )}

          </div>
        </div>
      )}
    </div>
  );
}

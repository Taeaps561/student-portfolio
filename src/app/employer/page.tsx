"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface JobOpening {
  id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  type: "FULL_TIME" | "INTERNSHIP" | "PART_TIME" | "CONTRACT";
  workplace: "Hybrid" | "On-site" | "Remote";
  salary: string;
  postedAt: string;
  applicantsCount: number;
  skills: string[];
  description: string;
  requirements: string[];
  benefits: string[];
  isEasyApply: boolean;
}

interface Candidate {
  id: string;
  name: string;
  headline: string;
  matchScore: number;
  gpa: string;
  certs: string[];
  verifiedSkills: string[];
  avatar: string;
  appliedJob?: string;
  status: "APPLIED" | "INTERVIEW_SCHEDULED" | "OFFERED" | "REVIEWING";
}

const SAMPLE_JOBS: JobOpening[] = [
  {
    id: "job-1",
    title: "Junior Full-Stack Web Developer (Next.js & TypeScript)",
    company: "บมจ. เทคโนโลยีดีไลท์ (Delight Technology PCL.)",
    logo: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&w=150&q=80",
    location: "กรุงเทพมหานคร (อารีย์)",
    type: "FULL_TIME",
    workplace: "Hybrid",
    salary: "฿32,000 - ฿45,000 / เดือน",
    postedAt: "1 วันที่แล้ว",
    applicantsCount: 14,
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    description: `บริษัทกำลังมองหานักพัฒนา Full-Stack รุ่นใหม่ไฟแรง ที่มีความสนใจในการสร้างสรรค์ Modern Web Application ด้วย Next.js และ TypeScript ร่วมกับทีมพัฒนาผลิตภัณฑ์ระดับสากล

คุณจะได้มีส่วนร่วมในการออกแบบสถาปัตยกรรมระบบ, เชื่อมโยง REST API, ปรับแต่ง Web Performance, และทำงานร่วมกับ UI/UX Designer`,
    requirements: [
      "สำเร็จการศึกษาหรือกำลังศึกษาปริญญาตรี สาขาวิทยาการคอมพิวเตอร์ หรือสาขาที่เกี่ยวข้อง",
      "มีทักษะความเข้าใจใน Next.js, React และ TypeScript",
      "มีผลงาน Portfolio หรือโครงการที่พัฒนาขึ้นจริงใน GitHub",
      "มีทักษะ Verified Skill จากสถาบันจะได้รับการพิจารณาเป็นพิเศษ",
    ],
    benefits: [
      "ทำงานแบบ Hybrid (เข้าออฟฟิศ 2 วัน/สัปดาห์)",
      "งบประมาณสำหรับการเรียนรู้และสอบใบรับรองสากล ฿20,000/ปี",
      "ประกันสุขภาพกลุ่มและทันตกรรม",
      "เวลาทำงานยืดหยุ่น (Flexible Working Hours)",
    ],
    isEasyApply: true,
  },
  {
    id: "job-2",
    title: "Cyber Security Analyst / SOC Tier 1 (นักศึกษาฝึกงาน / สหกิจศึกษา)",
    company: "บมจ. เทคโนโลยีดีไลท์ (Delight Technology PCL.)",
    logo: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=150&q=80",
    location: "กรุงเทพมหานคร (สาทร)",
    type: "INTERNSHIP",
    workplace: "On-site",
    salary: "฿15,000 - ฿18,000 / เดือน (เบี้ยเลี้ยง)",
    postedAt: "3 วันที่แล้ว",
    applicantsCount: 8,
    skills: ["Cyber Security", "Networking", "Python", "DevSecOps"],
    description: `เปิดรับสมัครนักศึกษาฝึกงานและสหกิจศึกษาเข้าร่วมทีม Security Operations Center (SOC) เพื่อเรียนรู้การเฝ้าระวัง ตรวจจับ และรับมือกับภัยคุกคามทางไซเบอร์ในสภาพแวดล้อมระบบจริงขององค์กรขนาดใหญ่`,
    requirements: [
      "นักศึกษาระดับปริญญาตรีชั้นปีที่ 3 หรือ 4 สาขาวิทยาการคอมพิวเตอร์ หรือความมั่นคงปลอดภัยไซเบอร์",
      "มีความรู้พื้นฐานด้าน TCP/IP, OSI Model, Firewall และ SIEM",
      "มีใบรับรอง CCNA, Sec+, หรือ CEH จะพิจารณาเป็นพิเศษ",
    ],
    benefits: [
      "เบี้ยเลี้ยงรายเดือนและค่าเดินทาง",
      "โอกาสได้รับการบรรจุเป็นพนักงานประจำทันทีหลังสำเร็จการศึกษา",
      "Mentor ผู้เชี่ยวชาญดูแลแบบ 1-on-1",
    ],
    isEasyApply: true,
  },
  {
    id: "job-3",
    title: "UI/UX & Product Designer (Entry-Level)",
    company: "บมจ. เทคโนโลยีดีไลท์ (Delight Technology PCL.)",
    logo: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=150&q=80",
    location: "กรุงเทพมหานคร (สุขุมวิท)",
    type: "FULL_TIME",
    workplace: "Hybrid",
    salary: "฿28,000 - ฿38,000 / เดือน",
    postedAt: "5 วันที่แล้ว",
    applicantsCount: 22,
    skills: ["Figma", "UI/UX", "Design Systems", "Communication"],
    description: `ร่วมงานกับสตูดิโอด้านการออกแบบดิจิทัล ออกแบบ User Experience และ User Interface สำหรับ Web & Mobile Application`,
    requirements: [
      "มีความเชี่ยวชาญในการใช้ Figma และการสร้าง Design System",
      "มีแฟ้มสะสมผลงาน (Portfolio) ด้าน UI/UX ที่ชัดเจน",
    ],
    benefits: [
      "MacBook Pro ประจำตำแหน่ง",
      "ทำงานแบบ Hybrid (WFH 3 วัน)",
    ],
    isEasyApply: true,
  },
];

const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: "cand-1",
    name: "นักศึกษา ทดสอบ",
    headline: "Full-Stack Dev & DevSecOps | Next.js, Prisma, Security",
    matchScore: 98,
    gpa: "3.75 (Verified)",
    certs: ["CCNA", "CompTIA Security+", "CEH", "SDU DevSecOps Specialist"],
    verifiedSkills: ["Next.js (ระดับ 5)", "React (ระดับ 4)", "DevSecOps (ระดับ 5)", "TypeScript (ระดับ 4)"],
    avatar: "https://ui-avatars.com/api/?name=Student+Test&background=0a66c2&color=fff",
    appliedJob: "Junior Full-Stack Web Developer",
    status: "INTERVIEW_SCHEDULED",
  },
  {
    id: "cand-2",
    name: "นางสาวเจนจิรา ดีไซเนอร์",
    headline: "Product & UI/UX Designer | Design Systems & Figma",
    matchScore: 92,
    gpa: "3.80 (Verified)",
    certs: ["Google UX Design Professional", "Figma Advanced Specialist"],
    verifiedSkills: ["Figma (ระดับ 5)", "UI/UX (ระดับ 5)", "Design Systems (ระดับ 4)"],
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    appliedJob: "UI/UX & Product Designer",
    status: "REVIEWING",
  },
  {
    id: "cand-3",
    name: "นายสมชาย ยอดนักโค้ด",
    headline: "Cloud & Backend Engineer | Node.js, Docker & PostgreSQL",
    matchScore: 88,
    gpa: "3.60 (Verified)",
    certs: ["AWS Certified Solutions Architect", "Docker Certified Associate"],
    verifiedSkills: ["Node.js (ระดับ 5)", "Docker (ระดับ 4)", "PostgreSQL (ระดับ 4)"],
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    appliedJob: "Cyber Security Analyst / SOC Tier 1",
    status: "APPLIED",
  },
];

export default function EmployerPage() {
  const { data: session } = useSession();
  const isEmployer = session?.user?.role === "EMPLOYER";

  const [activeTab, setActiveTab] = useState<"CANDIDATES" | "JOBS" | "POST_JOB">("CANDIDATES");
  const [candidates, setCandidates] = useState<Candidate[]>(INITIAL_CANDIDATES);
  const [jobs, setJobs] = useState<JobOpening[]>(SAMPLE_JOBS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSkill, setFilterSkill] = useState("ALL");
  const [selectedJob, setSelectedJob] = useState<JobOpening>(SAMPLE_JOBS[0]);

  // Form for posting a new job
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<"FULL_TIME" | "INTERNSHIP">("FULL_TIME");
  const [newSalary, setNewSalary] = useState("");
  const [newSkills, setNewSkills] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [postSuccess, setPostSuccess] = useState(false);

  const handlePostJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newJobObj: JobOpening = {
      id: `job-${Date.now()}`,
      title: newTitle.trim(),
      company: session?.user?.name || "บมจ. เทคโนโลยีดีไลท์",
      logo: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&w=150&q=80",
      location: "กรุงเทพมหานคร (Hybrid)",
      type: newType,
      workplace: "Hybrid",
      salary: newSalary || "ตามตกลง / โครงสร้างบริษัท",
      postedAt: "เมื่อสักครู่",
      applicantsCount: 0,
      skills: newSkills.split(",").map((s) => s.trim()).filter(Boolean),
      description: newDesc,
      requirements: ["นักศึกษา มหาวิทยาลัยสวนดุสิต ที่ผ่านการรับรองทักษะจาก SkillPassport"],
      benefits: ["เบี้ยเลี้ยง / เงินเดือนประจำ", "ประกันสุขภาพ", "โอกาสบรรจุงาน"],
      isEasyApply: true,
    };

    setJobs([newJobObj, ...jobs]);
    setPostSuccess(true);
    setTimeout(() => {
      setPostSuccess(false);
      setActiveTab("JOBS");
      setNewTitle("");
      setNewSalary("");
      setNewSkills("");
      setNewDesc("");
    }, 1200);
  };

  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch =
      searchQuery === "" ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.verifiedSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSkill =
      filterSkill === "ALL" ||
      c.verifiedSkills.some((s) => s.toLowerCase().includes(filterSkill.toLowerCase())) ||
      c.certs.some((cert) => cert.toLowerCase().includes(filterSkill.toLowerCase()));

    return matchesSearch && matchesSkill;
  });

  return (
    <div className="min-h-screen bg-[#f4f2ee] pt-[85px] px-4 pb-16">
      <div className="max-w-[1128px] mx-auto space-y-4">
        
        {/* ========================================================================= */}
        {/* 🏢 RECRUITER HEADER BANNER                                                */}
        {/* ========================================================================= */}
        <div className="bg-gradient-to-r from-[#002d62] via-[#0a66c2] to-[#047857] rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-extrabold uppercase tracking-wide">
                🏢 Recruiter & Talent Acquisition Hub
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 text-[11px] font-bold">
                ✓ พันธมิตรทางการ มสด.
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              ศูนย์สรรหาและคัดเลือกนักศึกษา (SDU Talent Hub)
            </h1>
            <p className="text-xs text-blue-100 max-w-2xl">
              ค้นหา คัดกรอง และเชิญสัมภาษณ์นักศึกษา มหาวิทยาลัยสวนดุสิต ที่ผ่านการรับรองทักษะดิจิทัลและใบประกาศนียบัตรสากล (Verified SkillPassport)
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setActiveTab("POST_JOB")}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition shadow-sm flex items-center gap-1.5"
            >
              <span>➕</span>
              <span>ประกาศรับสมัครงาน</span>
            </button>
            <Link
              href="/messaging"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition backdrop-blur-md flex items-center gap-1.5 border border-white/20"
            >
              <span>💬</span>
              <span>กล่องข้อความผู้สมัคร</span>
            </Link>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 🎛️ PORTAL NAVIGATION TABS                                                 */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-xl p-2 border border-slate-200 shadow-xs flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("CANDIDATES")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === "CANDIDATES"
                  ? "bg-[#0a66c2] text-white shadow-xs"
                  : "bg-slate-50 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <span>🎯</span>
              <span>ค้นหา & จับคู่ Talent อัจฉริยะ ({candidates.length} คน)</span>
            </button>

            <button
              onClick={() => setActiveTab("JOBS")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === "JOBS"
                  ? "bg-[#0a66c2] text-white shadow-xs"
                  : "bg-slate-50 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <span>📋</span>
              <span>ตำแหน่งงานที่เปิดรับ ({jobs.length} ตำแหน่ง)</span>
            </button>

            <button
              onClick={() => setActiveTab("POST_JOB")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === "POST_JOB"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-50 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <span>✏️</span>
              <span>สร้างประกาศใหม่</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-500 font-semibold px-2">
            บัญชีองค์กร: <strong className="text-slate-900">{session?.user?.name || "บมจ. เทคโนโลยีดีไลท์"}</strong>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: 🎯 TALENT MATCHING & CANDIDATE SEARCH                               */}
        {/* ========================================================================= */}
        {activeTab === "CANDIDATES" && (
          <div className="space-y-4 animate-in fade-in">
            {/* Search & Skill Filter Bar */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ค้นหาชื่อนักศึกษา, ทักษะที่ต้องการ (e.g. Next.js, DevSecOps, CCNA, Figma)..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0a66c2]"
                  />
                </div>

                {/* Skill Filter Badges */}
                <div className="flex items-center gap-1.5 flex-wrap shrink-0 text-xs">
                  <span className="text-[11px] font-bold text-slate-500">กรองทักษะ:</span>
                  {["ALL", "DevSecOps", "Next.js", "CCNA", "Figma", "Docker"].map((sk) => (
                    <button
                      key={sk}
                      onClick={() => setFilterSkill(sk)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition border ${
                        filterSkill === sk
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {sk === "ALL" ? "ทั้งหมด" : `#${sk}`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Candidate Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredCandidates.map((cand) => (
                <div
                  key={cand.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* Header with Avatar & Match Score */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={cand.avatar}
                          alt={cand.name}
                          className="w-12 h-12 rounded-full object-cover border border-slate-200 ring-2 ring-slate-100"
                        />
                        <div>
                          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1">
                            <span>{cand.name}</span>
                            <span className="text-[#057642] text-xs font-bold" title="ยืนยันตัวตนแล้ว">✓</span>
                          </h3>
                          <p className="text-[11px] text-slate-500 line-clamp-1">{cand.headline}</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-black shrink-0">
                        {cand.matchScore}% Match
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                      <span className="text-slate-500 text-[11px]">สมัครตำแหน่ง:</span>
                      <span className="font-bold text-slate-800 text-[11px] truncate max-w-[170px]">
                        {cand.appliedJob}
                      </span>
                    </div>

                    {/* Verified Skills */}
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">
                        ⚡ ทักษะที่ผ่านการรับรอง (Verified Skills):
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {cand.verifiedSkills.map((sk, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-blue-50 text-[#0a66c2] text-[10px] font-bold border border-blue-100"
                          >
                            ✓ {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Certifications */}
                    {cand.certs.length > 0 && (
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                          📜 ใบรับรองดิจิทัล (SHA-256):
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {cand.certs.map((c, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[10px] font-bold border border-purple-100"
                            >
                              🏆 {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                    <Link
                      href="/messaging"
                      className="flex-1 py-2 px-3 rounded-xl bg-[#0a66c2] hover:bg-[#004182] text-white text-xs font-bold transition text-center shadow-xs"
                    >
                      💬 นัดสัมภาษณ์งาน
                    </Link>
                    <Link
                      href={`/u/${cand.id}`}
                      className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition text-center"
                    >
                      ดูพอร์ต
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: 📋 MY JOB POSTINGS & APPLICANTS LIST                               */}
        {/* ========================================================================= */}
        {activeTab === "JOBS" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 animate-in fade-in">
            {/* Left 5 Cols: Job List */}
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">
                  ตำแหน่งที่เปิดรับสมัคร ({jobs.length})
                </h3>
                <button
                  onClick={() => setActiveTab("POST_JOB")}
                  className="text-xs text-[#0a66c2] font-bold hover:underline"
                >
                  + เพิ่มตำแหน่งงาน
                </button>
              </div>

              {jobs.map((job) => {
                const isSelected = selectedJob.id === job.id;
                return (
                  <div
                    key={job.id}
                    onClick={() => setSelectedJob(job)}
                    className={`p-4 rounded-2xl bg-white border transition cursor-pointer shadow-xs ${
                      isSelected
                        ? "border-[#0a66c2] ring-2 ring-blue-100"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 leading-snug">
                          {job.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">{job.company}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-black shrink-0">
                        {job.applicantsCount} ผู้สมัคร
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-2">
                      <span>📍 {job.location}</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-bold">{job.salary}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right 7 Cols: Selected Job Details & Applicants */}
            <div className="md:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900">
                      {selectedJob.title}
                    </h2>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {selectedJob.company} • {selectedJob.location} ({selectedJob.workplace})
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold shrink-0">
                    🟢 กำลังเปิดรับสมัคร
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500 mt-3">
                  <span>💰 ค่าตอบแทน: <strong className="text-slate-800">{selectedJob.salary}</strong></span>
                  <span>👥 จำนวนผู้สมัคร: <strong className="text-blue-600">{selectedJob.applicantsCount} คน</strong></span>
                </div>
              </div>

              {/* Job Requirements */}
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-slate-900">รายละเอียดและคุณสมบัติ:</h4>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">{selectedJob.description}</p>
                <ul className="list-disc pl-4 space-y-1 text-slate-600 pt-1">
                  {selectedJob.requirements.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons for Employer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  onClick={() => setActiveTab("CANDIDATES")}
                  className="px-4 py-2 rounded-xl bg-[#0a66c2] hover:bg-[#004182] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <span>👥 ดูรายชื่อผู้สมัครและคัดเลือก</span>
                </button>
                <button
                  onClick={() => alert("แก้ไขประกาศงานเรียบร้อย")}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition"
                >
                  ✏️ แก้ไขข้อมูลประกาศ
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: ➕ POST A NEW JOB / INTERNSHIP FORM                                */}
        {/* ========================================================================= */}
        {activeTab === "POST_JOB" && (
          <div className="max-w-2xl mx-auto bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5 animate-in fade-in">
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>➕</span>
                <span>สร้างประกาศรับสมัครงาน / สหกิจศึกษาใหม่</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                ประกาศจะแสดงในหน้าหางานของนักศึกษา มสด. และระบบจะจับคู่กับนักศึกษาที่มีทักษะตรงตามเกณฑ์อัตโนมัติ
              </p>
            </div>

            {postSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-2 animate-in fade-in">
                <span>✓</span>
                <span>บันทึกและเผยแพร่ประกาศรับสมัครงานเรียบร้อยแล้ว!</span>
              </div>
            )}

            <form onSubmit={handlePostJob} className="space-y-3.5 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ชื่อตำแหน่งงาน (Job Title) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="เช่น Junior DevSecOps Engineer / Full-Stack Developer"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0a66c2]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ประเภทงาน (Job Type)
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0a66c2]"
                  >
                    <option value="FULL_TIME">งานประจำ (Full-Time)</option>
                    <option value="INTERNSHIP">ฝึกงาน / สหกิจศึกษา (Internship)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ค่าตอบแทน / เบี้ยเลี้ยง (Salary)
                  </label>
                  <input
                    type="text"
                    value={newSalary}
                    onChange={(e) => setNewSalary(e.target.value)}
                    placeholder="เช่น ฿30,000 - ฿40,000 / เดือน"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0a66c2]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ทักษะที่ต้องการ (Required Skills) (คั่นด้วยจุลภาค)
                </label>
                <input
                  type="text"
                  value={newSkills}
                  onChange={(e) => setNewSkills(e.target.value)}
                  placeholder="เช่น Next.js, DevSecOps, CCNA, TypeScript"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0a66c2]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  รายละเอียดหน้าที่และความรับผิดชอบ (Description)
                </label>
                <textarea
                  rows={4}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="ระบุรายละเอียดงานและคุณสมบัติที่ต้องการ..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0a66c2]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("CANDIDATES")}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm"
                >
                  🚀 เผยแพร่ประกาศรับสมัครงาน
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
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

const SAMPLE_JOBS: JobOpening[] = [
  {
    id: "job-1",
    title: "Junior Full-Stack Web Developer (Next.js & TypeScript)",
    company: "Tech Innovation Hub (Thailand)",
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
    company: "SecureNet Defense Corp",
    logo: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=150&q=80",
    location: "กรุงเทพมหานคร (สาทร)",
    type: "INTERNSHIP",
    workplace: "On-site",
    salary: "฿15,000 - ฿18,000 / เดือน (เบี้ยเลี้ยง)",
    postedAt: "3 วันที่แล้ว",
    applicantsCount: 8,
    skills: ["Cyber Security", "Networking", "Python", "Problem Solving"],
    description: `เปิดรับสมัครนักศึกษาฝึกงานและสหกิจศึกษาเข้าร่วมทีม Security Operations Center (SOC) เพื่อเรียนรู้การเฝ้าระวัง ตรวจจับ และรับมือกับภัยคุกคามทางไซเบอร์ในสภาพแวดล้อมระบบจริงขององค์กรขนาดใหญ่`,
    requirements: [
      "นักศึกษาระดับปริญญาตรีชั้นปีที่ 3 หรือ 4 สาขาวิทยาการคอมพิวเตอร์ หรือความมั่นคงปลอดภัยไซเบอร์",
      "มีความรู้พื้นฐานด้าน TCP/IP, OSI Model, Firewall และ SIEM",
      "สามารถวิเคราะห์ Log และมีใจรักในการเรียนรู้เทคโนโลยีใหม่ๆ",
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
    company: "Creative Pulse Studio",
    logo: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=150&q=80",
    location: "กรุงเทพมหานคร (สุขุมวิท)",
    type: "FULL_TIME",
    workplace: "Hybrid",
    salary: "฿28,000 - ฿38,000 / เดือน",
    postedAt: "5 วันที่แล้ว",
    applicantsCount: 22,
    skills: ["Figma", "UI/UX", "Design Systems", "Communication"],
    description: `ร่วมงานกับสตูดิโอด้านการออกแบบดิจิทัล ออกแบบ User Experience และ User Interface สำหรับ Web & Mobile Application ของลูกค้าแบรนด์ชั้นนำ`,
    requirements: [
      "มีความเชี่ยวชาญในการใช้ Figma และการสร้าง Design System",
      "มีแฟ้มสะสมผลงาน (Portfolio) ด้าน UI/UX ที่ชัดเจน",
      "มีทักษะการสื่อสารและการทำงานเป็นทีมที่ดี",
    ],
    benefits: [
      "MacBook Pro ประจำตำแหน่ง",
      "ทำงานแบบ Hybrid (WFH 3 วัน)",
      "โบนัสประจำปีตามผลประกอบการ",
    ],
    isEasyApply: true,
  },
  {
    id: "job-4",
    title: "Cloud & DevOps Associate Engineer",
    company: "CloudVantage Enterprise",
    logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=150&q=80",
    location: "กรุงเทพมหานคร (พระราม 9)",
    type: "FULL_TIME",
    workplace: "Remote",
    salary: "฿35,000 - ฿50,000 / เดือน",
    postedAt: "1 สัปดาห์ที่แล้ว",
    applicantsCount: 19,
    skills: ["Cloud", "Docker", "Linux", "Node.js"],
    description: `ดูแลและพัฒนาโครงสร้างพื้นฐานระบบ Cloud Infrastructure (AWS / GCP) พร้อมวางระบบ CI/CD Pipeline และ Monitoring สำหรับบริการออนไลน์ขนาดใหญ่`,
    requirements: [
      "มีความเข้าใจใน Linux, Container (Docker) และ Cloud Fundamentals",
      "มีทักษะการเขียนสคริปต์อัตโนมัติ (Bash, Python หรือ Node.js)",
      "ผ่านการอบรมหรือมีใบรับรอง Cloud จะได้รับการพิจารณาเป็นพิเศษ",
    ],
    benefits: [
      "ทำงานแบบ 100% Remote (ทำงานจากที่ใดก็ได้)",
      "งบจัดโต๊ะทำงาน Home Office ฿15,000",
      "ประกันสุขภาพครอบคลุมครอบครัว",
    ],
    isEasyApply: false,
  },
];

export default function JobsPage() {
  const { data: session } = useSession();
  const [jobs, setJobs] = useState<JobOpening[]>(SAMPLE_JOBS);
  const [selectedJob, setSelectedJob] = useState<JobOpening>(SAMPLE_JOBS[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("ALL");
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  // Recruiter Candidate Match Engine state (for employer mode)
  const [viewMode, setViewMode] = useState<"JOB_BOARD" | "RECRUITER_MATCH">("JOB_BOARD");
  const [matchSkill, setMatchSkill] = useState("React");
  const [candidates, setCandidates] = useState<any[]>([
    {
      id: "mock-somchai",
      name: "สมชาย ยอดนักโค้ด",
      headline: "Full-Stack Developer | Next.js, TypeScript & Cloud",
      matchScore: 98,
      verifiedSkills: ["React (ระดับ 5)", "Next.js (ระดับ 5)", "TypeScript (ระดับ 5)"],
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    },
    {
      id: "mock-saifah",
      name: "สายฟ้า แฮกเกอร์",
      headline: "Cybersecurity Analyst | Penetration Testing & SOC",
      matchScore: 85,
      verifiedSkills: ["Cyber Security (ระดับ 5)", "Python (ระดับ 4)"],
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    },
    {
      id: "mock-jane",
      name: "เจนจิรา ดีไซเนอร์",
      headline: "Product & UI/UX Designer | Design Systems",
      matchScore: 78,
      verifiedSkills: ["Figma (ระดับ 5)", "UI/UX Design (ระดับ 5)"],
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    },
  ]);

  const filteredJobs = jobs.filter((j) => {
    const matchesSearch =
      searchQuery === "" ||
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType =
      filterType === "ALL" ||
      (filterType === "INTERNSHIP" && j.type === "INTERNSHIP") ||
      (filterType === "FULL_TIME" && j.type === "FULL_TIME") ||
      (filterType === "REMOTE" && j.workplace === "Remote");

    return matchesSearch && matchesType;
  });

  const handleApply = (jobId: string) => {
    if (!appliedJobIds.includes(jobId)) {
      setAppliedJobIds([...appliedJobIds, jobId]);
    }
    setApplySuccess(true);
    setTimeout(() => {
      setIsApplyModalOpen(false);
      setApplySuccess(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f4f2ee] pt-[85px] px-4 pb-16">
      <div className="max-w-[1128px] mx-auto space-y-4">
        
        {/* TOP SEARCH & CONTROLS BAR */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาตำแหน่งงาน, ทักษะ, หรือบริษัทพันธมิตร..."
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0a66c2] transition"
              />
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setViewMode("JOB_BOARD")}
                className={`px-4 py-2 rounded-full text-xs font-bold transition shadow-sm ${
                  viewMode === "JOB_BOARD"
                    ? "bg-[#0a66c2] text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                💼 ค้นหาตำแหน่งงาน
              </button>
              <button
                onClick={() => setViewMode("RECRUITER_MATCH")}
                className={`px-4 py-2 rounded-full text-xs font-bold transition shadow-sm ${
                  viewMode === "RECRUITER_MATCH"
                    ? "bg-[#047857] text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                🔍 สำหรับนายจ้าง (AI Match)
              </button>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2 flex-wrap text-xs pt-1 border-t border-slate-100">
            <span className="text-slate-500 font-bold mr-1">ตัวกรอง:</span>
            {[
              { id: "ALL", label: "ทั้งหมด" },
              { id: "INTERNSHIP", label: "🎓 ฝึกงาน / สหกิจศึกษา" },
              { id: "FULL_TIME", label: "🏢 งานประจำ (Full-Time)" },
              { id: "REMOTE", label: "🏠 ทำงานจากบ้าน (Remote)" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`px-3 py-1 rounded-full font-bold transition border ${
                  filterType === f.id
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* ================= VIEW 1: JOB BOARD & DETAILS SPLIT VIEW ================= */}
        {viewMode === "JOB_BOARD" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* Left Sidebar (3 Cols) */}
            <aside className="lg:col-span-3 space-y-3">
              
              {/* Quick Actions Card */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3 text-xs font-bold text-slate-700">
                <Link href="/employer" className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 text-slate-900">
                  <span className="text-base">🔖</span>
                  <span>งานที่บันทึกไว้ ({appliedJobIds.length})</span>
                </Link>
                <Link href="/skills" className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 text-slate-900">
                  <span className="text-base">⚡</span>
                  <span>ทดสอบและรับรองทักษะ</span>
                </Link>
                <Link href="/resume" className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 text-slate-900">
                  <span className="text-base">📄</span>
                  <span>สร้างและดูเรซูเม่ (Resume)</span>
                </Link>
              </div>

              {/* Verified SDU Partner Badge */}
              <div className="bg-gradient-to-br from-[#002d62] to-[#0a66c2] rounded-2xl p-4 text-white shadow-sm space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🏛️</span>
                  <h4 className="text-xs font-extrabold">เครือข่ายพันธมิตร มสด.</h4>
                </div>
                <p className="text-[11px] text-blue-100 leading-relaxed font-medium">
                  ตำแหน่งงานทั้งหมดผ่านการรับรองและเชื่อมโยงกับมาตรฐานทักษะดิจิทัลของมหาวิทยาลัยสวนดุสิตโดยตรง
                </p>
              </div>

            </aside>

            {/* Center Column: Job Cards List (4 Cols) */}
            <main className="lg:col-span-4 space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-sm font-extrabold text-slate-900">
                  ตำแหน่งงานแนะนำ ({filteredJobs.length})
                </h2>
                <span className="text-xs text-slate-500 font-semibold">เรียงตามล่าสุด</span>
              </div>

              {filteredJobs.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500 text-xs">
                  ไม่พบตำแหน่งงานที่ตรงกับการค้นหา
                </div>
              ) : (
                filteredJobs.map((job) => {
                  const isSelected = selectedJob.id === job.id;
                  const isApplied = appliedJobIds.includes(job.id);

                  return (
                    <div
                      key={job.id}
                      onClick={() => setSelectedJob(job)}
                      className={`p-4 rounded-2xl border transition cursor-pointer space-y-2.5 ${
                        isSelected
                          ? "bg-white border-[#0a66c2] shadow-md ring-2 ring-blue-100"
                          : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={job.logo}
                          alt={job.company}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xs font-extrabold text-slate-900 line-clamp-1 hover:text-[#0a66c2]">
                            {job.title}
                          </h3>
                          <p className="text-[11px] text-slate-600 font-semibold">{job.company}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">{job.location} • ({job.workplace})</p>
                        </div>
                      </div>

                      {/* Required Skills Badges */}
                      <div className="flex flex-wrap gap-1">
                        {job.skills.map((sk) => (
                          <span
                            key={sk}
                            className="px-2 py-0.5 rounded-md bg-blue-50 text-[#0a66c2] border border-blue-200 text-[10px] font-bold"
                          >
                            ✓ {sk}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] font-semibold text-slate-500">
                        <span>{job.salary}</span>
                        {isApplied ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            ✓ สมัครแล้ว
                          </span>
                        ) : (
                          <span className="text-slate-400">{job.postedAt}</span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </main>

            {/* Right Column: Selected Job Details View (5 Cols) */}
            <aside className="lg:col-span-5">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm sticky top-[85px] space-y-5">
                
                {/* Header */}
                <div className="space-y-3 border-b border-slate-100 pb-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={selectedJob.logo}
                        alt={selectedJob.company}
                        className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
                      />
                      <div>
                        <h2 className="text-base font-extrabold text-slate-900 leading-tight">
                          {selectedJob.title}
                        </h2>
                        <p className="text-xs font-bold text-[#0a66c2] mt-0.5">{selectedJob.company}</p>
                        <p className="text-[11px] text-slate-500 font-medium">
                          {selectedJob.location} • {selectedJob.workplace} • ประกาศเมื่อ {selectedJob.postedAt}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs font-bold pt-1">
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                      💰 {selectedJob.salary}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      👥 ผู้สมัคร {selectedJob.applicantsCount} คน
                    </span>
                  </div>

                  {/* Apply Button */}
                  <div className="pt-2 flex gap-2">
                    {appliedJobIds.includes(selectedJob.id) ? (
                      <button
                        disabled
                        className="flex-1 py-2.5 px-4 bg-emerald-100 text-emerald-800 rounded-full text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-default"
                      >
                        <span>✓</span> คุณได้สมัครตำแหน่งนี้แล้ว
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsApplyModalOpen(true)}
                        className="flex-1 py-2.5 px-4 bg-[#0a66c2] hover:bg-[#004182] text-white rounded-full text-xs font-extrabold transition shadow-sm flex items-center justify-center gap-1.5"
                      >
                        <span>⚡</span> สมัครด่วนด้วย Digital Passport (Easy Apply)
                      </button>
                    )}
                  </div>
                </div>

                {/* Job Description */}
                <div className="space-y-2 text-xs">
                  <h3 className="font-extrabold text-slate-900 text-sm">รายละเอียดงาน</h3>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-line font-normal">
                    {selectedJob.description}
                  </p>
                </div>

                {/* Qualifications */}
                <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
                  <h3 className="font-extrabold text-slate-900 text-sm">คุณสมบัติที่ต้องการ</h3>
                  <ul className="space-y-1.5 list-disc list-inside text-slate-700 font-normal">
                    {selectedJob.requirements.map((req, idx) => (
                      <li key={idx} className="leading-relaxed">{req}</li>
                    ))}
                  </ul>
                </div>

                {/* Benefits */}
                <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
                  <h3 className="font-extrabold text-slate-900 text-sm">สิทธิประโยชน์และสวัสดิการ</h3>
                  <ul className="space-y-1.5 list-disc list-inside text-slate-700 font-normal">
                    {selectedJob.benefits.map((b, idx) => (
                      <li key={idx} className="leading-relaxed">{b}</li>
                    ))}
                  </ul>
                </div>

              </div>
            </aside>

          </div>
        )}

        {/* ================= VIEW 2: RECRUITER TALENT MATCHING ENGINE ================= */}
        {viewMode === "RECRUITER_MATCH" && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-extrabold border border-emerald-200">
                  🎯 สำหรับฝ่ายบุคคล (Recruiters & HR)
                </span>
                <h2 className="text-2xl font-black text-slate-900 mt-2">
                  ระบบจับคู่และคัดกรองผู้สมัครตามสมรรถนะทักษะ (Skill Match AI)
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  ค้นหานักศึกษาและบัณฑิตที่มีทักษะตรงตามความต้องการขององค์กร พร้อมการรับรองมาตรฐานจากมหาวิทยาลัย
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600">ทักษะที่ต้องการ:</span>
                <select
                  value={matchSkill}
                  onChange={(e) => setMatchSkill(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#047857]"
                >
                  <option value="React">React & Next.js</option>
                  <option value="Cyber Security">Cyber Security & SOC</option>
                  <option value="Figma">UI/UX & Figma</option>
                </select>
              </div>
            </div>

            {/* Candidates Table / Grid */}
            <div className="space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900">
                ผู้สมัครที่มีความพร้อมสูงสุดสำหรับ "{matchSkill}" ({candidates.length} รายชื่อ)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {candidates.map((cand) => (
                  <div
                    key={cand.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-emerald-300 hover:shadow-md transition space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <img
                          src={cand.avatar}
                          alt={cand.name}
                          className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500 shadow-sm"
                        />
                        <div className="text-right">
                          <span className="text-2xl font-black text-emerald-700">{cand.matchScore}%</span>
                          <p className="text-[10px] text-slate-500 font-bold uppercase">ความตรงตามสเปก</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{cand.name}</h4>
                        <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{cand.headline}</p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-[11px] font-bold text-slate-700">ทักษะที่ผ่านการรับรอง:</p>
                        <div className="flex flex-wrap gap-1">
                          {cand.verifiedSkills.map((sk: string, idx: number) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[10px] font-bold"
                            >
                              ✓ {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex gap-2">
                      <Link
                        href={`/u/${cand.id}`}
                        className="flex-1 py-2 text-center rounded-full bg-[#0a66c2] hover:bg-[#004182] text-white text-xs font-bold transition shadow-sm"
                      >
                        ดูโปรไฟล์
                      </Link>
                      <button
                        onClick={() => alert(`ส่งคำเชิญสัมภาษณ์ไปยัง ${cand.name} เรียบร้อยแล้ว!`)}
                        className="px-3 py-2 rounded-full border border-slate-300 hover:bg-slate-200 text-slate-800 text-xs font-bold transition"
                      >
                        ✉️ ติดต่อ
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* EASY APPLY MODAL POPUP */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  สมัครงาน: {selectedJob.title}
                </h3>
                <p className="text-xs text-slate-600 font-semibold">{selectedJob.company}</p>
              </div>
              <button
                onClick={() => setIsApplyModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {applySuccess ? (
              <div className="text-center py-6 space-y-3">
                <span className="text-5xl">🎉</span>
                <h4 className="text-lg font-bold text-emerald-700">ยื่นใบสมัครสำเร็จเรียบร้อย!</h4>
                <p className="text-xs text-slate-600">
                  ข้อมูล Digital Passport และทักษะที่ได้รับการรับรองของคุณถูกส่งไปยังฝ่ายบุคคลแล้ว
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <p className="font-bold text-slate-900">ข้อมูลที่จะแนบส่งให้บริษัท:</p>
                  <ul className="space-y-1 text-slate-600">
                    <li>✓ ข้อมูลประวัติและช่องทางติดต่อ</li>
                    <li>✓ ทักษะที่ได้รับการรับรองจากมหาวิทยาลัยสวนดุสิต</li>
                    <li>✓ ผลงานเด่นและโปรเจกต์จาก GitHub</li>
                  </ul>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setIsApplyModalOpen(false)}
                    className="flex-1 py-2.5 rounded-full border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition"
                  >
                    ยกเลิก
                  </button>
                  <button
                    onClick={() => handleApply(selectedJob.id)}
                    className="flex-1 py-2.5 rounded-full bg-[#0a66c2] hover:bg-[#004182] text-white font-bold text-xs transition shadow-sm"
                  >
                    ยืนยันการส่งใบสมัคร 🚀
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

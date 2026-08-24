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

export default function StudentJobsPage() {
  const { data: session } = useSession();
  const [jobs] = useState<JobOpening[]>(SAMPLE_JOBS);
  const [selectedJob, setSelectedJob] = useState<JobOpening>(SAMPLE_JOBS[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("ALL");
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

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
        
        {/* TOP SEARCH & FILTER BAR */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาตำแหน่งงาน, สหกิจศึกษา, ทักษะ (e.g. Next.js, Cyber Security, CCNA)..."
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0a66c2] transition"
              />
            </div>

            <button
              onClick={() => setSearchQuery("")}
              className="px-4 py-2.5 bg-[#0a66c2] hover:bg-[#004182] text-white text-xs font-bold rounded-xl transition shadow-xs shrink-0"
            >
              🔍 ค้นหาตำแหน่งงาน
            </button>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2 flex-wrap text-xs pt-1 border-t border-slate-100">
            <span className="text-slate-500 font-bold mr-1">ตัวกรอง:</span>
            {[
              { id: "ALL", label: "ทั้งหมด" },
              { id: "INTERNSHIP", label: "🎓 ฝึกงาน / สหกิจศึกษา" },
              { id: "FULL_TIME", label: "💼 งานประจำ (Full-Time)" },
              { id: "REMOTE", label: "🏠 ทำงานจากบ้าน (Remote)" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-3 py-1.5 rounded-full font-bold transition border ${
                  filterType === tab.id
                    ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2-COLUMN MAIN CONTENT CONTAINER */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          
          {/* Left Column: Job Cards List (5 Cols) */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center justify-between px-1 text-xs text-slate-500 font-bold">
              <span>ตำแหน่งงานแนะนำ ({filteredJobs.length})</span>
              <span>เรียงตาม: ล่าสุด ▾</span>
            </div>

            {filteredJobs.map((job) => {
              const isSelected = selectedJob.id === job.id;
              const hasApplied = appliedJobIds.includes(job.id);

              return (
                <div
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className={`p-4 rounded-2xl bg-white border transition cursor-pointer shadow-xs ${
                    isSelected
                      ? "border-[#0a66c2] ring-2 ring-blue-100 bg-blue-50/20"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={job.logo}
                      alt={job.company}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug truncate hover:text-[#0a66c2]">
                        {job.title}
                      </h3>
                      <p className="text-xs text-slate-600 truncate mt-0.5 font-medium">{job.company}</p>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {job.location} ({job.workplace})
                      </p>

                      <div className="flex flex-wrap gap-1 mt-2">
                        {job.skills.slice(0, 3).map((s, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold"
                          >
                            ✓ {s}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 text-xs">
                        <span className="font-bold text-emerald-700">{job.salary}</span>
                        <span className="text-[10px] text-slate-400">{job.postedAt}</span>
                      </div>

                      {hasApplied && (
                        <div className="mt-2 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg flex items-center gap-1">
                          <span>✓</span> สมัครแล้วด้วย SkillPassport
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Selected Job Details (7 Cols) */}
          <div className="md:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-start gap-4">
                <img
                  src={selectedJob.logo}
                  alt={selectedJob.company}
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0"
                />
                <div className="flex-1">
                  <h2 className="text-base sm:text-lg font-extrabold text-slate-900 leading-tight">
                    {selectedJob.title}
                  </h2>
                  <p className="text-xs text-slate-600 mt-1 font-semibold">
                    {selectedJob.company} • {selectedJob.location} ({selectedJob.workplace})
                  </p>
                  <p className="text-xs font-bold text-emerald-700 mt-2 bg-emerald-50 inline-block px-2.5 py-1 rounded-lg">
                    💰 {selectedJob.salary}
                  </p>
                </div>
              </div>

              {/* Apply Button */}
              <div className="mt-4 flex items-center gap-3">
                {appliedJobIds.includes(selectedJob.id) ? (
                  <button
                    disabled
                    className="px-6 py-2.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5 shadow-2xs"
                  >
                    <span>✓</span>
                    <span>ยื่นใบสมัครเรียบร้อยแล้ว</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsApplyModalOpen(true)}
                    className="px-6 py-2.5 rounded-full bg-[#0a66c2] hover:bg-[#004182] text-white text-xs font-bold transition shadow-sm flex items-center gap-1.5"
                  >
                    <span>⚡ สมัครด่วนด้วย SkillPassport</span>
                  </button>
                )}

                <button
                  onClick={() => alert("บันทึกตำแหน่งงานไว้ในรายการโปรดเรียบร้อย")}
                  className="px-4 py-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition"
                >
                  🔖 บันทึกงาน
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3 text-xs">
              <h4 className="font-extrabold text-slate-900 text-sm">รายละเอียดงาน (Job Description):</h4>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">{selectedJob.description}</p>
            </div>

            {/* Requirements */}
            <div className="space-y-2 text-xs">
              <h4 className="font-extrabold text-slate-900 text-sm">คุณสมบัติที่ต้องการ (Requirements):</h4>
              <ul className="list-disc pl-4 space-y-1.5 text-slate-600">
                {selectedJob.requirements.map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            </div>

            {/* Required Skills */}
            <div>
              <h4 className="font-extrabold text-slate-900 text-xs mb-2">ทักษะที่เกี่ยวข้อง:</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedJob.skills.map((sk, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-blue-50 text-[#0a66c2] text-xs font-bold border border-blue-100"
                  >
                    ✓ {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-2 text-xs pt-2 border-t border-slate-100">
              <h4 className="font-extrabold text-slate-900 text-xs">สวัสดิการ (Benefits):</h4>
              <ul className="list-disc pl-4 space-y-1 text-slate-600">
                {selectedJob.benefits.map((b, idx) => (
                  <li key={idx}>{b}</li>
                ))}
              </ul>
            </div>

          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* ⚡ EASY APPLY MODAL                                                       */}
      {/* ========================================================================= */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  สมัครงาน: {selectedJob.title}
                </h3>
                <p className="text-xs text-slate-500">{selectedJob.company}</p>
              </div>
              <button
                onClick={() => setIsApplyModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {applySuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-2xl mx-auto">
                  ✓
                </div>
                <h4 className="text-base font-extrabold text-slate-900">ยื่นใบสมัครสำเร็จ!</h4>
                <p className="text-xs text-slate-600">
                  ระบบได้ส่งพอร์ตโฟลิโอและ Digital SkillPassport ของคุณไปยัง HR บมจ. เทคโนโลยีดีไลท์ เรียบร้อยแล้ว
                </p>
              </div>
            ) : (
              <div className="space-y-3.5 text-xs">
                <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 text-blue-900 space-y-1">
                  <p className="font-bold">📄 ข้อมูลที่จะแนบส่งไปยังผู้ประกอบการ:</p>
                  <p className="text-[11px] text-blue-700">
                    • พอร์ตโฟลิโอและโปรเจกต์จาก GitHub<br />
                    • ทักษะที่ได้รับการรับรองจากอาจารย์ มสด.<br />
                    • ใบรับรองดิจิทัล SHA-256 (CCNA, CompTIA Security+, CEH)
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    ผู้สมัคร: <strong className="text-slate-900">{session?.user?.name || "นักศึกษา ทดสอบ"}</strong>
                  </label>
                  <p className="text-slate-500 text-[11px]">อีเมลติดต่อ: {session?.user?.email || "test@example.com"}</p>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    onClick={() => setIsApplyModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold"
                  >
                    ยกเลิก
                  </button>
                  <button
                    onClick={() => handleApply(selectedJob.id)}
                    className="px-5 py-2 rounded-xl bg-[#0a66c2] hover:bg-[#004182] text-white font-bold transition shadow-sm"
                  >
                    🚀 ยืนยันการยื่นใบสมัคร
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

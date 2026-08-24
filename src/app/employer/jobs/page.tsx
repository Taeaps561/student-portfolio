"use client";

import { useState } from "react";
import Link from "next/link";

interface JobPosting {
  id: string;
  title: string;
  department: string;
  type: string;
  location: string;
  salary: string;
  status: "OPEN" | "CLOSED";
  applicantsCount: number;
  verifiedApplicantsCount: number;
  requiredSkills: string[];
  description: string;
  createdAt: string;
}

const INITIAL_JOBS: JobPosting[] = [
  {
    id: "job-1",
    title: "Full-Stack Developer (Next.js & TypeScript)",
    department: "Software Engineering",
    type: "งานประจำ / สหกิจศึกษา",
    location: "กรุงเทพมหานคร (Hybrid)",
    salary: "฿28,000 - ฿42,000",
    status: "OPEN",
    applicantsCount: 3,
    verifiedApplicantsCount: 3,
    requiredSkills: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    description: "ร่วมพัฒนา Enterprise Web Platform ด้วย Next.js App Router, Tailwind CSS และ Prisma ORM",
    createdAt: "3 วันที่แล้ว",
  },
  {
    id: "job-2",
    title: "Cybersecurity SOC Analyst",
    department: "Information Security",
    type: "งานประจำ",
    location: "กรุงเทพมหานคร (On-site)",
    salary: "฿32,000 - ฿48,000",
    status: "OPEN",
    applicantsCount: 2,
    verifiedApplicantsCount: 2,
    requiredSkills: ["Cyber Security", "Python", "Networking", "Log Analysis"],
    description: "วิเคราะห์และเฝ้าระวังเหตุการณ์ความมั่นคงปลอดภัยสารสนเทศใน Security Operations Center",
    createdAt: "5 วันที่แล้ว",
  },
  {
    id: "job-3",
    title: "UI/UX Product Designer",
    department: "Product & Design",
    type: "ฝึกงาน / สหกิจศึกษา",
    location: "กรุงเทพมหานคร (Remote)",
    salary: "฿12,000 - ฿18,000",
    status: "OPEN",
    applicantsCount: 2,
    verifiedApplicantsCount: 2,
    requiredSkills: ["Figma", "UI/UX", "Design Systems"],
    description: "ออกแบบประสบการณ์ผู้ใช้ (UX) และหน้าจอสัมผัส (UI) สำหรับผลิตภัณฑ์โมบายล์และเว็บแอป",
    createdAt: "1 สัปดาห์ที่แล้ว",
  },
];

const APPLICANTS_MOCK = [
  {
    id: "app-1",
    jobId: "job-1",
    studentId: "cmqgc491d0000xnpb4k7jc8as",
    name: "นักศึกษา ทดสอบ",
    major: "สาขาวิทยาการคอมพิวเตอร์ มหาวิทยาลัยสวนดุสิต",
    avatar: "https://ui-avatars.com/api/?name=Student+Test&background=0a66c2&color=fff",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    verifiedSkillsCount: 4,
    matchScore: 98,
    appliedDate: "วันนี้ 10:30",
    status: "REVIEWING",
  },
  {
    id: "app-2",
    jobId: "job-1",
    studentId: "mock-somchai",
    name: "สมชาย ยอดนักโค้ด",
    major: "สาขาวิทยาการคอมพิวเตอร์ มหาวิทยาลัยสวนดุสิต",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    skills: ["React", "Next.js", "TypeScript", "Node.js"],
    verifiedSkillsCount: 4,
    matchScore: 94,
    appliedDate: "วันนี้ 09:15",
    status: "INTERVIEW_CALLED",
  },
  {
    id: "app-3",
    jobId: "job-1",
    studentId: "mock-theeradech",
    name: "ธีรเดช คลาวด์เดฟ",
    major: "สาขาวิทยาการคอมพิวเตอร์ มหาวิทยาลัยสวนดุสิต",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    skills: ["Docker", "Kubernetes", "Linux Server"],
    verifiedSkillsCount: 3,
    matchScore: 90,
    appliedDate: "เมื่อวาน 16:45",
    status: "REVIEWING",
  },
  {
    id: "app-4",
    jobId: "job-2",
    studentId: "mock-saifah",
    name: "สายฟ้า แฮกเกอร์",
    major: "สาขาวิทยาการคอมพิวเตอร์ มหาวิทยาลัยสวนดุสิต",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    skills: ["Cyber Security", "Python", "Networking"],
    verifiedSkillsCount: 3,
    matchScore: 96,
    appliedDate: "เมื่อวาน 15:20",
    status: "INTERVIEW_CALLED",
  },
  {
    id: "app-5",
    jobId: "job-2",
    studentId: "mock-piyawat",
    name: "ปิยวัฒน์ ซอฟต์แวร์",
    major: "สาขาวิทยาการคอมพิวเตอร์ มหาวิทยาลัยสวนดุสิต",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80",
    skills: ["React Native", "TypeScript", "REST API"],
    verifiedSkillsCount: 3,
    matchScore: 89,
    appliedDate: "2 วันที่แล้ว",
    status: "REVIEWING",
  },
  {
    id: "app-6",
    jobId: "job-3",
    studentId: "mock-jane",
    name: "เจนจิรา ดีไซเนอร์",
    major: "สาขาวิทยาการคอมพิวเตอร์ มหาวิทยาลัยสวนดุสิต",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
    skills: ["Figma", "UI/UX", "Design Systems"],
    verifiedSkillsCount: 3,
    matchScore: 96,
    appliedDate: "2 วันที่แล้ว",
    status: "ACCEPTED",
  },
  {
    id: "app-7",
    jobId: "job-3",
    studentId: "mock-karnpitcha",
    name: "กานต์พิชชา ดาต้าไซน์",
    major: "สาขาวิทยาการคอมพิวเตอร์ มหาวิทยาลัยสวนดุสิต",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
    skills: ["Python", "SQL & Analytics", "PowerBI"],
    verifiedSkillsCount: 3,
    matchScore: 91,
    appliedDate: "3 วันที่แล้ว",
    status: "REVIEWING",
  },
];

export default function EmployerJobsPage() {
  const [jobs, setJobs] = useState<JobPosting[]>(INITIAL_JOBS);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(INITIAL_JOBS[0]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState("งานประจำ / สหกิจศึกษา");
  const [newSalary, setNewSalary] = useState("฿25,000 - ฿35,000");
  const [newSkills, setNewSkills] = useState("React, Next.js, TypeScript");
  const [newDesc, setNewDesc] = useState("");
  const [successToast, setSuccessToast] = useState("");

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created: JobPosting = {
      id: "job-" + Date.now(),
      title: newTitle.trim(),
      department: "Software & Technology",
      type: newType,
      location: "กรุงเทพมหานคร (Hybrid)",
      salary: newSalary,
      status: "OPEN",
      applicantsCount: 0,
      verifiedApplicantsCount: 0,
      requiredSkills: newSkills.split(",").map((s) => s.trim()).filter(Boolean),
      description: newDesc || "ร่วมงานกับทีมพัฒนาเทคโนโลยีสารสนเทศ มหาวิทยาลัยสวนดุสิต พันธมิตรองค์กร",
      createdAt: "เมื่อสักครู่",
    };

    setJobs([created, ...jobs]);
    setSelectedJob(created);
    setIsCreateModalOpen(false);
    setNewTitle("");
    setNewDesc("");
    setSuccessToast("สร้างและเผยแพร่ตำแหน่งงานใหม่เรียบร้อยแล้ว ✓");
    setTimeout(() => setSuccessToast(""), 3500);
  };

  const jobApplicants = APPLICANTS_MOCK.filter(
    (a) => !selectedJob || a.jobId === selectedJob.id || a.skills.some(s => selectedJob.requiredSkills.includes(s))
  );

  return (
    <div className="min-h-screen bg-[#f4f2ee] pt-[85px] px-4 pb-16">
      <div className="max-w-[1128px] mx-auto space-y-5">
        
        {/* TOAST */}
        {successToast && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl shadow-xs animate-in fade-in">
            {successToast}
          </div>
        )}

        {/* HEADER */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
              🏢 บมจ. เทคโนโลยีดีไลท์ (Employer Portal)
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              จัดการตำแหน่งงานและใบสมัคร (Job Openings & Applicants)
            </h1>
            <p className="text-xs text-slate-600 font-medium">
              ประกาศรับสมัครงาน สหกิจศึกษา และคัดเลือกนักศึกษาที่มีทักษะตรงตามมาตรฐาน มสด.
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-5 py-2.5 rounded-full bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold transition shadow-sm flex items-center gap-2 whitespace-nowrap"
          >
            <span>+</span>
            <span>ประกาศงานใหม่</span>
          </button>
        </div>

        {/* CREATE JOB MODAL */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-extrabold text-slate-900">
                  + สร้างประกาศรับสมัครงานใหม่
                </h3>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateJob} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ชื่อตำแหน่งงาน *</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="เช่น Full-Stack Developer, DevOps, Data Analyst..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 font-medium"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">ประเภทการจ้าง</label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 font-medium"
                    >
                      <option>งานประจำ / สหกิจศึกษา</option>
                      <option>งานประจำ (Full-time)</option>
                      <option>ฝึกงาน / สหกิจศึกษา (Internship)</option>
                      <option>สัญญาจ้าง (Contract)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">อัตราเงินเดือน / ค่าตอบแทน</label>
                    <input
                      type="text"
                      value={newSalary}
                      onChange={(e) => setNewSalary(e.target.value)}
                      placeholder="฿25,000 - ฿35,000"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">ทักษะที่ต้องการ (คั่นด้วยจุลภาค) *</label>
                  <input
                    type="text"
                    value={newSkills}
                    onChange={(e) => setNewSkills(e.target.value)}
                    placeholder="React, Next.js, TypeScript, Cloud"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">รายละเอียดงาน & คุณสมบัติ</label>
                  <textarea
                    rows={3}
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="ระบุหน้าที่ความรับผิดชอบ และคุณสมบัติที่คาดหวัง..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 font-medium"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 rounded-full border border-slate-300 text-slate-700 font-bold hover:bg-slate-50"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-[#059669] hover:bg-[#047857] text-white font-bold shadow-xs"
                  >
                    เผยแพร่ประกาศงาน ✓
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 2-PANE SPLIT VIEW (JOBS LIST & APPLICANTS VIEW) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Left Column: Job Postings List (5.5 Cols) */}
          <div className="lg:col-span-5 space-y-3">
            <h2 className="text-sm font-extrabold text-slate-900 px-1">
              ตำแหน่งงานที่เปิดรับ ({jobs.length})
            </h2>

            <div className="space-y-3">
              {jobs.map((j) => {
                const isSelected = selectedJob?.id === j.id;
                return (
                  <div
                    key={j.id}
                    onClick={() => setSelectedJob(j)}
                    className={`p-4 rounded-2xl border transition cursor-pointer shadow-sm bg-white space-y-2.5 ${
                      isSelected
                        ? "border-[#059669] ring-2 ring-[#059669]/20"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                          {j.department}
                        </span>
                        <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 mt-1">
                          {j.title}
                        </h3>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold shrink-0">
                        {j.status}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 font-medium">
                      {j.type} • {j.location} • <strong className="text-emerald-700">{j.salary}</strong>
                    </p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {j.requiredSkills.map((sk, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-slate-700 text-[10px] font-semibold">
                          ✓ {sk}
                        </span>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">{j.createdAt}</span>
                      <span className="text-[#0a66c2] font-bold">
                        👥 {j.applicantsCount} ผู้สมัคร ({j.verifiedApplicantsCount} ผ่านการรับรอง)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Job Applicants Detail (6.5 Cols) */}
          <div className="lg:col-span-7 space-y-3">
            {selectedJob ? (
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-5">
                
                {/* Header of Selected Job */}
                <div className="border-b border-slate-100 pb-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-emerald-700 font-bold">
                      รายละเอียดและรายชื่อผู้สมัคร
                    </span>
                    <Link
                      href="/employer/matching"
                      className="px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
                    >
                      AI Match ผู้สมัครตรงสเปก 🎯
                    </Link>
                  </div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900">
                    {selectedJob.title}
                  </h2>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    {selectedJob.description}
                  </p>
                </div>

                {/* Applicants List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-extrabold text-slate-900">
                      รายชื่อนักศึกษาที่สมัคร ({jobApplicants.length})
                    </h3>
                    <span className="text-[11px] text-slate-500">เรียงตามความตรงกับทักษะ</span>
                  </div>

                  {jobApplicants.map((app) => (
                    <div
                      key={app.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={app.avatar}
                            alt={app.name}
                            className="w-11 h-11 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <Link
                              href={`/u/${app.studentId}`}
                              className="text-xs font-bold text-slate-900 hover:text-[#0a66c2] hover:underline flex items-center gap-1.5"
                            >
                              <span>{app.name}</span>
                              <span className="text-[#057642] text-xs font-bold">✓</span>
                            </Link>
                            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                              {app.major}
                            </p>
                          </div>
                        </div>

                        {/* Match Badge */}
                        <div className="text-right">
                          <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
                            {app.matchScore}% Match
                          </span>
                          <p className="text-[10px] text-slate-400 mt-0.5">{app.appliedDate}</p>
                        </div>
                      </div>

                      {/* Verified Skills */}
                      <div className="flex flex-wrap gap-1">
                        {app.skills.map((sk, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-800 text-[10px] font-bold"
                          >
                            ✓ {sk}
                          </span>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
                        <Link
                          href={`/u/${app.studentId}`}
                          className="text-xs text-[#0a66c2] font-bold hover:underline"
                        >
                          ดูพอร์ตโฟลิโอและใบรับรอง ↗
                        </Link>

                        <div className="flex items-center gap-2">
                          <Link
                            href="/messaging"
                            className="px-3 py-1.5 rounded-full bg-[#0a66c2] hover:bg-[#004182] text-white text-xs font-bold transition shadow-xs"
                          >
                            💬 นัดสัมภาษณ์
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-500 text-xs">
                เลือกตำแหน่งงานทางซ้ายเพื่อดูผู้สมัคร
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Project {
  id: string;
  title: string;
  description: string;
  githubUrl: string | null;
  imageUrl: string | null;
}

export default function ProjectsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formGithub, setFormGithub] = useState("");
  const [formImage, setFormImage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchProjects();
    }
  }, [status]);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      }
    } catch (err) {
      console.error("Failed to fetch projects", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDescription.trim()) return;

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formTitle.trim(),
          description: formDescription.trim(),
          githubUrl: formGithub.trim(),
          imageUrl: formImage.trim() || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop",
        }),
      });

      if (res.ok) {
        setFormTitle("");
        setFormDescription("");
        setFormGithub("");
        setFormImage("");
        await fetchProjects();
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
    if (!confirm("คุณแน่ใจหรือไม่ที่จะลบโครงการนี้?")) return;

    try {
      const res = await fetch(`/api/projects?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setProjects(projects.filter((p) => p.id !== id));
      }
    } catch (err) {
      alert("ลบข้อมูลไม่สำเร็จ");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-white animate-pulse">กำลังโหลดข้อมูล...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 pb-12">
      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        
        {/* Header */}
        <div className="text-center md:text-left mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            โครงการและผลงานเด่น
          </h1>
          <p className="text-gray-400 mt-2">
            บันทึกและโชว์เคสโปรเจกต์การพัฒนา ซอฟต์แวร์ และงานออกแบบของคุณต่อสาธารณะ
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Add Project Form */}
          <div className="glass rounded-3xl p-6 border-white/10 h-max">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              📂 เพิ่มผลงานใหม่
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">ชื่อโครงการ</label>
                <input 
                  type="text" 
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="เช่น E-Commerce System, Portfolio Website"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">รายละเอียดโครงการ</label>
                <textarea 
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="อธิบายสิ่งที่คุณสร้าง เครื่องมือหลักที่ใช้ และสิ่งที่คุณได้เรียนรู้..."
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition resize-none"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">ลิงก์ GitHub Repository</label>
                <input 
                  type="url" 
                  value={formGithub}
                  onChange={(e) => setFormGithub(e.target.value)}
                  placeholder="เช่น https://github.com/my-username/repo"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">รูปภาพตัวอย่างโครงการ (URL)</label>
                <input 
                  type="url" 
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  placeholder="ลิงก์รูปภาพ..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                />
              </div>

              {error && <p className="text-red-400 text-xs">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold transition disabled:opacity-50"
              >
                {submitting ? "กำลังบันทึก..." : "💾 บันทึกผลงาน"}
              </button>
            </form>
          </div>

          {/* Projects List */}
          <div className="lg:col-span-2">
            <div className="glass rounded-3xl p-6 border-white/10">
              <h2 className="text-xl font-bold text-white mb-6">
                📂 ผลงานที่ลงทะเบียนไว้ ({projects.length})
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {projects.length > 0 ? (
                  projects.map((project) => (
                    <div key={project.id} className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden hover:border-purple-500/50 transition flex flex-col justify-between group">
                      {project.imageUrl && (
                        <img 
                          src={project.imageUrl} 
                          alt={project.title} 
                          className="w-full h-44 object-cover border-b border-white/10 group-hover:scale-102 transition duration-300"
                        />
                      )}
                      <div className="p-5 flex-grow flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="text-white font-bold text-lg group-hover:text-purple-300 transition truncate max-w-[200px]">
                              {project.title}
                            </h3>
                            <button 
                              onClick={() => handleDelete(project.id)}
                              className="text-xs text-red-400 bg-red-400/10 hover:bg-red-400/20 px-2.5 py-1 rounded-lg border border-red-500/20 transition"
                            >
                              ลบ
                            </button>
                          </div>
                          <p className="text-gray-400 text-sm mt-3 line-clamp-3 leading-relaxed">
                            {project.description}
                          </p>
                        </div>
                        
                        {project.githubUrl && (
                          <a 
                            href={project.githubUrl} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="mt-6 inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 font-semibold w-max"
                          >
                            <span>ดูซอร์สโค้ด GitHub</span>
                            <span>↗</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12 border border-dashed border-white/10 rounded-2xl">
                    <p className="text-gray-500 text-sm">ยังไม่มีการบันทึกโปรเจกต์/ผลงาน</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Certificate {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  fileUrl: string;
  hashValue: string;
}

export default function CertificatesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [formName, setFormName] = useState("");
  const [formIssuer, setFormIssuer] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formUrl, setFormUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Verification tool states
  const [verifyHash, setVerifyHash] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<any>(null);
  const [verifyError, setVerifyError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchCertificates();
    }
  }, [status]);

  const fetchCertificates = async () => {
    try {
      const res = await fetch("/api/certificates");
      if (res.ok) {
        const data = await res.json();
        setCertificates(data.certificates || []);
      }
    } catch (err) {
      console.error("Failed to fetch certificates", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formIssuer.trim() || !formDate) return;

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName.trim(),
          issuer: formIssuer.trim(),
          issueDate: formDate,
          fileUrl: formUrl.trim() || "#",
        }),
      });

      if (res.ok) {
        setFormName("");
        setFormIssuer("");
        setFormDate("");
        setFormUrl("");
        await fetchCertificates();
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
    if (!confirm("คุณแน่ใจหรือไม่ที่จะลบใบรับรองนี้?")) return;

    try {
      const res = await fetch(`/api/certificates?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setCertificates(certificates.filter((c) => c.id !== id));
      }
    } catch (err) {
      alert("ลบข้อมูลไม่สำเร็จ");
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyHash.trim()) return;

    setVerifying(true);
    setVerifyResult(null);
    setVerifyError("");

    try {
      const res = await fetch(`/api/certificates/verify?hash=${verifyHash.trim()}`);
      const data = await res.json();

      if (res.ok && data.verified) {
        setVerifyResult(data.certificate);
      } else {
        setVerifyError(data.error || "ไม่พบรหัส Hash นี้ในระบบ");
      }
    } catch (err) {
      setVerifyError("ไม่สามารถเชื่อมต่อระบบตรวจสอบได้");
    } finally {
      setVerifying(false);
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
            ใบรับรองและลายเซ็นดิจิทัล
          </h1>
          <p className="text-gray-400 mt-2">
            บันทึกและสืบค้นความแท้จริงของใบประกาศนียบัตรผ่านระบบเข้ารหัสความปลอดภัย (Cryptography Hash)
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left panel: Add Certificate & Verify Hash */}
          <div className="space-y-8 lg:col-span-1">
            
            {/* Add form */}
            <div className="glass rounded-3xl p-6 border-white/10">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                ➕ เพิ่มใบรับรองใหม่
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">ชื่อใบรับรอง / ความสำเร็จ</label>
                  <input 
                    type="text" 
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="เช่น React Developer Certification"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">ผู้แต่งตั้ง / สถาบันที่ออกให้</label>
                  <input 
                    type="text" 
                    value={formIssuer}
                    onChange={(e) => setFormIssuer(e.target.value)}
                    placeholder="เช่น Google, Coursera, สถาบันการศึกษา"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">วันที่ออกใบรับรอง</label>
                  <input 
                    type="date" 
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">ลิงก์ไฟล์หรือเอกสารอ้างอิง (URL)</label>
                  <input 
                    type="url" 
                    value={formUrl}
                    onChange={(e) => setFormUrl(e.target.value)}
                    placeholder="เช่น https://example.com/my-cert"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                  />
                </div>

                {error && <p className="text-red-400 text-xs">{error}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold transition disabled:opacity-50"
                >
                  {submitting ? "กำลังบันทึก..." : "💾 บันทึกใบรับรอง"}
                </button>
              </form>
            </div>

            {/* Verify Tool */}
            <div className="glass rounded-3xl p-6 border-white/10">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                🔍 ระบบตรวจสอบความแท้จริง
              </h2>
              <p className="text-gray-400 text-xs mb-4">วางรหัส Cryptographic Hash ของใบรับรองเพื่อตรวจสอบสิทธิ์ของเจ้าของพาสปอร์ต</p>
              
              <form onSubmit={handleVerify} className="space-y-3">
                <input 
                  type="text" 
                  value={verifyHash}
                  onChange={(e) => setVerifyHash(e.target.value)}
                  placeholder="ป้อนรหัส cert_hash_..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition"
                  required
                />
                <button
                  type="submit"
                  disabled={verifying}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition disabled:opacity-50"
                >
                  {verifying ? "กำลังค้นหา..." : "Verify Hash"}
                </button>
              </form>

              {/* Verify Results */}
              {verifyResult && (
                <div className="mt-4 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-300 space-y-2 text-xs">
                  <p className="font-bold flex items-center gap-1.5 text-sm text-green-400">
                    <span>✅ Verified Authenticity</span>
                  </p>
                  <p><span className="text-gray-400 font-semibold">ใบรับรอง:</span> {verifyResult.name}</p>
                  <p><span className="text-gray-400 font-semibold">ออกโดย:</span> {verifyResult.issuer}</p>
                  <p><span className="text-gray-400 font-semibold">นักศึกษา:</span> {verifyResult.studentName} ({verifyResult.studentEmail})</p>
                  <p><span className="text-gray-400 font-semibold">วันที่รับรอง:</span> {new Date(verifyResult.issueDate).toLocaleDateString()}</p>
                </div>
              )}

              {verifyError && (
                <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                  ❌ {verifyError}
                </div>
              )}
            </div>

          </div>

          {/* Right panel: Certificates list */}
          <div className="lg:col-span-2">
            <div className="glass rounded-3xl p-6 border-white/10">
              <h2 className="text-xl font-bold text-white mb-6">
                📜 รายชื่อใบรับรองของคุณ ({certificates.length})
              </h2>

              <div className="space-y-4">
                {certificates.length > 0 ? (
                  certificates.map((cert) => (
                    <div key={cert.id} className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group">
                      <div className="space-y-1">
                        <h3 className="text-white font-bold text-lg">{cert.name}</h3>
                        <p className="text-gray-400 text-sm">
                          📍 {cert.issuer} • Issued on: {new Date(cert.issueDate).toLocaleDateString()}
                        </p>
                        <div className="pt-2 flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-mono select-all">
                            {cert.hashValue}
                          </span>
                          {cert.fileUrl && cert.fileUrl !== "#" && (
                            <a 
                              href={cert.fileUrl} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="text-xs text-blue-400 hover:text-blue-300 underline"
                            >
                              ลิงก์หลักฐาน ↗
                            </a>
                          )}
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => handleDelete(cert.id)}
                        className="self-end md:self-center opacity-0 group-hover:opacity-100 transition px-4 py-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 text-sm font-bold"
                      >
                        ลบออก
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl">
                    <p className="text-gray-500 text-sm">ยังไม่มีการบันทึกใบรับรองความสำเร็จของคุณ</p>
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

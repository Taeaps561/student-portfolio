"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

  // Preview Modal state
  const [previewCert, setPreviewCert] = useState<Certificate | null>(null);

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
      const res = await fetch(`/api/certificates/verify?hash=${encodeURIComponent(verifyHash.trim())}`);
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
      <div className="min-h-screen bg-[#f4f2ee] flex items-center justify-center pt-20">
        <div className="text-sm font-bold text-slate-600 animate-pulse">กำลังโหลดข้อมูลใบรับรอง...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f2ee] pt-[85px] px-4 pb-16">
      <div className="max-w-[1128px] mx-auto space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📜</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                ศูนย์วุฒิบัตรและใบรับรองดิจิทัล (Digital Certificates)
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              จัดการใบประกาศนียบัตร พร้อมระบบตรวจสอบความถูกต้องด้วย Cryptographic Digital Signature (SHA-256)
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-full bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs transition shadow-sm"
            >
              ← กลับสู่แดชบอร์ด
            </Link>
          </div>
        </div>

        {/* Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column (1 Col): Add Form & Verify Tool */}
          <div className="space-y-6 lg:col-span-1">
            
            {/* 1. Add Certificate Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <span>➕</span> เพิ่มใบรับรองใหม่
              </h2>

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ชื่อใบรับรอง / หลักสูตร <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="เช่น Next.js Enterprise & Security"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0a66c2]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    สถาบัน / ผู้มอบใบรับรอง <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formIssuer}
                    onChange={(e) => setFormIssuer(e.target.value)}
                    placeholder="เช่น มหาวิทยาลัยสวนดุสิต / Meta / Google"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0a66c2]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    วันที่ออกใบรับรอง <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0a66c2]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ลิงก์เอกสารอ้างอิง (URL)
                  </label>
                  <input
                    type="url"
                    value={formUrl}
                    onChange={(e) => setFormUrl(e.target.value)}
                    placeholder="https://example.com/certificate.pdf"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0a66c2]"
                  />
                </div>

                {error && (
                  <p className="text-xs font-bold text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#0a66c2] hover:bg-[#004182] text-white font-bold text-xs transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? "กำลังบันทึก..." : "💾 บันทึกใบรับรองลงพอร์ต"}
                </button>
              </form>
            </div>

            {/* 2. Verification Tool */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <span>🔍</span> ตรวจสอบความแท้จริง (Hash Verifier)
              </h2>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                วางรหัส Cryptographic Hash เพื่อตรวจสอบลายเซ็นดิจิทัลว่าใบรับรองนี้ออกโดยระบบจริงและไม่มีการปลอมแปลง
              </p>

              <form onSubmit={handleVerify} className="space-y-2.5">
                <input
                  type="text"
                  value={verifyHash}
                  onChange={(e) => setVerifyHash(e.target.value)}
                  placeholder="ป้อนรหัส cert_hash_..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  required
                />
                <button
                  type="submit"
                  disabled={verifying}
                  className="w-full py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-sm disabled:opacity-50"
                >
                  {verifying ? "กำลังตรวจสอบ..." : "✓ ตรวจสอบความถูกต้อง"}
                </button>
              </form>

              {verifyResult && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-slate-800 space-y-1.5 text-xs animate-in fade-in">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
                    <span>✓ ตรวจสอบลายเซ็นถูกต้อง (Authentic)</span>
                  </div>
                  <p><strong className="text-slate-700">หลักสูตร:</strong> {verifyResult.name}</p>
                  <p><strong className="text-slate-700">ผู้ออกให้:</strong> {verifyResult.issuer}</p>
                  <p><strong className="text-slate-700">ผู้รับ:</strong> {verifyResult.studentName || session?.user?.name}</p>
                  <p><strong className="text-slate-700">วันที่:</strong> {new Date(verifyResult.issueDate).toLocaleDateString("th-TH")}</p>
                </div>
              )}

              {verifyError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                  ❌ {verifyError}
                </div>
              )}
            </div>

          </div>

          {/* Right Column (2 Cols): Certificates List */}
          <div className="space-y-6 lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>📜</span> รายการใบรับรองและวุฒิบัตรของคุณ ({certificates.length})
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0a66c2] font-bold border border-blue-200">
                  Data Integrity Secured
                </span>
              </div>

              <div className="space-y-3.5">
                {certificates.length > 0 ? (
                  certificates.map((cert) => (
                    <div
                      key={cert.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-blue-300 transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center text-2xl font-bold shrink-0 shadow-sm">
                          🎓
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-sm font-bold text-slate-900">{cert.name}</h3>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                              ✓ Verified
                            </span>
                          </div>
                          <p className="text-xs text-slate-600">
                            🏛️ <strong className="text-slate-800">{cert.issuer}</strong> • วันที่ออก: {new Date(cert.issueDate).toLocaleDateString("th-TH")}
                          </p>
                          <div className="pt-1 flex items-center gap-2 flex-wrap">
                            <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-mono text-[10px] select-all" title="SHA-256 Digital Hash">
                              🔑 {cert.hashValue}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
                        <button
                          onClick={() => setPreviewCert(cert)}
                          className="px-3 py-1.5 rounded-lg bg-[#0a66c2] hover:bg-[#004182] text-white font-bold text-xs transition shadow-sm flex items-center gap-1"
                        >
                          <span>👁️</span> ดูใบรับรอง
                        </button>
                        <button
                          onClick={() => handleDelete(cert.id)}
                          className="px-2.5 py-1.5 rounded-lg text-red-600 hover:bg-red-50 border border-red-200 text-xs font-bold transition"
                          title="ลบใบรับรอง"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl space-y-2">
                    <p className="text-slate-600 text-sm font-bold">ยังไม่มีใบรับรองในระบบ</p>
                    <p className="text-slate-400 text-xs">คุณสามารถเพิ่มใบรับรองจากฟอร์มด้านซ้าย หรือให้อาจารย์ออกวุฒิบัตรให้ได้</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 🎓 DIGITAL CERTIFICATE PREVIEW MODAL                                      */}
      {/* ========================================================================= */}
      {previewCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Controls Bar */}
            <div className="px-5 py-3.5 bg-slate-100 border-b border-slate-200 flex justify-between items-center print:hidden">
              <div className="flex items-center gap-2">
                <span className="text-base">📜</span>
                <span className="text-xs font-bold text-slate-800">พรีวิวใบประกาศนียบัตรดิจิทัล มสด.</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 bg-[#0a66c2] hover:bg-[#004182] text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center gap-1.5"
                >
                  <span>🖨️</span> พิมพ์ / ดาวน์โหลด PDF
                </button>
                <button
                  onClick={() => setPreviewCert(null)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-bold transition"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Certificate Paper Frame */}
            <div className="p-8 sm:p-12 overflow-y-auto bg-[#faf8f5]">
              <div className="border-8 border-double border-[#002d62] p-6 sm:p-8 bg-white rounded-xl shadow-md text-center space-y-6 relative overflow-hidden">
                
                {/* Background Watermark Crest */}
                <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/e/ee/Logo_of_Suan_Dusit_University.svg?utm_source=th.wikipedia.org&utm_campaign=index&utm_content=original"
                    alt="SDU Crest"
                    className="w-80 h-80 object-contain"
                  />
                </div>

                {/* SDU Logo & University Title */}
                <div className="space-y-2 relative z-10">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/e/ee/Logo_of_Suan_Dusit_University.svg?utm_source=th.wikipedia.org&utm_campaign=index&utm_content=original"
                    alt="SDU Logo"
                    className="h-16 w-auto mx-auto object-contain"
                  />
                  <h2 className="text-xl sm:text-2xl font-black text-[#002d62] tracking-wide">
                    มหาวิทยาลัยสวนดุสิต
                  </h2>
                  <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">
                    Suan Dusit University • SkillPassport Digital Certificate
                  </p>
                </div>

                {/* Subtitle */}
                <div className="relative z-10">
                  <p className="text-xs text-slate-600 font-semibold italic">
                    ใบประกาศนียบัตรนี้ออกให้เพื่อแสดงว่า
                  </p>
                </div>

                {/* Recipient Name */}
                <div className="relative z-10 py-1">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 border-b-2 border-slate-300 pb-2 inline-block px-8">
                    {session?.user?.name || "นักศึกษา มหาวิทยาลัยสวนดุสิต"}
                  </h3>
                </div>

                {/* Achievement / Course Name */}
                <div className="space-y-2 relative z-10">
                  <p className="text-xs text-slate-600">ได้ผ่านการประเมินและได้รับการรับรองสมรรถนะทักษะในหลักสูตร</p>
                  <p className="text-base sm:text-lg font-bold text-[#0a66c2]">
                    &ldquo;{previewCert.name}&rdquo;
                  </p>
                  <p className="text-xs text-slate-500 font-medium">
                    ออกโดย: <strong className="text-slate-800">{previewCert.issuer}</strong>
                  </p>
                </div>

                {/* Footer Stamps & Signatures */}
                <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-4 items-center relative z-10">
                  <div className="text-left space-y-1">
                    <p className="text-[11px] text-slate-500 font-semibold">
                      วันที่ออกใบรับรอง: <span className="text-slate-800 font-bold">{new Date(previewCert.issueDate).toLocaleDateString("th-TH")}</span>
                    </p>
                    <p className="text-[9px] font-mono text-slate-400 break-all select-all">
                      SHA-256: {previewCert.hashValue}
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="inline-block p-2 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-[10px] font-bold text-center">
                      <span className="text-base block">✓</span>
                      VERIFIED DIGITAL ASSET
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

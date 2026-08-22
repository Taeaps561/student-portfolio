"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AnalyticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated" || (session && session.user.role !== "TEACHER")) {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchAnalytics();
    }
  }, [status, session]);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch("/api/analytics");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error("Failed to load analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-xl text-slate-800 animate-pulse font-bold">กำลังประมวลผลสถิติหลักสูตรคณะ...</div>
      </div>
    );
  }

  const passRateAvg = data.skillMetrics.length > 0
    ? Math.round(data.skillMetrics.reduce((sum: number, m: any) => sum + m.avgScore, 0) / data.skillMetrics.length)
    : 75;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 px-4 pb-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center md:text-left mb-6">
          <h1 className="text-3xl font-extrabold text-[#0b2f64] flex items-center gap-2 justify-center md:justify-start">
            📊 ระบบวิเคราะห์หลักสูตรและสมรรถนะคณะ (Departmental Analytics)
          </h1>
          <p className="text-slate-600 mt-2 font-medium">
            บอร์ดประเมินการจัดการเรียนรู้ของคณบดีและผู้บริหารหลักสูตรเพื่อการปรับปรุงการศึกษา (Data-Driven Curriculum Reform)
          </p>
        </div>

        {/* Executive Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-900 text-xl font-bold">
              🎓
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">นักศึกษาที่จดทะเบียน</p>
              <h3 className="text-2xl font-black text-slate-850">{data.studentCount} คน</h3>
              <p className="text-[10px] text-slate-500 font-bold mt-0.5">นักศึกษาสาขาเทคโนโลยีสารสนเทศ</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-950 text-xl font-bold">
              📊
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">เกรดเฉลี่ยเฉลี่ยคณะ (GPAX)</p>
              <h3 className="text-2xl font-black text-slate-850">{data.averageGPAX} / 4.00</h3>
              <p className="text-[10px] text-emerald-700 font-bold mt-0.5">ผ่านเกณฑ์เฉลี่ยสะสมระดับภาควิชา</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 text-xl font-bold">
              🏆
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">คะแนนผ่านเกณฑ์สอบเฉลี่ย</p>
              <h3 className="text-2xl font-black text-slate-850">{passRateAvg}%</h3>
              <p className="text-[10px] text-slate-500 font-bold mt-0.5">เกณฑ์กลางสำหรับข้อสอบความเข้าใจ</p>
            </div>
          </div>

        </div>

        {/* Detail Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Skill Mastery and Advanced ratios */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              📉 ภาพรวมสมรรถนะนักศึกษาแยกตามทักษะ (Skill Mastery & Advanced Ratios)
            </h2>
            
            <div className="space-y-5">
              {data.skillMetrics.map((sk: any) => (
                <div key={sk.name} className="space-y-2">
                  <div className="flex justify-between items-end text-xs">
                    <div>
                      <span className="font-extrabold text-slate-800 text-sm">{sk.name}</span>
                      <span className="text-[10px] text-slate-400 font-medium ml-2">ผ่านแล้ว: {sk.verifiedCount} คน</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-800">เกรดเฉลี่ยการสอบ: {sk.avgScore}%</span>
                      <span className="text-[10px] text-slate-500 block font-medium">สัดส่วนระดับสูง (Level 4-5): {sk.advancedPercent}%</span>
                    </div>
                  </div>

                  {/* Dual progress bar */}
                  <div className="space-y-1">
                    {/* Test score bar */}
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          sk.avgScore >= 80 
                            ? "bg-emerald-500" 
                            : sk.avgScore >= 70 
                              ? "bg-blue-500" 
                              : "bg-red-500"
                        }`}
                        style={{ width: `${sk.avgScore}%` }}
                      ></div>
                    </div>
                    {/* Advanced Ratio bar */}
                    <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500 rounded-full"
                        style={{ width: `${sk.advancedPercent}%` }}
                      ></div>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* Curriculum Reforms suggestions */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-red-950 flex items-center gap-2">
              🚨 ดัชนีปรับปรุงการสอนของหลักสูตร (Curriculum Reform Indicators)
            </h2>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              ระบุและวิเคราะห์จุดบกพร่องทางความรู้ที่ผู้เรียนทำคะแนนประเมินได้ต่ำที่สุด เพื่อสนับสนุนให้อาจารย์ผู้สอนทำการปรับเปลี่ยนโครงสร้างเนื้อหาและการวัดผล
            </p>

            <div className="space-y-4">
              {data.skillMetrics.map((sk: any) => (
                <div 
                  key={sk.name} 
                  className={`p-5 rounded-2xl border transition space-y-3 ${
                    sk.status === "Urgent" 
                      ? "bg-red-50/20 border-red-200" 
                      : sk.status === "Warning"
                        ? "bg-amber-50/20 border-amber-200"
                        : "bg-emerald-50/20 border-emerald-100"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                      <span>{sk.name}</span>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                        sk.status === "Urgent" 
                          ? "bg-red-100 text-red-800 animate-pulse" 
                          : sk.status === "Warning"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-emerald-100 text-emerald-800"
                      }`}>
                        {sk.status === "Urgent" ? "🚨 ควรปฏิรูปด่วน" : sk.status === "Warning" ? "⚠️ ควรเฝ้าระวัง" : "✅ ผ่านเกณฑ์ดีเยี่ยม"}
                      </span>
                    </h3>
                    <span className="text-xs font-mono font-bold text-slate-600">เฉลี่ย: {sk.avgScore}%</span>
                  </div>

                  <p className="text-[11px] text-slate-650 leading-relaxed font-semibold">
                    💡 <span className="text-slate-800">ข้อเสนอเชิงหลักสูตร:</span> {sk.suggestion}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

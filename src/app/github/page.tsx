"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface LanguageStat {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

interface RepoItem {
  id: number;
  name: string;
  fullName: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  url: string;
  homepage?: string;
  updatedAt: string;
  topics: string[];
}

interface ContributionCell {
  date: string;
  count: number;
  level: number;
}

interface GitHubData {
  connected: boolean;
  profile: {
    username: string;
    name: string;
    avatarUrl: string;
    bio: string;
    location?: string;
    company?: string;
    blog?: string;
    publicRepos: number;
    followers: number;
    following: number;
    createdAt: string;
    htmlUrl: string;
  };
  stats: {
    totalStars: number;
    totalForks: number;
    publicRepos: number;
    followers: number;
    recentCommits: number;
    recentPRs: number;
  };
  languages: LanguageStat[];
  topRepos: RepoItem[];
  contributionGraph: ContributionCell[];
}

export default function GitHubPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [usernameInput, setUsernameInput] = useState("");
  const [activeUsername, setActiveUsername] = useState("");
  const [data, setData] = useState<GitHubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [importingId, setImportingId] = useState<number | null>(null);
  const [importedRepos, setImportedRepos] = useState<Record<string, boolean>>({});

  // Determine initial username
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      const initialUser =
        (session as any)?.githubUsername ||
        (session?.user?.name && !session.user.name.includes(" ") ? session.user.name : "octocat");
      setActiveUsername(initialUser);
      setUsernameInput(initialUser);
      fetchGitHubData(initialUser);
    }
  }, [status, session]);

  const fetchGitHubData = async (targetUser: string) => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch(`/api/github?username=${encodeURIComponent(targetUser)}`);
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "ไม่สามารถดึงข้อมูล GitHub ได้");
      }

      setData(result);
      setActiveUsername(result.profile.username);
    } catch (err: any) {
      setErrorMsg(err.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;
    fetchGitHubData(usernameInput.trim());
  };

  const handleSyncNow = async () => {
    if (!activeUsername) return;
    setSyncing(true);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      await fetchGitHubData(activeUsername);
      setSuccessMsg("🔄 ซิงก์ข้อมูลล่าสุดจาก GitHub API สำเร็จเรียบร้อยแล้ว!");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err: any) {
      setErrorMsg("การซิงก์ข้อมูลล้มเหลว: " + err.message);
    } finally {
      setSyncing(false);
    }
  };

  const handleImportRepo = async (repo: RepoItem) => {
    setImportingId(repo.id);
    setErrorMsg("");
    try {
      const res = await fetch("/api/github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "import_repo",
          repo: {
            name: repo.name,
            description: repo.description,
            url: repo.url,
            language: repo.language,
            stars: repo.stars,
          },
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "ไม่สามารถนำเข้าโครงการได้");
      }

      setImportedRepos((prev) => ({ ...prev, [repo.name]: true }));
      setSuccessMsg(`🎉 นำเข้าโครงการ "${repo.name}" สู่พอร์ตโฟลิโอของคุณสำเร็จแล้ว!`);
      setTimeout(() => setSuccessMsg(""), 5000);
    } catch (err: any) {
      setErrorMsg(err.message || "เกิดข้อผิดพลาดในการนำเข้าโครงการ");
    } finally {
      setImportingId(null);
    }
  };

  if (status === "loading" || (loading && !data)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 px-4">
        <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-300 font-medium text-lg animate-pulse">กำลังเชื่อมต่อและประมวลผลข้อมูล GitHub API...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 pb-16">
      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        
        {/* Top Notification Messages */}
        {successMsg && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-2xl flex items-center justify-between animate-fadeIn shadow-lg">
            <div className="flex items-center gap-3">
              <span className="text-xl">✅</span>
              <p className="text-sm font-medium">{successMsg}</p>
            </div>
            <Link href="/portfolio" className="text-xs bg-emerald-500/20 hover:bg-emerald-500/30 px-3 py-1.5 rounded-lg border border-emerald-500/40 text-white font-bold transition">
              ดูใน Portfolio ↗
            </Link>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-300 rounded-2xl flex items-center gap-3 animate-fadeIn">
            <span className="text-xl">⚠️</span>
            <p className="text-sm font-medium">{errorMsg}</p>
          </div>
        )}

        {/* Header section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400">
              🐙 เชื่อมต่อประวัติ GitHub แบบเรียลไทม์
            </h1>
            <p className="text-gray-400 mt-2 text-sm md:text-base">
              ดึงข้อมูลสถิติผลงานการพัฒนา, กราฟ Contribution, ภาษาโปรแกรมมิ่ง และนำเข้า Repositories สู่ Digital Passport ทันที
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={handleSyncNow}
              disabled={syncing || loading}
              className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.4)] cursor-pointer"
            >
              {syncing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                  <span>กำลังซิงก์...</span>
                </>
              ) : (
                <>
                  <span>🔄</span>
                  <span>ซิงก์ข้อมูลเดี๋ยวนี้</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Search / Switch GitHub Username Form */}
        <div className="glass rounded-3xl p-6 border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl">
              🔍
            </div>
            <div>
              <p className="text-sm font-semibold text-white">ค้นหาหรือสลับบัญชี GitHub</p>
              <p className="text-xs text-gray-400">ระบุชื่อบัญชี GitHub เพื่อดึงประวัติและผลงานมาแสดง</p>
            </div>
          </div>

          <form onSubmit={handleSearchUser} className="flex gap-2 w-full md:w-auto flex-grow max-w-md">
            <div className="relative flex-grow">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">@</span>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="กรอกชื่อ GitHub username เช่น octocat, vercel"
                className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50 transition"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-medium text-sm transition shrink-0"
            >
              ค้นหา
            </button>
          </form>
        </div>

        {data && (
          <>
            {/* GitHub Profile Banner Card */}
            <div className="glass rounded-3xl p-8 border-white/10 relative overflow-hidden flex flex-col md:flex-row items-center gap-8 shadow-2xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-600/15 via-blue-600/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

              <div className="relative shrink-0">
                <img
                  src={data.profile.avatarUrl}
                  alt={data.profile.name}
                  className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-purple-500/40 object-cover shadow-[0_0_25px_rgba(168,85,247,0.3)]"
                />
                <span className="absolute bottom-1 right-1 p-2 bg-black/80 rounded-full border border-white/20 text-xs shadow">
                  🐙
                </span>
              </div>

              <div className="flex-grow text-center md:text-left space-y-3">
                <div className="flex flex-col md:flex-row md:items-center gap-3 justify-center md:justify-start">
                  <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                    {data.profile.name}
                  </h2>
                  <a
                    href={data.profile.htmlUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold hover:bg-blue-500/20 transition self-center"
                  >
                    @{data.profile.username} ↗
                  </a>
                </div>

                <p className="text-gray-300 text-sm max-w-2xl leading-relaxed">
                  {data.profile.bio || "ไม่มีคำอธิบายโปรไฟล์ใน GitHub"}
                </p>

                <div className="flex flex-wrap gap-4 text-xs text-gray-400 justify-center md:justify-start pt-1">
                  {data.profile.location && <span>📍 {data.profile.location}</span>}
                  {data.profile.company && <span>🏢 {data.profile.company}</span>}
                  <span>👥 ผู้ติดตาม: {data.profile.followers.toLocaleString()} คน</span>
                  <span>📦 คลังผลงานสาธารณะ: {data.profile.publicRepos} โครงการ</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 shrink-0 w-full md:w-auto">
                <a
                  href={data.profile.htmlUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-bold text-center transition flex items-center justify-center gap-2"
                >
                  เปิดโปรไฟล์ GitHub ↗
                </a>
              </div>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="glass rounded-2xl p-5 border-white/10 text-center hover:border-yellow-500/40 transition">
                <p className="text-2xl md:text-3xl font-black text-yellow-400">{data.stats.totalStars}</p>
                <p className="text-xs text-gray-400 uppercase font-semibold mt-1">⭐ Total Stars</p>
              </div>

              <div className="glass rounded-2xl p-5 border-white/10 text-center hover:border-blue-500/40 transition">
                <p className="text-2xl md:text-3xl font-black text-blue-400">{data.stats.totalForks}</p>
                <p className="text-xs text-gray-400 uppercase font-semibold mt-1">🍴 Total Forks</p>
              </div>

              <div className="glass rounded-2xl p-5 border-white/10 text-center hover:border-purple-500/40 transition">
                <p className="text-2xl md:text-3xl font-black text-purple-400">{data.stats.publicRepos}</p>
                <p className="text-xs text-gray-400 uppercase font-semibold mt-1">📦 Repositories</p>
              </div>

              <div className="glass rounded-2xl p-5 border-white/10 text-center hover:border-emerald-500/40 transition">
                <p className="text-2xl md:text-3xl font-black text-emerald-400">{data.stats.followers}</p>
                <p className="text-xs text-gray-400 uppercase font-semibold mt-1">👥 Followers</p>
              </div>

              <div className="glass rounded-2xl p-5 border-white/10 text-center hover:border-orange-500/40 transition">
                <p className="text-2xl md:text-3xl font-black text-orange-400">{data.stats.recentCommits}</p>
                <p className="text-xs text-gray-400 uppercase font-semibold mt-1">🔥 Recent Commits</p>
              </div>

              <div className="glass rounded-2xl p-5 border-white/10 text-center hover:border-cyan-500/40 transition">
                <p className="text-2xl md:text-3xl font-black text-cyan-400">{data.stats.recentPRs}</p>
                <p className="text-xs text-gray-400 uppercase font-semibold mt-1">🚀 Pull Requests</p>
              </div>
            </div>

            {/* Middle Section: Languages & Contributions Heatmap */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Languages Breakdown Card */}
              <div className="glass rounded-3xl p-6 border-white/10 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>📊</span> ภาษาที่ใช้บ่อยที่สุด
                  </h3>
                  <span className="text-xs text-gray-400">{data.languages.length} ภาษา</span>
                </div>

                {/* Progress bar visualizer */}
                {data.languages.length > 0 ? (
                  <div className="space-y-4">
                    <div className="h-3 w-full rounded-full overflow-hidden flex bg-black/40 border border-white/10">
                      {data.languages.slice(0, 6).map((lang) => (
                        <div
                          key={lang.name}
                          style={{
                            width: `${Math.max(lang.percentage, 3)}%`,
                            backgroundColor: lang.color,
                          }}
                          title={`${lang.name}: ${lang.percentage}%`}
                          className="h-full transition-all duration-500"
                        />
                      ))}
                    </div>

                    <div className="space-y-2.5">
                      {data.languages.slice(0, 7).map((lang) => (
                        <div key={lang.name} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-3 h-3 rounded-full shrink-0"
                              style={{ backgroundColor: lang.color }}
                            />
                            <span className="text-gray-200 font-medium">{lang.name}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-gray-400">{lang.count} repos</span>
                            <span className="text-white font-bold">{lang.percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm text-center py-8">ไม่พบข้อมูลสถิติภาษาโปรแกรม</p>
                )}
              </div>

              {/* Contribution Activity Grid Heatmap */}
              <div className="lg:col-span-2 glass rounded-3xl p-6 border-white/10 space-y-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <span>🔥</span> กราฟกิจกรรมการมีส่วนร่วม (Contribution Heatmap)
                    </h3>
                    <span className="text-xs text-emerald-400 font-semibold">60 วันย้อนหลัง</span>
                  </div>
                  <p className="text-gray-400 text-xs">
                    ประมวลผลความถี่ในการ Push Code และ Pull Request ล่าสุดจาก GitHub Events
                  </p>
                </div>

                {/* Heatmap Grid */}
                <div className="p-4 bg-black/30 rounded-2xl border border-white/5 overflow-x-auto">
                  <div className="grid grid-flow-col grid-rows-5 gap-2 min-w-[500px]">
                    {data.contributionGraph.map((cell, idx) => {
                      let colorClass = "bg-white/5 border-white/5";
                      if (cell.level === 1) colorClass = "bg-emerald-950/80 border-emerald-800/50";
                      if (cell.level === 2) colorClass = "bg-emerald-800 border-emerald-600/50";
                      if (cell.level === 3) colorClass = "bg-emerald-600 border-emerald-400/50 shadow-[0_0_8px_rgba(16,185,129,0.3)]";
                      if (cell.level === 4) colorClass = "bg-emerald-400 border-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.6)]";

                      return (
                        <div
                          key={idx}
                          className={`w-5 h-5 rounded-md border ${colorClass} hover:scale-125 transition-transform duration-150 cursor-pointer`}
                          title={`วันที่ ${cell.date}: มีกิจกรรม ${cell.count} ครั้ง`}
                        />
                      );
                    })}
                  </div>

                  {/* Legend */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mt-4 pt-3 border-t border-white/5">
                    <span>ความถี่ของกิจกรรม</span>
                    <div className="flex items-center gap-1.5">
                      <span>น้อย</span>
                      <div className="w-3 h-3 rounded-sm bg-white/5"></div>
                      <div className="w-3 h-3 rounded-sm bg-emerald-950"></div>
                      <div className="w-3 h-3 rounded-sm bg-emerald-800"></div>
                      <div className="w-3 h-3 rounded-sm bg-emerald-600"></div>
                      <div className="w-3 h-3 rounded-sm bg-emerald-400"></div>
                      <span>มาก</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-400 bg-white/5 p-3 rounded-xl border border-white/5">
                  <span>💡 ข้อมูลอัปเดตแบบ Direct Stream ผ่าน GitHub REST API</span>
                  <span className="text-purple-300">อัตราความสดใหม่: เรียลไทม์</span>
                </div>
              </div>

            </div>

            {/* Repositories Showcase with 1-Click Import to Portfolio */}
            <div className="glass rounded-3xl p-6 md:p-8 border-white/10 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>📂</span> โครงการเด่น (Top Repositories)
                  </h3>
                  <p className="text-gray-400 text-xs mt-1">
                    สามารถกดนำเข้าโครงการจาก GitHub เข้าสู่แฟ้มสะสมผลงาน (Portfolio) ได้ในคลิกเดียว
                  </p>
                </div>

                <Link
                  href="/portfolio"
                  className="text-xs bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 px-4 py-2 rounded-xl font-semibold transition flex items-center gap-1.5"
                >
                  <span>เปิดดูใน Portfolio ทั้งหมด</span>
                  <span>↗</span>
                </Link>
              </div>

              {data.topRepos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {data.topRepos.map((repo) => {
                    const isImported = importedRepos[repo.name];
                    const isImporting = importingId === repo.id;

                    return (
                      <div
                        key={repo.id}
                        className="rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/40 transition p-5 flex flex-col justify-between gap-4 group"
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <a
                              href={repo.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-white font-bold text-base group-hover:text-purple-300 hover:underline transition flex items-center gap-1.5 truncate"
                            >
                              <span>{repo.name}</span>
                              <span className="text-xs text-gray-500">↗</span>
                            </a>

                            <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300 font-medium shrink-0">
                              {repo.language}
                            </span>
                          </div>

                          <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
                            {repo.description}
                          </p>

                          {repo.topics && repo.topics.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {repo.topics.slice(0, 4).map((topic) => (
                                <span
                                  key={topic}
                                  className="text-[10px] px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/20"
                                >
                                  #{topic}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs">
                          <div className="flex items-center gap-3 text-gray-400">
                            <span className="flex items-center gap-1">⭐ {repo.stars}</span>
                            <span className="flex items-center gap-1">🍴 {repo.forks}</span>
                          </div>

                          <button
                            onClick={() => handleImportRepo(repo)}
                            disabled={isImporting || isImported}
                            className={`px-3 py-1.5 rounded-xl font-semibold text-xs transition flex items-center gap-1.5 ${
                              isImported
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-default"
                                : "bg-purple-600 hover:bg-purple-700 text-white shadow-[0_0_10px_rgba(168,85,247,0.3)] cursor-pointer"
                            }`}
                          >
                            {isImporting ? (
                              <>
                                <div className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                                <span>กำลังนำเข้า...</span>
                              </>
                            ) : isImported ? (
                              <>
                                <span>✓</span>
                                <span>นำเข้าแล้ว</span>
                              </>
                            ) : (
                              <>
                                <span>📥</span>
                                <span>นำเข้าสู่ Portfolio</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center border border-dashed border-white/10 rounded-2xl text-gray-500 text-sm">
                  ไม่พบคลังผลงานสาธารณะสำหรับบัญชีนี้
                </div>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
}

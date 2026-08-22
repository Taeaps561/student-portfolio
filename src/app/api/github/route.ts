import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// Language Colors for visual representation
const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Vue: "#41b883",
  Rust: "#dea584",
  Go: "#00ADD8",
  Java: "#b07219",
  "C++": "#f34b7d",
  "C#": "#178600",
  PHP: "#4F5D95",
  Ruby: "#701516",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Solidity: "#AA6746",
  Dart: "#00B4AB",
  Shell: "#89e051",
};

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    let username = searchParams.get("username");

    let token = (session as any)?.accessToken;

    // If no username provided, try to find from session or linked GitHub account
    if (!username && session?.user?.id) {
      const account = await prisma.account.findFirst({
        where: {
          userId: session.user.id as string,
          provider: "github",
        },
      });

      if (account?.access_token) {
        token = account.access_token;
      }

      if ((session as any)?.githubUsername) {
        username = (session as any).githubUsername;
      }
    }

    // Default fallback username for demonstration if neither is available
    const targetUsername = username || (session?.user?.name ? session.user.name.replace(/\s+/g, "").toLowerCase() : "torvalds");

    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "SkillPassport-Student-Portfolio",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // 1. Fetch User Profile
    const userRes = await fetch(`https://api.github.com/users/${targetUsername}`, { headers });
    if (!userRes.ok) {
      if (userRes.status === 404) {
        return NextResponse.json({ error: `ไม่พบผู้ใช้ GitHub: @${targetUsername}` }, { status: 404 });
      }
      return NextResponse.json({ error: "ไม่สามารถเชื่อมต่อกับ GitHub API ได้ในขณะนี้ (อาจติด Rate limit)" }, { status: userRes.status });
    }
    const userData = await userRes.json();

    // 2. Fetch Repositories
    const reposRes = await fetch(`https://api.github.com/users/${targetUsername}/repos?sort=updated&per_page=100`, { headers });
    const reposData = reposRes.ok ? await reposRes.json() : [];

    // 3. Fetch Public Events (for commit & PR activity)
    const eventsRes = await fetch(`https://api.github.com/users/${targetUsername}/events/public?per_page=100`, { headers });
    const eventsData = eventsRes.ok ? await eventsRes.json() : [];

    // Calculate Statistics
    let totalStars = 0;
    let totalForks = 0;
    const languageCounts: Record<string, number> = {};

    const formattedRepos = Array.isArray(reposData)
      ? reposData.map((repo: any) => {
          totalStars += repo.stargazers_count || 0;
          totalForks += repo.forks_count || 0;

          if (repo.language) {
            languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
          }

          return {
            id: repo.id,
            name: repo.name,
            fullName: repo.full_name,
            description: repo.description || "ไม่มีคำอธิบายโครงการ",
            stars: repo.stargazers_count || 0,
            forks: repo.forks_count || 0,
            language: repo.language || "Other",
            url: repo.html_url,
            homepage: repo.homepage,
            updatedAt: repo.updated_at,
            isFork: repo.fork,
            topics: repo.topics || [],
          };
        })
      : [];

    // Sort repos by stars & recency
    const topRepos = [...formattedRepos]
      .filter((r) => !r.isFork)
      .sort((a, b) => b.stars - a.stars || new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 8);

    // Calculate Languages breakdown
    const totalReposWithLang = Object.values(languageCounts).reduce((a, b) => a + b, 0);
    const languages = Object.entries(languageCounts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: totalReposWithLang > 0 ? Math.round((count / totalReposWithLang) * 100) : 0,
        color: LANGUAGE_COLORS[name] || "#8b949e",
      }))
      .sort((a, b) => b.count - a.count);

    // Calculate Activity Stats from Events
    let totalPushCommits = 0;
    let totalPRs = 0;
    const dailyActivity: Record<string, number> = {};

    if (Array.isArray(eventsData)) {
      eventsData.forEach((evt: any) => {
        const dateStr = evt.created_at ? evt.created_at.split("T")[0] : "";
        if (evt.type === "PushEvent") {
          const commitCount = evt.payload?.commits?.length || 1;
          totalPushCommits += commitCount;
          if (dateStr) dailyActivity[dateStr] = (dailyActivity[dateStr] || 0) + commitCount;
        } else if (evt.type === "PullRequestEvent") {
          totalPRs += 1;
          if (dateStr) dailyActivity[dateStr] = (dailyActivity[dateStr] || 0) + 1;
        }
      });
    }

    // Generate 60-day contribution cells with real activity density
    const today = new Date();
    const contributionGraph = [];
    for (let i = 59; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateKey = d.toISOString().split("T")[0];
      const count = dailyActivity[dateKey] || 0;
      let level = 0;
      if (count > 0) level = count >= 4 ? 4 : count >= 2 ? 3 : count === 1 ? 2 : 1;
      contributionGraph.push({
        date: dateKey,
        count,
        level,
      });
    }

    return NextResponse.json({
      connected: true,
      profile: {
        username: userData.login,
        name: userData.name || userData.login,
        avatarUrl: userData.avatar_url,
        bio: userData.bio,
        location: userData.location,
        company: userData.company,
        blog: userData.blog,
        twitter: userData.twitter_username,
        publicRepos: userData.public_repos,
        followers: userData.followers,
        following: userData.following,
        createdAt: userData.created_at,
        htmlUrl: userData.html_url,
      },
      stats: {
        totalStars,
        totalForks,
        publicRepos: userData.public_repos,
        followers: userData.followers,
        recentCommits: totalPushCommits,
        recentPRs: totalPRs,
      },
      languages,
      topRepos,
      contributionGraph,
    });
  } catch (error: any) {
    console.error("GitHub API Error:", error);
    return NextResponse.json({ error: error.message || "เกิดข้อผิดพลาดในการดึงข้อมูล GitHub" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบก่อนดำเนินการ" }, { status: 401 });
  }

  try {
    const { action, repo } = await req.json();

    // Action 1: Import repository to Portfolio Projects
    if (action === "import_repo") {
      if (!repo || !repo.name) {
        return NextResponse.json({ error: "ข้อมูล Repository ไม่ถูกต้อง" }, { status: 400 });
      }

      // Get or create portfolio
      let portfolio = await prisma.portfolio.findUnique({
        where: { userId: session.user.id as string },
      });

      if (!portfolio) {
        portfolio = await prisma.portfolio.create({
          data: {
            userId: session.user.id as string,
            bio: "สวัสดี! ฉันเป็นนักศึกษาที่หลงใหลในการเขียนโค้ดและสร้างสรรค์นวัตกรรมใหม่ๆ",
            isPublic: true,
          },
        });
      }

      // Check if project already exists
      const existingProject = await prisma.project.findFirst({
        where: {
          portfolioId: portfolio.id,
          title: repo.name,
        },
      });

      let savedProject;
      if (existingProject) {
        savedProject = await prisma.project.update({
          where: { id: existingProject.id },
          data: {
            description: repo.description || existingProject.description,
            githubUrl: repo.url || existingProject.githubUrl,
          },
        });
      } else {
        savedProject = await prisma.project.create({
          data: {
            portfolioId: portfolio.id,
            title: repo.name,
            description: repo.description || `โครงการ ${repo.name} พัฒนาด้วย ${repo.language || "TypeScript / JavaScript"} (${repo.stars} ⭐)`,
            githubUrl: repo.url || null,
          },
        });
      }

      // Write to Audit Log
      await prisma.auditLog.create({
        data: {
          userId: session.user.id as string,
          action: "IMPORT_GITHUB_PROJECT",
          details: `นำเข้าโครงการ GitHub: ${repo.name} (${repo.url}) สู่แฟ้มสะสมผลงานสำเร็จ`,
        },
      });

      return NextResponse.json({ success: true, project: savedProject });
    }

    return NextResponse.json({ error: "คำสั่งไม่ถูกต้อง (Invalid Action)" }, { status: 400 });
  } catch (error: any) {
    console.error("GitHub Sync Error:", error);
    return NextResponse.json({ error: error.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล" }, { status: 500 });
  }
}

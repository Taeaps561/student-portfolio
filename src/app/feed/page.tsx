"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Author {
  id: string;
  name: string | null;
  image: string | null;
  role: string;
}

interface Like {
  id: string;
  userId: string;
  type: string;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

interface PostItem {
  id: string;
  content: string;
  imageUrl?: string | null;
  postType: string;
  tag?: string | null;
  createdAt: string;
  author: Author;
  likes: Like[];
  comments: Comment[];
}

export default function LinkedInFeedPage() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Job prompt visibility (only if logged in)
  const [showJobPrompt, setShowJobPrompt] = useState(true);

  // Create post modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [postType, setPostType] = useState("GENERAL");
  const [postTag, setPostTag] = useState("");
  const [postImageUrl, setPostImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Comments state
  const [openComments, setOpenComments] = useState<{ [key: string]: boolean }>({});
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const isLoggedIn = !!session?.user;

  // Fetch posts
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/posts");
      const data = await res.json();
      if (data.success && data.posts && data.posts.length > 0) {
        setPosts(data.posts);
      } else {
        setPosts(mockLinkedInPosts);
      }
    } catch {
      setPosts(mockLinkedInPosts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: postContent,
          postType,
          tag: postTag || null,
          imageUrl: postImageUrl || null,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPostContent("");
        setPostTag("");
        setPostImageUrl("");
        setIsModalOpen(false);
        fetchPosts();
      } else {
        alert(data.error || "กรุณาเข้าสู่ระบบก่อนทำการโพสต์");
      }
    } catch {
      alert("เกิดข้อผิดพลาดในการโพสต์");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReaction = async (postId: string) => {
    if (!isLoggedIn) {
      alert("กรุณาเข้าสู่ระบบก่อนกดถูกใจโพสต์");
      return;
    }
    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "LIKE" }),
      });
      const data = await res.json();
      if (data.success) {
        fetchPosts();
      }
    } catch {
      // ignore
    }
  };

  const handleAddComment = async (postId: string) => {
    const text = commentInputs[postId];
    if (!text?.trim()) return;
    if (!isLoggedIn) {
      alert("กรุณาเข้าสู่ระบบก่อนแสดงความคิดเห็น");
      return;
    }

    try {
      const res = await fetch(`/api/posts/${postId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
        fetchPosts();
      }
    } catch {
      // ignore
    }
  };

  const handleShare = (postId: string) => {
    const url = `${window.location.origin}/feed#${postId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(postId);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Mock Realistic Feed Posts for SDU Community
  const mockLinkedInPosts: PostItem[] = [
    {
      id: "post-1",
      content: `🏛️ ประกาศรับรองทักษะ DevSecOps และ Digital Skill Passport สำหรับนักศึกษา มหาวิทยาลัยสวนดุสิต\n\nทางคณะเปิดให้นักศึกษาทุกชั้นปีส่งผลงานและสอบวัดระดับสมรรถนะดิจิทัลรอบใหม่ เพื่อรับวุฒิบัตรดิจิทัลพร้อมลายเซ็นเข้ารหัส SHA-256 สำหรับใช้สมัครฝึกงานสหกิจศึกษากับบริษัทพันธมิตรแล้วครับ 🚀\n\n📌 สามารถกดทำแบบทดสอบได้ที่แท็บ "ศูนย์สอบวัดระดับทักษะ" หรือจัดการใบรับรองได้ทันที`,
      postType: "GENERAL",
      tag: "DevSecOps",
      imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80",
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      author: {
        id: "teacher-somchai",
        name: "ศ.ดร.สมชาย ใจดี (Faculty Advisor)",
        image: "https://ui-avatars.com/api/?name=Somchai+Jaidee&background=002d62&color=fff",
        role: "TEACHER",
      },
      likes: [{ id: "l1", userId: "u1", type: "LIKE" }, { id: "l2", userId: "u2", type: "CELEBRATE" }, { id: "l3", userId: "u3", type: "INSIGHTFUL" }],
      comments: [
        {
          id: "c1",
          content: "ขอบพระคุณอาจารย์ครับ เข้าไปทำแบบทดสอบและได้รับ Digital Certificate เรียบร้อยแล้วครับ!",
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          user: {
            id: "u1",
            name: "นายอภิสิทธิ์ ศรีพัฒน์",
            image: "https://ui-avatars.com/api/?name=Apisit+Sripat&background=0a66c2&color=fff",
          },
        },
      ],
    },
    {
      id: "post-2",
      content: `💼 บมจ. เทคโนโลยีดีไลท์ (Delight Technology PCL.) เปิดรับสมัครนิสิต/นักศึกษาฝึกงานและตำแหน่ง Junior Full-stack Developer (Next.js / TypeScript / PostgreSQL)\n\nองค์กรเราเป็นพันธมิตรอย่างเป็นทางการกับ มหาวิทยาลัยสวนดุสิต โดยจะพิจารณานักศึกษาที่มีทักษะผ่านการรับรองจาก SkillPassport เป็นลำดับแรก!\n\n✨ สวัสดิการ: ค่าตอบแทนฝึกงาน, Hybrid Working, โอกาสบรรจุเป็นพนักงานประจำทันทีหลังสำเร็จการศึกษา\n📩 ส่งโปรไฟล์ผ่านระบบ SkillPassport ได้ที่แท็บ "งาน" ได้เลยครับ`,
      postType: "HIRING",
      tag: "NextJS",
      imageUrl: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80",
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      author: {
        id: "employer-wichai",
        name: "คุณวิชัย ปรีชา (บมจ. เทคโนโลยีดีไลท์)",
        image: "https://ui-avatars.com/api/?name=Wichai+Preecha&background=059669&color=fff",
        role: "EMPLOYER",
      },
      likes: [{ id: "l4", userId: "u1", type: "CELEBRATE" }, { id: "l5", userId: "u2", type: "LOVE" }],
      comments: [],
    },
    {
      id: "post-3",
      content: `🚀 ตื่นเต้นมากครับ! พัฒนาระบบ "Student Portfolio & Skill Passport" สำหรับวิชา DevSecOps สำเร็จไปอีกขั้น\n\nระบบนี้สร้างด้วย Next.js 15, Prisma ORM, NextAuth รองรับ Multi-Role RBAC และมีระบบ Digital Certificate Hashing ป้องกันการปลอมแปลงผลงาน\n\nขอขอบคุณอาจารย์และเพื่อนๆ ในกลุ่มที่ช่วยกันพัฒนาครับ 💻✨ #DevSecOps #NextJS #CyberSecurity`,
      postType: "PROJECT_SHOWCASE",
      tag: "CyberSecurity",
      imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      author: {
        id: "student-apisit",
        name: "นายอภิสิทธิ์ ศรีพัฒน์",
        image: "https://ui-avatars.com/api/?name=Apisit+Sripat&background=0a66c2&color=fff",
        role: "STUDENT",
      },
      likes: [{ id: "l6", userId: "u1", type: "LIKE" }, { id: "l7", userId: "u4", type: "CELEBRATE" }, { id: "l8", userId: "u5", type: "LOVE" }],
      comments: [
        {
          id: "c2",
          content: "ยอดเยี่ยมมากครับ สถาปัตยกรรมระบบปลอดภัยและถูกต้องตามหลัก DevSecOps",
          createdAt: new Date(Date.now() - 3600000 * 10).toISOString(),
          user: {
            id: "u3",
            name: "ศ.ดร.สมชาย ใจดี",
            image: "https://ui-avatars.com/api/?name=Somchai+Jaidee&background=002d62&color=fff",
          },
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#f4f2ee] pt-[85px] pb-16 px-4">
      {/* 3-COLUMN MAIN CONTAINER (Exact 1128px) */}
      <div className="max-w-[1128px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* ================= LEFT COLUMN (Approx 225px) ================= */}
        <aside className="md:col-span-4 lg:col-span-3 space-y-2.5">
          
          {isLoggedIn ? (
            /* LOGGED IN USER PROFILE CARD */
            <div className="linkedin-card overflow-hidden text-center relative bg-white">
              {/* Header Cityscape Banner */}
              <div className="h-16 w-full bg-gradient-to-r from-amber-700 via-amber-900 to-stone-900 relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=400&q=80"
                  alt="Banner"
                  className="w-full h-full object-cover opacity-60"
                />
              </div>

              {/* Avatar overlapping with #OPENTOWORK green ring */}
              <div className="relative -mt-9 inline-block">
                <div className="w-[72px] h-[72px] rounded-full p-[2.5px] bg-[#057642] ring-2 ring-white">
                  <img
                    src={
                      session.user?.image ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user?.name || "User")}`
                    }
                    alt="Profile Avatar"
                    className="w-full h-full rounded-full object-cover bg-white"
                  />
                </div>
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#057642] text-white text-[8px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-tighter whitespace-nowrap shadow">
                  #OpenToWork
                </span>
              </div>

              {/* User Details */}
              <div className="px-4 pt-2 pb-4 border-b border-[#e0e0e0]">
                <Link
                  href={`/u/${session.user?.id}`}
                  className="text-base font-bold text-black hover:underline block leading-snug"
                >
                  {session.user?.name}
                </Link>
                <p className="text-xs text-slate-600 mt-0.5 font-medium">
                  {session.user?.role === "TEACHER" ? "อาจารย์ประจำหลักสูตร" : "B.Sc. Cyber Security"}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  กรุงเทพมหานคร
                </p>

                {/* Institution badge */}
                <div className="mt-3 inline-flex items-center gap-1.5 text-left text-xs font-semibold text-slate-900 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                  <span className="text-sm">🏛️</span>
                  <span className="truncate">มหาวิทยาลัยสวนดุสิต</span>
                </div>
              </div>

              {/* Premium upsell */}
              <div className="p-3 text-left border-b border-slate-200 hover:bg-slate-50 transition cursor-pointer">
                <p className="text-[11px] text-slate-500 font-medium">เข้าถึงเครื่องมือและข้อมูลเชิงลึกสุดพิเศษ</p>
                <p className="text-xs font-bold text-amber-700 flex items-center gap-1 mt-0.5">
                  <span>👑</span> ลองใช้ Premium ในราคา ฿0
                </p>
              </div>

              {/* Profile stats */}
              <div className="p-3 text-xs space-y-2 text-left">
                <Link
                  href="/explore"
                  className="flex items-center justify-between hover:bg-slate-50 p-1.5 rounded-lg transition"
                >
                  <span className="text-slate-700 font-semibold leading-tight">
                    การเข้าชมโปรไฟล์ของคุณ
                  </span>
                  <span className="text-[#0a66c2] font-bold">29</span>
                </Link>
                <Link
                  href="/explore"
                  className="flex items-center justify-between hover:bg-slate-50 p-1.5 rounded-lg transition"
                >
                  <span className="text-slate-700 font-semibold leading-tight">
                    การเชื่อมต่อ / คำเชิญ
                  </span>
                  <span className="text-[#0a66c2] font-bold">2</span>
                </Link>
              </div>
            </div>
          ) : (
            /* GUEST (NOT LOGGED IN) CARD */
            <div className="linkedin-card p-5 bg-white space-y-4 text-center">
              <div>
                <h3 className="text-base font-bold text-black">
                  ยินดีต้อนรับสู่เครือข่ายวิชาชีพ
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
                  สำรวจพอร์ตโฟลิโอ ทักษะที่ได้รับการรับรองจากสถาบัน และเชื่อมโยงโอกาสการทำงาน
                </p>
              </div>

              <div className="space-y-2 pt-1">
                <Link
                  href="/login"
                  className="block w-full py-2 bg-[#0a66c2] hover:bg-[#004182] text-white font-bold text-xs rounded-full transition shadow-sm"
                >
                  เข้าสู่ระบบ
                </Link>
                <Link
                  href="/login"
                  className="block w-full py-2 border border-[#0a66c2] text-[#0a66c2] hover:bg-[#ebf4fd] font-bold text-xs rounded-full transition"
                >
                  เข้าร่วมตอนนี้ (สมัครสมาชิก)
                </Link>
              </div>

              <div className="pt-3 border-t border-slate-200 text-left text-xs space-y-2 font-semibold">
                <Link href="/explore" className="text-slate-600 hover:text-[#0a66c2] hover:underline flex items-center justify-between">
                  <span>🔍 สำรวจบุคคลและทักษะ</span>
                  <span>→</span>
                </Link>
                <Link href="/employer" className="text-slate-600 hover:text-[#0a66c2] hover:underline flex items-center justify-between">
                  <span>💼 สำรวจตำแหน่งงาน</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          )}

          {/* Sticky Quick Nav Card */}
          <div className="linkedin-card p-3.5 text-xs text-slate-800 font-bold space-y-3 sticky top-[85px] bg-white">
            <Link href="/portfolio" className="flex items-center gap-2 hover:underline text-slate-600 hover:text-[#0a66c2]">
              <span>🔖</span> รายการที่บันทึกแล้ว
            </Link>
            <Link href="/explore" className="flex items-center gap-2 hover:underline text-slate-600 hover:text-[#0a66c2]">
              <span>👥</span> กลุ่ม
            </Link>
            <Link href="/feed" className="flex items-center gap-2 hover:underline text-slate-600 hover:text-[#0a66c2]">
              <span>📰</span> จดหมายข่าว
            </Link>
            <Link href="/feed" className="flex items-center gap-2 hover:underline text-slate-600 hover:text-[#0a66c2]">
              <span>📅</span> กิจกรรม
            </Link>
            <div className="pt-2 border-t border-slate-200 text-center">
              <Link href="/explore" className="text-[#0a66c2] hover:underline font-bold text-xs">
                สำรวจเพิ่มเติม ▾
              </Link>
            </div>
          </div>

        </aside>

        {/* ================= CENTER COLUMN (Feed & Posts - Approx 555px) ================= */}
        <main className="md:col-span-8 lg:col-span-6 space-y-2.5">
          
          {/* 1. Prompt Banner (Only when logged in) */}
          {isLoggedIn && showJobPrompt && (
            <div className="linkedin-card p-5 relative text-center bg-white shadow-sm">
              <button
                onClick={() => setShowJobPrompt(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-black p-1 text-sm font-bold"
                title="ปิด"
              >
                ✕
              </button>

              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                สวัสดี {session?.user?.name?.split(" ")[0]} คุณกำลังมองหางานอยู่ตอนนี้หรือเปล่า
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                คำตอบของคุณจะปรากฏให้คุณเห็นเท่านั้น
              </p>

              <div className="flex items-center justify-center gap-3 mt-4">
                <button
                  onClick={() => setShowJobPrompt(false)}
                  className="px-8 py-1.5 rounded-full border-2 border-[#0a66c2] text-[#0a66c2] bg-white hover:bg-[#ebf4fd] font-bold text-sm transition"
                >
                  ใช่
                </button>
                <button
                  onClick={() => setShowJobPrompt(false)}
                  className="px-8 py-1.5 rounded-full border-2 border-[#0a66c2] text-[#0a66c2] bg-white hover:bg-[#ebf4fd] font-bold text-sm transition"
                >
                  ไม่
                </button>
              </div>
            </div>
          )}

          {/* 2. Start a Post Box (กล่องเริ่มโพสต์) */}
          <div className="linkedin-card p-3.5 bg-white space-y-2.5">
            <div className="flex items-center gap-2.5">
              <img
                src={
                  isLoggedIn
                    ? session?.user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(session?.user?.name || "User")}`
                    : "https://static.licdn.com/aero-v1/sc/h/1c5u578iilxfxf448nv91icxo"
                }
                alt="Avatar"
                className="w-12 h-12 rounded-full object-cover bg-gray-100 ring-2 ring-slate-100"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=Guest";
                }}
              />
              <button
                onClick={() => {
                  if (isLoggedIn) {
                    setIsModalOpen(true);
                  } else {
                    alert("กรุณาเข้าสู่ระบบเพื่อเริ่มสร้างโพสต์");
                  }
                }}
                className="flex-1 text-left px-4 py-3 rounded-full border border-slate-300 hover:bg-[#f3f2ef] text-sm text-slate-600 hover:text-slate-900 font-semibold transition cursor-pointer"
              >
                เริ่มโพสต์ข้อความหรือแชร์ผลงาน...
              </button>
            </div>

            {/* Quick Action buttons */}
            <div className="flex items-center justify-around pt-1 border-t border-slate-100">
              <button
                onClick={() => (isLoggedIn ? setIsModalOpen(true) : alert("กรุณาเข้าสู่ระบบเพื่อเพิ่มสื่อ"))}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 text-xs font-bold text-slate-700 transition cursor-pointer"
              >
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-8.5 7a1.5 1.5 0 1 1 1.5-1.5 1.5 1.5 0 0 1-1.5 1.5zm6.5 7H7l3.5-4.5 2.5 3 3.5-4.5z" />
                </svg>
                <span className="text-slate-800 font-bold">สื่อ</span>
              </button>

              <button
                onClick={() => (isLoggedIn ? setIsModalOpen(true) : alert("กรุณาเข้าสู่ระบบเพื่อสร้างกิจกรรม"))}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 text-xs font-bold text-slate-700 transition cursor-pointer"
              >
                <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 16H5V9h14z" />
                </svg>
                <span className="text-slate-800 font-bold">กิจกรรม</span>
              </button>

              <button
                onClick={() => (isLoggedIn ? setIsModalOpen(true) : alert("กรุณาเข้าสู่ระบบเพื่อเขียนบทความ"))}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 text-xs font-bold text-slate-700 transition cursor-pointer"
              >
                <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-2 14H7v-2h10zm0-4H7v-2h10zm0-4H7V7h10z" />
                </svg>
                <span className="text-slate-800 font-bold">เขียนบทความ</span>
              </button>
            </div>
          </div>

          {/* Sort Divider */}
          <div className="flex items-center gap-2 px-1">
            <div className="flex-1 h-[1px] bg-[#e0e0e0]"></div>
            <span className="text-[11px] text-[#00000099] flex items-center gap-1 cursor-pointer">
              จัดเรียงตาม: <strong className="text-black">ยอดนิยม</strong> ▾
            </span>
          </div>

          {/* 3. Feed Posts Stream */}
          <div className="space-y-2.5">
            {posts.map((post) => {
              const isLiked = post.likes.some((l) => l.userId === session?.user?.id);
              const isCommentsOpen = !!openComments[post.id];

              return (
                <article key={post.id} id={post.id} className="linkedin-card bg-white overflow-hidden">
                  
                  {/* Context line */}
                  <div className="px-4 pt-3 pb-1 border-b border-[#f3f2ef] flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1.5 truncate font-medium">
                      {post.postType === "HIRING" ? (
                        <>💼 <strong className="text-emerald-700 font-bold">โอกาสร่วมงานและสหกิจศึกษา</strong></>
                      ) : post.postType === "PROJECT_SHOWCASE" ? (
                        <>🚀 <strong className="text-[#0a66c2] font-bold">ผลงานและนวัตกรรมนักศึกษา</strong></>
                      ) : post.postType === "CERTIFICATE_EARNED" ? (
                        <>📜 <strong className="text-purple-700 font-bold">การรับรองสมรรถนะทักษะดิจิทัล</strong></>
                      ) : (
                        <>🏛️ <strong className="text-slate-700 font-bold">ข่าวสารและประกาศจากคณาจารย์ มสด.</strong></>
                      )}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 font-bold text-slate-600">
                        {post.tag ? `#${post.tag}` : "#SDU"}
                      </span>
                    </div>
                  </div>

                  {/* Post Header */}
                  <div className="p-4 pb-2 flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Link href={`/u/${post.author.id}`}>
                        <img
                          src={
                            post.author.image ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.name || "User")}&background=0a66c2&color=fff`
                          }
                          alt={post.author.name || "Author"}
                          className="w-12 h-12 rounded-full object-cover border border-slate-200 ring-2 ring-slate-100"
                        />
                      </Link>
                      <div>
                        <Link
                          href={`/u/${post.author.id}`}
                          className="text-sm font-bold text-slate-900 hover:underline hover:text-[#0a66c2] block"
                        >
                          {post.author.name}
                        </Link>
                        <p className="text-[11px] text-slate-500 font-medium">
                          {post.author.role === "TEACHER"
                            ? "🏛️ อาจารย์ประจำภาควิชา • มหาวิทยาลัยสวนดุสิต"
                            : post.author.role === "EMPLOYER"
                            ? "🏢 ผู้ประกอบการพันธมิตรทางการ มสด."
                            : "🎓 นักศึกษา • วิทยาการคอมพิวเตอร์ มสด."}
                        </p>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <span>{new Date(post.createdAt).toLocaleDateString("th-TH", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                          <span>•</span>
                          <span title="สาธารณะ">🌐 สาธารณะ</span>
                        </p>
                      </div>
                    </div>

                    <button className="text-[#0a66c2] hover:bg-[#ebf4fd] px-3 py-1 rounded-full text-xs font-bold transition flex items-center gap-1 shrink-0">
                      <span>+</span> ติดตาม
                    </button>
                  </div>

                  {/* Post Content */}
                  <div className="px-4 py-2 text-sm text-[#000000e6] leading-relaxed whitespace-pre-line">
                    {post.content}
                  </div>

                  <div className="px-4 pb-2">
                    <button className="text-xs font-semibold text-[#0a66c2] hover:underline">
                      แสดงคำแปล
                    </button>
                  </div>

                  {/* Media Embed */}
                  {post.imageUrl && (
                    <div className="w-full bg-slate-900 border-y border-[#e0e0e0] max-h-[420px] overflow-hidden flex items-center justify-center">
                      <img
                        src={post.imageUrl}
                        alt="Post media"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Reaction Summary Line */}
                  <div className="px-4 py-2 flex items-center justify-between text-xs text-[#00000099] border-b border-[#e0e0e0]">
                    <div className="flex items-center gap-1">
                      <span className="inline-flex items-center -space-x-1">
                        <span className="w-4 h-4 rounded-full bg-[#0a66c2] text-white text-[9px] flex items-center justify-center">👍</span>
                        <span className="w-4 h-4 rounded-full bg-[#057642] text-white text-[9px] flex items-center justify-center">👏</span>
                        <span className="w-4 h-4 rounded-full bg-[#df704d] text-white text-[9px] flex items-center justify-center">💡</span>
                      </span>
                      <span className="ml-1">{post.likes.length + 18} คน</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setOpenComments((prev) => ({ ...prev, [post.id]: !prev[post.id] }))}
                        className="hover:underline hover:text-[#0a66c2]"
                      >
                        {post.comments.length + 4} ความคิดเห็น
                      </button>
                      <span>•</span>
                      <span>2 การส่งต่อ</span>
                    </div>
                  </div>

                  {/* 4 Action Buttons Bar */}
                  <div className="px-2 py-1 flex items-center justify-between text-xs font-bold text-[#00000099]">
                    <button
                      onClick={() => handleReaction(post.id)}
                      className={`flex-1 py-2.5 rounded hover:bg-[#f3f2ef] flex items-center justify-center gap-1.5 transition ${
                        isLiked ? "text-[#0a66c2]" : ""
                      }`}
                    >
                      <span>👍</span>
                      <span>ถูกใจ</span>
                    </button>

                    <button
                      onClick={() => setOpenComments((prev) => ({ ...prev, [post.id]: !prev[post.id] }))}
                      className="flex-1 py-2.5 rounded hover:bg-[#f3f2ef] flex items-center justify-center gap-1.5 transition"
                    >
                      <span>💬</span>
                      <span>ความคิดเห็น</span>
                    </button>

                    <button
                      onClick={() => handleShare(post.id)}
                      className="flex-1 py-2.5 rounded hover:bg-[#f3f2ef] flex items-center justify-center gap-1.5 transition"
                    >
                      <span>🔁</span>
                      <span>ส่งต่อ</span>
                    </button>

                    <button
                      onClick={() => handleShare(post.id)}
                      className="flex-1 py-2.5 rounded hover:bg-[#f3f2ef] flex items-center justify-center gap-1.5 transition"
                    >
                      <span>📤</span>
                      <span>{copiedId === post.id ? "คัดลอกแล้ว!" : "ส่ง"}</span>
                    </button>
                  </div>

                  {/* Expandable Comments */}
                  {isCommentsOpen && (
                    <div className="px-4 py-3 bg-[#f8fafc] border-t border-[#e0e0e0] space-y-3">
                      {/* Comment Input */}
                      {isLoggedIn ? (
                        <div className="flex items-start gap-2">
                          <img
                            src={
                              session?.user?.image ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(session?.user?.name || "User")}`
                            }
                            alt="Me"
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div className="flex-1 flex gap-2">
                            <input
                              type="text"
                              value={commentInputs[post.id] || ""}
                              onChange={(e) =>
                                setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleAddComment(post.id);
                              }}
                              placeholder="เพิ่มความคิดเห็น..."
                              className="flex-1 px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-[#0a66c2]"
                            />
                            <button
                              onClick={() => handleAddComment(post.id)}
                              className="px-3 py-1 bg-[#0a66c2] hover:bg-[#004182] text-white text-xs font-bold rounded-full transition"
                            >
                              โพสต์
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-2 text-xs text-[#00000099]">
                          <Link href="/login" className="text-[#0a66c2] font-bold hover:underline">
                            เข้าสู่ระบบ
                          </Link>{" "}
                          เพื่อร่วมแสดงความคิดเห็น
                        </div>
                      )}

                      {/* Comments list */}
                      <div className="space-y-2 pt-1">
                        {post.comments.map((c) => (
                          <div key={c.id} className="flex items-start gap-2">
                            <img
                              src={
                                c.user.image ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(c.user.name || "User")}`
                              }
                              alt={c.user.name || "User"}
                              className="w-7 h-7 rounded-full object-cover mt-0.5"
                            />
                            <div className="flex-1 bg-white p-2.5 rounded-lg border border-gray-200 text-xs">
                              <p className="font-bold text-black">{c.user.name}</p>
                              <p className="text-gray-700 mt-0.5">{c.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </article>
              );
            })}
          </div>

        </main>

        {/* ================= RIGHT COLUMN (SDU News & Trending Skills - Approx 300px) ================= */}
        <aside className="hidden lg:block lg:col-span-3 space-y-2.5">
          
          {/* ข่าวสารและประกาศ มสด. */}
          <div className="linkedin-card p-4 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <span>📰</span> ข่าวสารและประกาศ มสด.
              </h3>
              <span className="text-gray-400 cursor-pointer text-xs" title="ข่าวสาร">ℹ️</span>
            </div>

            <p className="text-[11px] font-bold text-[#0a66c2]">เรื่องราวยอดนิยมในแคมปัส</p>

            <ul className="space-y-3 text-xs">
              {[
                { title: "มสด. ขยายความร่วมมือสหกิจศึกษากับ 30+ องค์กรไอทีชั้นนำ", time: "2 ชม. ที่แล้ว", readers: "1,420 คน" },
                { title: "เปิดรับสมัครโครงการ SDU Cyber Defense & DevSecOps Workshop", time: "5 ชม. ที่แล้ว", readers: "980 คน" },
                { title: "บมจ. เทคโนโลยีดีไลท์ เปิดรับฝึกงานผ่านระบบ SkillPassport", time: "1 วันที่แล้ว", readers: "2,150 คน" },
                { title: "กำหนดการสอบวัดระดับสมรรถนะทักษะดิจิทัลกลาง ประจำปี 2026", time: "2 วันที่แล้ว", readers: "3,420 คน" },
                { title: "ขอแสดงความยินดีกับทีมชนะเลิศการแข่งขัน SDU Hackathon", time: "3 วันที่แล้ว", readers: "1,890 คน" },
              ].map((news, idx) => (
                <li key={idx} className="group cursor-pointer border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                  <p className="font-bold text-slate-900 group-hover:text-[#0a66c2] group-hover:underline truncate leading-snug">
                    {news.title}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {news.time} • ผู้อ่าน {news.readers}
                  </p>
                </li>
              ))}
            </ul>

            <Link href="/explore" className="text-xs font-bold text-[#0a66c2] hover:underline block pt-1">
              สำรวจเครือข่าย มสด. ทั้งหมด ▾
            </Link>
          </div>

          {/* ทักษะและเทรนด์ยอดนิยม */}
          <div className="linkedin-card p-4 bg-white space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <span>⚡</span> ทักษะยอดนิยมในระบบ (Trending)
            </h3>

            <div className="space-y-2 text-xs">
              {[
                { icon: "🛡️", name: "#DevSecOps", desc: "รับรองแล้ว 48 คน", color: "bg-blue-50 text-blue-700" },
                { icon: "⚡", name: "#NextJS", desc: "รับรองแล้ว 64 คน", color: "bg-emerald-50 text-emerald-700" },
                { icon: "🔒", name: "#CyberSecurity", desc: "รับรองแล้ว 35 คน", color: "bg-amber-50 text-amber-700" },
                { icon: "🗄️", name: "#PrismaORM", desc: "รับรองแล้ว 42 คน", color: "bg-purple-50 text-purple-700" },
                { icon: "📘", name: "#TypeScript", desc: "รับรองแล้ว 56 คน", color: "bg-sky-50 text-sky-700" },
              ].map((skill, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-[#f3f2ef] cursor-pointer transition border border-slate-100"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{skill.icon}</span>
                    <div>
                      <p className="font-bold text-slate-900">{skill.name}</p>
                      <p className="text-[10px] text-slate-500">{skill.desc}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${skill.color}`}>
                    HOT
                  </span>
                </div>
              ))}
            </div>

            <Link href="/skills" className="text-xs font-bold text-[#0a66c2] hover:underline block pt-1 text-center">
              ศูนย์สอบวัดระดับทักษะ ↗
            </Link>
          </div>

          {/* SDU Footer Links */}
          <footer className="px-2 text-[11px] text-slate-500 space-y-2 text-center">
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-1">
              <Link href="/about" className="hover:text-[#0a66c2] hover:underline">เกี่ยวกับระบบ</Link>
              <Link href="/explore" className="hover:text-[#0a66c2] hover:underline">ค้นหาบุคคล</Link>
              <Link href="/certificates" className="hover:text-[#0a66c2] hover:underline">วุฒิบัตร</Link>
              <Link href="/settings" className="hover:text-[#0a66c2] hover:underline">ความเป็นส่วนตัว</Link>
              <Link href="/employer" className="hover:text-[#0a66c2] hover:underline">สำหรับนายจ้าง</Link>
            </div>
            <p className="pt-1 flex items-center justify-center gap-1.5 text-slate-600">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/e/ee/Logo_of_Suan_Dusit_University.svg?utm_source=th.wikipedia.org&utm_campaign=index&utm_content=original"
                alt="SDU"
                className="w-4 h-4 object-contain"
              />
              <span className="font-semibold text-slate-700">มหาวิทยาลัยสวนดุสิต © 2026</span>
            </p>
          </footer>

        </aside>

      </div>

      {/* CREATE POST MODAL POPUP */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 shadow-2xl border border-[#e0e0e0] space-y-4">
            
            <div className="flex items-center justify-between border-b border-[#e0e0e0] pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={
                    session?.user?.image ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(session?.user?.name || "User")}`
                  }
                  alt="Avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-black text-sm">{session?.user?.name || "ผู้ใช้งาน"}</h4>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
                    🌐 สาธารณะ
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-black p-1 text-base font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="คุณต้องการพูดคุยเกี่ยวกับอะไร..."
                rows={5}
                className="w-full text-sm text-gray-900 placeholder-gray-500 border-none resize-none focus:outline-none"
                autoFocus
                required
              />

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#e0e0e0]">
                <input
                  type="text"
                  value={postTag}
                  onChange={(e) => setPostTag(e.target.value)}
                  placeholder="แท็กทักษะ (เช่น CyberSecurity, React)"
                  className="px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0a66c2]"
                />
                <input
                  type="text"
                  value={postImageUrl}
                  onChange={(e) => setPostImageUrl(e.target.value)}
                  placeholder="URL รูปภาพประกอบ"
                  className="px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0a66c2]"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#e0e0e0]">
                <div className="flex items-center gap-2 text-gray-500">
                  <span className="p-2 hover:bg-gray-100 rounded-full cursor-pointer" title="เพิ่มรูปภาพ">🖼️</span>
                  <span className="p-2 hover:bg-gray-100 rounded-full cursor-pointer" title="เพิ่มกิจกรรม">📅</span>
                  <span className="p-2 hover:bg-gray-100 rounded-full cursor-pointer" title="ฉลองความสำเร็จ">🎉</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !postContent.trim()}
                  className="px-6 py-1.5 rounded-full bg-[#0a66c2] hover:bg-[#004182] text-white font-bold text-sm transition disabled:opacity-50"
                >
                  {isSubmitting ? "กำลังโพสต์..." : "โพสต์"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}

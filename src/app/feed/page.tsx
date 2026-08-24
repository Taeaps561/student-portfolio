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
  type: "LIKE" | "CELEBRATE" | "SUPPORT" | "LOVE" | "INSIGHTFUL";
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

const REACTION_CONFIG = {
  LIKE: { emoji: "👍", label: "ถูกใจ", color: "text-[#0a66c2]", bg: "bg-blue-50" },
  CELEBRATE: { emoji: "👏", label: "ปรบมือ", color: "text-emerald-600", bg: "bg-emerald-50" },
  SUPPORT: { emoji: "🚀", label: "สนับสนุน", color: "text-purple-600", bg: "bg-purple-50" },
  LOVE: { emoji: "❤️", label: "ประทับใจ", color: "text-rose-600", bg: "bg-rose-50" },
  INSIGHTFUL: { emoji: "💡", label: "มีประโยชน์", color: "text-amber-600", bg: "bg-amber-50" },
};

export default function LinkedInFeedPage() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Job prompt visibility
  const [showJobPrompt, setShowJobPrompt] = useState(true);

  // Create post modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [postType, setPostType] = useState("GENERAL");
  const [postTag, setPostTag] = useState("");
  const [postImageUrl, setPostImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reaction hover dock state
  const [hoveredReactionPostId, setHoveredReactionPostId] = useState<string | null>(null);

  // Comments state
  const [openComments, setOpenComments] = useState<{ [key: string]: boolean }>({});
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isLoggedIn = !!session?.user;
  const currentUserId = session?.user?.id || "current-user";

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Mock Initial Community Posts
  const mockLinkedInPosts: PostItem[] = [
    {
      id: "post-1",
      content: `🎉 ยินดีกับความสำเร็จ! ผ่านการสอบวัดระดับและได้รับการรับรองสมรรถนะทักษะ Next.js 15 & React จากมหาวิทยาลัยสวนดุสิตเรียบร้อยแล้วครับ 🏛️✨\n\nระบบ SkillPassport มีการออกวุฒิบัตรดิจิทัลพร้อมลายเซ็นเข้ารหัส SHA-256 ป้องกันการปลอมแปลงผลงาน ช่วยเพิ่มความมั่นใจในการยื่นสมัครงานและสหกิจศึกษามากครับ 🚀 #NextJS #SkillPassport #DevSecOps`,
      postType: "CERTIFICATE_EARNED",
      tag: "NextJS",
      imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      author: {
        id: "mock-test",
        name: "นักศึกษา ทดสอบ",
        image: "https://ui-avatars.com/api/?name=Student+Test&background=0a66c2&color=fff",
        role: "STUDENT",
      },
      likes: [
        { id: "l1", userId: "u1", type: "CELEBRATE" },
        { id: "l2", userId: "u2", type: "LIKE" },
        { id: "l3", userId: "u3", type: "SUPPORT" },
        { id: "l4", userId: "u4", type: "INSIGHTFUL" },
      ],
      comments: [
        {
          id: "c1",
          content: "ยินดีด้วยครับ! ทักษะตรงกับที่บริษัทเรากำลังตามหาเลยครับ สนใจสมัครสหกิจศึกษาได้เลยนะครับ 🎉",
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          user: {
            id: "employer-wichai",
            name: "คุณวิชัย ปรีชา (บมจ. เทคโนโลยีดีไลท์)",
            image: "https://ui-avatars.com/api/?name=Wichai+Preecha&background=059669&color=fff",
          },
        },
        {
          id: "c2",
          content: "ยินดีด้วยครับ ผลงานและคะแนนการประเมิน Rubrics อยู่ในเกณฑ์ยอดเยี่ยมมากครับ 👏",
          createdAt: new Date(Date.now() - 1800000).toISOString(),
          user: {
            id: "teacher-somchai",
            name: "ศ.ดร.สมชาย ใจดี",
            image: "https://ui-avatars.com/api/?name=Somchai+Jaidee&background=002d62&color=fff",
          },
        },
      ],
    },
    {
      id: "post-2",
      content: `📜 ข่าวดีประจำสัปดาห์! สอบผ่านใบรับรองสากล Cisco Certified Network Associate (CCNA 200-301) และ CompTIA Security+ แล้วครับ 🛡️💻\n\nนำรหัสใบรับรองมาเพิ่มในระบบ SkillPassport พร้อมสร้าง Digital Signature เรียบร้อย ขอบคุณคำแนะนำจากอาจารย์ที่ปรึกษาทุกท่านครับ! #CCNA #CompTIA #CyberSecurity`,
      postType: "CERTIFICATE_EARNED",
      tag: "CyberSecurity",
      imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
      createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
      author: {
        id: "mock-saifah",
        name: "สายฟ้า แฮกเกอร์",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
        role: "STUDENT",
      },
      likes: [
        { id: "l5", userId: "u1", type: "CELEBRATE" },
        { id: "l6", userId: "u2", type: "LOVE" },
        { id: "l7", userId: "u3", type: "LIKE" },
      ],
      comments: [
        {
          id: "c3",
          content: "สุดยอดมากสายฟ้า! ใบเซอร์มาตรฐานสากลครบทั้ง Network และ Security เลย 🔥",
          createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
          user: {
            id: "mock-somchai",
            name: "สมชาย ยอดนักโค้ด",
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
          },
        },
      ],
    },
    {
      id: "post-3",
      content: `💼 บมจ. เทคโนโลยีดีไลท์ (Delight Technology PCL.) เปิดรับสมัครนิสิต/นักศึกษาฝึกงานและตำแหน่ง Junior Full-stack Developer (Next.js / TypeScript / PostgreSQL)\n\nองค์กรเราเป็นพันธมิตรอย่างเป็นทางการกับ มหาวิทยาลัยสวนดุสิต โดยจะพิจารณานักศึกษาที่มีทักษะผ่านการรับรองจาก SkillPassport เป็นลำดับแรก!\n\n✨ สวัสดิการ: ค่าตอบแทนฝึกงาน, Hybrid Working, โอกาสบรรจุเป็นพนักงานประจำทันทีหลังสำเร็จการศึกษา\n📩 ส่งโปรไฟล์ผ่านระบบ SkillPassport ได้ที่แท็บ "งาน" ได้เลยครับ`,
      postType: "HIRING",
      tag: "NextJS",
      imageUrl: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80",
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      author: {
        id: "employer-wichai",
        name: "คุณวิชัย ปรีชา (บมจ. เทคโนโลยีดีไลท์)",
        image: "https://ui-avatars.com/api/?name=Wichai+Preecha&background=059669&color=fff",
        role: "EMPLOYER",
      },
      likes: [
        { id: "l8", userId: "u1", type: "LIKE" },
        { id: "l9", userId: "u2", type: "LOVE" },
      ],
      comments: [],
    },
  ];

  // Fetch posts from API or initialize
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

  // Quick Achievement Template Selector
  const handleOpenAchievementModal = (type: "SKILL" | "CERT" | "JOB" | "PROJECT") => {
    if (!isLoggedIn) {
      alert("กรุณาเข้าสู่ระบบก่อนทำการโพสต์ประกาศความสำเร็จ");
      return;
    }

    if (type === "SKILL") {
      setPostContent("🎉 ยินดีกับตนเอง! ผ่านการสอบวัดระดับและได้รับการรับรองทักษะ Next.js 15 & React จากมหาวิทยาลัยสวนดุสิตเรียบร้อยแล้วครับ 🏛️✨\n\nพร้อมเปิดรับโอกาสการฝึกงานสหกิจศึกษาและทำงานร่วมกับองค์กรพันธมิตรครับ 💻 #NextJS #SDU #SkillPassport");
      setPostTag("NextJS");
      setPostType("CERTIFICATE_EARNED");
      setPostImageUrl("https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80");
    } else if (type === "CERT") {
      setPostContent("📜 สำเร็จไปอีกขั้น! สอบผ่านใบรับรองสากล Cisco Certified Network Associate (CCNA 200-301) และ CompTIA Security+ เรียบร้อยแล้วครับ 🛡️\n\nตรวจสอบลายเซ็นดิจิทัล SHA-256 บนโปรไฟล์ได้ทันที #CCNA #SecurityPlus #Cisco");
      setPostTag("CCNA");
      setPostType("CERTIFICATE_EARNED");
      setPostImageUrl("https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80");
    } else if (type === "JOB") {
      setPostContent("💼 มีความยินดีเป็นอย่างยิ่งที่จะประกาศว่า ได้รับการตอบรับเข้าฝึกงานโครงการสหกิจศึกษากับ บมจ. เทคโนโลยีดีไลท์ ในตำแหน่ง Full-Stack Developer แล้วครับ! 🚀\n\nขอขอบคุณอาจารย์และระบบ SkillPassport ที่ช่วยเชื่อมโยงโอกาสดีๆ ครับ ✨ #Internship #DelightTech");
      setPostTag("Internship");
      setPostType("HIRING");
      setPostImageUrl("https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80");
    } else if (type === "PROJECT") {
      setPostContent("🚀 เปิดตัวผลงานใหม่! พัฒนาระบบโครงงานนวัตกรรม 'Suan Dusit SkillPassport & DevSecOps Platform' เสร็จสมบูรณ์แล้ว 💻\n\nสามารถเข้าชมซอร์สโค้ดและทดสอบระบบได้ผ่าน GitHub ↗ #DevSecOps #OpenSource #Portfolio");
      setPostTag("DevSecOps");
      setPostType("PROJECT_SHOWCASE");
      setPostImageUrl("https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80");
    }

    setIsModalOpen(true);
  };

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

      const newPost: PostItem = {
        id: `post-${Date.now()}`,
        content: postContent,
        postType,
        tag: postTag || "SDU",
        imageUrl: postImageUrl || null,
        createdAt: new Date().toISOString(),
        author: {
          id: session?.user?.id || "current-user",
          name: session?.user?.name || "ผู้ใช้งาน",
          image: session?.user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(session?.user?.name || "User")}`,
          role: session?.user?.role || "STUDENT",
        },
        likes: [],
        comments: [],
      };

      setPosts([newPost, ...posts]);
      setPostContent("");
      setPostTag("");
      setPostImageUrl("");
      setIsModalOpen(false);
      showToast("✓ โพสต์ผลงานและความสำเร็จของคุณลงใน Feed เรียบร้อยแล้ว! 🎉");
    } catch {
      showToast("เกิดข้อผิดพลาดในการโพสต์");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Multi-Reaction Click (Like, Celebrate, Support, Love, Insightful)
  const handleSelectReaction = async (postId: string, reactionType: "LIKE" | "CELEBRATE" | "SUPPORT" | "LOVE" | "INSIGHTFUL") => {
    if (!isLoggedIn) {
      alert("กรุณาเข้าสู่ระบบก่อนร่วมแสดงความรู้สึก");
      return;
    }

    setHoveredReactionPostId(null);

    // Optimistic UI Update
    setPosts((prevPosts) =>
      prevPosts.map((p) => {
        if (p.id !== postId) return p;
        const existingIndex = p.likes.findIndex((l) => l.userId === currentUserId);
        let updatedLikes = [...p.likes];

        if (existingIndex > -1) {
          if (updatedLikes[existingIndex].type === reactionType) {
            // Toggle off
            updatedLikes.splice(existingIndex, 1);
          } else {
            // Change type
            updatedLikes[existingIndex] = { ...updatedLikes[existingIndex], type: reactionType };
          }
        } else {
          // Add new
          updatedLikes.push({
            id: `like-${Date.now()}`,
            userId: currentUserId,
            type: reactionType,
          });
        }
        return { ...p, likes: updatedLikes };
      })
    );

    try {
      await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: reactionType }),
      });
    } catch {
      // Ignored for optimistic mock posts
    }
  };

  // Quick Comment / Custom Comment submission
  const handleAddComment = async (postId: string, customText?: string) => {
    const text = customText || commentInputs[postId];
    if (!text?.trim()) return;

    if (!isLoggedIn) {
      alert("กรุณาเข้าสู่ระบบก่อนแสดงความคิดเห็น");
      return;
    }

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      content: text.trim(),
      createdAt: new Date().toISOString(),
      user: {
        id: currentUserId,
        name: session?.user?.name || "ผู้ใช้งาน",
        image: session?.user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(session?.user?.name || "User")}`,
      },
    };

    // Optimistic UI update
    setPosts((prevPosts) =>
      prevPosts.map((p) => {
        if (p.id !== postId) return p;
        return { ...p, comments: [...p.comments, newComment] };
      })
    );

    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
    showToast("✓ แสดงความคิดเห็นเรียบร้อยแล้ว");

    try {
      await fetch(`/api/posts/${postId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text.trim() }),
      });
    } catch {
      // Ignored for optimistic UI
    }
  };

  const handleShare = (postId: string) => {
    const url = `${window.location.origin}/feed#${postId}`;
    navigator.clipboard.writeText(url);
    showToast("✓ คัดลอกลิงก์โพสต์ผลงานเรียบร้อยแล้ว! 🔗");
  };

  return (
    <div className="min-h-screen bg-[#f4f2ee] pt-[85px] pb-16 px-4">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[100] bg-white border-2 border-[#0a66c2] text-slate-900 px-5 py-3 rounded-2xl text-xs font-black shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-3 whitespace-nowrap">
          <span className="text-base">🔗</span>
          <span className="font-extrabold text-slate-900" style={{ color: "#0f172a" }}>
            {toastMessage}
          </span>
        </div>
      )}

      {/* 3-COLUMN MAIN CONTAINER (Exact 1128px) */}
      <div className="max-w-[1128px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* ================= LEFT COLUMN (Approx 225px) ================= */}
        <aside className="md:col-span-4 lg:col-span-3 space-y-2.5">
          
          {isLoggedIn ? (
            /* LOGGED IN USER PROFILE CARD */
            <div className="linkedin-card overflow-hidden text-center relative bg-white shadow-sm">
              <div className="h-16 w-full bg-gradient-to-r from-[#002d62] via-[#004182] to-slate-900 relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=400&q=80"
                  alt="Banner"
                  className="w-full h-full object-cover opacity-60"
                />
              </div>

              {/* Avatar */}
              <div className="relative -mt-9 inline-block">
                <div className="w-[72px] h-[72px] rounded-full p-[2.5px] bg-[#057642] ring-2 ring-white shadow-sm">
                  <img
                    src={
                      session.user?.image ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user?.name || "User")}&background=002d62&color=fff`
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
                  href={`/u/${session.user?.id || "mock-test"}`}
                  className="text-base font-bold text-black hover:underline block leading-snug"
                >
                  {session.user?.name}
                </Link>
                <p className="text-xs text-slate-600 mt-0.5 font-medium">
                  {session.user?.role === "TEACHER"
                    ? "🏛️ อาจารย์ประจำภาควิชา"
                    : session.user?.role === "EMPLOYER"
                    ? "🏢 ผู้ประกอบการพันธมิตร"
                    : "🎓 นักศึกษา • วท.บ. วิทยาการคอมพิวเตอร์"}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  มหาวิทยาลัยสวนดุสิต
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
                  <span className="text-[#0a66c2] font-bold">34</span>
                </Link>
                <Link
                  href="/explore"
                  className="flex items-center justify-between hover:bg-slate-50 p-1.5 rounded-lg transition"
                >
                  <span className="text-slate-700 font-semibold leading-tight">
                    การเชื่อมต่อวิชาชีพ
                  </span>
                  <span className="text-[#0a66c2] font-bold">12</span>
                </Link>
              </div>
            </div>
          ) : (
            /* GUEST CARD */
            <div className="linkedin-card p-5 bg-white space-y-4 text-center shadow-sm">
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
                  สมัครสมาชิกใหม่
                </Link>
              </div>
            </div>
          )}

          {/* Quick Nav Card */}
          <div className="linkedin-card p-3.5 text-xs text-slate-800 font-bold space-y-3 bg-white shadow-xs">
            <Link href="/portfolio" className="flex items-center gap-2 hover:underline text-slate-600 hover:text-[#0a66c2]">
              <span>🔖</span> รายการที่บันทึกแล้ว
            </Link>
            <Link href="/skills" className="flex items-center gap-2 hover:underline text-slate-600 hover:text-[#0a66c2]">
              <span>⚡</span> ศูนย์สอบวัดระดับทักษะ
            </Link>
            <Link href="/certificates" className="flex items-center gap-2 hover:underline text-slate-600 hover:text-[#0a66c2]">
              <span>📜</span> วุฒิบัตรดิจิทัล SHA-256
            </Link>
          </div>

        </aside>

        {/* ================= CENTER COLUMN (Feed & Posts - Approx 555px) ================= */}
        <main className="md:col-span-8 lg:col-span-6 space-y-3">
          
          {/* 1. Prompt Banner (Only for STUDENT role) */}
          {isLoggedIn && session?.user?.role === "STUDENT" && showJobPrompt && (
            <div className="linkedin-card p-4 relative text-center bg-white shadow-sm border border-slate-200">
              <button
                onClick={() => setShowJobPrompt(false)}
                className="absolute top-2.5 right-3 text-gray-400 hover:text-black text-xs font-bold"
              >
                ✕
              </button>

              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                สวัสดีคุณ {session?.user?.name?.split(" ")[0]} กำลังมองหาตำแหน่งงานหรือสหกิจศึกษาอยู่หรือไม่?
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                เลือกตอบเพื่อปรับแต่งข้อเสนองานที่ตรงกับทักษะของคุณ
              </p>

              <div className="flex items-center justify-center gap-3 mt-3">
                <Link
                  href="/jobs"
                  className="px-6 py-1.5 rounded-full bg-[#0a66c2] text-white hover:bg-[#004182] font-bold text-xs transition"
                >
                  กำลังมองหางาน 💼
                </Link>
                <button
                  onClick={() => setShowJobPrompt(false)}
                  className="px-6 py-1.5 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs transition"
                >
                  ยังไม่เปิดรับ
                </button>
              </div>
            </div>
          )}

          {/* 2. Start a Post Box with Quick Celebrate Buttons */}
          <div className="linkedin-card p-4 bg-white space-y-3 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3">
              <img
                src={
                  isLoggedIn
                    ? session?.user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(session?.user?.name || "User")}&background=002d62&color=fff`
                    : "https://ui-avatars.com/api/?name=Guest"
                }
                alt="Avatar"
                className="w-11 h-11 rounded-full object-cover bg-gray-100 ring-2 ring-slate-100 shrink-0"
              />
              <button
                onClick={() => {
                  if (isLoggedIn) {
                    setIsModalOpen(true);
                  } else {
                    alert("กรุณาเข้าสู่ระบบเพื่อเริ่มสร้างโพสต์");
                  }
                }}
                className="flex-1 text-left px-4 py-2.5 rounded-full border border-slate-300 hover:bg-[#f3f2ef] text-xs text-slate-600 hover:text-slate-900 font-semibold transition cursor-pointer"
              >
                เริ่มโพสต์ข้อความ, อัปเดตผลงาน หรือประกาศความสำเร็จ...
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

          {/* 3. Feed Posts Stream */}
          <div className="space-y-3">
            {posts.map((post) => {
              const userReaction = post.likes.find((l) => l.userId === currentUserId);
              const isLiked = !!userReaction;
              const isCommentsOpen = !!openComments[post.id];

              // Group likes by type
              const likeCount = post.likes.length;
              const hasCelebrate = post.likes.some((l) => l.type === "CELEBRATE");
              const hasLove = post.likes.some((l) => l.type === "LOVE");
              const hasSupport = post.likes.some((l) => l.type === "SUPPORT");

              return (
                <article key={post.id} id={post.id} className="linkedin-card bg-white overflow-hidden shadow-sm border border-slate-200">
                  
                  {/* Context Header Badge */}
                  <div className="px-4 pt-3 pb-2 border-b border-[#f3f2ef] flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1.5 truncate font-medium">
                      {post.postType === "CERTIFICATE_EARNED" ? (
                        <>🎉 <strong className="text-purple-700 font-bold">ประกาศความสำเร็จและการรับรองทักษะ</strong></>
                      ) : post.postType === "HIRING" ? (
                        <>💼 <strong className="text-emerald-700 font-bold">โอกาสร่วมงานและสหกิจศึกษา</strong></>
                      ) : post.postType === "PROJECT_SHOWCASE" ? (
                        <>🚀 <strong className="text-[#0a66c2] font-bold">ผลงานและโครงงานนักศึกษา</strong></>
                      ) : (
                        <>🏛️ <strong className="text-slate-700 font-bold">ข่าวสารและประกาศจากคณาจารย์ มสด.</strong></>
                      )}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 font-bold text-slate-600">
                      {post.tag ? `#${post.tag}` : "#SDU"}
                    </span>
                  </div>

                  {/* Post Header */}
                  <div className="p-4 pb-2 flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Link href={`/u/${post.author.id}`}>
                        <img
                          src={
                            post.author.image ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.name || "User")}&background=002d62&color=fff`
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
                          <span>🌐 สาธารณะ</span>
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => showToast(`กำลังติดตาม ${post.author.name} เรียบร้อยแล้ว ✓`)}
                      className="text-[#0a66c2] hover:bg-[#ebf4fd] px-3 py-1 rounded-full text-xs font-bold transition flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      <span>+</span> ติดตาม
                    </button>
                  </div>

                  {/* Post Content */}
                  <div className="px-4 py-2 text-xs sm:text-sm text-slate-900 leading-relaxed whitespace-pre-line">
                    {post.content}
                  </div>

                  {/* Media Embed */}
                  {post.imageUrl && (
                    <div className="w-full bg-slate-900 border-y border-[#e0e0e0] max-h-[380px] overflow-hidden flex items-center justify-center">
                      <img
                        src={post.imageUrl}
                        alt="Post media"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Reaction Summary Line */}
                  <div className="px-4 py-2 flex items-center justify-between text-xs text-slate-500 border-b border-[#e0e0e0]">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center -space-x-1">
                        <span className="w-4 h-4 rounded-full bg-[#0a66c2] text-white text-[9px] flex items-center justify-center">👍</span>
                        {hasCelebrate && <span className="w-4 h-4 rounded-full bg-[#057642] text-white text-[9px] flex items-center justify-center">👏</span>}
                        {hasLove && <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] flex items-center justify-center">❤️</span>}
                        {hasSupport && <span className="w-4 h-4 rounded-full bg-purple-600 text-white text-[9px] flex items-center justify-center">🚀</span>}
                      </span>
                      <span className="font-semibold text-slate-700">{likeCount} คนแสดงความรู้สึก</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setOpenComments((prev) => ({ ...prev, [post.id]: !prev[post.id] }))}
                        className="hover:underline hover:text-[#0a66c2] font-semibold"
                      >
                        {post.comments.length} ความคิดเห็น
                      </button>
                      <span>•</span>
                      <span>1 การแชร์</span>
                    </div>
                  </div>

                  {/* Action Buttons Bar with Multi-Reaction Dock */}
                  <div className="px-2 py-1 flex items-center justify-between text-xs font-bold text-slate-600 relative">
                    
                    {/* Multi-Reaction Hover Dock */}
                    {hoveredReactionPostId === post.id && (
                      <div
                        onMouseEnter={() => setHoveredReactionPostId(post.id)}
                        onMouseLeave={() => setHoveredReactionPostId(null)}
                        className="absolute -top-11 left-2 bg-white rounded-full px-3 py-1.5 shadow-2xl border border-slate-200 flex items-center gap-2.5 z-30 animate-in zoom-in-90 duration-150"
                      >
                        {(["LIKE", "CELEBRATE", "SUPPORT", "LOVE", "INSIGHTFUL"] as const).map((rtype) => {
                          const conf = REACTION_CONFIG[rtype];
                          return (
                            <button
                              key={rtype}
                              onClick={() => handleSelectReaction(post.id, rtype)}
                              className="text-lg hover:scale-130 transition transform p-1 cursor-pointer flex flex-col items-center"
                              title={conf.label}
                            >
                              <span>{conf.emoji}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Reaction Button (Hover to open dock) */}
                    <button
                      onMouseEnter={() => setHoveredReactionPostId(post.id)}
                      onClick={() => handleSelectReaction(post.id, userReaction?.type || "LIKE")}
                      className={`flex-1 py-2 rounded-lg hover:bg-slate-100 flex items-center justify-center gap-1.5 transition cursor-pointer ${
                        userReaction ? REACTION_CONFIG[userReaction.type].color : ""
                      }`}
                    >
                      <span>{userReaction ? REACTION_CONFIG[userReaction.type].emoji : "👍"}</span>
                      <span>{userReaction ? REACTION_CONFIG[userReaction.type].label : "ถูกใจ"}</span>
                    </button>

                    {/* Comment Button */}
                    <button
                      onClick={() => setOpenComments((prev) => ({ ...prev, [post.id]: !prev[post.id] }))}
                      className="flex-1 py-2 rounded-lg hover:bg-slate-100 flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <span>💬</span>
                      <span>ความคิดเห็น</span>
                    </button>

                    {/* Celebrate Quick Action */}
                    <button
                      onClick={() => handleSelectReaction(post.id, "CELEBRATE")}
                      className="flex-1 py-2 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 flex items-center justify-center gap-1.5 transition cursor-pointer text-slate-600"
                    >
                      <span>👏</span>
                      <span>ชื่นชม</span>
                    </button>

                    {/* Share Button */}
                    <button
                      onClick={() => handleShare(post.id)}
                      className="flex-1 py-2 rounded-lg hover:bg-slate-100 flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <span>📤</span>
                      <span>แชร์ผลงาน</span>
                    </button>
                  </div>

                  {/* Expandable Comments Section */}
                  {isCommentsOpen && (
                    <div className="px-4 py-3.5 bg-slate-50 border-t border-slate-200 space-y-3 animate-in fade-in">
                      
                      {/* Quick Congratulation Badges */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] font-bold text-slate-500">ตอบด่วน:</span>
                        {[
                          "🎉 ยินดีด้วยครับ!",
                          "👏 สุดยอดมากครับ",
                          "🔥 เก่งมากครับ",
                          "🚀 เป็นกำลังใจให้ครับ",
                        ].map((quickText, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleAddComment(post.id, quickText)}
                            className="px-2.5 py-1 bg-white hover:bg-blue-50 hover:text-[#0a66c2] border border-slate-200 rounded-full text-[11px] font-semibold transition cursor-pointer shadow-2xs"
                          >
                            {quickText}
                          </button>
                        ))}
                      </div>

                      {/* Comment Input */}
                      {isLoggedIn ? (
                        <div className="flex items-start gap-2.5 pt-1">
                          <img
                            src={
                              session?.user?.image ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(session?.user?.name || "User")}&background=002d62&color=fff`
                            }
                            alt="Me"
                            className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
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
                              placeholder="แสดงความคิดเห็น หรือเขียนคำชื่นชม..."
                              className="flex-1 px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0a66c2]"
                            />
                            <button
                              onClick={() => handleAddComment(post.id)}
                              className="px-4 py-2 bg-[#0a66c2] hover:bg-[#004182] text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer"
                            >
                              ส่ง
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-2 text-xs text-slate-500">
                          <Link href="/login" className="text-[#0a66c2] font-bold hover:underline">
                            เข้าสู่ระบบ
                          </Link>{" "}
                          เพื่อร่วมแสดงความคิดเห็นและแสดงความยินดี
                        </div>
                      )}

                      {/* Comments list */}
                      {post.comments.length > 0 && (
                        <div className="space-y-2 pt-2 border-t border-slate-200/60">
                          {post.comments.map((c) => (
                            <div key={c.id} className="flex items-start gap-2.5">
                              <img
                                src={
                                  c.user.image ||
                                  `https://ui-avatars.com/api/?name=${encodeURIComponent(c.user.name || "User")}&background=002d62&color=fff`
                                }
                                alt={c.user.name || "User"}
                                className="w-7 h-7 rounded-full object-cover mt-0.5 border border-slate-200 shrink-0"
                              />
                              <div className="flex-1 bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-0.5">
                                <p className="font-bold text-slate-900">{c.user.name}</p>
                                <p className="text-slate-700 leading-relaxed">{c.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                    </div>
                  )}

                </article>
              );
            })}
          </div>

        </main>

        {/* ================= RIGHT COLUMN (SDU News & Trending Skills) ================= */}
        <aside className="hidden lg:block lg:col-span-3 space-y-2.5">
          
          {/* ข่าวสารและประกาศ มสด. */}
          <div className="linkedin-card p-4 bg-white space-y-3 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <span>📰</span> ข่าวสารและประกาศ มสด.
              </h3>
            </div>

            <p className="text-[11px] font-bold text-[#0a66c2]">เรื่องราวยอดนิยมในแคมปัส</p>

            <ul className="space-y-3 text-xs">
              {[
                { title: "มสด. ขยายความร่วมมือสหกิจศึกษากับ 30+ องค์กรไอทีชั้นนำ", time: "2 ชม. ที่แล้ว", readers: "1,420 คน" },
                { title: "เปิดรับสมัครโครงการ SDU Cyber Defense & DevSecOps Workshop", time: "5 ชม. ที่แล้ว", readers: "980 คน" },
                { title: "บมจ. เทคโนโลยีดีไลท์ เปิดรับฝึกงานผ่านระบบ SkillPassport", time: "1 วันที่แล้ว", readers: "2,150 คน" },
                { title: "กำหนดการสอบวัดระดับสมรรถนะทักษะดิจิทัลกลาง ประจำปี 2026", time: "2 วันที่แล้ว", readers: "3,420 คน" },
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
          <div className="linkedin-card p-4 bg-white space-y-3 shadow-sm border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <span>⚡</span> ทักษะยอดนิยมในระบบ (Trending)
            </h3>

            <div className="space-y-2 text-xs">
              {[
                { icon: "🛡️", name: "#DevSecOps", desc: "รับรองแล้ว 48 คน", color: "bg-blue-50 text-blue-700" },
                { icon: "⚡", name: "#NextJS", desc: "รับรองแล้ว 64 คน", color: "bg-emerald-50 text-emerald-700" },
                { icon: "🔒", name: "#CyberSecurity", desc: "รับรองแล้ว 35 คน", color: "bg-amber-50 text-amber-700" },
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
          </div>

          {/* Footer */}
          <footer className="px-2 text-[11px] text-slate-500 space-y-2 text-center">
            <p className="pt-1 flex items-center justify-center gap-1.5 text-slate-600">
              <span className="font-semibold text-slate-700">มหาวิทยาลัยสวนดุสิต © 2026</span>
            </p>
          </footer>

        </aside>

      </div>

      {/* CREATE POST MODAL POPUP */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-[#e0e0e0] space-y-4">
            
            <div className="flex items-center justify-between border-b border-[#e0e0e0] pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={
                    session?.user?.image ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(session?.user?.name || "User")}&background=002d62&color=fff`
                  }
                  alt="Avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{session?.user?.name || "ผู้ใช้งาน"}</h4>
                  <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                    🌐 สาธารณะ (เครือข่าย มสด.)
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 text-base font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="พิมพ์ข้อความเพื่อแชร์ผลงาน ประกาศความสำเร็จ หรือเปิดรับสมัครงาน..."
                rows={5}
                className="w-full text-xs sm:text-sm text-slate-900 placeholder-slate-400 border-none resize-none focus:outline-none p-2 bg-slate-50 rounded-xl"
                autoFocus
                required
              />

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#e0e0e0]">
                <input
                  type="text"
                  value={postTag}
                  onChange={(e) => setPostTag(e.target.value)}
                  placeholder="แท็กทักษะ (เช่น NextJS, CCNA)"
                  className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#0a66c2]"
                />
                <input
                  type="text"
                  value={postImageUrl}
                  onChange={(e) => setPostImageUrl(e.target.value)}
                  placeholder="URL รูปภาพประกอบผลงาน"
                  className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#0a66c2]"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#e0e0e0]">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>✨ พร้อมแชร์ลงในฟีดชุมชน</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-1.5 rounded-full border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !postContent.trim()}
                    className="px-6 py-1.5 rounded-full bg-[#0a66c2] hover:bg-[#004182] text-white font-bold text-xs transition disabled:opacity-50 shadow-sm cursor-pointer"
                  >
                    {isSubmitting ? "กำลังโพสต์..." : "โพสต์ผลงาน"}
                  </button>
                </div>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}

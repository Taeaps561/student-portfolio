"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Message {
  id: string;
  sender: "me" | "them";
  text: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  name: string;
  role: string;
  avatar: string;
  isOnline: boolean;
  unreadCount: number;
  lastMessage: string;
  lastTime: string;
  messages: Message[];
  autoReply?: string;
}

// =========================================================================
// 💬 ROLE-BASED CONVERSATION DATA
// =========================================================================

const STUDENT_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-stud-1",
    name: "ศ.ดร.สมชาย ใจดี",
    role: "อาจารย์ประจำหลักสูตรวิทยาการคอมพิวเตอร์ • Faculty Advisor",
    avatar: "https://ui-avatars.com/api/?name=Somchai+Jaidee&background=002d62&color=fff",
    isOnline: true,
    unreadCount: 1,
    lastMessage: "อาจารย์ตรวจและรับรองทักษะ Cloud Architecture ให้เรียบร้อยแล้วนะครับ ผลงานดีเยี่ยมมาก!",
    lastTime: "14:32",
    autoReply: "ยินดีด้วยครับอาจารย์เห็นความตั้งใจ หากมีโปรเจกต์ใหม่สามารถส่งมาให้ตรวจรับรองเพิ่มเติมได้เสมอครับ",
    messages: [
      {
        id: "m1",
        sender: "them",
        text: "สวัสดีครับ ได้รับเอกสารและลิงก์ GitHub สำหรับตรวจสอบทักษะเรียบร้อยแล้ว",
        timestamp: "14:15",
      },
      {
        id: "m2",
        sender: "me",
        text: "ขอบพระคุณอาจารย์มากครับ รบกวนอาจารย์ช่วยชี้แนะส่วน Architecture Diagram เพิ่มเติมด้วยครับ",
        timestamp: "14:20",
      },
      {
        id: "m3",
        sender: "them",
        text: "อาจารย์ตรวจและรับรองทักษะ Cloud Architecture ให้เรียบร้อยแล้วนะครับ ผลงานดีเยี่ยมมาก!",
        timestamp: "14:32",
      },
    ],
  },
  {
    id: "conv-stud-2",
    name: "คุณวิชัย ปรีชา (บมจ. เทคโนโลยีดีไลท์)",
    role: "HR & Tech Talent Acquisition • พันธมิตรทางการ มสด.",
    avatar: "https://ui-avatars.com/api/?name=Wichai+Preecha&background=059669&color=fff",
    isOnline: true,
    unreadCount: 2,
    lastMessage: "ทางบริษัทสนใจผลงานของคุณ ต้องการเชิญสัมภาษณ์ตำแหน่ง Full-Stack Developer ครับ",
    lastTime: "11:45",
    autoReply: "ขอบคุณที่ตอบกลับครับ ทางทีม Tech Lead จะส่งลิงก์ห้องสัมภาษณ์ออนไลน์ให้ทางอีเมลอีกครั้งนะครับ",
    messages: [
      {
        id: "m4",
        sender: "them",
        text: "สวัสดีครับคุณนักศึกษา จาก บมจ. เทคโนโลยีดีไลท์ นะครับ เราเห็นผลงานของคุณใน SkillPassport",
        timestamp: "11:40",
      },
      {
        id: "m5",
        sender: "them",
        text: "ทางบริษัทสนใจผลงานของคุณ ต้องการเชิญสัมภาษณ์ตำแหน่ง Full-Stack Developer ครับ สะดวกสัปดาห์หน้าไหมครับ?",
        timestamp: "11:45",
      },
    ],
  },
  {
    id: "conv-stud-3",
    name: "สมชาย ยอดนักโค้ด",
    role: "นักศึกษา Full-Stack Developer มสด.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    isOnline: false,
    unreadCount: 0,
    lastMessage: "สัปดาห์หน้าไปแข่ง SDU Hackathon ด้วยกันไหมครับ เดี๋ยวรวมทีมกัน",
    lastTime: "เมื่อวาน",
    autoReply: "โอเคเลยเพื่อน เดี๋ยวเย็นนี้เจอกันที่ห้องแล็บคอมพิวเตอร์นะ!",
    messages: [
      {
        id: "m6",
        sender: "them",
        text: "สวัสดีครับ เห็นโปรเจกต์ Next.js ในพอร์ตโฟลิโอของคุณน่าสนใจมาก",
        timestamp: "เมื่อวาน 16:10",
      },
      {
        id: "m7",
        sender: "me",
        text: "ขอบคุณมากครับ! ยินดีที่ได้รู้จักครับ",
        timestamp: "เมื่อวาน 16:15",
      },
      {
        id: "m8",
        sender: "them",
        text: "สัปดาห์หน้าไปแข่ง SDU Hackathon ด้วยกันไหมครับ เดี๋ยวรวมทีมกัน",
        timestamp: "เมื่อวาน 16:20",
      },
    ],
  },
  {
    id: "conv-stud-4",
    name: "เจนจิรา ดีไซเนอร์",
    role: "นักศึกษา UI/UX & Design Systems มสด.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
    isOnline: false,
    unreadCount: 0,
    lastMessage: "ส่งไฟล์ Figma Design System สำหรับหน้าพอร์ตโฟลิโอให้แล้วนะคะ",
    lastTime: "3 วันที่แล้ว",
    autoReply: "ขอบคุณมากจ้า มีอะไรให้ช่วยปรับแต่งดีไซน์บอกได้ตลอดเลยนะ",
    messages: [
      {
        id: "m9",
        sender: "them",
        text: "ส่งไฟล์ Figma Design System สำหรับหน้าพอร์ตโฟลิโอให้แล้วนะคะ ลองเปิดดูได้เลย",
        timestamp: "3 วันที่แล้ว",
      },
    ],
  },
];

const TEACHER_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-teach-1",
    name: "นักศึกษา ทดสอบ",
    role: "นักศึกษาชั้นปีที่ 3 • วิทยาการคอมพิวเตอร์ (นักศึกษาในที่ปรึกษา)",
    avatar: "https://ui-avatars.com/api/?name=Student+Test&background=0a66c2&color=fff",
    isOnline: true,
    unreadCount: 1,
    lastMessage: "อาจารย์ครับ ผมอัปเดตสถาปัตยกรรม NextAuth และ DevSecOps ใน GitHub แล้วครับ รบกวนอาจารย์ช่วยตรวจรับรองด้วยครับ",
    lastTime: "15:10",
    autoReply: "รับทราบครับ อาจารย์จะเข้าไปตรวจสอบโค้ดและออก Digital Certificate ให้ในระบบครับ",
    messages: [
      {
        id: "tm1",
        sender: "them",
        text: "กราบเรียนอาจารย์สมชายครับ ผมได้ส่งเอกสารโครงงานระบบ SkillPassport ในระบบเรียบร้อยแล้วครับ",
        timestamp: "14:50",
      },
      {
        id: "tm2",
        sender: "me",
        text: "อาจารย์ตรวจดูเบื้องต้นแล้ว การออกแบบฐานข้อมูลและระบบ RBAC ทำได้รัดกุมดีมากครับ",
        timestamp: "15:02",
      },
      {
        id: "tm3",
        sender: "them",
        text: "อาจารย์ครับ ผมอัปเดตสถาปัตยกรรม NextAuth และ DevSecOps ใน GitHub แล้วครับ รบกวนอาจารย์ช่วยตรวจรับรองด้วยครับ",
        timestamp: "15:10",
      },
    ],
  },
  {
    id: "conv-teach-2",
    name: "นางสาวณิชาภา สุขใจ",
    role: "นักศึกษาชั้นปีที่ 4 • สหกิจศึกษา บมจ. เทคโนโลยีดีไลท์",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
    isOnline: true,
    unreadCount: 0,
    lastMessage: "อาจารย์คะ ส่งรายงานความก้าวหน้าโครงการสหกิจศึกษาประจำสัปดาห์ที่ 8 ให้แล้วค่ะ",
    lastTime: "11:20",
    autoReply: "อาจารย์ได้รับรายงานแล้วครับ ขอให้น้องณิชาภาตั้งใจฝึกงานต่อไปนะครับ",
    messages: [
      {
        id: "tm4",
        sender: "them",
        text: "สวัสดีค่ะอาจารย์ ส่งรายงานความก้าวหน้าโครงการสหกิจศึกษาประจำสัปดาห์ที่ 8 ให้แล้วค่ะ",
        timestamp: "11:20",
      },
    ],
  },
  {
    id: "conv-teach-3",
    name: "คุณวิชัย ปรีชา (บมจ. เทคโนโลยีดีไลท์)",
    role: "ผู้จัดการฝ่ายบุคคลและเทคโนโลยี • Delight Technology PCL.",
    avatar: "https://ui-avatars.com/api/?name=Wichai+Preecha&background=059669&color=fff",
    isOnline: true,
    unreadCount: 1,
    lastMessage: "เรียนท่านอาจารย์สมชาย ทางบริษัทขอเชิญร่วมประเมินโครงงานสหกิจศึกษานักศึกษาในวันศุกร์นี้ครับ",
    lastTime: "09:45",
    autoReply: "ยินดีเป็นอย่างยิ่งครับคุณวิชัย ทางภาควิชาพร้อมเข้าร่วมประชุมประเมินผลตามวันและเวลาดังกล่าวครับ",
    messages: [
      {
        id: "tm5",
        sender: "them",
        text: "เรียนท่านอาจารย์สมชาย ทางบริษัทขอเชิญร่วมประเมินโครงงานสหกิจศึกษานักศึกษาในวันศุกร์นี้ครับ",
        timestamp: "09:45",
      },
    ],
  },
  {
    id: "conv-teach-4",
    name: "รศ.ดร.ประเสริฐ วิจัยเด่น",
    role: "หัวหน้าภาควิชาวิทยาการคอมพิวเตอร์ มสด.",
    avatar: "https://ui-avatars.com/api/?name=Prasert+Vijaiden&background=475569&color=fff",
    isOnline: false,
    unreadCount: 0,
    lastMessage: "อย่าลืมส่งสรุปผลการประเมินทักษะดิจิทัลของนักศึกษาเข้าที่ประชุมคณะนะครับ",
    lastTime: "เมื่อวาน",
    autoReply: "เตรียมข้อมูลและกราฟิกสรุปคะแนนรูบริคส์เรียบร้อยแล้วครับอาจารย์หัวหน้าภาค",
    messages: [
      {
        id: "tm6",
        sender: "them",
        text: "อย่าลืมส่งสรุปผลการประเมินทักษะดิจิทัลของนักศึกษาเข้าที่ประชุมคณะนะครับ",
        timestamp: "เมื่อวาน 17:30",
      },
    ],
  },
];

const EMPLOYER_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-emp-1",
    name: "นักศึกษา ทดสอบ",
    role: "ผู้สมัครตำแหน่ง Full-Stack Developer • นักศึกษา มสด. (Verified Score: 95%)",
    avatar: "https://ui-avatars.com/api/?name=Student+Test&background=0a66c2&color=fff",
    isOnline: true,
    unreadCount: 1,
    lastMessage: "สวัสดีครับคุณวิชัย ผมสะดวกเข้าสัมภาษณ์รอบ Technical Interview วันพฤหัสบดีนี้ เวลา 10:00 น. ครับ",
    lastTime: "14:10",
    autoReply: "ยอดเยี่ยมครับ ทางฝ่ายบุคคลได้ลงตารางนัดหมายและส่งบัตรเชิญ Google Meet ให้ทางอีเมลแล้วครับ",
    messages: [
      {
        id: "em1",
        sender: "me",
        text: "สวัสดีครับคุณนักศึกษา ทาง บมจ. เทคโนโลยีดีไลท์ ประทับใจผลงานและทักษะ DevSecOps ของคุณมากครับ",
        timestamp: "13:30",
      },
      {
        id: "em2",
        sender: "me",
        text: "ต้องการนัดสัมภาษณ์ตำแหน่ง Full-Stack Developer สะดวกวันพฤหัสบดีหรือศุกร์นี้ไหมครับ?",
        timestamp: "13:31",
      },
      {
        id: "em3",
        sender: "them",
        text: "สวัสดีครับคุณวิชัย ผมสะดวกเข้าสัมภาษณ์รอบ Technical Interview วันพฤหัสบดีนี้ เวลา 10:00 น. ครับ",
        timestamp: "14:10",
      },
    ],
  },
  {
    id: "conv-emp-2",
    name: "นางสาวเจนจิรา ดีไซเนอร์",
    role: "ผู้สมัครตำแหน่ง UI/UX Designer • นักศึกษา มสด.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
    isOnline: true,
    unreadCount: 0,
    lastMessage: "แนบไฟล์ Portfolio และ Case Study ระบบ Enterprise Design System ให้เรียบร้อยแล้วค่ะ",
    lastTime: "10:15",
    autoReply: "ทางทีม Design Lead กำลังรีวิวผลงานนะคะ แล้วจะรีบติดต่อกลับภายใน 2 วันทำการค่ะ",
    messages: [
      {
        id: "em4",
        sender: "them",
        text: "แนบไฟล์ Portfolio และ Case Study ระบบ Enterprise Design System ให้เรียบร้อยแล้วค่ะ",
        timestamp: "10:15",
      },
    ],
  },
  {
    id: "conv-emp-3",
    name: "ศ.ดร.สมชาย ใจดี (มสด.)",
    role: "อาจารย์ผู้ประสานงานโครงการสหกิจศึกษา • มหาวิทยาลัยสวนดุสิต",
    avatar: "https://ui-avatars.com/api/?name=Somchai+Jaidee&background=002d62&color=fff",
    isOnline: true,
    unreadCount: 0,
    lastMessage: "ทางมหาวิทยาลัยจัดส่งเอกสาร MOU ความร่วมมือสหกิจศึกษาปี 2026 ให้ทางอีเมลแล้วครับ",
    lastTime: "เมื่อวาน",
    autoReply: "ขอบพระคุณท่านอาจารย์ครับ ทางฝ่ายกฎหมายของบริษัทกำลังดำเนินการลงนามเอกสารครับ",
    messages: [
      {
        id: "em5",
        sender: "them",
        text: "ทางมหาวิทยาลัยจัดส่งเอกสาร MOU ความร่วมมือสหกิจศึกษาปี 2026 ให้ทางอีเมลแล้วครับ",
        timestamp: "เมื่อวาน 15:40",
      },
    ],
  },
  {
    id: "conv-emp-4",
    name: "ฝ่ายบุคคล (HR Talent Acquisition Team)",
    role: "Internal Recruiter • บมจ. เทคโนโลยีดีไลท์",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    isOnline: false,
    unreadCount: 0,
    lastMessage: "สรุปโควตารับนักศึกษาฝึกงานและ Junior Dev ประจำไตรมาสที่ 3 เรียบร้อยแล้วค่ะ",
    lastTime: "3 วันที่แล้ว",
    autoReply: "รับทราบครับ เดี๋ยวเราจะเริ่มกระบวนการคัดเลือกผ่านพอร์ตโฟลิโอ SkillPassport ในสัปดาห์นี้เลยครับ",
    messages: [
      {
        id: "em6",
        sender: "them",
        text: "สรุปโควตารับนักศึกษาฝึกงานและ Junior Dev ประจำไตรมาสที่ 3 เรียบร้อยแล้วค่ะ",
        timestamp: "3 วันที่แล้ว",
      },
    ],
  },
];

export default function MessagingPage() {
  const { data: session } = useSession();
  const currentRole = session?.user?.role || "STUDENT";

  // Select initial dataset according to logged-in user's role
  const getInitialList = () => {
    if (currentRole === "TEACHER") return TEACHER_CONVERSATIONS;
    if (currentRole === "EMPLOYER") return EMPLOYER_CONVERSATIONS;
    return STUDENT_CONVERSATIONS;
  };

  const [conversations, setConversations] = useState<Conversation[]>(getInitialList());
  const [activeId, setActiveId] = useState<string>(getInitialList()[0].id);
  const [searchTerm, setSearchTerm] = useState("");
  const [inputText, setInputText] = useState("");
  const [filterType, setFilterType] = useState<"all" | "unread">("all");
  const [isTyping, setIsTyping] = useState(false);

  // Sync conversations whenever logged-in user role changes
  useEffect(() => {
    const list = getInitialList();
    setConversations(list);
    setActiveId(list[0].id);
  }, [currentRole]);

  const activeConv = conversations.find((c) => c.id === activeId) || conversations[0];

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const myText = inputText.trim();
    const nowTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const newMessage: Message = {
      id: "msg-" + Date.now(),
      sender: "me",
      text: myText,
      timestamp: nowTime,
    };

    // Update conversation with sent message
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeId) {
          return {
            ...c,
            lastMessage: myText,
            lastTime: nowTime,
            messages: [...c.messages, newMessage],
          };
        }
        return c;
      })
    );

    setInputText("");

    // Simulate realistic auto-reply from contact after 1.5s
    if (activeConv.autoReply) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const replyTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        const replyMsg: Message = {
          id: "reply-" + Date.now(),
          sender: "them",
          text: activeConv.autoReply || "รับทราบข้อความเรียบร้อยครับ ขอบคุณครับ!",
          timestamp: replyTime,
        };

        setConversations((prev) =>
          prev.map((c) => {
            if (c.id === activeId) {
              return {
                ...c,
                lastMessage: replyMsg.text,
                lastTime: replyTime,
                messages: [...c.messages, replyMsg],
              };
            }
            return c;
          })
        );
      }, 1400);
    }
  };

  const filteredConversations = conversations.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || (filterType === "unread" && c.unreadCount > 0);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[#f4f2ee] pt-[85px] px-4 pb-12">
      <div className="max-w-[1128px] mx-auto space-y-3">
        
        {/* Role Context Bar */}
        <div className="bg-white rounded-xl px-4 py-2.5 border border-slate-200 shadow-xs flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-slate-600">กล่องข้อความประจำบัญชี:</span>
            <span className="font-bold text-slate-900">
              {currentRole === "TEACHER"
                ? "🏛️ อาจารย์ (Teacher Portal Messenger)"
                : currentRole === "EMPLOYER"
                ? "🏢 ผู้ประกอบการ / HR (Recruiter Messenger)"
                : "🎓 นักศึกษา (Student Messenger)"}
            </span>
          </div>
          <span className="text-slate-500 text-[11px] hidden sm:inline">
            ผู้ใช้งาน: <strong className="text-[#0a66c2]">{session?.user?.name || "ผู้ใช้งาน"}</strong>
          </span>
        </div>

        {/* Main 2-Pane Chat Container */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[640px] max-h-[calc(100vh-140px)]">
          
          {/* ================= LEFT PANE: CONVERSATION LIST (5 COLS) ================= */}
          <div className="md:col-span-5 border-r border-slate-200 flex flex-col h-full bg-white">
            
            {/* Header */}
            <div className="p-4 border-b border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <h1 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <span>💬 ข้อความ</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold">
                    {conversations.reduce((acc, curr) => acc + curr.unreadCount, 0)} ใหม่
                  </span>
                </h1>
                <button
                  onClick={() => alert("สร้างบทสนทนาใหม่")}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600 font-bold text-sm transition"
                  title="ข้อความใหม่"
                >
                  ✏️
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ค้นหาข้อความหรือบุคคล..."
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0a66c2]"
                />
              </div>

              {/* Filter Tabs */}
              <div className="flex gap-2 text-xs font-bold pt-1">
                <button
                  onClick={() => setFilterType("all")}
                  className={`px-3 py-1 rounded-full transition border ${
                    filterType === "all"
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  ทั้งหมด
                </button>
                <button
                  onClick={() => setFilterType("unread")}
                  className={`px-3 py-1 rounded-full transition border ${
                    filterType === "unread"
                      ? "bg-[#0a66c2] text-white border-[#0a66c2]"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  ยังไม่ได้อ่าน
                </button>
              </div>
            </div>

            {/* Conversation Items List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  ไม่พบบทสนทนา
                </div>
              ) : (
                filteredConversations.map((c) => {
                  const isActive = c.id === activeId;
                  return (
                    <button
                      key={c.id}
                      onClick={() => {
                        setActiveId(c.id);
                        // mark unread as read
                        setConversations((prev) =>
                          prev.map((item) => (item.id === c.id ? { ...item, unreadCount: 0 } : item))
                        );
                      }}
                      className={`w-full p-3.5 flex items-start gap-3 text-left transition ${
                        isActive
                          ? "bg-blue-50/70 border-l-4 border-[#0a66c2]"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <div className="relative shrink-0">
                        <img
                          src={c.avatar}
                          alt={c.name}
                          className="w-12 h-12 rounded-full object-cover border border-slate-200"
                        />
                        {c.isOnline && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {c.name}
                          </h4>
                          <span className="text-[10px] text-slate-500 shrink-0 ml-1">
                            {c.lastTime}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5 font-medium">
                          {c.role}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-slate-600 truncate font-normal">
                            {c.lastMessage}
                          </p>
                          {c.unreadCount > 0 && (
                            <span className="shrink-0 ml-1 w-4 h-4 rounded-full bg-[#0a66c2] text-white text-[10px] font-extrabold flex items-center justify-center">
                              {c.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

          </div>

          {/* ================= RIGHT PANE: ACTIVE CHAT THREAD (7 COLS) ================= */}
          <div className="md:col-span-7 flex flex-col h-full bg-[#f8fafc]">
            
            {/* Active Thread Header */}
            <div className="p-3.5 bg-white border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={activeConv.avatar}
                  alt={activeConv.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                    <span>{activeConv.name}</span>
                    <span className="text-[#057642] text-xs font-bold">✓</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    {activeConv.role}
                  </p>
                </div>
              </div>

              {/* Header Actions */}
              <div className="flex items-center gap-1 text-slate-600">
                <Link
                  href="/explore"
                  className="px-3 py-1 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition shadow-xs hidden sm:inline-block"
                >
                  ดูโปรไฟล์
                </Link>
                <button
                  onClick={() => alert("เริ่มการโทรติดต่อ...")}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-600 text-sm font-bold"
                  title="โทรติดต่อ"
                >
                  📞
                </button>
                <button
                  onClick={() => alert("เริ่มการสนทนาผ่านวิดีโอ...")}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-600 text-sm font-bold"
                  title="วิดีโอคอล"
                >
                  📹
                </button>
              </div>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              
              {/* Security & Verification Banner */}
              <div className="bg-blue-50/80 border border-blue-100 rounded-xl p-3 text-center text-xs text-blue-900 space-y-1">
                <p className="font-bold">🔒 การสนทนาปลอดภัยในเครือข่าย มสด.</p>
                <p className="text-[11px] text-blue-700">
                  คู่สนทนาเป็นสมาชิกที่ผ่านการตรวจสอบตัวตนและข้อมูลวิชาการจาก มหาวิทยาลัยสวนดุสิต
                </p>
              </div>

              {/* Message Bubbles */}
              {activeConv.messages.map((m) => {
                const isMe = m.sender === "me";
                return (
                  <div
                    key={m.id}
                    className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    {!isMe && (
                      <img
                        src={activeConv.avatar}
                        alt="Avatar"
                        className="w-7 h-7 rounded-full object-cover mb-1 border border-slate-200 shrink-0"
                      />
                    )}

                    <div
                      className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-xs font-medium leading-relaxed shadow-xs ${
                        isMe
                          ? "bg-[#0a66c2] text-white rounded-br-none"
                          : "bg-white text-slate-900 border border-slate-200 rounded-bl-none"
                      }`}
                    >
                      <p className="whitespace-pre-line">{m.text}</p>
                      <span
                        className={`text-[9px] block text-right mt-1 font-semibold ${
                          isMe ? "text-blue-100" : "text-slate-400"
                        }`}
                      >
                        {m.timestamp}
                      </span>
                    </div>

                    {isMe && (
                      <img
                        src={
                          session?.user?.image ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(session?.user?.name || "Me")}&background=002d62&color=fff`
                        }
                        alt="My Avatar"
                        className="w-7 h-7 rounded-full object-cover mb-1 border border-slate-200 shrink-0"
                      />
                    )}
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-center gap-2">
                  <img
                    src={activeConv.avatar}
                    alt="Avatar"
                    className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0"
                  />
                  <div className="bg-white px-3.5 py-2 rounded-2xl rounded-bl-none border border-slate-200 shadow-xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
            </div>

            {/* Message Input Box */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`พิมพ์ข้อความถึง ${activeConv.name.split(" ")[0]}...`}
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0a66c2]"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="px-4 py-2.5 rounded-2xl bg-[#0a66c2] hover:bg-[#004182] text-white text-xs font-bold transition shadow-sm disabled:opacity-40 flex items-center gap-1.5"
                >
                  <span>ส่ง</span>
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                </button>
              </div>

              {/* Attachment Toolbars */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-1 px-1">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => alert("แนบไฟล์รูปภาพ...")}
                    className="hover:text-slate-800 flex items-center gap-1 font-semibold"
                  >
                    <span>🖼️</span> <span className="hidden sm:inline">รูปภาพ</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => alert("แนบไฟล์เอกสาร / Resume...")}
                    className="hover:text-slate-800 flex items-center gap-1 font-semibold"
                  >
                    <span>📎</span> <span className="hidden sm:inline">เอกสาร</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => alert("เลือกอิโมจิ...")}
                    className="hover:text-slate-800 flex items-center gap-1 font-semibold"
                  >
                    <span>😊</span> <span className="hidden sm:inline">อิโมจิ</span>
                  </button>
                </div>
                <span className="text-[10px] text-slate-400">กด Enter เพื่อส่ง</span>
              </div>
            </form>

          </div>

        </div>

      </div>
    </div>
  );
}

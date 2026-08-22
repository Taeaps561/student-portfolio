"use client";

import { useState } from "react";

export function PublicShareButton({ userId, userName }: { userId: string; userName: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const url = `${window.location.origin}/u/${userId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <button
      onClick={handleCopy}
      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/15 backdrop-blur-md transition flex items-center gap-1.5 shadow-md"
    >
      <span>{copied ? "✓" : "📋"}</span>
      <span>{copied ? "คัดลอกลิงก์สำเร็จ!" : "คัดลอกลิงก์แชร์โปรไฟล์"}</span>
    </button>
  );
}

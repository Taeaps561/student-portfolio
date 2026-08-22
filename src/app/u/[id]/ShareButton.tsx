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
      type="button"
      className={`px-4 py-1.5 rounded-full border text-xs font-bold transition flex items-center gap-1.5 shadow-xs ${
        copied
          ? "bg-emerald-50 border-emerald-300 text-emerald-800"
          : "bg-white border-slate-300 hover:bg-slate-50 text-slate-800"
      }`}
    >
      <span>{copied ? "✓" : "📋"}</span>
      <span className={copied ? "text-emerald-800 font-bold" : "text-slate-800 font-bold"}>
        {copied ? "คัดลอกลิงก์แล้ว!" : "คัดลอกลิงก์แชร์โปรไฟล์"}
      </span>
    </button>
  );
}

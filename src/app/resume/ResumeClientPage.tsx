"use client";

export default function ResumeClientPage() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button
      onClick={handlePrint}
      className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition flex items-center gap-2 text-sm shadow-[0_0_15px_rgba(168,85,247,0.4)]"
    >
      🖨️ พิมพ์ประวัติย่อ (Print/PDF)
    </button>
  );
}

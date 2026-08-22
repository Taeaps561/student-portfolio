import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 px-4 pb-12">
      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-6">
            เกี่ยวกับ Skill Passport
          </h1>
          <p className="text-xl text-gray-300 font-light leading-relaxed">
            แพลตฟอร์มพอร์ตโฟลิโอดิจิทัลยุคใหม่ที่ออกแบบมาสำหรับนักศึกษา อาจารย์ และบริษัทรับสมัครงาน โดยเน้นที่ <strong className="text-purple-400">ความปลอดภัย</strong>, <strong className="text-purple-400">ความเป็นส่วนตัวของข้อมูล</strong> และ <strong className="text-purple-400">ความถูกต้องน่าเชื่อถือ</strong>
          </p>
        </div>

        <div className="space-y-8">
          
          {/* Mission Section */}
          <div className="glass rounded-3xl p-8 md:p-10 border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="text-2xl">🎯</span> เป้าหมายของเรา
            </h2>
            <p className="text-gray-400 leading-relaxed">
              ในยุคดิจิทัล เรซูเม่กระดาษแบบเดิมอาจไม่เพียงพอต่อการพิสูจน์ความสามารถ Skill Passport จึงเข้ามาช่วยเป็นสื่อกลางที่ปลอดภัย สวยงาม และตรวจสอบได้ เพื่อให้นักศึกษาได้แสดงทักษะจริงที่มี พร้อมเชื่อมต่อกับผลงานใน GitHub และใบรับรองดิจิทัล
            </p>
          </div>

          {/* Security Features Grid */}
          <h2 className="text-2xl font-bold text-white pt-8 pb-2 text-center">สถาปัตยกรรมความปลอดภัยหลัก</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Feature 1 */}
            <div className="glass rounded-3xl p-6 border-white/10 hover:border-blue-500/30 transition group">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition">
                🔐
              </div>
              <h3 className="text-lg font-bold text-white mb-2">OAuth & MFA</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                ระบบยืนยันตัวตนผ่าน GitHub OAuth สำหรับนักพัฒนา พร้อมรองรับระบบตรวจสอบสองขั้นตอน (MFA) เพื่อความปลอดภัยของบัญชีขั้นสูงสุด
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass rounded-3xl p-6 border-white/10 hover:border-purple-500/30 transition group">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition">
                🛡️
              </div>
              <h3 className="text-lg font-bold text-white mb-2">ระบบจำกัดสิทธิ์ (RBAC)</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                การแบ่งแยกสิทธิ์ที่ชัดเจนระหว่าง นักศึกษา อาจารย์ และบริษัท ข้อมูลส่วนตัวที่ละเอียดอ่อนจะถูกซ่อน (Masking) อัตโนมัติจากบุคคลทั่วไป
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass rounded-3xl p-6 border-white/10 hover:border-green-500/30 transition group">
              <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center text-green-400 mb-4 group-hover:scale-110 transition">
                ✓
              </div>
              <h3 className="text-lg font-bold text-white mb-2">ความถูกต้องของข้อมูล</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                ป้องกันการปลอมแปลงใบรับรองด้วยระบบ Digital Signature ทุกใบเซอร์จะถูกเข้ารหัส (Hash) และตรวจสอบความถูกต้องผ่านการสแกน QR Code ได้
              </p>
            </div>

            {/* Feature 4 */}
            <div className="glass rounded-3xl p-6 border-white/10 hover:border-pink-500/30 transition group">
              <div className="w-12 h-12 rounded-2xl bg-pink-500/20 flex items-center justify-center text-pink-400 mb-4 group-hover:scale-110 transition">
                🐙
              </div>
              <h3 className="text-lg font-bold text-white mb-2">การตรวจสอบอัตโนมัติ</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                ดึงข้อมูลจริงจากระบบภายนอก (เช่น GitHub API) แบบเรียลไทม์ ทำให้มั่นใจว่าผลงานโค้ด หรือสถิติที่แสดงนั้นเป็นของจริงและอัปเดตเสมอ
              </p>
            </div>

          </div>

          <div className="pt-10 text-center">
            <Link href="/login" className="inline-block px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
              สร้างพาสปอร์ตของคุณเลย
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

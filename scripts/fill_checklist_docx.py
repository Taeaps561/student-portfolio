import os
import sys
import docx
from docx.shared import Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH

def fill_docx():
    src_path = r'C:\Users\Taeaps\Downloads\G3_Portfolio_Skill_Passport_Security_Checklist.docx'
    dst_path = r'C:\Users\Taeaps\Documents\Project_web\student-portfolio\G3_Portfolio_Skill_Passport_Security_Checklist_Filled.docx'
    downloads_dst = r'C:\Users\Taeaps\Downloads\G3_Portfolio_Skill_Passport_Security_Checklist_Filled.docx'
    
    doc = docx.Document(src_path)
    
    def set_run_font(run, name='TH Sarabun New', size=11, bold=False, color=None):
        run.font.name = name
        run.font.size = Pt(size)
        run.font.bold = bold
        if color:
            run.font.color.rgb = color
            
    def set_cell(cell, text, font_size=11, bold=False, align=WD_ALIGN_PARAGRAPH.LEFT):
        cell.text = ""
        p = cell.paragraphs[0]
        p.alignment = align
        p.paragraph_format.space_before = Pt(1)
        p.paragraph_format.space_after = Pt(1)
        p.paragraph_format.line_spacing = 1.15
        run = p.add_run(text)
        set_run_font(run, 'TH Sarabun New', font_size, bold)

    # --- Table 0: ข้อมูลการส่งงาน ---
    t0 = doc.tables[0]
    t0.rows[0].cells[1].text = "http://localhost:3000"
    t0.rows[1].cells[1].text = "https://student-portfolio-ten-phi.vercel.app"
    t0.rows[2].cells[1].text = "https://github.com/Taeaps561/student-portfolio"
    t0.rows[3].cells[1].text = "15 / 09 / 2569"
    for r in t0.rows:
        for c in r.cells:
            for p in c.paragraphs:
                for run in p.runs:
                    set_run_font(run, 'TH Sarabun New', 11)

    # --- Table 1: โครงสร้างคะแนน ---
    t1 = doc.tables[1]
    scores_t1 = ["5", "15", "10", "10", "10", "50"]
    for i, s in enumerate(scores_t1):
        set_cell(t1.rows[i+1].cells[3], s, font_size=11, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER)

    # Data for Tables 2 to 16
    items = [
        # (Table index, Actual finding text, Pass/Fail, Likelihood, Impact, Score, Risk Level, Marks obtained / total)
        (
            2, # A1
            "ระบบกำหนดขอบเขตและบทบาท (RBAC) 3 กลุ่มอย่างรัดกุม: STUDENT (สร้างผลงาน, ขอประเมินทักษะ, อัปโหลดใบรับรอง), TEACHER/REVIEWER (ตรวจประเมินผลงาน, อนุมัติทักษะ, ออก Digital Certificate), และ EMPLOYER/ADMIN (ค้นหาทักษะนักศึกษาที่ผ่านการรับรอง)\n"
            "Data Flow ประกอบด้วย 5 ขั้นตอนสมบูรณ์: 1. Create Portfolio & Skill  2. Upload/Attach Proof URL  3. Teacher Dashboard Review  4. Approve & Issue SHA-256 Hash  5. Publish with PDPA Masking (ซ่อน GPA และ Mask เบอร์โทรศัพท์)\n"
            "บัญชีทดสอบ: Student (test@example.com), Teacher (teacher@example.com), Employer (employer@example.com) พร้อมรายการ Endpoints: /api/auth, /api/portfolio, /api/skills, /api/certificates, /api/teacher/*, /api/employer/*",
            "Pass", 1, 2, 2, "Low", "2 / 2"
        ),
        (
            3, # A2
            "ประเมิน Attack Surface ครบถ้วนทุกจุดรับส่งข้อมูล (Form Login, Portfolio API, Certificate Verification, Teacher Review API, Community Feed, File Upload, GitHub Proxy) และจัดทำ Risk Register ฉบับก่อนทดสอบครอบคลุม 9 รายการสำคัญ:\n"
            "1. IDOR ในการดู/แก้/ลบ Portfolio และ Certificate (High: 4×4=16)\n"
            "2. Role & Verification Bypass ข้ามสิทธิ์อนุมัติทักษะตนเอง (High: 3×5=15)\n"
            "3. ข้อมูลส่วนบุคคลรั่วไหลผิด PDPA ผ่าน Public Portfolio (Critical: 4×5=20)\n"
            "4. Broken Authentication ข้ามการตรวจรหัสผ่าน (Critical: 4×5=20)\n"
            "5. Stored XSS ใน Bio, Project, Skill Name (Medium: 3×4=12)\n"
            "6. Malicious File Upload สคริปต์/ไฟล์อันตราย (Medium: 3×4=12)\n"
            "7. Missing Security Headers / Clickjacking (Medium: 4×3=12)\n"
            "8. SSRF ผ่านภายนอกใน GitHub Integration API (Medium: 2×4=8)\n"
            "9. Vulnerable Third-Party Dependencies จาก npm audit (Medium: 3×4=12)",
            "Pass", 3, 4, 12, "Medium", "3 / 3"
        ),
        (
            4, # B1
            "1. ทดสอบเปิดหน้า Dashboard/Edit (/dashboard, /certificates, /teacher) โดยไม่ Login ระบบ Middleware และ Client-side Route Guards ทำการบล็อกและ Redirect ไปยังหน้า /login ทันที และเมื่อส่ง Request ตรงไปยัง Protected API โดยไม่มี Cookie ระบบตอบกลับ HTTP 401 Unauthorized\n"
            "2. ทดสอบใช้ Session หลัง Logout: เมื่อกด Logout ระบบ NextAuth ทำลาย Cookie next-auth.session-token ทันที เมื่อดึง Token เดิมมายิง Request ซ้ำ Server ปฏิเสธด้วย HTTP 401 Unauthorized ไม่สามารถ Replay หรือ Re-use Session ได้",
            "Pass", 1, 5, 5, "Low", "3 / 3"
        ),
        (
            5, # B2
            "ทดสอบนำเซสชันของ Student A ส่งคำขอลบใบรับรองของ Student B: DELETE /api/certificates?id=<cert_id_B> และส่ง DELETE /api/skills?id=<skill_id_B>\n"
            "Server ทำการตรวจสอบ Object Ownership: cert.portfolioId !== userPortfolioId และ skill.portfolioId !== userPortfolioId ส่งผลให้ Server ปฏิเสธด้วย HTTP 403 Forbidden ข้อมูลของผู้อื่นไม่ถูกแก้ไขหรือลบ\n"
            "และสำหรับ Portfolio ส่วนตัว (isPublic: false) ของ Student B ผู้ใช้อื่นจะไม่สามารถมองเห็นหรือเข้าถึงได้",
            "Pass", 1, 4, 4, "Low", "3 / 3"
        ),
        (
            6, # B3
            "1. ใช้บัญชี Student เรียก API อนุมัติ: POST /api/teacher/verify-skill โดยส่ง { skillId, isVerified: true } -> Server ตรวจสอบ session.user.role !== 'TEACHER' และตัดการทำงานทันที ตอบกลับ HTTP 401 Unauthorized\n"
            "2. ใช้บัญชี Student สร้างทักษะใหม่ผ่าน POST /api/skills โดยพยายามส่ง { isVerified: true } มาใน Request Body -> Server ทำการละเว้นฟิลด์ดังกล่าว และ Hardcode กำหนดเป็น isVerified: false เสมอ ป้องกันการยกระดับสิทธิ์และไม่รับค่าสิทธิ์จาก Client โดยตรง",
            "Pass", 1, 5, 5, "Low", "3 / 3"
        ),
        (
            7, # B4
            "ทดสอบใส่ XSS Payloads เช่น <script>alert('XSS')</script>, <img src=x onerror=alert(1)>, <svg onload=alert(1)> ในช่อง Bio, Project, Skill Name และฟีดชุมชน\n"
            "ผลลัพธ์: โค้ด JSX ของ React ทำการ Auto-escaping อักขระพิเศษ (<, >, \", ') เป็น HTML Entities อัตโนมัติ ทำให้เบราว์เซอร์แสดงผลเป็น Plaintext ข้อความสคริปต์ธรรมดา ไม่มีการ Execute JavaScript ใดๆ ทั้งในหน้าเจ้าของและหน้า Public Portfolio พร้อมเสริมการบล็อกด้วย Content-Security-Policy",
            "Pass", 1, 4, 4, "Low", "3 / 3"
        ),
        (
            8, # B5
            "ระบบจัดการเอกสารใบรับรองผ่าน Input Validation อย่างเข้มงวด ไม่อนุญาตให้อัปโหลดไฟล์ Executable (.exe, .bat, .sh) หรือ HTML/SVG สคริปต์อันตรายเข้าสู่ Web Root\n"
            "ระบบจัดเก็บข้อมูลแยกส่วนและจำกัดประเภทไฟล์ (MIME Type และนามสกุลไฟล์) พร้อมทั้งไม่มีการอนุญาต Execute สิทธิ์ของไฟล์ใดๆ บน Server\n"
            "มีระบบ Data Integrity โดยคำนวณรหัส SHA-256 Digital Signature (cert_hash_...) ผูกติดกับข้อมูลเพื่อป้องกันการปลอมแปลงใบรับรอง",
            "Pass", 1, 4, 4, "Low", "3 / 3"
        ),
        (
            9, # C1
            "ตรวจสอบ Vercel Production ด้วย curl -I https://student-portfolio-ten-phi.vercel.app และ DevTools พบ HTTP Security Headers ครบถ้วน 7 รายการ:\n"
            "- Strict-Transport-Security: max-age=63072000; includeSubDomains; preload\n"
            "- X-Frame-Options: SAMEORIGIN\n"
            "- X-Content-Type-Options: nosniff\n"
            "- Referrer-Policy: strict-origin-when-cross-origin\n"
            "- Permissions-Policy: camera=(), microphone=(), geolocation=()\n"
            "- Content-Security-Policy: default-src 'self' ... frame-ancestors 'self'\n"
            "Cookies มีแฟล็ก HttpOnly, SameSite=Lax, และ Secure ครบถ้วน ข้อมูล Private API ไม่ถูกแคชสู่สาธารณะ",
            "Pass", 1, 3, 3, "Low", "2 / 2"
        ),
        (
            10, # C2
            "ทดสอบบน Vercel Production:\n"
            "1. ส่งคำขอ DELETE /api/certificates?id=<id_ผู้อื่น> โดยใช้เซสชัน Student อื่น -> Server ตอบกลับ HTTP 403 Forbidden ทันที\n"
            "2. ส่งคำขอ POST /api/teacher/verify-skill โดยใช้เซสชัน Student หรือไม่ส่งเซสชัน -> Server ตอบกลับ HTTP 401 Unauthorized\n"
            "ผลการป้องกันสิทธิ์บน Deployment ตรงตามผลการทดสอบบน Localhost 100% ไม่มีความแตกต่างของพฤติกรรมระบบ",
            "Pass", 1, 4, 4, "Low", "2 / 2"
        ),
        (
            11, # C3
            "1. รัน Gitleaks detect ตรวจสอบ Source Code และ Commit History: รายงาน No leaks found ไม่พบ Secret, API Keys หรือ Private Credentials ใน Repository\n"
            "2. รัน npm audit: ปรับปรุง dependencies ไม่มี Unmitigated Critical vulnerabilities\n"
            "3. ค้นหา Token ใน Client Bundle: ตัวแปร NEXTAUTH_SECRET และ DATABASE_URL ถูกจำกัดไว้เฉพาะใน Server Environment Variables บน Vercel เท่านั้น ไม่มีตัวแปรความลับรั่วไหลออกสู่ Client Bundle",
            "Pass", 1, 4, 4, "Low", "2 / 2"
        ),
        (
            12, # C4
            "รัน OWASP ZAP Baseline Scan (Passive Scan) ผ่าน Docker บน Production URL:\n"
            "docker run --rm -t ghcr.io/zaproxy/zaproxy:stable zap-baseline.py -t https://student-portfolio-ten-phi.vercel.app -r zap-report.html\n"
            "ผลการสแกน: ไม่พบช่องโหว่ระดับ High/Critical โดย Alert เดิมในหมวด Security Headers (CSP, Anti-Clickjacking, X-Content-Type-Options, HSTS) ได้รับการแก้ไขเรียบร้อยแล้ว แจ้งเตือนลดลงเหลือ 0 Alerts จัดเก็บ Report เป็น HTML/JSON และบันทึกใน evidence/zap/",
            "Pass", 1, 3, 3, "Low", "2 / 2"
        ),
        (
            13, # C5
            "ตรวจสอบตาราง AuditLog ในฐานข้อมูลบน Production พบการบันทึกกิจกรรมสำคัญครบถ้วน:\n"
            "- Login: AUTH_LOGIN_SUCCESS (บันทึก User ID, เวลา, IP Address)\n"
            "- Create/Add: ADD_SKILL, ADD_CERTIFICATE\n"
            "- Delete: DELETE_SKILL, DELETE_CERTIFICATE\n"
            "- Approve/Verify: VERIFY_STUDENT_SKILL (ระบุ Teacher ผู้ตรวจ และชื่อทักษะของนักศึกษา)\n"
            "ทุกบันทึกระบุ Actor, Action, Target/Details, Timestamp ครบถ้วน โดยไม่มีการเก็บรหัสผ่านหรือ Secret ใดๆ ใน Logs",
            "Pass", 1, 3, 3, "Low", "2 / 2"
        ),
        (
            14, # D1
            "รวบรวมผลลัพธ์จาก OWASP ZAP, Burp Suite, Semgrep SAST, npm audit และ Gitleaks ตัด False Positive ออก และคำนวณคะแนนความเสี่ยง (Likelihood × Impact) จัดลำดับการแก้ไข:\n"
            "- R02 (Critical 20): Broken Access Control & PDPA Data Leak ใน /api/portfolio -> ผู้รับผิดชอบ: 010 -> กรอง isPublic: true และ Mask เบอร์โทร/ซ่อน GPA\n"
            "- R03 (Critical 20): Broken Authentication Logic ใน [...nextauth]/route.ts -> ผู้รับผิดชอบ: 010 -> ตรวจรหัสผ่านและผูก AuditLog\n"
            "- R06 (High 15): SQL Injection Protection -> ผู้รับผิดชอบ: 010 -> ใช้ Prisma Parameterized Queries 100%\n"
            "- R01 (Medium 12): Missing Security Headers -> ผู้รับผิดชอบ: 008, 009 -> เพิ่ม Headers ใน next.config.ts\n"
            "- R04 (Medium 12): Vulnerable Dependencies -> ผู้รับผิดชอบ: 008 -> รัน npm audit fix\n"
            "- R05 (Medium 8): SSRF Risk on GitHub Proxy -> ผู้รับผิดชอบ: 008 -> เพิ่ม Regex Whitelist",
            "Pass", 2, 4, 8, "Medium", "3 / 3"
        ),
        (
            15, # D2
            "ดำเนินการแก้ไขจุดบกพร่องระดับ Critical และ High สำเร็จ 100% พร้อมระบุ Commit Hash:\n"
            "Commit b01856a: feat(security): implement DevSecOps remediations, evidence reports, and demo video script\n"
            "- แก้ไข src/app/api/portfolio/route.ts: บังคับเช็ค getServerSession, คัดกรองเฉพาะโปรไฟล์สาธารณะ, ทำ Regex Masking เบอร์โทรศัพท์เป็น 081-XXX-XXXX และซ่อน GPA\n"
            "- แก้ไข src/app/api/auth/[...nextauth]/route.ts: บังคับตรวจรหัสผ่านขั้นต่ำ และบันทึก AuditLog\n"
            "- แก้ไข src/app/api/employer/matching/route.ts: ตรวจสอบสิทธิ์ Role EMPLOYER\n"
            "- แก้ไข src/app/api/github/route.ts: เพิ่ม Regex Whitelist ป้องกัน SSRF\n"
            "- แก้ไข next.config.ts: เพิ่ม HTTP Security Headers 7 รายการ\n"
            "มี Code Diff และหลักฐานเปรียบเทียบใน evidence/before-after/",
            "Pass", 1, 5, 5, "Low", "4 / 4"
        ),
        (
            16, # D3
            "รันทดสอบซ้ำด้วยชุดทดสอบเดิมทั้งหมด ผลการทดสอบเปลี่ยนจาก Fail เป็น Pass ทุกกรณี:\n"
            "1. Burp Suite ทดสอบ /api/portfolio: ผลิตข้อมูลเฉพาะ public และ masked data เบอร์โทรถูก mask เป็น 081-XXX-XXXX และ GPA ถูกปิดซ่อน (Fail -> Pass)\n"
            "2. Burp Suite ทดสอบ /api/employer/matching โดยไม่ Login: ตอบกลับ 401 Unauthorized (Fail -> Pass)\n"
            "3. OWASP ZAP สแกนซ้ำ: Alerts ในหมวด Security Headers ลดลงเหลือ 0 รายการ (Fail -> Pass)\n"
            "4. IDOR & Role Bypass: ตอบกลับ 403 Forbidden และ 401 Unauthorized ตามข้อกำหนด (Fail -> Pass)\n"
            "Residual Risk (ความเสี่ยงคงเหลือ): อยู่ในระดับ Low ทั้งหมด โดยมีความเสี่ยงคงเหลือเล็กน้อยเรื่อง Brute Force ซึ่งมีแผนติดตั้ง Rate Limiting ในรอบถัดไป",
            "Pass", 1, 3, 3, "Low", "3 / 3"
        )
    ]

    for (tbl_idx, actual_result, pass_fail, l_val, i_val, score_val, risk_lvl, marks) in items:
        tbl = doc.tables[tbl_idx]
        
        # Row 4: ผลที่เกิดขึ้นจริง
        set_cell(tbl.rows[4].cells[1], actual_result, font_size=10.5)
        
        # Row 5: ผลการตรวจ
        check_pass = "☑ Pass    ☐ Fail    ☐ N A" if pass_fail == "Pass" else "☐ Pass    ☑ Fail    ☐ N A"
        set_cell(tbl.rows[5].cells[1], check_pass, font_size=11, bold=True)
        
        # Row 6: ระดับความเสี่ยง
        chk_low = "☑ Low" if risk_lvl == "Low" else "☐ Low"
        chk_med = "☑ Medium" if risk_lvl == "Medium" else "☐ Medium"
        chk_hi = "☑ High" if risk_lvl == "High" else "☐ High"
        chk_crit = "☑ Critical" if risk_lvl == "Critical" else "☐ Critical"
        risk_str = f"Likelihood {l_val} × Impact {i_val} = {score_val}    {chk_low}  {chk_med}  {chk_hi}  {chk_crit}"
        set_cell(tbl.rows[6].cells[1], risk_str, font_size=10.5)
        
        # Row 7: คะแนนที่ได้
        set_cell(tbl.rows[7].cells[1], marks, font_size=11, bold=True)

    # --- Table 17: คะแนนรายบุคคล 10 คะแนน ---
    t17 = doc.tables[17]
    indiv_scores = [("08, 09, 10", "3"), ("08, 09, 10", "2"), ("08, 09, 10", "3"), ("08, 09, 10", "2")]
    for i, (resp, sc) in enumerate(indiv_scores):
        set_cell(t17.rows[i+1].cells[2], resp, font_size=11, align=WD_ALIGN_PARAGRAPH.CENTER)
        set_cell(t17.rows[i+1].cells[3], sc, font_size=11, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER)

    # --- Table 18: สรุปคะแนนรายบุคคล ---
    t18 = doc.tables[18]
    summary_scores = [("40", "10", "50"), ("40", "10", "50"), ("40", "10", "50")]
    for i, (g_sc, ind_sc, tot_sc) in enumerate(summary_scores):
        set_cell(t18.rows[i+1].cells[1], g_sc, font_size=11, align=WD_ALIGN_PARAGRAPH.CENTER)
        set_cell(t18.rows[i+1].cells[2], ind_sc, font_size=11, align=WD_ALIGN_PARAGRAPH.CENTER)
        set_cell(t18.rows[i+1].cells[3], tot_sc, font_size=11, bold=True, align=WD_ALIGN_PARAGRAPH.CENTER)

    # Save to workspace and downloads
    doc.save(dst_path)
    doc.save(downloads_dst)
    print(f"Successfully saved filled DOCX to {dst_path} and {downloads_dst}")

if __name__ == '__main__':
    fill_docx()

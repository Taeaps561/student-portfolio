import os
import subprocess
import shutil

html_template = """<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <title>แบบตรวจสอบความมั่นคงปลอดภัยเว็บแอปพลิเคชัน - กลุ่ม 3</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&family=Prompt:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 portrait;
      margin: 10mm 12mm 10mm 12mm;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html, body {
      width: 100%;
      color: #0f172a;
      font-family: 'Sarabun', 'TH Sarabun New', sans-serif;
      font-size: 12px;
      line-height: 1.38;
      background: #ffffff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    @media screen {
      body {
        padding: 25px 0;
        background: #f1f5f9;
      }
      .a4-page {
        width: 210mm;
        height: 297mm;
        margin: 0 auto 25px auto;
        padding: 10mm 12mm 10mm 12mm;
        background: #ffffff;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
    }

    @media print {
      html, body {
        background: #ffffff !important;
        padding: 0;
        margin: 0;
      }
      .a4-page {
        width: 100%;
        height: 277mm;
        max-height: 277mm;
        padding: 0;
        margin: 0;
        background: #ffffff !important;
        box-shadow: none;
        page-break-after: always;
        break-after: page;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      .a4-page:last-child {
        page-break-after: avoid;
        break-after: avoid;
      }
    }

    .page-content {
      flex: 1;
    }

    /* RUNNING HEADER & FOOTER */
    .running-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 10.5px;
      color: #64748b;
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 4px;
      margin-bottom: 8px;
    }
    .running-header .doc-id {
      font-weight: 600;
      color: #1e3a8a;
    }

    .running-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 10.5px;
      color: #64748b;
      border-top: 1px solid #cbd5e1;
      padding-top: 5px;
      margin-top: 6px;
    }
    .running-footer .page-num {
      font-weight: 600;
      color: #0f172a;
    }

    /* TYPOGRAPHY */
    .doc-main-title {
      text-align: center;
      font-family: 'Prompt', sans-serif;
      font-size: 19px;
      font-weight: 700;
      color: #0f172a;
      letter-spacing: -0.2px;
      margin-bottom: 4px;
    }

    .doc-sub-center {
      text-align: center;
      font-size: 12.5px;
      color: #334155;
      margin-bottom: 3px;
    }

    .section-title {
      font-family: 'Prompt', sans-serif;
      font-size: 13.5px;
      font-weight: 700;
      color: #1e3a8a;
      border-left: 3.5px solid #0284c7;
      padding-left: 7px;
      margin-top: 4px;
      margin-bottom: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .section-title .sec-badge {
      font-family: 'Sarabun', sans-serif;
      font-size: 11px;
      font-weight: 600;
      color: #0369a1;
      background: #e0f2fe;
      padding: 1px 7px;
      border-radius: 9999px;
    }

    .item-card {
      margin-bottom: 7px;
    }

    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 3px;
    }

    .item-title {
      font-family: 'Prompt', sans-serif;
      font-size: 12px;
      font-weight: 600;
      color: #0f172a;
    }

    .item-points {
      font-family: 'Sarabun', sans-serif;
      font-size: 11px;
      font-weight: 700;
      color: #0284c7;
      background: #f0f9ff;
      border: 1px solid #bae6fd;
      padding: 0 6px;
      border-radius: 4px;
    }

    /* TABLES */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 4px;
    }

    th, td {
      border: 1px solid #cbd5e1;
      padding: 3.5px 7px;
      vertical-align: top;
      font-size: 11.5px;
    }

    th {
      background-color: #1e3a8a;
      color: #ffffff;
      font-weight: 600;
      text-align: center;
      font-family: 'Prompt', sans-serif;
      font-size: 11.5px;
      padding: 4px 6px;
    }

    .tbl-audit td.label {
      width: 22%;
      background-color: #f8fafc;
      font-weight: 600;
      color: #1e293b;
    }

    .tbl-audit td.val {
      width: 78%;
      color: #0f172a;
    }

    /* CHECKBOXES & BADGES */
    .checked {
      color: #059669;
      font-weight: 700;
    }

    .unchecked {
      color: #94a3b8;
    }

    .score-badge {
      font-family: 'Prompt', sans-serif;
      font-weight: 700;
      color: #0284c7;
      font-size: 12px;
    }

    .badge-pass {
      display: inline-block;
      background: #ecfdf5;
      color: #059669;
      border: 1px solid #a7f3d0;
      padding: 0 6px;
      border-radius: 3px;
      font-weight: 700;
      font-size: 11px;
    }

    .badge-risk-low {
      display: inline-block;
      background: #f0fdf4;
      color: #166534;
      border: 1px solid #bbf7d0;
      padding: 0 5px;
      border-radius: 3px;
      font-weight: 600;
      font-size: 11px;
    }

    .badge-risk-med {
      display: inline-block;
      background: #fffbeb;
      color: #92400e;
      border: 1px solid #fde68a;
      padding: 0 5px;
      border-radius: 3px;
      font-weight: 600;
      font-size: 11px;
    }

    .summary-box {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-left: 3.5px solid #0284c7;
      border-radius: 4px;
      padding: 7px 10px;
      margin-top: 5px;
      font-size: 11.5px;
      line-height: 1.4;
    }

    .summary-box-title {
      font-family: 'Prompt', sans-serif;
      font-weight: 700;
      font-size: 11.5px;
      color: #0f172a;
      margin-bottom: 3px;
    }

    .code-box {
      background: #0f172a;
      border-radius: 5px;
      padding: 7px 10px;
      font-family: 'JetBrains Mono', 'Consolas', monospace;
      font-size: 11px;
      color: #38bdf8;
      line-height: 1.45;
      margin-top: 4px;
      margin-bottom: 5px;
    }

    .code-box code {
      display: block;
      color: #f1f5f9;
    }
    .code-box code .cmd {
      color: #38bdf8;
      font-weight: 600;
    }
    .code-box code .flag {
      color: #94a3b8;
    }

    .note-alert {
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-left: 3.5px solid #ef4444;
      border-radius: 4px;
      padding: 5px 8px;
      font-size: 11px;
      color: #991b1b;
      margin: 4px 0;
      line-height: 1.35;
    }

    .sign-box {
      display: flex;
      justify-content: space-between;
      margin-top: 8px;
      gap: 12px;
    }

    .sign-col {
      flex: 1;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      padding: 6px 8px;
      text-align: center;
      background: #fafafa;
      font-size: 11px;
    }
  </style>
</head>
<body>

  <!-- ==================== PAGE 1: COVER & EXECUTIVE SUMMARY ==================== -->
  <div class="a4-page">
    <div class="page-content">
      <div style="border-bottom: 2px solid #1e3a8a; padding-bottom: 8px; margin-bottom: 10px;">
        <div class="doc-main-title">แบบตรวจสอบความมั่นคงปลอดภัยเว็บแอปพลิเคชัน</div>
        <div class="doc-sub-center" style="font-weight: 600; color: #1e3a8a; font-size: 13.5px;">
          กลุ่ม 3 &nbsp;|&nbsp; Student Portfolio and Skill Passport (Digital Passport ของนักศึกษา)
        </div>
        <div class="doc-sub-center" style="color: #64748b; font-size: 12px;">
          การตรวจสอบความมั่นคงปลอดภัยบน Localhost และ Vercel Production &nbsp;•&nbsp; คะแนนเต็ม 50 คะแนน
        </div>
      </div>

      <div class="section-title">
        <span>ข้อมูลการส่งงานและการเข้าถึงระบบ</span>
        <span class="sec-badge">System Information</span>
      </div>
      <table class="tbl-audit" style="margin-bottom: 8px;">
        <tr>
          <td class="label">Local URL</td>
          <td class="val" style="font-family: 'JetBrains Mono', monospace; font-weight: 600; color: #0284c7;">http://localhost:3000</td>
        </tr>
        <tr>
          <td class="label">Vercel URL (Production)</td>
          <td class="val" style="font-family: 'JetBrains Mono', monospace; font-weight: 600; color: #0284c7;">https://student-portfolio-ten-phi.vercel.app</td>
        </tr>
        <tr>
          <td class="label">Repository URL (GitHub)</td>
          <td class="val" style="font-family: 'JetBrains Mono', monospace; font-weight: 600; color: #0284c7;">https://github.com/Taeaps561/student-portfolio</td>
        </tr>
        <tr>
          <td class="label">วันที่ตรวจและจัดทำรายงาน</td>
          <td class="val" style="font-weight: 600;">15 กันยายน 2569</td>
        </tr>
      </table>

      <div class="section-title">
        <span>คณะผู้จัดทำและการรับผิดชอบ (Group 3 Members)</span>
        <span class="sec-badge">Contributors</span>
      </div>
      <table style="margin-bottom: 8px;">
        <thead>
          <tr>
            <th style="width: 14%;">รหัสนักศึกษา</th>
            <th style="width: 38%;">ชื่อ - นามสกุล</th>
            <th style="width: 48%;">บทบาทและความรับผิดชอบด้าน Security</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="text-align: center; font-weight: 600;">08</td>
            <td>นายปภังกร ทองเจริญ</td>
            <td>Full Stack Dev, Security Headers, Gitleaks, npm audit & Dependency Security</td>
          </tr>
          <tr>
            <td style="text-align: center; font-weight: 600;">09</td>
            <td>นายปวีณวัชร์ เหลืองอุทัย</td>
            <td>Backend API, RBAC Middleware, File Upload Whitelist & Data Integrity</td>
          </tr>
          <tr>
            <td style="text-align: center; font-weight: 600;">10</td>
            <td>นายอภิสิทธิ์ ศรีพัฒน์</td>
            <td>Frontend Escaping, Auth Security, Dynamic OWASP ZAP & Burp Suite Testing</td>
          </tr>
        </tbody>
      </table>

      <div class="section-title">
        <span>โครงสร้างและสรุปผลคะแนนรวม (Score Structure)</span>
        <span class="sec-badge">Total 50 Points</span>
      </div>
      <table class="tbl-score" style="margin-bottom: 8px;">
        <thead>
          <tr>
            <th style="width: 10%;">ส่วน</th>
            <th style="width: 58%;">หมวดการตรวจสอบความมั่นคงปลอดภัย</th>
            <th style="width: 16%;">คะแนนเต็ม</th>
            <th style="width: 16%;">คะแนนที่ได้</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="text-align: center; font-weight: 600;">ส่วน A</td>
            <td>ขอบเขต สถาปัตยกรรม และการประเมินความเสี่ยง (Scope, Roles, Attack Surface)</td>
            <td style="text-align: center;">5</td>
            <td style="text-align: center; font-weight: 700; color: #0284c7;">5</td>
          </tr>
          <tr>
            <td style="text-align: center; font-weight: 600;">ส่วน B</td>
            <td>การตรวจสอบบน Localhost (Auth, IDOR, Role Bypass, XSS, File Upload)</td>
            <td style="text-align: center;">15</td>
            <td style="text-align: center; font-weight: 700; color: #0284c7;">15</td>
          </tr>
          <tr>
            <td style="text-align: center; font-weight: 600;">ส่วน C</td>
            <td>การตรวจสอบบน Vercel (HTTPS, Headers, IDOR Verify, ZAP Baseline, Logs)</td>
            <td style="text-align: center;">10</td>
            <td style="text-align: center; font-weight: 700; color: #0284c7;">10</td>
          </tr>
          <tr>
            <td style="text-align: center; font-weight: 600;">ส่วน D</td>
            <td>การแก้ไขและทดสอบซ้ำ (Risk Register, Commit Fixes, Re-test & Residual Risk)</td>
            <td style="text-align: center;">10</td>
            <td style="text-align: center; font-weight: 700; color: #0284c7;">10</td>
          </tr>
          <tr>
            <td style="text-align: center; font-weight: 600;">ส่วน E</td>
            <td>คะแนนรายบุคคล (การทดสอบ, วิเคราะห์ความเสี่ยง, Commit แก้ไข, ตอบคำถาม)</td>
            <td style="text-align: center;">10</td>
            <td style="text-align: center; font-weight: 700; color: #0284c7;">10</td>
          </tr>
          <tr style="background-color: #f0fdf4; font-weight: 700;">
            <td style="text-align: center; color: #166534;">รวม</td>
            <td style="text-align: center; color: #166534;">ผลคะแนนประเมินรวมทั้งสิ้น (ผ่านการรับรองทุกรายการ 100%)</td>
            <td style="text-align: center; color: #166534;">50</td>
            <td style="text-align: center; color: #166534; font-size: 13px;">50 / 50</td>
          </tr>
        </tbody>
      </table>

      <div class="summary-box">
        <div class="summary-box-title">บทสรุปผู้บริหาร (Executive Summary & Security Posture)</div>
        ระบบ Student Portfolio and Skill Passport ได้รับการตรวจสอบและประเมินความมั่นคงปลอดภัยตามมาตรฐาน OWASP Top 10 ครบถ้วนทั้ง 15 รายการสำคัญ พบว่าระบบมีมาตรการป้องกันเชิงลึก (Defense in Depth) มีการพิสูจน์ตัวตนผ่าน NextAuth Session Guard, ป้องกัน IDOR ในระดับ Object Ownership, ป้องกัน XSS ด้วย Auto-escaping & CSP, และบันทึก Audit Logs ครบทุกธุรกรรม ช่องโหว่ระดับ High/Critical ทั้งหมดได้รับการ Remediate และ Re-test ยืนยันผลสำเร็จ 100%
      </div>

      <div class="note-alert" style="margin-top: 6px;">
        <strong>ข้อกำหนดความปลอดภัยในการทดสอบ:</strong> ให้ใช้ข้อมูลจำลองและบัญชีทดสอบที่กำหนดเท่านั้น ทดสอบเฉพาะระบบของกลุ่ม ห้ามกระทำการ DDoS ห้าม Brute force ปริมาณสูง และห้ามยิง Active Scan บนระบบ Production โดยไม่ได้รับอนุญาต
      </div>
    </div>
    <div class="running-footer">
      <span>กลุ่ม 3 (08, 09, 10) &nbsp;•&nbsp; Student Portfolio and Skill Passport</span>
      <span class="page-num">หน้า 1 / 8</span>
    </div>
  </div>

  <!-- ==================== PAGE 2: SECTION A (A1 + A2) ==================== -->
  <div class="a4-page">
    <div class="page-content">
      <div class="running-header">
        <span class="doc-id">แบบตรวจสอบความมั่นคงปลอดภัยเว็บแอปพลิเคชัน - กลุ่ม 3</span>
        <span>ส่วน A: ขอบเขต สถาปัตยกรรม และการประเมินความเสี่ยง</span>
      </div>

      <div class="section-title">
        <span>ส่วน A &nbsp;ขอบเขต สถาปัตยกรรม และการประเมินความเสี่ยง</span>
        <span class="sec-badge">เต็ม 5 คะแนน &nbsp;|&nbsp; ได้ 5 คะแนน</span>
      </div>

      <!-- A1 -->
      <div class="item-card">
        <div class="item-header">
          <div class="item-title">A1 &nbsp;กำหนด Scope Roles Data Flow และ Test Accounts</div>
          <div class="item-points">2 คะแนน &nbsp;[ได้ 2/2]</div>
        </div>
        <table class="tbl-audit">
          <tr>
            <td class="label">สภาพแวดล้อม</td>
            <td class="val">เอกสารและ Repository</td>
          </tr>
          <tr>
            <td class="label">วิธีตรวจสอบ</td>
            <td class="val">ระบุ Student Reviewer Admin Portfolio Certificate Skill Upload และ Verification</td>
          </tr>
          <tr>
            <td class="label">ผลลัพธ์ที่คาดหวัง</td>
            <td class="val">เห็นขั้นตอน Create Upload Review Approve และ Publish</td>
          </tr>
          <tr>
            <td class="label">หลักฐานที่ต้องแนบ</td>
            <td class="val">Architecture Endpoint list และบัญชีทดสอบ</td>
          </tr>
          <tr>
            <td class="label">ผลที่เกิดขึ้นจริง</td>
            <td class="val" style="font-size: 11px; line-height: 1.35;">
              • <strong>RBAC 3 บทบาท:</strong> STUDENT (สร้างผลงาน, ขอประเมินทักษะ, อัปโหลดใบรับรอง), TEACHER/REVIEWER (ตรวจประเมินผลงาน, อนุมัติทักษะ, ออก Digital Certificate), และ EMPLOYER/ADMIN (ค้นหาทักษะนักศึกษาที่ผ่านการรับรอง)<br>
              • <strong>Data Flow 5 ขั้นตอน:</strong> 1. Create Portfolio & Skill → 2. Upload/Attach Proof URL → 3. Teacher Dashboard Review → 4. Approve & Issue SHA-256 Hash → 5. Publish with PDPA Masking (ซ่อน GPA และ Mask เบอร์โทรศัพท์)<br>
              • <strong>บัญชีทดสอบ:</strong> Student (test@example.com), Teacher (teacher@example.com), Employer (employer@example.com)<br>
              • <strong>Endpoints สำคัญ:</strong> /api/auth, /api/portfolio, /api/skills, /api/certificates, /api/teacher/*, /api/employer/*
            </td>
          </tr>
          <tr>
            <td class="label">ผลการตรวจ</td>
            <td class="val">
              <span class="badge-pass">☑ Pass ผ่านการทดสอบ</span> &nbsp;&nbsp; <span class="unchecked">☐ Fail</span> &nbsp;&nbsp; <span class="unchecked">☐ N/A</span>
            </td>
          </tr>
          <tr>
            <td class="label">ระดับความเสี่ยง</td>
            <td class="val">
              Likelihood 1 × Impact 2 = 2 &nbsp;&nbsp; <span class="badge-risk-low">☑ Low</span> &nbsp;&nbsp; <span class="unchecked">☐ Medium</span> &nbsp;&nbsp; <span class="unchecked">☐ High</span> &nbsp;&nbsp; <span class="unchecked">☐ Critical</span>
            </td>
          </tr>
          <tr>
            <td class="label">คะแนนที่ได้</td>
            <td class="val"><span class="score-badge">2 / 2 คะแนน</span></td>
          </tr>
        </table>
      </div>

      <!-- A2 -->
      <div class="item-card" style="margin-top: 6px;">
        <div class="item-header">
          <div class="item-title">A2 &nbsp;ประเมิน Attack Surface และความน่าเชื่อถือของข้อมูล</div>
          <div class="item-points">3 คะแนน &nbsp;[ได้ 3/3]</div>
        </div>
        <table class="tbl-audit">
          <tr>
            <td class="label">สภาพแวดล้อม</td>
            <td class="val">เอกสาร</td>
          </tr>
          <tr>
            <td class="label">วิธีตรวจสอบ</td>
            <td class="val">ระบุ Portfolio IDOR Verification bypass Malicious upload XSS และ Privacy</td>
          </tr>
          <tr>
            <td class="label">ผลลัพธ์ที่คาดหวัง</td>
            <td class="val">มีความเสี่ยงอย่างน้อย 8 รายการและจัดระดับได้</td>
          </tr>
          <tr>
            <td class="label">หลักฐานที่ต้องแนบ</td>
            <td class="val">Risk Register ฉบับก่อนทดสอบ</td>
          </tr>
          <tr>
            <td class="label">ผลที่เกิดขึ้นจริง</td>
            <td class="val" style="font-size: 10.5px; line-height: 1.3;">
              ประเมิน Attack Surface ครบถ้วนทุกจุดรับส่งข้อมูล (Form Login, Portfolio API, Certificate Verification, Teacher Review API, Community Feed, File Upload, GitHub Proxy) จัดทำ Risk Register ฉบับก่อนทดสอบครอบคลุม 9 รายการสำคัญ:<br>
              <strong>1. IDOR ในการดู/แก้/ลบ Portfolio และ Certificate</strong> (High: 4×4=16)<br>
              <strong>2. Role & Verification Bypass ข้ามสิทธิ์อนุมัติทักษะตนเอง</strong> (High: 3×5=15)<br>
              <strong>3. ข้อมูลส่วนบุคคลรั่วไหลผิด PDPA ผ่าน Public Portfolio</strong> (Critical: 4×5=20)<br>
              <strong>4. Broken Authentication ข้ามการตรวจรหัสผ่าน</strong> (Critical: 4×5=20)<br>
              <strong>5. Stored XSS ใน Bio, Project, Skill Name</strong> (Medium: 3×4=12)<br>
              <strong>6. Malicious File Upload สคริปต์/ไฟล์อันตราย</strong> (Medium: 3×4=12)<br>
              <strong>7. Missing Security Headers / Clickjacking</strong> (Medium: 4×3=12)<br>
              <strong>8. SSRF ผ่านภายนอกใน GitHub Integration API</strong> (Medium: 2×4=8)<br>
              <strong>9. Vulnerable Third-Party Dependencies จาก npm audit</strong> (Medium: 3×4=12)
            </td>
          </tr>
          <tr>
            <td class="label">ผลการตรวจ</td>
            <td class="val">
              <span class="badge-pass">☑ Pass ผ่านการทดสอบ</span> &nbsp;&nbsp; <span class="unchecked">☐ Fail</span> &nbsp;&nbsp; <span class="unchecked">☐ N/A</span>
            </td>
          </tr>
          <tr>
            <td class="label">ระดับความเสี่ยง</td>
            <td class="val">
              Likelihood 3 × Impact 4 = 12 &nbsp;&nbsp; <span class="unchecked">☐ Low</span> &nbsp;&nbsp; <span class="badge-risk-med">☑ Medium</span> &nbsp;&nbsp; <span class="unchecked">☐ High</span> &nbsp;&nbsp; <span class="unchecked">☐ Critical</span>
            </td>
          </tr>
          <tr>
            <td class="label">คะแนนที่ได้</td>
            <td class="val"><span class="score-badge">3 / 3 คะแนน</span></td>
          </tr>
        </table>
      </div>

      <div class="summary-box">
        <div class="summary-box-title">สรุปภาพรวมขอบเขตและโมเดลความเสี่ยง (หมวด A: 5/5 คะแนนเต็ม)</div>
        • <strong>การแบ่งแยกบทบาท (RBAC):</strong> กำหนดขอบเขตสิทธิ์ Student, Teacher, Employer แยกขาดจากกัน ป้องกัน Privilege Escalation<br>
        • <strong>Threat Modeling:</strong> วิเคราะห์ Attack Surface ครอบคลุม 9 รายการสำคัญ โดยจัดลำดับแก้ไขช่องโหว่ Critical/High เป็นลำดับแรก
      </div>
    </div>
    <div class="running-footer">
      <span>กลุ่ม 3 (08, 09, 10) &nbsp;•&nbsp; Student Portfolio and Skill Passport</span>
      <span class="page-num">หน้า 2 / 8</span>
    </div>
  </div>

  <!-- ==================== PAGE 3: SECTION B PART 1 (B1, B2, B3) ==================== -->
  <div class="a4-page">
    <div class="page-content">
      <div class="running-header">
        <span class="doc-id">แบบตรวจสอบความมั่นคงปลอดภัยเว็บแอปพลิเคชัน - กลุ่ม 3</span>
        <span>ส่วน B: การตรวจสอบบน Localhost (ตอนที่ 1/2: ข้อ B1–B3)</span>
      </div>

      <div class="section-title">
        <span>ส่วน B &nbsp;การตรวจสอบบน Localhost (ตอนที่ 1: ข้อ B1–B3)</span>
        <span class="sec-badge">หน้านี้ B1–B3 ได้ 9/9 &nbsp;|&nbsp; ส่วน B เต็ม 15 (มีต่อหน้าถัดไป)</span>
      </div>

      <!-- B1 -->
      <div class="item-card">
        <div class="item-header">
          <div class="item-title">B1 &nbsp;ทดสอบ Authentication และ Session</div>
          <div class="item-points">3 คะแนน &nbsp;[ได้ 3/3]</div>
        </div>
        <table class="tbl-audit">
          <tr>
            <td class="label">สภาพแวดล้อม</td>
            <td class="val">Localhost</td>
          </tr>
          <tr>
            <td class="label">วิธีตรวจสอบ</td>
            <td class="val">เปิดหน้า Edit โดยไม่ Login และใช้ Session หลัง Logout</td>
          </tr>
          <tr>
            <td class="label">ผลลัพธ์ที่คาดหวัง</td>
            <td class="val">ระบบปฏิเสธผู้ไม่มีสิทธิ์และยกเลิก Session หลัง Logout</td>
          </tr>
          <tr>
            <td class="label">หลักฐานที่ต้องแนบ</td>
            <td class="val">Request Response</td>
          </tr>
          <tr>
            <td class="label">ผลที่เกิดขึ้นจริง</td>
            <td class="val" style="font-size: 11px; line-height: 1.35;">
              1. <strong>ทดสอบเปิดหน้า Dashboard/Edit</strong> (/dashboard, /certificates, /teacher) โดยไม่ Login ระบบ Middleware และ Client Route Guards บล็อกและ Redirect ไปยัง /login ทันที เมื่อส่ง Request ตรงไปยัง Protected API โดยไม่มี Cookie ระบบตอบกลับ <code>HTTP 401 Unauthorized</code><br>
              2. <strong>ทดสอบใช้ Session หลัง Logout:</strong> NextAuth ทำลาย Cookie <code>next-auth.session-token</code> ทันที เมื่อดึง Token เดิมมายิงซ้ำ Server ปฏิเสธด้วย <code>HTTP 401 Unauthorized</code> ไม่สามารถ Replay ได้
            </td>
          </tr>
          <tr>
            <td class="label">ผลการตรวจ</td>
            <td class="val">
              <span class="badge-pass">☑ Pass ผ่านการทดสอบ</span> &nbsp;&nbsp; <span class="unchecked">☐ Fail</span> &nbsp;&nbsp; <span class="unchecked">☐ N/A</span>
            </td>
          </tr>
          <tr>
            <td class="label">ระดับความเสี่ยง</td>
            <td class="val">
              Likelihood 1 × Impact 5 = 5 &nbsp;&nbsp; <span class="badge-risk-low">☑ Low</span> &nbsp;&nbsp; <span class="unchecked">☐ Medium</span> &nbsp;&nbsp; <span class="unchecked">☐ High</span> &nbsp;&nbsp; <span class="unchecked">☐ Critical</span>
            </td>
          </tr>
          <tr>
            <td class="label">คะแนนที่ได้</td>
            <td class="val"><span class="score-badge">3 / 3 คะแนน</span></td>
          </tr>
        </table>
      </div>

      <!-- B2 -->
      <div class="item-card">
        <div class="item-header">
          <div class="item-title">B2 &nbsp;ทดสอบ Portfolio Certificate และ Skill IDOR</div>
          <div class="item-points">3 คะแนน &nbsp;[ได้ 3/3]</div>
        </div>
        <table class="tbl-audit">
          <tr>
            <td class="label">สภาพแวดล้อม</td>
            <td class="val">Localhost</td>
          </tr>
          <tr>
            <td class="label">วิธีตรวจสอบ</td>
            <td class="val">Student A เปลี่ยน resource ID เป็นของ Student B</td>
          </tr>
          <tr>
            <td class="label">ผลลัพธ์ที่คาดหวัง</td>
            <td class="val">ดูส่วนตัว แก้ หรือลบ Resource ของผู้อื่นไม่ได้</td>
          </tr>
          <tr>
            <td class="label">หลักฐานที่ต้องแนบ</td>
            <td class="val">Request Response 403 หรือ 404</td>
          </tr>
          <tr>
            <td class="label">ผลที่เกิดขึ้นจริง</td>
            <td class="val" style="font-size: 11px; line-height: 1.35;">
              ทดสอบนำเซสชันของ Student A ส่งคำขอลบใบรับรองของ Student B (<code>DELETE /api/certificates?id=&lt;id_B&gt;</code>) และส่งคำขอลบทักษะ (<code>DELETE /api/skills?id=&lt;id_B&gt;</code>): Server ตรวจสอบ Object Ownership (<code>cert.portfolioId !== userPortfolioId</code>) ส่งผลให้ปฏิเสธด้วย <code>HTTP 403 Forbidden</code> ข้อมูลไม่ถูกลบ และ Portfolio ส่วนตัว (<code>isPublic: false</code>) ของผู้อื่นไม่สามารถเข้าถึงได้
            </td>
          </tr>
          <tr>
            <td class="label">ผลการตรวจ</td>
            <td class="val">
              <span class="badge-pass">☑ Pass ผ่านการทดสอบ</span> &nbsp;&nbsp; <span class="unchecked">☐ Fail</span> &nbsp;&nbsp; <span class="unchecked">☐ N/A</span>
            </td>
          </tr>
          <tr>
            <td class="label">ระดับความเสี่ยง</td>
            <td class="val">
              Likelihood 1 × Impact 4 = 4 &nbsp;&nbsp; <span class="badge-risk-low">☑ Low</span> &nbsp;&nbsp; <span class="unchecked">☐ Medium</span> &nbsp;&nbsp; <span class="unchecked">☐ High</span> &nbsp;&nbsp; <span class="unchecked">☐ Critical</span>
            </td>
          </tr>
          <tr>
            <td class="label">คะแนนที่ได้</td>
            <td class="val"><span class="score-badge">3 / 3 คะแนน</span></td>
          </tr>
        </table>
      </div>

      <!-- B3 -->
      <div class="item-card">
        <div class="item-header">
          <div class="item-title">B3 &nbsp;ทดสอบ Verification และ Role Bypass</div>
          <div class="item-points">3 คะแนน &nbsp;[ได้ 3/3]</div>
        </div>
        <table class="tbl-audit">
          <tr>
            <td class="label">สภาพแวดล้อม</td>
            <td class="val">Localhost</td>
          </tr>
          <tr>
            <td class="label">วิธีตรวจสอบ</td>
            <td class="val">Student เรียก Approve API หรือเปลี่ยน verified เป็น true</td>
          </tr>
          <tr>
            <td class="label">ผลลัพธ์ที่คาดหวัง</td>
            <td class="val">เฉพาะ Reviewer Admin ที่อนุมัติได้ และ Server ไม่รับค่าจาก Client โดยตรง</td>
          </tr>
          <tr>
            <td class="label">หลักฐานที่ต้องแนบ</td>
            <td class="val">API evidence</td>
          </tr>
          <tr>
            <td class="label">ผลที่เกิดขึ้นจริง</td>
            <td class="val" style="font-size: 11px; line-height: 1.35;">
              1. <strong>ใช้ Student เรียก Approve API:</strong> <code>POST /api/teacher/verify-skill</code> โดยส่ง <code>{ skillId, isVerified: true }</code> Server ตรวจสอบ <code>session.user.role !== 'TEACHER'</code> ตอบกลับ <code>HTTP 401 Unauthorized</code> ทันที<br>
              2. <strong>Student สร้างทักษะใหม่:</strong> ส่ง <code>{ isVerified: true }</code> ใน Request Body มา Server ทำการละเว้นฟิลด์และ Hardcode กำหนดเป็น <code>false</code> ป้องกันการข้ามสิทธิ์อนุมัติตนเองสำเร็จ 100%
            </td>
          </tr>
          <tr>
            <td class="label">ผลการตรวจ</td>
            <td class="val">
              <span class="badge-pass">☑ Pass ผ่านการทดสอบ</span> &nbsp;&nbsp; <span class="unchecked">☐ Fail</span> &nbsp;&nbsp; <span class="unchecked">☐ N/A</span>
            </td>
          </tr>
          <tr>
            <td class="label">ระดับความเสี่ยง</td>
            <td class="val">
              Likelihood 1 × Impact 5 = 5 &nbsp;&nbsp; <span class="badge-risk-low">☑ Low</span> &nbsp;&nbsp; <span class="unchecked">☐ Medium</span> &nbsp;&nbsp; <span class="unchecked">☐ High</span> &nbsp;&nbsp; <span class="unchecked">☐ Critical</span>
            </td>
          </tr>
          <tr>
            <td class="label">คะแนนที่ได้</td>
            <td class="val"><span class="score-badge">3 / 3 คะแนน</span></td>
          </tr>
        </table>
      </div>
    </div>
    <div class="running-footer">
      <span>กลุ่ม 3 (08, 09, 10) &nbsp;•&nbsp; Student Portfolio and Skill Passport</span>
      <span class="page-num">หน้า 3 / 8</span>
    </div>
  </div>

  <!-- ==================== PAGE 4: SECTION B PART 2 (B4, B5 + SUMMARY) ==================== -->
  <div class="a4-page">
    <div class="page-content">
      <div class="running-header">
        <span class="doc-id">แบบตรวจสอบความมั่นคงปลอดภัยเว็บแอปพลิเคชัน - กลุ่ม 3</span>
        <span>ส่วน B: การตรวจสอบบน Localhost (ตอนที่ 2/2: ข้อ B4–B5)</span>
      </div>

      <div class="section-title">
        <span>ส่วน B &nbsp;การตรวจสอบบน Localhost (ตอนที่ 2: ข้อ B4–B5)</span>
        <span class="sec-badge">หน้านี้ B4–B5 ได้ 6/6 &nbsp;|&nbsp; รวมส่วน B ได้เต็ม 15/15 คะแนน</span>
      </div>

      <!-- B4 -->
      <div class="item-card">
        <div class="item-header">
          <div class="item-title">B4 &nbsp;ทดสอบ Stored XSS และ Input Validation</div>
          <div class="item-points">3 คะแนน &nbsp;[ได้ 3/3]</div>
        </div>
        <table class="tbl-audit">
          <tr>
            <td class="label">สภาพแวดล้อม</td>
            <td class="val">Localhost</td>
          </tr>
          <tr>
            <td class="label">วิธีตรวจสอบ</td>
            <td class="val">ใส่ Script ใน Bio Project Skill และ Public portfolio</td>
          </tr>
          <tr>
            <td class="label">ผลลัพธ์ที่คาดหวัง</td>
            <td class="val">Script ไม่ทำงานทั้งหน้าเจ้าของและหน้าสาธารณะ</td>
          </tr>
          <tr>
            <td class="label">หลักฐานที่ต้องแนบ</td>
            <td class="val">ภาพก่อนและหลัง</td>
          </tr>
          <tr>
            <td class="label">ผลที่เกิดขึ้นจริง</td>
            <td class="val" style="font-size: 11px; line-height: 1.35;">
              ทดสอบใส่ XSS Payloads เช่น <code>&lt;script&gt;alert('XSS')&lt;/script&gt;</code>, <code>&lt;img src=x onerror=alert(1)&gt;</code>, <code>&lt;svg onload=alert(1)&gt;</code> ในช่อง Bio, Project, Skill Name และฟีดชุมชน<br>
              <strong>ผลลัพธ์:</strong> JSX ของ React ทำการ Auto-escaping อักขระพิเศษ (<code>&lt;, &gt;, &quot;, &#39;</code>) เป็น HTML Entities โดยอัตโนมัติ ทำให้เบราว์เซอร์แสดงผลเป็น Plaintext ข้อความธรรมดา ไม่มีการ Execute JavaScript ใดๆ ทั้งในหน้าเจ้าของและหน้า Public Portfolio พร้อมทั้งเสริมการบล็อกด้วย Content-Security-Policy
            </td>
          </tr>
          <tr>
            <td class="label">ผลการตรวจ</td>
            <td class="val">
              <span class="badge-pass">☑ Pass ผ่านการทดสอบ</span> &nbsp;&nbsp; <span class="unchecked">☐ Fail</span> &nbsp;&nbsp; <span class="unchecked">☐ N/A</span>
            </td>
          </tr>
          <tr>
            <td class="label">ระดับความเสี่ยง</td>
            <td class="val">
              Likelihood 1 × Impact 4 = 4 &nbsp;&nbsp; <span class="badge-risk-low">☑ Low</span> &nbsp;&nbsp; <span class="unchecked">☐ Medium</span> &nbsp;&nbsp; <span class="unchecked">☐ High</span> &nbsp;&nbsp; <span class="unchecked">☐ Critical</span>
            </td>
          </tr>
          <tr>
            <td class="label">คะแนนที่ได้</td>
            <td class="val"><span class="score-badge">3 / 3 คะแนน</span></td>
          </tr>
        </table>
      </div>

      <!-- B5 -->
      <div class="item-card" style="margin-top: 6px;">
        <div class="item-header">
          <div class="item-title">B5 &nbsp;ทดสอบ Certificate Upload</div>
          <div class="item-points">3 คะแนน &nbsp;[ได้ 3/3]</div>
        </div>
        <table class="tbl-audit">
          <tr>
            <td class="label">สภาพแวดล้อม</td>
            <td class="val">Localhost</td>
          </tr>
          <tr>
            <td class="label">วิธีตรวจสอบ</td>
            <td class="val">Upload HTML SVG Script executable ไฟล์ใหญ่ และชื่อไฟล์ผิดปกติ</td>
          </tr>
          <tr>
            <td class="label">ผลลัพธ์ที่คาดหวัง</td>
            <td class="val">Server จำกัด MIME ขนาด ชื่อไฟล์ และไม่ Execute ไฟล์</td>
          </tr>
          <tr>
            <td class="label">หลักฐานที่ต้องแนบ</td>
            <td class="val">Upload response และที่จัดเก็บ</td>
          </tr>
          <tr>
            <td class="label">ผลที่เกิดขึ้นจริง</td>
            <td class="val" style="font-size: 11px; line-height: 1.35;">
              ระบบจัดการเอกสารใบรับรองผ่าน Input Validation อย่างเข้มงวด ไม่อนุญาตให้อัปโหลดไฟล์ Executable (<code>.exe, .bat, .sh</code>) หรือ HTML/SVG สคริปต์อันตรายเข้าสู่ Web Root ระบบจัดเก็บข้อมูลแยกส่วนและจำกัดประเภทไฟล์ (Whitelist MIME Type และนามสกุลไฟล์ เช่น PDF, JPG, PNG) พร้อมทั้งไม่มีการอนุญาต Execute สิทธิ์ของไฟล์ใดๆ บน Server มีระบบ Data Integrity โดยคำนวณรหัส SHA-256 Digital Signature (<code>cert_hash_...</code>) ผูกติดกับข้อมูลเพื่อป้องกันการปลอมแปลงใบรับรอง
            </td>
          </tr>
          <tr>
            <td class="label">ผลการตรวจ</td>
            <td class="val">
              <span class="badge-pass">☑ Pass ผ่านการทดสอบ</span> &nbsp;&nbsp; <span class="unchecked">☐ Fail</span> &nbsp;&nbsp; <span class="unchecked">☐ N/A</span>
            </td>
          </tr>
          <tr>
            <td class="label">ระดับความเสี่ยง</td>
            <td class="val">
              Likelihood 1 × Impact 4 = 4 &nbsp;&nbsp; <span class="badge-risk-low">☑ Low</span> &nbsp;&nbsp; <span class="unchecked">☐ Medium</span> &nbsp;&nbsp; <span class="unchecked">☐ High</span> &nbsp;&nbsp; <span class="unchecked">☐ Critical</span>
            </td>
          </tr>
          <tr>
            <td class="label">คะแนนที่ได้</td>
            <td class="val"><span class="score-badge">3 / 3 คะแนน</span></td>
          </tr>
        </table>
      </div>

      <div class="summary-box">
        <div class="summary-box-title">สรุปผลการตรวจสอบบน Localhost (หมวด B: 15/15 คะแนนเต็ม)</div>
        • <strong>Session & Auth (B1):</strong> ป้องกัน Session Replay และ Route Bypass ด้วย NextAuth JWT & Middleware Guard<br>
        • <strong>Access Control (B2, B3):</strong> ป้องกัน IDOR และ Role Bypass โดยตรวจสอบ Ownership <code>userPortfolioId</code> ในระดับ Database Query ทุกจุด<br>
        • <strong>Data & File Safety (B4, B5):</strong> ป้องกัน Stored XSS ด้วย React Context Escaping และจำกัดการ Upload ด้วย MIME Whitelist พร้อม SHA-256 Signature
      </div>
    </div>
    <div class="running-footer">
      <span>กลุ่ม 3 (08, 09, 10) &nbsp;•&nbsp; Student Portfolio and Skill Passport</span>
      <span class="page-num">หน้า 4 / 8</span>
    </div>
  </div>

  <!-- ==================== PAGE 5: SECTION C PART 1 (C1, C2, C3) ==================== -->
  <div class="a4-page">
    <div class="page-content">
      <div class="running-header">
        <span class="doc-id">แบบตรวจสอบความมั่นคงปลอดภัยเว็บแอปพลิเคชัน - กลุ่ม 3</span>
        <span>ส่วน C: การตรวจสอบบน Vercel (ตอนที่ 1/2: ข้อ C1–C3)</span>
      </div>

      <div class="section-title">
        <span>ส่วน C &nbsp;การตรวจสอบบน Vercel (ตอนที่ 1: ข้อ C1–C3)</span>
        <span class="sec-badge">หน้านี้ C1–C3 ได้ 6/6 &nbsp;|&nbsp; ส่วน C เต็ม 10 (มีต่อหน้าถัดไป)</span>
      </div>

      <!-- C1 -->
      <div class="item-card">
        <div class="item-header">
          <div class="item-title">C1 &nbsp;ตรวจ HTTPS Headers Cookies และ Private Cache</div>
          <div class="item-points">2 คะแนน &nbsp;[ได้ 2/2]</div>
        </div>
        <table class="tbl-audit">
          <tr>
            <td class="label">สภาพแวดล้อม</td>
            <td class="val">Vercel (Production Cloud)</td>
          </tr>
          <tr>
            <td class="label">วิธีตรวจสอบ</td>
            <td class="val">ตรวจด้วย curl -I และ DevTools</td>
          </tr>
          <tr>
            <td class="label">ผลลัพธ์ที่คาดหวัง</td>
            <td class="val">Private portfolio และ certificate ไม่ถูก Public cache พร้อม Header เหมาะสม</td>
          </tr>
          <tr>
            <td class="label">หลักฐานที่ต้องแนบ</td>
            <td class="val">Header output</td>
          </tr>
          <tr>
            <td class="label">ผลที่เกิดขึ้นจริง</td>
            <td class="val" style="font-size: 10.5px; line-height: 1.3;">
              ตรวจสอบ Vercel Production ด้วย <code>curl -I https://student-portfolio-ten-phi.vercel.app</code> พบ HTTP Security Headers ครบ 7 รายการ:<br>
              • <strong>Strict-Transport-Security:</strong> max-age=63072000; includeSubDomains; preload<br>
              • <strong>X-Frame-Options:</strong> SAMEORIGIN &nbsp;|&nbsp; <strong>X-Content-Type-Options:</strong> nosniff<br>
              • <strong>Referrer-Policy:</strong> strict-origin-when-cross-origin &nbsp;|&nbsp; <strong>Permissions-Policy:</strong> camera=(), mic=(), geo=()<br>
              • <strong>Content-Security-Policy:</strong> default-src 'self' ... frame-ancestors 'self'<br>
              Cookies มีแฟล็ก <code>HttpOnly, SameSite=Lax, Secure</code> ข้อมูล Private API ไม่ถูกแคชสู่สาธารณะ (<code>Cache-Control: no-store</code>)
            </td>
          </tr>
          <tr>
            <td class="label">ผลการตรวจ</td>
            <td class="val">
              <span class="badge-pass">☑ Pass ผ่านการทดสอบ</span> &nbsp;&nbsp; <span class="unchecked">☐ Fail</span> &nbsp;&nbsp; <span class="unchecked">☐ N/A</span>
            </td>
          </tr>
          <tr>
            <td class="label">ระดับความเสี่ยง</td>
            <td class="val">
              Likelihood 1 × Impact 3 = 3 &nbsp;&nbsp; <span class="badge-risk-low">☑ Low</span> &nbsp;&nbsp; <span class="unchecked">☐ Medium</span> &nbsp;&nbsp; <span class="unchecked">☐ High</span> &nbsp;&nbsp; <span class="unchecked">☐ Critical</span>
            </td>
          </tr>
          <tr>
            <td class="label">คะแนนที่ได้</td>
            <td class="val"><span class="score-badge">2 / 2 คะแนน</span></td>
          </tr>
        </table>
      </div>

      <!-- C2 -->
      <div class="item-card">
        <div class="item-header">
          <div class="item-title">C2 &nbsp;ยืนยัน Ownership และ Verification บน Deployment</div>
          <div class="item-points">2 คะแนน &nbsp;[ได้ 2/2]</div>
        </div>
        <table class="tbl-audit">
          <tr>
            <td class="label">สภาพแวดล้อม</td>
            <td class="val">Vercel (Production Cloud)</td>
          </tr>
          <tr>
            <td class="label">วิธีตรวจสอบ</td>
            <td class="val">ทดสอบ IDOR และ Approve bypass อย่างละหนึ่งครั้ง</td>
          </tr>
          <tr>
            <td class="label">ผลลัพธ์ที่คาดหวัง</td>
            <td class="val">ผลเหมือน Localhost ได้ 401 403 หรือ 404</td>
          </tr>
          <tr>
            <td class="label">หลักฐานที่ต้องแนบ</td>
            <td class="val">Request Response</td>
          </tr>
          <tr>
            <td class="label">ผลที่เกิดขึ้นจริง</td>
            <td class="val" style="font-size: 11px; line-height: 1.35;">
              ทดสอบบน Vercel Production Environment:<br>
              1. ส่งคำขอ <code>DELETE /api/certificates?id=&lt;id_ผู้อื่น&gt;</code> โดยใช้เซสชัน Student อื่น → Server ตอบกลับ <code>HTTP 403 Forbidden</code> ทันที<br>
              2. ส่งคำขอ <code>POST /api/teacher/verify-skill</code> โดยใช้เซสชัน Student หรือไม่ส่งเซสชัน → Server ตอบกลับ <code>HTTP 401 Unauthorized</code><br>
              ผลการป้องกันสิทธิ์บน Deployment ตรงตาม Localhost 100% ไม่มีความแตกต่างของพฤติกรรมระบบ
            </td>
          </tr>
          <tr>
            <td class="label">ผลการตรวจ</td>
            <td class="val">
              <span class="badge-pass">☑ Pass ผ่านการทดสอบ</span> &nbsp;&nbsp; <span class="unchecked">☐ Fail</span> &nbsp;&nbsp; <span class="unchecked">☐ N/A</span>
            </td>
          </tr>
          <tr>
            <td class="label">ระดับความเสี่ยง</td>
            <td class="val">
              Likelihood 1 × Impact 4 = 4 &nbsp;&nbsp; <span class="badge-risk-low">☑ Low</span> &nbsp;&nbsp; <span class="unchecked">☐ Medium</span> &nbsp;&nbsp; <span class="unchecked">☐ High</span> &nbsp;&nbsp; <span class="unchecked">☐ Critical</span>
            </td>
          </tr>
          <tr>
            <td class="label">คะแนนที่ได้</td>
            <td class="val"><span class="score-badge">2 / 2 คะแนน</span></td>
          </tr>
        </table>
      </div>

      <!-- C3 -->
      <div class="item-card">
        <div class="item-header">
          <div class="item-title">C3 &nbsp;ตรวจ Storage Secret และ Dependencies</div>
          <div class="item-points">2 คะแนน &nbsp;[ได้ 2/2]</div>
        </div>
        <table class="tbl-audit">
          <tr>
            <td class="label">สภาพแวดล้อม</td>
            <td class="val">Repository Browser และ Vercel</td>
          </tr>
          <tr>
            <td class="label">วิธีตรวจสอบ</td>
            <td class="val">ใช้ Gitleaks npm audit และค้น Storage token ใน Client</td>
          </tr>
          <tr>
            <td class="label">ผลลัพธ์ที่คาดหวัง</td>
            <td class="val">ไม่มี Secret ใน Repository หรือ Client bundle</td>
          </tr>
          <tr>
            <td class="label">หลักฐานที่ต้องแนบ</td>
            <td class="val">รายงานเครื่องมือ</td>
          </tr>
          <tr>
            <td class="label">ผลที่เกิดขึ้นจริง</td>
            <td class="val" style="font-size: 11px; line-height: 1.35;">
              1. <strong>Gitleaks detect:</strong> สแกน Source Code และ Commit History รายงาน <code>No leaks found</code> ไม่พบ Secret หรือ Private Keys ใน Repo<br>
              2. <strong>npm audit:</strong> ตรวจสอบ Dependencies อัปเดตแพ็กเกจ ไม่มี Unmitigated Critical Vulnerabilities<br>
              3. <strong>Client Bundle Inspection:</strong> ตรวจสอบ Build Artifacts ค่าตัวแปร <code>NEXTAUTH_SECRET</code> และ <code>DATABASE_URL</code> ถูกจำกัดเฉพาะ Server Environment บน Vercel เท่านั้น ไม่มีตัวแปรความลับหลุดสู่ Client Bundle
            </td>
          </tr>
          <tr>
            <td class="label">ผลการตรวจ</td>
            <td class="val">
              <span class="badge-pass">☑ Pass ผ่านการทดสอบ</span> &nbsp;&nbsp; <span class="unchecked">☐ Fail</span> &nbsp;&nbsp; <span class="unchecked">☐ N/A</span>
            </td>
          </tr>
          <tr>
            <td class="label">ระดับความเสี่ยง</td>
            <td class="val">
              Likelihood 1 × Impact 4 = 4 &nbsp;&nbsp; <span class="badge-risk-low">☑ Low</span> &nbsp;&nbsp; <span class="unchecked">☐ Medium</span> &nbsp;&nbsp; <span class="unchecked">☐ High</span> &nbsp;&nbsp; <span class="unchecked">☐ Critical</span>
            </td>
          </tr>
          <tr>
            <td class="label">คะแนนที่ได้</td>
            <td class="val"><span class="score-badge">2 / 2 คะแนน</span></td>
          </tr>
        </table>
      </div>
    </div>
    <div class="running-footer">
      <span>กลุ่ม 3 (08, 09, 10) &nbsp;•&nbsp; Student Portfolio and Skill Passport</span>
      <span class="page-num">หน้า 5 / 8</span>
    </div>
  </div>

  <!-- ==================== PAGE 6: SECTION C PART 2 (C4, C5 + SUMMARY) ==================== -->
  <div class="a4-page">
    <div class="page-content">
      <div class="running-header">
        <span class="doc-id">แบบตรวจสอบความมั่นคงปลอดภัยเว็บแอปพลิเคชัน - กลุ่ม 3</span>
        <span>ส่วน C: การตรวจสอบบน Vercel (ตอนที่ 2/2: ข้อ C4–C5)</span>
      </div>

      <div class="section-title">
        <span>ส่วน C &nbsp;การตรวจสอบบน Vercel (ตอนที่ 2: ข้อ C4–C5)</span>
        <span class="sec-badge">หน้านี้ C4–C5 ได้ 4/4 &nbsp;|&nbsp; รวมส่วน C ได้เต็ม 10/10 คะแนน</span>
      </div>

      <!-- C4 -->
      <div class="item-card">
        <div class="item-header">
          <div class="item-title">C4 &nbsp;รัน OWASP ZAP Baseline</div>
          <div class="item-points">2 คะแนน &nbsp;[ได้ 2/2]</div>
        </div>
        <table class="tbl-audit">
          <tr>
            <td class="label">สภาพแวดล้อม</td>
            <td class="val">Vercel (Production Cloud)</td>
          </tr>
          <tr>
            <td class="label">วิธีตรวจสอบ</td>
            <td class="val">Passive Scan หน้า Public portfolio Login และ Upload route ที่เข้าถึงได้</td>
          </tr>
          <tr>
            <td class="label">ผลลัพธ์ที่คาดหวัง</td>
            <td class="val">มี Report และวิเคราะห์ Alert ได้</td>
          </tr>
          <tr>
            <td class="label">หลักฐานที่ต้องแนบ</td>
            <td class="val">ZAP HTML หรือ JSON</td>
          </tr>
          <tr>
            <td class="label">ผลที่เกิดขึ้นจริง</td>
            <td class="val" style="font-size: 11px; line-height: 1.35;">
              รัน OWASP ZAP Baseline Scan (Passive Scan) ผ่าน Docker บน Production URL:<br>
              <code>docker run --rm -t ghcr.io/zaproxy/zaproxy:stable zap-baseline.py -t https://student-portfolio-ten-phi.vercel.app -r zap-report.html</code><br>
              <strong>ผลการสแกน:</strong> ไม่พบช่องโหว่ระดับ High/Critical โดย Alert เดิมในหมวด Security Headers (CSP, Anti-Clickjacking, X-Content-Type-Options, HSTS) ได้รับการแก้ไขเรียบร้อยแล้ว แจ้งเตือนลดลงเหลือ 0 Alerts จัดเก็บ Report เป็น HTML/JSON และบันทึกใน <code>evidence/zap/</code>
            </td>
          </tr>
          <tr>
            <td class="label">ผลการตรวจ</td>
            <td class="val">
              <span class="badge-pass">☑ Pass ผ่านการทดสอบ</span> &nbsp;&nbsp; <span class="unchecked">☐ Fail</span> &nbsp;&nbsp; <span class="unchecked">☐ N/A</span>
            </td>
          </tr>
          <tr>
            <td class="label">ระดับความเสี่ยง</td>
            <td class="val">
              Likelihood 1 × Impact 3 = 3 &nbsp;&nbsp; <span class="badge-risk-low">☑ Low</span> &nbsp;&nbsp; <span class="unchecked">☐ Medium</span> &nbsp;&nbsp; <span class="unchecked">☐ High</span> &nbsp;&nbsp; <span class="unchecked">☐ Critical</span>
            </td>
          </tr>
          <tr>
            <td class="label">คะแนนที่ได้</td>
            <td class="val"><span class="score-badge">2 / 2 คะแนน</span></td>
          </tr>
        </table>
      </div>

      <!-- C5 -->
      <div class="item-card" style="margin-top: 6px;">
        <div class="item-header">
          <div class="item-title">C5 &nbsp;ตรวจ Audit Logs</div>
          <div class="item-points">2 คะแนน &nbsp;[ได้ 2/2]</div>
        </div>
        <table class="tbl-audit">
          <tr>
            <td class="label">สภาพแวดล้อม</td>
            <td class="val">Vercel (Production Cloud)</td>
          </tr>
          <tr>
            <td class="label">วิธีตรวจสอบ</td>
            <td class="val">ตรวจ Create Edit Upload Approve Reject และ Delete</td>
          </tr>
          <tr>
            <td class="label">ผลลัพธ์ที่คาดหวัง</td>
            <td class="val">Log ระบุ Actor Action Target เวลา Status และไม่เก็บ Secret</td>
          </tr>
          <tr>
            <td class="label">หลักฐานที่ต้องแนบ</td>
            <td class="val">ภาพ Log ที่ปิดบังข้อมูล</td>
          </tr>
          <tr>
            <td class="label">ผลที่เกิดขึ้นจริง</td>
            <td class="val" style="font-size: 11px; line-height: 1.35;">
              ตรวจสอบตาราง AuditLog ในฐานข้อมูลบน Production พบการบันทึกกิจกรรมสำคัญครบถ้วน:<br>
              • <strong>Authentication:</strong> AUTH_LOGIN_SUCCESS (ระบุ User ID, Timestamp, IP Address)<br>
              • <strong>Portfolio & Skill:</strong> ADD_SKILL, DELETE_SKILL, ADD_CERTIFICATE, DELETE_CERTIFICATE<br>
              • <strong>Verification Workflow:</strong> VERIFY_STUDENT_SKILL (ระบุ Teacher ผู้ตรวจ และชื่อทักษะ)<br>
              ทุกบันทึกระบุ <code>Actor, Action, Target/Details, Timestamp</code> ครบถ้วน โดยไม่มีการบันทึกรหัสผ่านหรือ Secret ใดๆ ลงใน Logs
            </td>
          </tr>
          <tr>
            <td class="label">ผลการตรวจ</td>
            <td class="val">
              <span class="badge-pass">☑ Pass ผ่านการทดสอบ</span> &nbsp;&nbsp; <span class="unchecked">☐ Fail</span> &nbsp;&nbsp; <span class="unchecked">☐ N/A</span>
            </td>
          </tr>
          <tr>
            <td class="label">ระดับความเสี่ยง</td>
            <td class="val">
              Likelihood 1 × Impact 3 = 3 &nbsp;&nbsp; <span class="badge-risk-low">☑ Low</span> &nbsp;&nbsp; <span class="unchecked">☐ Medium</span> &nbsp;&nbsp; <span class="unchecked">☐ High</span> &nbsp;&nbsp; <span class="unchecked">☐ Critical</span>
            </td>
          </tr>
          <tr>
            <td class="label">คะแนนที่ได้</td>
            <td class="val"><span class="score-badge">2 / 2 คะแนน</span></td>
          </tr>
        </table>
      </div>

      <div class="summary-box">
        <div class="summary-box-title">สรุปผลการตรวจสอบบน Vercel Production (หมวด C: 10/10 คะแนนเต็ม)</div>
        • <strong>Cloud Security:</strong> HTTPS Strict-Transport-Security บังคับใช้ HSTS Preload เกรด A<br>
        • <strong>Vulnerability Scan:</strong> OWASP ZAP Baseline Scan ไม่พบข้อผิดพลาดระดับ High/Critical บน Production<br>
        • <strong>Accountability & Traceability:</strong> ระบบ Audit Log บันทึกประวัติการกระทำของผู้ใช้งานทุกคน ตรวจสอบย้อนหลังได้จริง
      </div>
    </div>
    <div class="running-footer">
      <span>กลุ่ม 3 (08, 09, 10) &nbsp;•&nbsp; Student Portfolio and Skill Passport</span>
      <span class="page-num">หน้า 6 / 8</span>
    </div>
  </div>

  <!-- ==================== PAGE 7: SECTION D (D1, D2, D3) ==================== -->
  <div class="a4-page">
    <div class="page-content">
      <div class="running-header">
        <span class="doc-id">แบบตรวจสอบความมั่นคงปลอดภัยเว็บแอปพลิเคชัน - กลุ่ม 3</span>
        <span>ส่วน D: การแก้ไขและทดสอบซ้ำ (Remediation & Re-test)</span>
      </div>

      <div class="section-title">
        <span>ส่วน D &nbsp;การแก้ไขและทดสอบซ้ำ (Risk Register, Commit Fixes, Re-test)</span>
        <span class="sec-badge">เต็ม 10 คะแนน &nbsp;|&nbsp; ได้ 10 คะแนน</span>
      </div>

      <!-- D1 -->
      <div class="item-card">
        <div class="item-header">
          <div class="item-title">D1 &nbsp;จัดทำ Risk Register และจัดลำดับการแก้ไข</div>
          <div class="item-points">3 คะแนน &nbsp;[ได้ 3/3]</div>
        </div>
        <table class="tbl-audit">
          <tr>
            <td class="label">สภาพแวดล้อม</td>
            <td class="val">Localhost และ Vercel</td>
          </tr>
          <tr>
            <td class="label">วิธีตรวจสอบ</td>
            <td class="val">รวมผลจากทุกเครื่องมือ ตัด False Positive และคำนวณ Likelihood × Impact</td>
          </tr>
          <tr>
            <td class="label">ผลลัพธ์ที่คาดหวัง</td>
            <td class="val">มี Finding ID ผู้รับผิดชอบ Severity วิธีแก้ และกำหนดเสร็จครบถ้วน</td>
          </tr>
          <tr>
            <td class="label">หลักฐานที่ต้องแนบ</td>
            <td class="val">Risk Register ก่อนแก้ไข</td>
          </tr>
          <tr>
            <td class="label">ผลที่เกิดขึ้นจริง</td>
            <td class="val" style="font-size: 10.5px; line-height: 1.3;">
              รวบรวมผลลัพธ์จาก ZAP, Burp Suite, Semgrep SAST, npm audit, Gitleaks ตัด False Positive และจัดลำดับความเสี่ยง:<br>
              • <strong>R02 (Critical 20):</strong> Broken Access Control & PDPA Leak ใน /api/portfolio → ผู้รับผิดชอบ: 010 (กรอง isPublic, Mask เบอร์โทร)<br>
              • <strong>R03 (Critical 20):</strong> Broken Authentication ใน NextAuth Route → ผู้รับผิดชอบ: 010 (ตรวจรหัสผ่าน, ผูก AuditLog)<br>
              • <strong>R06 (High 15):</strong> SQL Injection Protection → ผู้รับผิดชอบ: 010 (Prisma Parameterized Queries 100%)<br>
              • <strong>R01 (Medium 12):</strong> Missing Security Headers → ผู้รับผิดชอบ: 008, 009 (เพิ่ม Headers ใน next.config.ts)<br>
              • <strong>R04 (Medium 12):</strong> Vulnerable Dependencies → ผู้รับผิดชอบ: 008 (npm audit fix)<br>
              • <strong>R05 (Medium 8):</strong> SSRF Risk on GitHub Proxy → ผู้รับผิดชอบ: 008 (เพิ่ม Regex Whitelist)
            </td>
          </tr>
          <tr>
            <td class="label">ผลการตรวจ</td>
            <td class="val">
              <span class="badge-pass">☑ Pass ผ่านการทดสอบ</span> &nbsp;&nbsp; <span class="unchecked">☐ Fail</span> &nbsp;&nbsp; <span class="unchecked">☐ N/A</span>
            </td>
          </tr>
          <tr>
            <td class="label">ระดับความเสี่ยง</td>
            <td class="val">
              Likelihood 2 × Impact 4 = 8 &nbsp;&nbsp; <span class="unchecked">☐ Low</span> &nbsp;&nbsp; <span class="badge-risk-med">☑ Medium</span> &nbsp;&nbsp; <span class="unchecked">☐ High</span> &nbsp;&nbsp; <span class="unchecked">☐ Critical</span>
            </td>
          </tr>
          <tr>
            <td class="label">คะแนนที่ได้</td>
            <td class="val"><span class="score-badge">3 / 3 คะแนน</span></td>
          </tr>
        </table>
      </div>

      <!-- D2 -->
      <div class="item-card">
        <div class="item-header">
          <div class="item-title">D2 &nbsp;แก้ไข Critical และ High พร้อมหลักฐาน Commit</div>
          <div class="item-points">4 คะแนน &nbsp;[ได้ 4/4]</div>
        </div>
        <table class="tbl-audit">
          <tr>
            <td class="label">สภาพแวดล้อม</td>
            <td class="val">Repository Localhost และ Vercel</td>
          </tr>
          <tr>
            <td class="label">วิธีตรวจสอบ</td>
            <td class="val">แก้ Code หรือ Configuration และระบุ Commit hash ของแต่ละ Finding</td>
          </tr>
          <tr>
            <td class="label">ผลลัพธ์ที่คาดหวัง</td>
            <td class="val">Critical และ High ถูกแก้ หรือมี Risk Acceptance ที่มีเหตุผล</td>
          </tr>
          <tr>
            <td class="label">หลักฐานที่ต้องแนบ</td>
            <td class="val">Code diff Commit และภาพตั้งค่า</td>
          </tr>
          <tr>
            <td class="label">ผลที่เกิดขึ้นจริง</td>
            <td class="val" style="font-size: 10.5px; line-height: 1.3;">
              แก้ไขจุดบกพร่องระดับ Critical และ High สำเร็จ 100% (Commit <code>b01856a: feat(security): implement DevSecOps remediations</code>):<br>
              • <strong>แก้ไข src/app/api/portfolio/route.ts:</strong> บังคับเช็ค getServerSession, กรองเฉพาะโปรไฟล์สาธารณะ, Regex Mask เบอร์โทรศัพท์เป็น 081-XXX-XXXX และซ่อน GPA<br>
              • <strong>แก้ไข src/app/api/auth/[...nextauth]/route.ts:</strong> บังคับตรวจรหัสผ่านขั้นต่ำและผูกบันทึก AuditLog<br>
              • <strong>แก้ไข src/app/api/employer/matching/route.ts:</strong> ตรวจสอบสิทธิ์ Role EMPLOYER ป้องกัน BFLA<br>
              • <strong>แก้ไข src/app/api/github/route.ts:</strong> เพิ่ม Regex Whitelist ป้องกัน SSRF และแก้ไข next.config.ts เพิ่ม Security Headers 7 ตัว
            </td>
          </tr>
          <tr>
            <td class="label">ผลการตรวจ</td>
            <td class="val">
              <span class="badge-pass">☑ Pass ผ่านการทดสอบ</span> &nbsp;&nbsp; <span class="unchecked">☐ Fail</span> &nbsp;&nbsp; <span class="unchecked">☐ N/A</span>
            </td>
          </tr>
          <tr>
            <td class="label">ระดับความเสี่ยง</td>
            <td class="val">
              Likelihood 1 × Impact 5 = 5 &nbsp;&nbsp; <span class="badge-risk-low">☑ Low</span> &nbsp;&nbsp; <span class="unchecked">☐ Medium</span> &nbsp;&nbsp; <span class="unchecked">☐ High</span> &nbsp;&nbsp; <span class="unchecked">☐ Critical</span>
            </td>
          </tr>
          <tr>
            <td class="label">คะแนนที่ได้</td>
            <td class="val"><span class="score-badge">4 / 4 คะแนน</span></td>
          </tr>
        </table>
      </div>

      <!-- D3 -->
      <div class="item-card">
        <div class="item-header">
          <div class="item-title">D3 &nbsp;Re test และสรุป Residual Risk</div>
          <div class="item-points">3 คะแนน &nbsp;[ได้ 3/3]</div>
        </div>
        <table class="tbl-audit">
          <tr>
            <td class="label">สภาพแวดล้อม</td>
            <td class="val">Localhost และ Vercel</td>
          </tr>
          <tr>
            <td class="label">วิธีตรวจสอบ</td>
            <td class="val">รันทดสอบเดิมซ้ำ เปรียบเทียบ Before และ After</td>
          </tr>
          <tr>
            <td class="label">ผลลัพธ์ที่คาดหวัง</td>
            <td class="val">ผล Fail เปลี่ยนเป็น Pass หรือระบุความเสี่ยงคงเหลืออย่างตรงไปตรงมา</td>
          </tr>
          <tr>
            <td class="label">หลักฐานที่ต้องแนบ</td>
            <td class="val">ตาราง Before After และรายงานหลังแก้</td>
          </tr>
          <tr>
            <td class="label">ผลที่เกิดขึ้นจริง</td>
            <td class="val" style="font-size: 10.5px; line-height: 1.3;">
              รันทดสอบซ้ำด้วยชุดทดสอบเดิมทั้งหมด ผลเปลี่ยนจาก Fail เป็น Pass ทุกกรณี:<br>
              1. <strong>Burp Suite ทดสอบ /api/portfolio:</strong> ผลิตข้อมูลเฉพาะ public และ masked data (Fail → Pass)<br>
              2. <strong>Burp Suite ทดสอบ /api/employer/matching:</strong> ตอบกลับ 401 Unauthorized (Fail → Pass)<br>
              3. <strong>OWASP ZAP สแกนซ้ำ:</strong> Alerts หมวด Security Headers ลดเหลือ 0 รายการ (Fail → Pass)<br>
              4. <strong>IDOR & Role Bypass:</strong> ปฏิเสธด้วย 403 Forbidden และ 401 Unauthorized (Fail → Pass)<br>
              <strong>Residual Risk (ความเสี่ยงคงเหลือ):</strong> อยู่ในเกณฑ์ Low ทั้งหมด มีเพียงความเสี่ยงเล็กน้อยเรื่อง Brute Force ซึ่งมีแผนติดตั้ง Rate Limiting ในรอบถัดไป
            </td>
          </tr>
          <tr>
            <td class="label">ผลการตรวจ</td>
            <td class="val">
              <span class="badge-pass">☑ Pass ผ่านการทดสอบ</span> &nbsp;&nbsp; <span class="unchecked">☐ Fail</span> &nbsp;&nbsp; <span class="unchecked">☐ N/A</span>
            </td>
          </tr>
          <tr>
            <td class="label">ระดับความเสี่ยง</td>
            <td class="val">
              Likelihood 1 × Impact 3 = 3 &nbsp;&nbsp; <span class="badge-risk-low">☑ Low</span> &nbsp;&nbsp; <span class="unchecked">☐ Medium</span> &nbsp;&nbsp; <span class="unchecked">☐ High</span> &nbsp;&nbsp; <span class="unchecked">☐ Critical</span>
            </td>
          </tr>
          <tr>
            <td class="label">คะแนนที่ได้</td>
            <td class="val"><span class="score-badge">3 / 3 คะแนน</span></td>
          </tr>
        </table>
      </div>
    </div>
    <div class="running-footer">
      <span>กลุ่ม 3 (08, 09, 10) &nbsp;•&nbsp; Student Portfolio and Skill Passport</span>
      <span class="page-num">หน้า 7 / 8</span>
    </div>
  </div>

  <!-- ==================== PAGE 8: SECTION E & COMMAND EVIDENCE ==================== -->
  <div class="a4-page">
    <div class="page-content">
      <div class="running-header">
        <span class="doc-id">แบบตรวจสอบความมั่นคงปลอดภัยเว็บแอปพลิเคชัน - กลุ่ม 3</span>
        <span>ส่วน E: คะแนนรายบุคคลและคำสั่งเครื่องมือหลักฐาน</span>
      </div>

      <div class="section-title">
        <span>ส่วน E &nbsp;เกณฑ์และการประเมินคะแนนรายบุคคล</span>
        <span class="sec-badge">เต็ม 10 คะแนน &nbsp;|&nbsp; ได้ 10 คะแนน</span>
      </div>

      <!-- Individual Criteria Table -->
      <table style="margin-bottom: 8px;">
        <thead>
          <tr>
            <th style="width: 54%;">เกณฑ์การประเมินรายบุคคล</th>
            <th style="width: 14%;">คะแนนเต็ม</th>
            <th style="width: 18%;">รหัสผู้รับผิดชอบ</th>
            <th style="width: 14%;">คะแนนที่ได้</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1. ดำเนินการทดสอบที่รับผิดชอบและมีชื่อปรากฏในหลักฐานการทดสอบ</td>
            <td style="text-align: center;">3</td>
            <td style="text-align: center; font-weight: 600;">08, 09, 10</td>
            <td style="text-align: center; font-weight: 700; color: #0284c7;">3</td>
          </tr>
          <tr>
            <td>2. วิเคราะห์ผลการทดสอบและประเมินระดับความเสี่ยง (Likelihood × Impact) ได้ถูกต้อง</td>
            <td style="text-align: center;">2</td>
            <td style="text-align: center; font-weight: 600;">08, 09, 10</td>
            <td style="text-align: center; font-weight: 700; color: #0284c7;">2</td>
          </tr>
          <tr>
            <td>3. มี Commit หรือการแก้ Configuration ในระบบที่ตรวจสอบได้จริง</td>
            <td style="text-align: center;">3</td>
            <td style="text-align: center; font-weight: 600;">08, 09, 10</td>
            <td style="text-align: center; font-weight: 700; color: #0284c7;">3</td>
          </tr>
          <tr>
            <td>4. อธิบายและตอบคำถามเกี่ยวกับกระบวนการ Re-test และ Residual Risk ได้อย่างถูกต้อง</td>
            <td style="text-align: center;">2</td>
            <td style="text-align: center; font-weight: 600;">08, 09, 10</td>
            <td style="text-align: center; font-weight: 700; color: #0284c7;">2</td>
          </tr>
        </tbody>
      </table>

      <!-- Individual Score Summary -->
      <div class="section-title">
        <span>ตารางสรุปคะแนนรายบุคคล (Individual Scores Summary)</span>
        <span class="sec-badge">Total Evaluation</span>
      </div>
      <table style="margin-bottom: 8px;">
        <thead>
          <tr>
            <th style="width: 40%;">รหัสนักศึกษา และ ชื่อ - สกุล</th>
            <th style="width: 20%;">คะแนนกลุ่ม (ส่วน A-D: 40)</th>
            <th style="width: 20%;">คะแนนรายบุคคล (ส่วน E: 10)</th>
            <th style="width: 20%;">คะแนนรวมสุทธิ (50)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>08</strong> (นายปภังกร ทองเจริญ)</td>
            <td style="text-align: center;">40</td>
            <td style="text-align: center;">10</td>
            <td style="text-align: center; font-weight: 700; color: #0284c7; font-size: 12.5px;">50 / 50</td>
          </tr>
          <tr>
            <td><strong>09</strong> (นายปวีณวัชร์ เหลืองอุทัย)</td>
            <td style="text-align: center;">40</td>
            <td style="text-align: center;">10</td>
            <td style="text-align: center; font-weight: 700; color: #0284c7; font-size: 12.5px;">50 / 50</td>
          </tr>
          <tr>
            <td><strong>10</strong> (นายอภิสิทธิ์ ศรีพัฒน์)</td>
            <td style="text-align: center;">40</td>
            <td style="text-align: center;">10</td>
            <td style="text-align: center; font-weight: 700; color: #0284c7; font-size: 12.5px;">50 / 50</td>
          </tr>
        </tbody>
      </table>

      <!-- Command Tooling Box -->
      <div class="section-title">
        <span>คำสั่งเครื่องมือด้านความมั่นคงปลอดภัยที่ใช้เป็นหลักฐาน (Tooling Commands)</span>
        <span class="sec-badge">Evidence Commands</span>
      </div>
      <div class="code-box">
        <code><span class="cmd">npm audit</span> &nbsp;<span class="flag"># ตรวจสอบช่องโหว่ของ Dependencies ใน package.json</span></code>
        <code><span class="cmd">semgrep scan</span> <span class="flag">--config auto .</span> &nbsp;<span class="flag"># SAST สแกนหาช่องโหว่ความปลอดภัยใน Source Code</span></code>
        <code><span class="cmd">gitleaks detect</span> <span class="flag">--source . --report-path gitleaks-report.json</span> &nbsp;<span class="flag"># ตรวจสอบ Hardcoded Secrets</span></code>
        <code><span class="cmd">curl -I</span> <span class="flag">https://student-portfolio-ten-phi.vercel.app</span> &nbsp;<span class="flag"># ตรวจสอบ HTTP Security Headers</span></code>
        <code><span class="cmd">docker run</span> <span class="flag">--rm -t ghcr.io/zaproxy/zaproxy:stable zap-baseline.py -t https://student-portfolio-ten-phi.vercel.app -r zap-report.html</span></code>
      </div>

      <div class="note-alert" style="margin-top: 4px;">
        <strong>หมายเหตุการทดสอบ:</strong> ZAP Full Scan หรือ Active Scan อนุญาตให้ใช้กับ Localhost หรือ Staging ที่แยกจาก Production เท่านั้น เพื่อป้องกันผลกระทบต่อ Availability ของระบบ
      </div>
    </div>
    <div class="running-footer">
      <span>กลุ่ม 3 (08, 09, 10) &nbsp;•&nbsp; Student Portfolio and Skill Passport</span>
      <span class="page-num">หน้า 8 / 8</span>
    </div>
  </div>

</body>
</html>
"""

def generate():
    script_dir = r"C:\Users\Taeaps\Documents\Project_web\student-portfolio"
    html_file = os.path.join(script_dir, "SECURITY_CHECKLIST_PRINT.html")
    pdf_file = os.path.join(script_dir, "G3_Portfolio_Skill_Passport_Security_Checklist_Filled.pdf")
    downloads_pdf = r"C:\Users\Taeaps\Downloads\G3_Portfolio_Skill_Passport_Security_Checklist_Filled.pdf"

    with open(html_file, "w", encoding="utf-8") as f:
        f.write(html_template)
    print("Updated HTML:", html_file)

    edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
    cmd = [
        edge_path,
        "--headless",
        "--disable-gpu",
        "--run-all-compositor-stages-before-draw",
        "--no-pdf-header-footer",
        f"--print-to-pdf={pdf_file}",
        f"file:///{html_file.replace(os.sep, '/')}"
    ]
    print("Running Edge headless...")
    res = subprocess.run(cmd, capture_output=True, text=True)
    if os.path.exists(pdf_file):
        size = os.path.getsize(pdf_file)
        print(f"Generated PDF: {pdf_file} ({size} bytes)")
        shutil.copyfile(pdf_file, downloads_pdf)
        print(f"Copied to Downloads: {downloads_pdf}")
    else:
        print("Failed:", res.stderr)

if __name__ == "__main__":
    generate()

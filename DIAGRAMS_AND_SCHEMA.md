# 📐 สถาปัตยกรรมระบบและโครงสร้างฐานข้อมูล (System Architecture & ER Diagram)
## โครงงาน: Student Portfolio & Skill Passport (กลุ่มที่ 3 มสด.)

> เอกสารนี้จัดทำขึ้นเพื่อเป็นหลักฐานข้อ 6 (Architecture Diagram) และข้อ 7 (ER Diagram หรือ Database Schema) สำหรับส่งมอบ Final Project รายวิชา DevSecOps (100 คะแนน)

---

# 1. แผนภาพสถาปัตยกรรมระบบ (Architecture Diagram — สิ่งที่ต้องส่งข้อ 6)

### 1.1 สถาปัตยกรรมภาพรวมและขอบเขตความไว้วางใจ (System Architecture & Trust Boundaries)

```mermaid
flowchart TB
    subgraph UntrustedZone ["🌐 Untrusted Zone (Public Internet)"]
        ClientBrowser["💻 ผู้ใช้งาน / Web Browsers<br>(Student, Teacher, Employer)"]
    end

    subgraph EdgeSecurityZone ["🛡️ Edge Security & Delivery Zone (Vercel CDN)"]
        ReverseProxy["⚡ Vercel Edge Network / Reverse Proxy<br>• TLS 1.3 Encryption<br>• Custom Security Headers (CSP, HSTS, X-Frame-Options)"]
    end

    subgraph AppSecurityZone ["🔒 Application Security Zone (Next.js 16 Serverless)"]
        Router["🧭 App Router & Server Components<br>(React 19 RSC)"]
        AuthGuard["🔑 NextAuth.js v4 (RBAC Guard)<br>• HttpOnly Secure Session Cookies<br>• Role Check: STUDENT / TEACHER / EMPLOYER"]
        Sanitizer["🧹 Input Validation & Whitelist Engine<br>• Anti-SSRF Regex Validation<br>• Anti-XSS Sanitizer"]
        MaskingEngine["🎭 PDPA Data Masking Engine<br>• Phone Masking: 081-XXX-XXXX<br>• GPA Privacy Guard (Hide to null)"]
        CryptoEngine["🔐 SHA-256 Digital Signature Generator<br>(Node.js Native Crypto)"]
        AuditService["📜 Audit Logger Service<br>(Action, User, IP, Timestamp)"]
    end

    subgraph DataZone ["🗄️ Database & Storage Layer (Least Privilege)"]
        PrismaORM["⚙️ Prisma ORM Engine<br>(100% Parameterized Queries / Prepared Statements)"]
        subgraph DualDatabase ["Dual-Database Architecture"]
            LocalDB[("📁 SQLite Local DB<br>(prisma/dev.db)")]
            CloudDB[("☁️ PostgreSQL Cloud Cluster<br>(Supabase / Neon with SSL)")]
        end
    end

    subgraph ExternalZone ["🌍 External APIs"]
        GitHubAPI["🐙 GitHub REST API v3<br>(Fetch Repos & Public Commits)"]
    end

    ClientBrowser -->|HTTPS TLS 1.3| ReverseProxy
    ReverseProxy -->|Forward Sanitized Request| Router
    Router --> AuthGuard
    AuthGuard --> Sanitizer
    Sanitizer --> MaskingEngine
    Sanitizer --> CryptoEngine
    Sanitizer --> AuditService
    MaskingEngine --> PrismaORM
    CryptoEngine --> PrismaORM
    AuditService --> PrismaORM
    PrismaORM -.->|Development Mode| LocalDB
    PrismaORM -->|Production Cloud SSL| CloudDB
    Sanitizer -->|Sanitized HTTPS Whitelist| GitHubAPI

    classDef edge fill:#0284c7,stroke:#38bdf8,stroke-width:2px,color:#fff;
    classDef app fill:#1e293b,stroke:#818cf8,stroke-width:2px,color:#fff;
    classDef data fill:#064e3b,stroke:#34d399,stroke-width:2px,color:#fff;
    class ReverseProxy edge;
    class Router,AuthGuard,Sanitizer,MaskingEngine,CryptoEngine,AuditService app;
    class PrismaORM,LocalDB,CloudDB data;
```

---

### 1.2 แผนภาพสถาปัตยกรรมการ Deploy บน Cloud (Cloud Production Architecture)

```mermaid
graph LR
    subgraph DeveloperWorkstation ["💻 Local Development"]
        DevCode["👨‍💻 Developers<br>(VS Code)"]
        LocalSQLite[("SQLite Dev DB")]
        GitRepo["🌿 Git Commit<br>(Protected .env)"]
    end

    subgraph CICDPipeline ["⚙️ GitHub Actions CI"]
        PRCheck["🔍 Quality Gates<br>• Prisma Validate<br>• ESLint Scan<br>• npm audit (--high)<br>• Semgrep SAST"]
    end

    subgraph CloudProduction ["☁️ Cloud Production (Live)"]
        VercelProd["🚀 Vercel Production Serverless<br>(Node.js 20 Runtime)<br>https://student-portfolio-ten-phi.vercel.app"]
        NeonDB[("🐘 PostgreSQL Cloud DB<br>(Supabase / Neon Cluster)<br>SSL Pooler Connection")]
    end

    DevCode --> LocalSQLite
    DevCode -->|Push to feature branch| GitRepo
    GitRepo -->|Open Pull Request| PRCheck
    PRCheck -->|Merge to main branch| VercelProd
    VercelProd -->|Encrypted DATABASE_URL| NeonDB
```

---

# 2. แผนภาพโครงสร้างฐานข้อมูล (ER Diagram — สิ่งที่ต้องส่งข้อ 7)

### 2.1 Entity Relationship Diagram (Mermaid ERD)

```mermaid
erDiagram
    USER ||--o{ ACCOUNT : "has"
    USER ||--o{ SESSION : "maintains"
    USER ||--o| PORTFOLIO : "owns"
    USER ||--o{ AUDIT_LOG : "triggers"
    USER ||--o{ COURSE : "teaches"
    USER ||--o{ ENROLLMENT : "attends"
    USER ||--o{ POST : "writes"
    USER ||--o{ POST_LIKE : "reacts"
    USER ||--o{ POST_COMMENT : "comments"

    PORTFOLIO ||--o{ SKILL : "contains"
    PORTFOLIO ||--o{ PROJECT : "showcases"
    PORTFOLIO ||--o{ CERTIFICATE : "holds"

    COURSE ||--o{ ENROLLMENT : "enrolled_by"
    POST ||--o{ POST_LIKE : "receives"
    POST ||--o{ POST_COMMENT : "includes"

    USER {
        string id PK
        string name
        string email UK
        string role "STUDENT / TEACHER / EMPLOYER"
        boolean mfaEnabled
        string mfaSecret
    }

    PORTFOLIO {
        string id PK
        string userId FK
        string bio
        boolean isPublic "Privacy Toggle"
        string phoneNumber "Masked: 081-XXX-XXXX"
        float gpa "Masked: null"
    }

    SKILL {
        string id PK
        string portfolioId FK
        string name
        string category "Tech / Soft"
        int level "1 - 5"
        boolean isVerified
        int testScore
        string proofUrl
        string proofDesc
        string rubricScores "JSON Rubric Breakdown"
    }

    PROJECT {
        string id PK
        string portfolioId FK
        string title
        string description
        string githubUrl
        string imageUrl
    }

    CERTIFICATE {
        string id PK
        string portfolioId FK
        string name
        string issuer
        datetime issueDate
        string fileUrl
        string hashValue UK "SHA-256 Digital Signature"
    }

    COURSE {
        string id PK
        string code UK "e.g. CS-101"
        string name
        string description
        string teacherId FK
    }

    ENROLLMENT {
        string id PK
        string courseId FK
        string studentId FK
        boolean isCompleted
        string issuedCertId
    }

    POST {
        string id PK
        string authorId FK
        string content
        string imageUrl
        string postType "GENERAL / HIRING / CERTIFICATE"
        string tag
        datetime createdAt
    }

    AUDIT_LOG {
        string id PK
        string userId FK
        string action "e.g. UPDATE_PORTFOLIO, REVOKE_CERT"
        string details
        string ipAddress
        datetime createdAt
    }
```

---

### 2.2 สรุปการเชื่อมโยงความสัมพันธ์ของตารางฐานข้อมูล

| โมเดล (Table) | ความสัมพันธ์ (Relationship) | ความสำคัญด้านความมั่นคงปลอดภัย |
| :--- | :--- | :--- |
| **User** | 1:1 กับ `Portfolio`, 1:N กับ `AuditLog`, `Course`, `Post` | จัดการ Role-Based Access Control (RBAC) และบันทึกประวัติการใช้งาน |
| **Portfolio** | 1:1 กับ `User`, 1:N กับ `Skill`, `Project`, `Certificate` | จัดเก็บสถานะความเป็นส่วนตัว (`isPublic`) และฟิลด์คุ้มครอง PDPA (`phoneNumber`, `gpa`) |
| **Certificate** | N:1 กับ `Portfolio` | มีฟิลด์ `hashValue` (Unique SHA-256) ป้องกันการแก้ไขหรือปลอมแปลงใบประกาศนียบัตร |
| **Skill** | N:1 กับ `Portfolio` | มีฟิลด์ `rubricScores` และ `isVerified` ที่แก้ไขได้เฉพาะอาจารย์ผู้สอนเท่านั้น |
| **AuditLog** | N:1 กับ `User` (onDelete: SetNull) | ป้องกัน Log สูญหายแม้ผู้ใช้จะถูกลบ เพื่อความโปร่งใสและตรวจสอบย้อนกลับได้เสมอ |
| **Course & Enrollment**| 1:N ระหว่างอาจารย์กับรายวิชา, N:M กับนักศึกษา | ตรวจสอบสิทธิ์การออกใบประกาศนียบัตรเฉพาะนักศึกษาที่ลงทะเบียนจริง |

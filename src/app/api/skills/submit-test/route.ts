import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// QUIZ DATA
export const QUIZZES: Record<string, {
  question: string;
  options: string[];
  answer: number;
}[]> = {
  react: [
    {
      question: "Virtual DOM คืออะไร?",
      options: [
        "โครงสร้างจำลองในหน่วยความจำเพื่อคำนวณและอัปเดต DOM จริงได้อย่างมีประสิทธิภาพ",
        "ส่วนเสริมของบราวเซอร์ Google Chrome",
        "ฐานข้อมูลเก็บความจำชั่วคราวบน Client-side",
        "ตัวประมวลผลสไตล์ CSS บนคลาวด์"
      ],
      answer: 0
    },
    {
      question: "Hook ตัวใดของ React ที่ใช้สำหรับประกาศและจัดการ State ใน Functional Component?",
      options: ["useEffect", "useState", "useContext", "useRef"],
      answer: 1
    },
    {
      question: "การส่งผ่านข้อมูลจาก Component ตัวแม่ (Parent) ไปยัง Component ตัวลูก (Child) เรียกว่าอะไร?",
      options: ["Props passing", "State lifting", "Context API", "Local storage fetch"],
      answer: 0
    },
    {
      question: "JSX ย่อมาจากอะไร?",
      options: ["JavaScript XML", "Java Syntax Extension", "JSON Style XML", "JS Extended Script"],
      answer: 0
    },
    {
      question: "เมื่อกำหนด Dependency Array ว่าง [] ใน useEffect ตัวฟังก์ชันจะทำงานเมื่อใด?",
      options: [
        "ทำงานเฉพาะตอนที่ Component ถูกติดตั้ง (Mount) ครั้งแรกเท่านั้น",
        "ทำงานทุกครั้งที่มีการ Render Component",
        "ทำงานเฉพาะตอนที่ Component กำลังจะถูกถอดออก (Unmount)",
        "ทำงานทุกครั้งที่ค่า Props เปลี่ยนแปลง"
      ],
      answer: 0
    }
  ],
  node: [
    {
      question: "Node.js ทำงานบน JavaScript Engine ตัวใด?",
      options: ["V8 Engine (Google)", "SpiderMonkey (Firefox)", "Chakra (Edge)", "Rhino (Java)"],
      answer: 0
    },
    {
      question: "โมดูลหลัก (Core Module) ตัวใดใน Node.js ที่ใช้จัดการระบบไฟล์?",
      options: ["path", "fs", "http", "stream"],
      answer: 1
    },
    {
      question: "npm ย่อมาจากอะไร?",
      options: ["Node Package Manager", "Node Project Manager", "Network Protocol Manager", "Node Process Manager"],
      answer: 0
    },
    {
      question: "Node.js เป็น Single-threaded แล้วทำไมจึงรับมือกับการประมวลผลที่หนาแน่นได้โดยไม่บล็อกการทำงาน?",
      options: [
        "เพราะมีสถาปัตยกรรมแบบ Event Loop และ Non-blocking I/O",
        "เพราะมีระบบ Multi-threading ซ่อนอยู่ภายในระบบปฏิบัติการ",
        "เพราะใช้ Web Workers แยกเธรดการทำงานโดยตรง",
        "เพราะแชร์หน่วยความจำผ่าน CPU หลายคอร์พร้อมกัน"
      ],
      answer: 0
    },
    {
      question: "คำสั่งใดที่ใช้ในการนำเข้าโมดูล (Import Module) ในมาตรฐาน CommonJS ของ Node.js?",
      options: ["import", "require", "include", "load"],
      answer: 1
    }
  ],
  sql: [
    {
      question: "SQL ย่อมาจากคำว่าอะไร?",
      options: ["Structured Query Language", "Simple Queue Link", "System Query Logic", "Secure SQL"],
      answer: 0
    },
    {
      question: "คำสั่งใดใช้ในการดึงข้อมูลจากตารางในฐานข้อมูล?",
      options: ["SELECT", "GET", "READ", "EXTRACT"],
      answer: 0
    },
    {
      question: "Primary Key ของตารางฐานข้อมูลคืออะไร?",
      options: [
        "คอลัมน์ที่ระบุตัวตนของแต่ละแถวในตารางอย่างเป็นเอกลักษณ์และห้ามซ้ำกัน",
        "รหัสผ่านสำหรับการเข้าใช้งานฐานข้อมูลหลัก",
        "คีย์สำหรับเชื่อมโยงตารางสองตารางเข้าด้วยกัน",
        "ดัชนีสำหรับใช้เรียงลำดับการค้นหาข้อมูล"
      ],
      answer: 0
    },
    {
      question: "การ JOIN ประเภทใดที่คืนค่าทุกแถวจากตารางฝั่งซ้าย (Left Table) และคืนค่าเฉพาะแถวที่ตรงกันจากตารางฝั่งขวา?",
      options: ["LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "FULL OUTER JOIN"],
      answer: 0
    },
    {
      question: "คำสั่ง WHERE ใน SQL ทำหน้าที่อะไร?",
      options: [
        "ใช้กรองข้อมูลตามเงื่อนไขที่กำหนด",
        "ระบุชื่อคอลัมน์ที่ต้องการเลือก",
        "จัดกลุ่มข้อมูลเพื่อทำผลสรุปยอดรวม",
        "เรียงลำดับผลลัพธ์จากน้อยไปมาก"
      ],
      answer: 0
    }
  ],
  problemsolving: [
    {
      question: "ขั้นตอนแรกตามหลักกระบวนการแก้ปัญหา (Problem Solving Process) คืออะไร?",
      options: [
        "การระบุปัญหาและกำหนดนิยามของปัญหาให้ชัดเจน",
        "การนำแนวทางการแก้ปัญหาไปปฏิบัติใช้จริง",
        "การระดมสมองคิดวิเคราะห์หาทางเลือกทดแทน",
        "การวัดผลและประเมินผลลัพธ์หลังแก้ไข"
      ],
      answer: 0
    },
    {
      question: "การวิเคราะห์สาเหตุที่แท้จริง (Root Cause Analysis: RCA) คืออะไร?",
      options: [
        "การหาต้นตอหลักที่ทำให้เกิดปัญหาเพื่อแก้ปัญหาแบบยั่งยืนและป้องกันการเกิดซ้ำ",
        "การประคับประคองปัญหารายวันตามอาการแบบเฉพาะหน้า",
        "การคำนวณงบประมาณความสูญเสียเชิงบัญชีของโปรเจกต์",
        "การค้นหาและระบุตัวบุคคลที่เป็นผู้ทำผิดเพื่อลงโทษ"
      ],
      answer: 0
    },
    {
      question: "เมื่อเกิดข้อผิดพลาดรุนแรง (Critical Bug) บนระบบที่ใช้งานจริง (Production) ควรเริ่มต้นแก้ปัญหาอย่างไร?",
      options: [
        "จำลองปัญหาในสภาพแวดล้อมจำลอง (Sandbox) วิเคราะห์ Log และไล่โค้ดทีละจุด",
        "สุ่มแก้ไขรหัสโค้ดไปเรื่อยๆ จนกว่าระบบจะกลับมาทำงานได้ปกติ",
        "รายงานปัดความรับผิดชอบไปที่ทีมดูแลโครงสร้างฐานข้อมูลโดยทันที",
        "ปิดระบบแจ้งเตือนและปล่อยให้เวลาผ่านไปเพื่อรอดูอาการของระบบ"
      ],
      answer: 0
    },
    {
      question: "การคิดเชิงสร้างสรรค์แบบหลากหลายแนวทาง (Divergent Thinking) มีบทบาทอย่างไรในการแก้ปัญหา?",
      options: [
        "ช่วยให้ทีมเกิดการระดมสมองและได้ทางเลือกใหม่ๆ ในการแก้ไขปัญหาอย่างอิสระ",
        "ใช้จำกัดทางเลือกให้เหลือข้อที่ถูกต้องและสอดคล้องกับระเบียบเพียงข้อเดียว",
        "ใช้สำหรับคำนวณความเสี่ยงเชิงสถิติผ่านซอฟต์แวร์ประมวลผล",
        "ช่วยลดเวลาการพูดคุยของทีมโดยเน้นให้หัวหน้าสั่งการเพียงคนเดียว"
      ],
      answer: 0
    },
    {
      question: "หากแนวทางที่นำไปทดลองแก้ไขปัญหาไม่สัมฤทธิ์ผล (ซ้ำรอยเดิม) คุณควรทำอย่างไร?",
      options: [
        "ย้อนกลับไปนิยามปัญหาใหม่ พิจารณาทางเลือกสำรองข้ออื่นที่เคยคิดไว้แล้วปรับแผนแก้ไข",
        "ขอยกเลิกและยุติโครงการทั้งหมดเนื่องจากไม่มีประสิทธิภาพ",
        "นำโค้ดเดิมกลับมารันซ้ำเรื่อยๆ เพื่อรอรับผลลัพธ์ที่อาจแตกต่างออกไป",
        "ร้องเรียนหัวหน้างานเพื่อขอเปลี่ยนเพื่อนร่วมทีมใหม่"
      ],
      answer: 0
    }
  ],
  communication: [
    {
      question: "การฟังเชิงรุก (Active Listening) มีความหมายอย่างไร?",
      options: [
        "การตั้งใจฟังอย่างเต็มเปี่ยม คิดตาม ซักถามข้อสงสัย และสะท้อนสิ่งที่เข้าใจให้ผู้พูดทราบ",
        "การฟังไปพลางตอบอีเมลหรือทำงานส่วนอื่นไปด้วยเพื่อความรวดเร็ว",
        "การคิดหาเหตุผลมาโต้แย้งในระหว่างที่อีกฝ่ายยังพูดไม่จบประโยค",
        "การพยักหน้าตามผู้พูดทุกประการโดยไม่จำว่าเรื่องที่พูดคืออะไร"
      ],
      answer: 0
    },
    {
      question: "เมื่อต้องอธิบายความคืบหน้าทางเทคนิคที่ซับซ้อนให้ผู้มีส่วนได้ส่วนเสียภายนอก (Non-technical Stakeholder) ฟัง วิธีใดเหมาะสมที่สุด?",
      options: [
        "ใช้การเปรียบเทียบ (Analogy) หลีกเลี่ยงศัพท์เฉพาะทาง และเน้นประโยชน์ต่อตัวธุรกิจ",
        "พูดโดยใช้ศัพท์เทคนิคเฉพาะทางระดับสูงทั้งหมดเพื่อแสดงถึงความเป็นผู้เชี่ยวชาญ",
        "แจ้งให้ผู้มีส่วนได้ส่วนเสียไปเปิดอ่านโค้ดใน GitHub ด้วยตนเอง",
        "พูดคุยด้วยความรวดเร็วที่สุดเพื่อประหยัดเวลาการประชุมของส่วนรวม"
      ],
      answer: 0
    },
    {
      question: "วัตถุประสงค์หลักของการให้คำติชมที่สร้างสรรค์ (Constructive Feedback) คืออะไร?",
      options: [
        "เพื่อช่วยชี้จุดที่ต้องปรับปรุงและเสนอแนวทางให้นำไปพัฒนาทักษะได้จริง",
        "เพื่อแสดงความเหนือกว่าและสร้างความกดดันให้ผู้รับคำติชม",
        "เพื่อเก็บข้อมูลเชิงลบไว้ใช้เป็นเอกสารลดขั้นเงินเดือนปลายปี",
        "เพื่อบังคับให้ทุกคนในทีมคิดเห็นและทำงานด้วยวิธีเดียวกัน"
      ],
      answer: 0
    },
    {
      question: "ช่องทางการสื่อสารใดเหมาะสมที่สุดในการจัดการข้อขัดแย้งที่ละเอียดอ่อนภายในทีม?",
      options: [
        "การนัดพูดคุยแบบเผชิญหน้าหรือประชุมวิดีโอคอลแบบจำกัดคน",
        "การเขียนข้อร้องเรียนลงในกรุ๊ปแชตรวมของแผนกเพื่อให้ทุกคนร่วมตัดสิน",
        "การเขียนอีเมลขนาดยาวส่ง CC หาผู้บริหารทุกคนเพื่อชี้แจงความเสียหาย",
        "การเขียนตำหนิซ่อนลงในคำอธิบายการบันทึกโค้ด (Git Commit Message)"
      ],
      answer: 0
    },
    {
      question: "อวัจนภาษา (Non-verbal Communication) ในการร่วมงานหมายถึงสิ่งใด?",
      options: [
        "ภาษากาย ลักษณะท่าทาง น้ำเสียง และแววตาของผู้สื่อสาร",
        "การจัดทำเอกสารและคู่มือระบบอย่างเป็นลายลักษณ์อักษร",
        "การส่งรูปภาพสัญลักษณ์การ์ตูน Emojis ในกลุ่มสนทนาของทีม",
        "การใส่ข้อความอธิบาย (Comments) ภายในโค้ด"
      ],
      answer: 0
    }
  ],
  teamwork: [
    {
      question: "หากสมาชิกนักพัฒนามีความเห็นแย้งกันในเรื่องสถาปัตยกรรมโค้ด (Design Pattern) ควรแก้ไขอย่างไร?",
      options: [
        "ร่วมวิเคราะห์ข้อดีข้อเสียของแต่ละวิธีอย่างเป็นกลาง และเลือกวิธีที่ส่งผลดีต่อโปรเจกต์ที่สุด",
        "ให้สมาชิกที่มีพรรษาหรืออายุงานมากที่สุดเลือกวิธีของตัวเองทันทีโดยไม่ต้องหารือ",
        "ทำการเปิดโหวตความนิยมในโซเชียลมีเดียเพื่อหาข้อยุติ",
        "ถกเถียงกันต่อไปเรื่อยๆ ในที่ประชุมจนกว่าสัญญางานจะสิ้นสุดลง"
      ],
      answer: 0
    },
    {
      question: "สภาพแวดล้อมการทำงานร่วมกันที่ดี (Psychological Safety) หมายถึงข้อใด?",
      options: [
        "วัฒนธรรมที่สนับสนุนให้ทุกคนกล้าพูด แชร์แนวคิด และเปิดรับคำวิจารณ์โดยไม่ต้องกลัวโดนตำหนิ",
        "วัฒนธรรมแข่งขันอย่างเข้มข้นเพื่อแย่งชิงความดีความชอบสูงสุดเพียงคนเดียว",
        "การที่ทุกคนทำงานในความเงียบสงบโดยไม่มีการปฏิสัมพันธ์ช่วยเหลือกัน",
        "การที่หัวหน้างานคอยตรวจสอบและสั่งการทำงานทุกคลิกของพนักงาน"
      ],
      answer: 0
    },
    {
      question: "การประชุม Daily Stand-up Meeting ในทีมแบบ Agile สมาชิกทุกคนจะตอบคำถามใดบ้างเป็นหลัก?",
      options: [
        "เมื่อวานทำอะไร วันนี้จะทำอะไร และมีอุปสรรคใดติดขัดอยู่บ้าง",
        "ใครช่วยงานฉัน ใครทำผิดพลาด และเงินเดือนควรเพิ่มเท่าใด",
        "สร้างบั๊กไปกี่ตัว วันนี้พักกี่โมง และกาแฟอยู่ที่ไหน",
        "เมื่อคืนกินอะไร งานอดิเรกคืออะไร และสภาพอากาศเป็นอย่างไร"
      ],
      answer: 0
    },
    {
      question: "การร่วมเป็นเจ้าของโค้ด (Collective Code Ownership) ดีต่อการทำงานอย่างไร?",
      options: [
        "ทำให้สมาชิกทุกคนช่วยตรวจสอบ ปรับปรุง และแก้ไขโค้ดส่วนใดในโปรเจกต์ร่วมกันได้เสมอ",
        "ทำให้มีสิทธิ์แค่หัวหน้าโปรแกรมเมอร์คนเดียวเท่านั้นในการเขียนโค้ดทั้งหมด",
        "แบ่งแยกหน้าที่ชัดเจนว่านักพัฒนาห้ามแก้ไขโค้ดของเพื่อนโดยเด็ดขาด",
        "ทำให้สิทธิ์ความเป็นเจ้าของในสิทธิบัตรซอฟต์แวร์ตกเป็นของบริษัทอย่างสมบูรณ์"
      ],
      answer: 0
    },
    {
      question: "หากสมาชิกในทีมคนหนึ่งงานล้าหลังเนื่องจากเจอปัญหาเชิงเทคนิคที่ซับซ้อน ทีมควรทำอย่างไร?",
      options: [
        "เข้าไปช่วยแบ่งเบางานหรือร่วมวิเคราะห์แก้ปัญหาร่วมกัน (Pairing) เพื่อระเบิดคอขวด",
        "เขียนรายงานส่งผู้บริหารเพื่อแจ้งบทลงโทษตามระเบียบสถาบัน",
        "ละเลยไม่สนใจเนื่องจากไม่ใช่หน้าที่หรืองานส่วนที่ตนเองต้องรับผิดชอบ",
        "ยึดงานส่วนนั้นมาทำทั้งหมดแล้วเสนอลดตำแหน่งของเพื่อนร่วมทีมคนนั้น"
      ],
      answer: 0
    }
  ],
  generic: [
    {
      question: "ระบบเลขฐานใดที่เป็นพื้นฐานของเครื่องคอมพิวเตอร์ดิจิทัล?",
      options: ["เลขฐานสอง (Binary)", "เลขฐานสิบ (Decimal)", "เลขฐานแปด (Octal)", "เลขฐานสิบหก (Hexadecimal)"],
      answer: 0
    },
    {
      question: "CPU ย่อมาจากอะไร?",
      options: ["Central Processing Unit", "Computer Power Unit", "Control Panel Utility", "Core Processor Unit"],
      answer: 0
    },
    {
      question: "โปรโตคอลมาตรฐานในการเข้าชมและรับส่งหน้าเว็บเพจบนอินเทอร์เน็ตคืออะไร?",
      options: ["HTTP", "FTP", "SMTP", "SSH"],
      answer: 0
    },
    {
      question: "ข้อใดไม่ใช่ระบบปฏิบัติการ (Operating System)?",
      options: ["Linux", "Windows", "macOS", "Google Chrome Browser"],
      answer: 3
    },
    {
      question: "วัตถุประสงค์หลักในการใช้งานซอฟต์แวร์ Version Control เช่น Git คืออะไร?",
      options: [
        "ติดตามประวัติการแก้ไขซอร์สโค้ดและช่วยนักพัฒนาทำงานร่วมกันอย่างเป็นระบบ",
        "เร่งความเร็วในการเชื่อมต่ออินเทอร์เน็ตในการอัปโหลดไฟล์",
        "ทำการคอมไพล์โค้ดโปรเจกต์ให้เสร็จเร็วขึ้น",
        "เป็นระบบเก็บสำรองไฟล์ข้อมูลส่วนบุคคลบนระบบคลาวด์เท่านั้น"
      ],
      answer: 0
    }
  ]
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const skillName = searchParams.get("skillName")?.toLowerCase() || "";

  let key = "generic";
  if (skillName.includes("react") || skillName.includes("next")) {
    key = "react";
  } else if (skillName.includes("node") || skillName.includes("express") || skillName.includes("api")) {
    key = "node";
  } else if (skillName.includes("sql") || skillName.includes("db") || skillName.includes("database") || skillName.includes("prisma")) {
    key = "sql";
  } else if (skillName.includes("problem") || skillName.includes("solve")) {
    key = "problemsolving";
  } else if (skillName.includes("communication") || skillName.includes("talk") || skillName.includes("speak")) {
    key = "communication";
  } else if (skillName.includes("team") || skillName.includes("collaborate") || skillName.includes("group")) {
    key = "teamwork";
  }

  // Return questions without the correct answer field for security
  const secureQuestions = QUIZZES[key].map(q => ({
    question: q.question,
    options: q.options
  }));

  return NextResponse.json({ questions: secureQuestions, key });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { skillId, isCodingTest, scorePercent: reqScore } = body;

    if (isCodingTest) {
      if (typeof reqScore !== "number" || reqScore < 0 || reqScore > 100) {
        return NextResponse.json({ error: "Invalid coding score" }, { status: 400 });
      }

      const passed = reqScore >= 80;
      const calculatedLevel = reqScore >= 100 ? 5 : reqScore >= 80 ? 4 : 2;

      const updatedSkill = await prisma.skill.update({
        where: { id: skillId },
        data: {
          testScore: reqScore,
          level: calculatedLevel,
          isVerified: passed ? true : undefined,
          status: passed ? "PASSED" : "FAILED"
        }
      });

      if (passed) {
        try {
          const { addBlock } = require("@/lib/blockchain");
          const studentName = session.user.name || "นักศึกษา ทดสอบ";
          addBlock(
            studentName,
            "SKILL_VERIFIED",
            `แล็บเขียนโค้ดทักษะ ${updatedSkill.name} (ระดับ ${calculatedLevel}, คะแนนยูนิตเทสต์ ${reqScore}%)`
          );
        } catch (bcErr) {
          console.error("Failed to write blockchain ledger:", bcErr);
        }
      }

      return NextResponse.json({
        success: true,
        score: reqScore,
        passed,
        skill: updatedSkill
      });
    }

    const { answers, quizKey } = body;
    if (!skillId || !answers || !quizKey || !QUIZZES[quizKey]) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const quizSet = QUIZZES[quizKey];
    let correctCount = 0;

    quizSet.forEach((q, idx) => {
      if (answers[idx] === q.answer) {
        correctCount++;
      }
    });

    const scorePercent = Math.round((correctCount / quizSet.length) * 100);
    const passed = scorePercent >= 80; // Pass mark is 80%

    // Calculate level based on correct answers (0-5 questions -> level 1 to 5)
    const calculatedLevel = correctCount > 0 ? correctCount : 1;

    // Update student's skill with objective assessment score
    const updatedSkill = await prisma.skill.update({
      where: { id: skillId },
      data: {
        testScore: scorePercent,
        level: calculatedLevel,
        isVerified: passed ? true : undefined // Only set verified to true if passed, don't change if failed.
      }
    });

    if (passed) {
      try {
        const { addBlock } = require("@/lib/blockchain");
        const studentName = session.user.name || "นักศึกษา ทดสอบ";
        addBlock(
          studentName,
          "SKILL_VERIFIED",
          `ทักษะ ${updatedSkill.name} (ระดับ ${calculatedLevel}, คะแนนสอบ ${scorePercent}%)`
        );
      } catch (bcErr) {
        console.error("Failed to write blockchain ledger:", bcErr);
      }
    }

    return NextResponse.json({
      success: true,
      score: scorePercent,
      correctCount,
      totalCount: quizSet.length,
      passed,
      skill: updatedSkill
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

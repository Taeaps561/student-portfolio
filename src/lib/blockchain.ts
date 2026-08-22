import fs from "fs";
import path from "path";
import crypto from "crypto";

export interface Block {
  index: number;
  timestamp: string;
  studentName: string;
  action: string; // "SKILL_VERIFIED" | "TEACHER_VERIFIED" | "GENESIS"
  details: string;
  previousHash: string;
  hash: string;
  nonce: number;
}

const LEDGER_PATH = path.join(process.cwd(), "blockchain_ledger.json");

export function calculateHash(block: Omit<Block, "hash">): string {
  const payload = `${block.index}-${block.timestamp}-${block.studentName}-${block.action}-${block.details}-${block.previousHash}-${block.nonce}`;
  return crypto.createHash("sha256").update(payload).digest("hex");
}

export function getBlockchain(): Block[] {
  if (!fs.existsSync(LEDGER_PATH)) {
    // Genesis block
    const genesisBlock: Block = {
      index: 0,
      timestamp: new Date("2026-06-17T12:00:00.000Z").toISOString(),
      studentName: "ระบบหลักศิลาจารึก (Genesis Authority)",
      action: "GENESIS",
      details: "บล็อกกำเนิด SkillPassport Blockchain Ledger - จุดเริ่มต้นความน่าเชื่อถือ",
      previousHash: "0000000000000000000000000000000000000000000000000000000000000000",
      hash: "",
      nonce: 0
    };
    genesisBlock.hash = calculateHash(genesisBlock);
    
    // Add some initial mock blocks so the ledger starts with some historical records
    const initialChain = [
      genesisBlock,
      {
        index: 1,
        timestamp: new Date("2026-06-17T12:30:00.000Z").toISOString(),
        studentName: "สมชาย ทดลองเรียน",
        action: "SKILL_VERIFIED",
        details: "React (ระดับ 4, สอบได้ 90%) - ผ่านเกณฑ์มาตรฐาน",
        previousHash: genesisBlock.hash,
        hash: "",
        nonce: 145
      },
      {
        index: 2,
        timestamp: new Date("2026-06-17T13:10:00.000Z").toISOString(),
        studentName: "นางสาวสมหญิง สู้ชีวิต",
        action: "TEACHER_VERIFIED",
        details: "SQL / Database (ระดับ 3) ได้รับการประเมินโดย ศ.ดร.สมชาย ใจดี",
        previousHash: "",
        hash: "",
        nonce: 82
      }
    ];

    // Recalculate and mine mock blocks
    initialChain[1].hash = calculateHash(initialChain[1]);
    initialChain[2].previousHash = initialChain[1].hash;
    initialChain[2].hash = calculateHash(initialChain[2]);

    fs.writeFileSync(LEDGER_PATH, JSON.stringify(initialChain, null, 2));
    return initialChain;
  }

  try {
    const data = fs.readFileSync(LEDGER_PATH, "utf-8");
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

export function saveBlockchain(chain: Block[]) {
  fs.writeFileSync(LEDGER_PATH, JSON.stringify(chain, null, 2));
}

export function addBlock(studentName: string, action: string, details: string): Block {
  const chain = getBlockchain();
  const prevBlock = chain[chain.length - 1];
  
  const newBlock: Omit<Block, "hash"> = {
    index: chain.length,
    timestamp: new Date().toISOString(),
    studentName,
    action,
    details,
    previousHash: prevBlock.hash,
    nonce: 0
  };

  // Proof of Work mining loop (mine to start with two zeroes to represent security validation)
  let hash = calculateHash(newBlock);
  while (!hash.startsWith("00")) {
    newBlock.nonce++;
    hash = calculateHash(newBlock);
  }

  const completedBlock: Block = { ...newBlock, hash };
  chain.push(completedBlock);
  saveBlockchain(chain);
  return completedBlock;
}

export function verifyChain(chain: Block[]): { isValid: boolean; brokenIndex: number } {
  for (let i = 1; i < chain.length; i++) {
    const current = chain[i];
    const previous = chain[i - 1];

    // 1. Recalculate hash of current block
    const recalculated = calculateHash({
      index: current.index,
      timestamp: current.timestamp,
      studentName: current.studentName,
      action: current.action,
      details: current.details,
      previousHash: current.previousHash,
      nonce: current.nonce
    });

    if (current.hash !== recalculated) {
      return { isValid: false, brokenIndex: i };
    }

    // 2. Validate chain link
    if (current.previousHash !== previous.hash) {
      return { isValid: false, brokenIndex: i };
    }
  }
  return { isValid: true, brokenIndex: -1 };
}

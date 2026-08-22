import { NextRequest, NextResponse } from "next/server";
import { getBlockchain, saveBlockchain, verifyChain, Block } from "@/lib/blockchain";
import fs from "fs";
import path from "path";

export async function GET(req: NextRequest) {
  try {
    const chain = getBlockchain();
    const verification = verifyChain(chain);

    return NextResponse.json({
      success: true,
      chain,
      isValid: verification.isValid,
      brokenIndex: verification.brokenIndex
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { action } = await req.json();

    if (action === "tamper") {
      const chain = getBlockchain();
      if (chain.length > 1) {
        // Tamper with Block 1 details (e.g. change score/grade illegally in DB)
        chain[1].details = "React (ระดับ 5, สอบได้ 100%) - *ข้อมูลถูกลักลอบแก้ไขโดยแฮกเกอร์*";
        // Save the tampered chain to demonstrate detection
        saveBlockchain(chain);
      }
      return NextResponse.json({ success: true, message: "จำลองการแก้ไขข้อมูลใน Block 1 เรียบร้อย" });
    }

    if (action === "reset") {
      const ledgerPath = path.join(process.cwd(), "blockchain_ledger.json");
      if (fs.existsSync(ledgerPath)) {
        fs.unlinkSync(ledgerPath);
      }
      // Regenerate fresh genesis/mock ledger
      const freshChain = getBlockchain();
      return NextResponse.json({ success: true, chain: freshChain, message: "รีเซ็ตบล็อกเชนกลับสู่ปกติแล้ว" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

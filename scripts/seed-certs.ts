import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: "test@example.com" },
    include: { portfolio: { include: { certificates: true } } },
  });

  if (!user) {
    console.log("User test@example.com not found");
    return;
  }

  let portfolio = user.portfolio;
  if (!portfolio) {
    portfolio = await prisma.portfolio.create({
      data: {
        userId: user.id,
        bio: "สวัสดี! ฉันเป็นนักศึกษาที่หลงใหลในความปลอดภัย DevSecOps, Network และ Cloud Computing",
        isPublic: true,
      },
      include: { certificates: true },
    });
  }

  const certsToEnsure = [
    {
      name: "CCNA (Cisco Certified Network Associate)",
      issuer: "Cisco Systems",
      issueDate: new Date("2025-11-20"),
      fileUrl: "https://www.cisco.com/c/en/us/training-events/training-certifications/certifications/associate/ccna.html",
      hashValue: `cert_hash_${crypto.createHash("sha256").update(`CCNA-Cisco-${user.id}`).digest("hex").substring(0, 32)}`,
    },
    {
      name: "CompTIA Security+ (Sec+)",
      issuer: "CompTIA",
      issueDate: new Date("2026-01-10"),
      fileUrl: "https://www.comptia.org/certifications/security",
      hashValue: `cert_hash_${crypto.createHash("sha256").update(`SecPlus-CompTIA-${user.id}`).digest("hex").substring(0, 32)}`,
    },
    {
      name: "CEH (Certified Ethical Hacker)",
      issuer: "EC-Council",
      issueDate: new Date("2026-02-15"),
      fileUrl: "https://www.eccouncil.org/programs/certified-ethical-hacker-ceh/",
      hashValue: `cert_hash_${crypto.createHash("sha256").update(`CEH-ECCouncil-${user.id}`).digest("hex").substring(0, 32)}`,
    },
  ];

  for (const c of certsToEnsure) {
    const exists = portfolio.certificates.some((existing) => existing.name.includes(c.name.split(" ")[0]));
    if (!exists) {
      await prisma.certificate.create({
        data: {
          portfolioId: portfolio.id,
          ...c,
        },
      });
      console.log(`Added certificate: ${c.name}`);
    } else {
      console.log(`Certificate already exists: ${c.name}`);
    }
  }

  console.log("Certificate seeding complete!");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());

const { PrismaClient } = require("@prisma/client");
const crypto = require("crypto");

const prisma = new PrismaClient();

async function main() {
  let user = await prisma.user.findUnique({
    where: { email: "test@example.com" },
    include: { portfolio: { include: { certificates: true } } },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        name: "นักศึกษา ทดสอบ",
        email: "test@example.com",
        role: "STUDENT",
        image: "https://ui-avatars.com/api/?name=Student+Test&background=0a66c2&color=fff",
      },
      include: { portfolio: { include: { certificates: true } } },
    });
  }

  let portfolio = user.portfolio;
  if (!portfolio) {
    portfolio = await prisma.portfolio.create({
      data: {
        userId: user.id,
        bio: "สวัสดี! ฉันเป็นนักศึกษาที่หลงใหลในความปลอดภัย DevSecOps, Network และ Cloud Security",
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
    {
      name: "SDU DevSecOps & Cloud Security Specialist",
      issuer: "Suan Dusit University (มหาวิทยาลัยสวนดุสิต)",
      issueDate: new Date("2026-03-01"),
      fileUrl: "#",
      hashValue: `cert_hash_${crypto.createHash("sha256").update(`SDU-DevSecOps-${user.id}`).digest("hex").substring(0, 32)}`,
    },
  ];

  const existingCertificates = await prisma.certificate.findMany({
    where: { portfolioId: portfolio.id },
  });

  for (const c of certsToEnsure) {
    const exists = existingCertificates.some((existing) => existing.name.toLowerCase().includes(c.name.split(" ")[0].toLowerCase()));
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

  console.log("SUCCESS: All certificates seeded successfully into database!");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());

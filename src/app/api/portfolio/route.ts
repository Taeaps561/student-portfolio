import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const publicOnly = searchParams.get("publicOnly");

    // DevSecOps / Access Control & PDPA Policy:
    // 1. If user is unauthenticated or requests public list, restrict strictly to public portfolios
    // 2. Sensitive fields (phoneNumber, gpa) must be masked unless caller has verified authorized role
    const isPrivileged = session?.user?.role === "TEACHER" || session?.user?.role === "EMPLOYER";
    
    // Default to public-only unless privileged role explicitly requests otherwise
    const whereClause: any = {};
    if (!session || !isPrivileged || publicOnly === "true") {
      whereClause.isPublic = true;
    }

    const portfolios = await prisma.portfolio.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            role: true,
          },
        },
        skills: {
          where: { isVerified: true },
        },
        projects: true,
        certificates: true,
      },
      orderBy: { id: "desc" },
    });

    // PDPA Data Masking: Mask phone number & GPA for unauthorized viewers
    const sanitizedPortfolios = portfolios.map((portfolio) => {
      const isOwner = session?.user?.id === portfolio.userId;
      const canViewSensitive = isOwner || isPrivileged;

      return {
        ...portfolio,
        // Mask phone number: 081-XXX-1234
        phoneNumber: canViewSensitive
          ? portfolio.phoneNumber
          : portfolio.phoneNumber
          ? portfolio.phoneNumber.replace(/^(\d{3})\d{3}(\d{4})$/, "$1-XXX-$2")
          : null,
        // Mask GPA unless authorized
        gpa: canViewSensitive ? portfolio.gpa : null,
      };
    });

    return Response.json({ success: true, portfolios: sanitizedPortfolios });
  } catch (error: any) {
    console.error("Error fetching portfolios:", error);
    return Response.json(
      { success: false, error: "Failed to fetch portfolios" },
      { status: 500 }
    );
  }
}

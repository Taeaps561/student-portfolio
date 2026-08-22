import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const publicOnly = searchParams.get("publicOnly") === "true";

    const whereClause: any = {};
    if (publicOnly) {
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
        skills: true,
        projects: true,
        certificates: true,
      },
      orderBy: { id: "desc" },
    });

    return Response.json({ success: true, portfolios });
  } catch (error: any) {
    console.error("Error fetching portfolios:", error);
    return Response.json(
      { success: false, error: "Failed to fetch portfolios" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

async function getOrCreatePortfolioId(userId: string) {
  let portfolio = await prisma.portfolio.findUnique({
    where: { userId },
  });
  if (!portfolio) {
    portfolio = await prisma.portfolio.create({
      data: {
        userId,
        bio: "สวัสดี! ฉันเป็นนักศึกษาที่หลงใหลในการเขียนโค้ดและสร้างสรรค์นวัตกรรมใหม่ๆ",
        isPublic: true,
      },
    });
  }
  return portfolio.id;
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const portfolioId = await getOrCreatePortfolioId(session.user.id as string);
    const projects = await prisma.project.findMany({
      where: { portfolioId },
    });
    return NextResponse.json({ projects });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, description, githubUrl, imageUrl } = await req.json();
    if (!title || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const portfolioId = await getOrCreatePortfolioId(session.user.id as string);

    const newProject = await prisma.project.create({
      data: {
        portfolioId,
        title,
        description,
        githubUrl: githubUrl || null,
        imageUrl: imageUrl || null,
      },
    });

    // Write to audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id as string,
        action: "ADD_PROJECT",
        details: `Added project: ${title}`,
      },
    });

    return NextResponse.json({ project: newProject });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    const portfolioId = await getOrCreatePortfolioId(session.user.id as string);
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project || project.portfolioId !== portfolioId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.project.delete({
      where: { id },
    });

    // Write to audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id as string,
        action: "DELETE_PROJECT",
        details: `Deleted project: ${project.title}`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

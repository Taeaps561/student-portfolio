import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userEmail = session.user.email;
    if (!userEmail) {
      return NextResponse.json({ error: "Email not found in session" }, { status: 400 });
    }

    // Find user and their portfolio
    let user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: { portfolio: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // If portfolio doesn't exist, create it initially
    if (!user.portfolio && user.role === "STUDENT") {
      const portfolio = await prisma.portfolio.create({
        data: {
          userId: user.id,
          bio: "",
          isPublic: false
        }
      });
      user = { ...user, portfolio };
    }

    return NextResponse.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        portfolio: user.portfolio || null
      }
    });
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
    const userEmail = session.user.email;
    if (!userEmail) {
      return NextResponse.json({ error: "Email not found in session" }, { status: 400 });
    }

    const { name, image, bio, phoneNumber, gpa, isPublic } = await req.json();

    // Find the user first
    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update user name and profile image
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name !== undefined ? name : undefined,
        image: image !== undefined ? image : undefined,
      }
    });

    // Update portfolio (only relevant for students, but supported for all roles if portfolio exists)
    let updatedPortfolio = null;
    const gpaFloat = gpa !== undefined && gpa !== "" && gpa !== null ? parseFloat(gpa) : null;

    const existingPortfolio = await prisma.portfolio.findUnique({
      where: { userId: user.id }
    });

    if (existingPortfolio) {
      updatedPortfolio = await prisma.portfolio.update({
        where: { userId: user.id },
        data: {
          bio: bio !== undefined ? bio : undefined,
          phoneNumber: phoneNumber !== undefined ? phoneNumber : undefined,
          gpa: gpaFloat,
          isPublic: isPublic !== undefined ? isPublic : undefined
        }
      });
    } else if (user.role === "STUDENT") {
      updatedPortfolio = await prisma.portfolio.create({
        data: {
          userId: user.id,
          bio: bio || "",
          phoneNumber: phoneNumber || null,
          gpa: gpaFloat,
          isPublic: isPublic || false
        }
      });
    }

    // Log the change in audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "UPDATE_SETTINGS",
        details: JSON.stringify({ name, hasBio: !!bio, isPublic }),
        ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1"
      }
    });

    return NextResponse.json({
      success: true,
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
        image: updatedUser.image,
        role: updatedUser.role,
        portfolio: updatedPortfolio
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

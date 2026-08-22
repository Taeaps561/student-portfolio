import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// GET /api/posts - ดึงรายการโพสต์ทั้งหมดพร้อมข้อมูลผู้โพสต์, likes, และ comments
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filterTag = searchParams.get("tag");
    const filterType = searchParams.get("type");

    const whereClause: any = {};
    if (filterTag && filterTag !== "ALL") {
      whereClause.tag = filterTag;
    }
    if (filterType && filterType !== "ALL") {
      whereClause.postType = filterType;
    }

    const posts = await prisma.post.findMany({
      where: whereClause,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            role: true,
            portfolio: {
              select: {
                bio: true,
                isPublic: true,
              },
            },
          },
        },
        likes: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
                role: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    });

    return Response.json({ success: true, posts });
  } catch (error: any) {
    console.error("Error fetching posts:", error);
    return Response.json(
      { success: false, error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

// POST /api/posts - สร้างโพสต์ใหม่
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return Response.json(
        { success: false, error: "กรุณาเข้าสู่ระบบก่อนทำการโพสต์" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { content, postType, tag, imageUrl } = body;

    if (!content || typeof content !== "string" || !content.trim()) {
      return Response.json(
        { success: false, error: "เนื้อหาโพสต์ต้องไม่ว่างเปล่า" },
        { status: 400 }
      );
    }

    const newPost = await prisma.post.create({
      data: {
        authorId: session.user.id,
        content: content.trim(),
        postType: postType || "GENERAL",
        tag: tag ? tag.trim() : null,
        imageUrl: imageUrl ? imageUrl.trim() : null,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            role: true,
            portfolio: {
              select: {
                bio: true,
                isPublic: true,
              },
            },
          },
        },
        likes: true,
        comments: true,
      },
    });

    return Response.json({ success: true, post: newPost }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating post:", error);
    return Response.json(
      { success: false, error: "ไม่สามารถสร้างโพสต์ได้" },
      { status: 500 }
    );
  }
}

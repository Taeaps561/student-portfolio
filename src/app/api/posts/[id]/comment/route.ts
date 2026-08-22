import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return Response.json(
        { success: false, error: "กรุณาเข้าสู่ระบบก่อนแสดงความคิดเห็น" },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const postId = resolvedParams.id;
    const body = await request.json();
    const { content } = body;

    if (!content || typeof content !== "string" || !content.trim()) {
      return Response.json(
        { success: false, error: "ข้อความคอมเมนต์ต้องไม่ว่างเปล่า" },
        { status: 400 }
      );
    }

    const comment = await prisma.postComment.create({
      data: {
        postId,
        userId: session.user.id,
        content: content.trim(),
      },
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
    });

    return Response.json({ success: true, comment }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating comment:", error);
    return Response.json(
      { success: false, error: "ไม่สามารถส่งความคิดเห็นได้" },
      { status: 500 }
    );
  }
}

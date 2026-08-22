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
        { success: false, error: "กรุณาเข้าสู่ระบบก่อนแสดงความรู้สึก" },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const postId = resolvedParams.id;
    const body = await request.json().catch(() => ({}));
    const reactionType = body.type || "LIKE";

    // Check if like exists
    const existingLike = await prisma.postLike.findUnique({
      where: {
        postId_userId: {
          postId,
          userId: session.user.id,
        },
      },
    });

    if (existingLike) {
      if (existingLike.type === reactionType) {
        // Toggle off
        await prisma.postLike.delete({
          where: { id: existingLike.id },
        });
        return Response.json({ success: true, action: "UNLIKED" });
      } else {
        // Update reaction type
        const updated = await prisma.postLike.update({
          where: { id: existingLike.id },
          data: { type: reactionType },
        });
        return Response.json({ success: true, action: "UPDATED", like: updated });
      }
    } else {
      // Create new like
      const newLike = await prisma.postLike.create({
        data: {
          postId,
          userId: session.user.id,
          type: reactionType,
        },
      });
      return Response.json({ success: true, action: "LIKED", like: newLike });
    }
  } catch (error: any) {
    console.error("Error liking post:", error);
    return Response.json(
      { success: false, error: "ไม่สามารถดำเนินการได้" },
      { status: 500 }
    );
  }
}

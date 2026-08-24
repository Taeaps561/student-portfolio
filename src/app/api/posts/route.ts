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

    let posts = await prisma.post.findMany({
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

    // Auto-seed realistic posts if database is empty
    if (posts.length === 0 && !filterTag && !filterType) {
      // Find or create representative users for posts
      let teacher = await prisma.user.findUnique({ where: { email: "teacher@example.com" } });
      if (!teacher) {
        teacher = await prisma.user.create({
          data: {
            name: "ศ.ดร.สมชาย ใจดี",
            email: "teacher@example.com",
            role: "TEACHER",
            image: "https://ui-avatars.com/api/?name=Somchai+Jaidee&background=002d62&color=fff",
          }
        });
      }

      let employer = await prisma.user.findUnique({ where: { email: "employer@example.com" } });
      if (!employer) {
        employer = await prisma.user.create({
          data: {
            name: "คุณวิชัย ปรีชา (บมจ. เทคโนโลยีดีไลท์)",
            email: "employer@example.com",
            role: "EMPLOYER",
            image: "https://ui-avatars.com/api/?name=Wichai+Preecha&background=059669&color=fff",
          }
        });
      }

      let student = await prisma.user.findUnique({ where: { email: "test@example.com" } });
      if (!student) {
        student = await prisma.user.create({
          data: {
            name: "นายอภิสิทธิ์ ศรีพัฒน์",
            email: "test@example.com",
            role: "STUDENT",
            image: "https://ui-avatars.com/api/?name=Apisit+Sripat&background=0a66c2&color=fff",
          }
        });
      }

      // Create realistic posts
      await prisma.post.create({
        data: {
          authorId: teacher.id,
          content: `🏛️ ประกาศรับรองทักษะ DevSecOps และ Digital Skill Passport สำหรับนักศึกษา มหาวิทยาลัยสวนดุสิต\n\nทางคณะเปิดให้นักศึกษาทุกชั้นปีส่งผลงานและสอบวัดระดับสมรรถนะดิจิทัลรอบใหม่ เพื่อรับวุฒิบัตรดิจิทัลพร้อมลายเซ็นเข้ารหัส SHA-256 สำหรับใช้สมัครฝึกงานสหกิจศึกษากับบริษัทพันธมิตรแล้วครับ 🚀\n\n📌 สามารถกดทำแบบทดสอบได้ที่แท็บ "ศูนย์สอบวัดระดับทักษะ" หรือจัดการใบรับรองได้ทันที`,
          postType: "GENERAL",
          tag: "DevSecOps",
          imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80",
        }
      });

      await prisma.post.create({
        data: {
          authorId: employer.id,
          content: `💼 บมจ. เทคโนโลยีดีไลท์ (Delight Technology PCL.) เปิดรับสมัครนิสิต/นักศึกษาฝึกงานและตำแหน่ง Junior Full-stack Developer (Next.js / TypeScript / PostgreSQL)\n\nองค์กรเราเป็นพันธมิตรอย่างเป็นทางการกับ มหาวิทยาลัยสวนดุสิต โดยจะพิจารณานักศึกษาที่มีทักษะผ่านการรับรองจาก SkillPassport เป็นลำดับแรก!\n\n✨ สวัสดิการ: ค่าตอบแทนฝึกงาน, Hybrid Working, โอกาสบรรจุเป็นพนักงานประจำทันทีหลังสำเร็จการศึกษา\n📩 ส่งโปรไฟล์ผ่านระบบ SkillPassport ได้ที่แท็บ "งาน" ได้เลยครับ`,
          postType: "HIRING",
          tag: "NextJS",
          imageUrl: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80",
        }
      });

      await prisma.post.create({
        data: {
          authorId: student.id,
          content: `🚀 ตื่นเต้นมากครับ! พัฒนาระบบ "Student Portfolio & Skill Passport" สำหรับวิชา DevSecOps สำเร็จไปอีกขั้น\n\nระบบนี้สร้างด้วย Next.js 15, Prisma ORM, NextAuth รองรับ Multi-Role RBAC และมีระบบ Digital Certificate Hashing ป้องกันการปลอมแปลงผลงาน\n\nขอขอบคุณอาจารย์และเพื่อนๆ ในกลุ่มที่ช่วยกันพัฒนาครับ 💻✨ #DevSecOps #NextJS #CyberSecurity`,
          postType: "PROJECT_SHOWCASE",
          tag: "CyberSecurity",
          imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
        }
      });

      // Refetch posts with newly created records
      posts = await prisma.post.findMany({
        where: whereClause,
        include: {
          author: { select: { id: true, name: true, image: true, role: true, portfolio: true } },
          likes: { include: { user: true } },
          comments: { include: { user: true }, orderBy: { createdAt: "asc" } },
        },
        orderBy: { createdAt: "desc" },
      });
    }

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

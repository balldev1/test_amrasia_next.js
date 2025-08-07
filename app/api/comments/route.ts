import dbConnect from "@/lib/mongodb";
import Comment from "@/models/Comment";
import { authenticate } from "@/app/api/middleware/route";

export async function GET(req: any) {
  try {
    const url = new URL(req.url);
    const imageId = url.searchParams.get("imageId");
    if (!imageId) {
      return new Response(JSON.stringify({ message: "Missing imageId" }), {
        status: 400,
      });
    }

    // ตรวจสอบ JWT จาก cookie
    await authenticate(req);

    // เชื่อมต่อ DB
    await dbConnect();

    // ดึง comment ที่ตรงกับ imageId และ populate userId (เอาแค่ username)
    const comments = await Comment.find({ imageId })
      .populate("userId", "username")
      .sort({ createdAt: -1 });

    return new Response(JSON.stringify(comments), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ message: error.message || "Unauthorized" }),
      { status: 401 }
    );
  }
}

// POST /api/comments
export async function POST(req: any) {
  try {
    const { imageId, comment } = await req.json();

    if (!imageId || !comment) {
      return new Response(
        JSON.stringify({ message: "Missing imageId or comment" }),
        { status: 400 }
      );
    }

    // ตรวจสอบ JWT และดึง user info จาก token
    const user: any = await authenticate(req);

    // เชื่อมต่อ DB
    await dbConnect();

    // สร้าง comment ใหม่
    const newComment = new Comment({
      imageId,
      comment,
      userId: user.userId,
      createdAt: new Date(),
    });

    await newComment.save();

    // ดึงข้อมูล user (username) มา populate ด้วย
    await newComment.populate("userId", "username");

    return new Response(JSON.stringify(newComment), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ message: error.message || "Unauthorized" }),
      { status: 401 }
    );
  }
}

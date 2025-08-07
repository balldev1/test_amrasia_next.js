import dbConnect from "@/lib/mongodb";
import Image from "@/models/Image";
import { authenticate } from "@/app/api/middleware/route";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import sharp from "sharp";

export async function GET(req: any) {
  try {
    // ตรวจสอบ JWT
    await authenticate(req);

    await dbConnect();

    // ดึงรูปแมวจาก cataas.com
    const res = await fetch("https://cataas.com/cat");
    if (!res.ok) {
      return new Response(
        JSON.stringify({ message: "Failed to fetch cat image" }),
        { status: 500 }
      );
    }

    const buffer = await res.arrayBuffer();
    const inputBuffer = Buffer.from(buffer);

    // แปลงภาพเป็น webp
    const webpBuffer = await sharp(inputBuffer).webp().toBuffer();

    // สร้างชื่อไฟล์ .webp
    const filename = `${uuidv4()}.webp`;
    const dir = path.resolve(process.cwd(), "public/cats");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const filePath = path.join(dir, filename);

    // บันทึกไฟล์ .webp ลง public/cats
    fs.writeFileSync(filePath, webpBuffer);

    // สร้าง record ใน images collection
    const image = new Image({
      path: `/cats/${filename}`,
      createdAt: new Date(),
    });
    await image.save();

    return new Response(
      JSON.stringify({ imageId: image._id, path: image.path }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}

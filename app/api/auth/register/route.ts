import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return new Response(
        JSON.stringify({ message: "Missing username or password" }),
        { status: 400 }
      );
    }

    // เช็คว่ามี username นี้แล้วหรือยัง
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return new Response(
        JSON.stringify({ message: "Username already exists" }),
        { status: 409 }
      );
    }

    // เข้ารหัส password
    const hashedPassword = await bcrypt.hash(password, 10);

    // สร้าง user ใหม่
    const newUser = new User({
      username,
      password: hashedPassword,
      createdAt: new Date(),
    });

    await newUser.save();

    return new Response(
      JSON.stringify({ message: "User registered successfully" }),
      { status: 201 }
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}

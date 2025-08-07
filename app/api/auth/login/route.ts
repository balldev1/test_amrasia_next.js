import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: any) {
  await dbConnect();

  const { username, password } = await request.json();

  if (!username || !password) {
    return new Response(
      JSON.stringify({ message: "Missing username or password" }),
      { status: 400 }
    );
  }

  const user = await User.findOne({ username });
  if (!user) {
    return new Response(JSON.stringify({ message: "Invalid credentials" }), {
      status: 401,
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return new Response(JSON.stringify({ message: "Invalid credentials" }), {
      status: 401,
    });
  }

  const token = jwt.sign(
    { userId: user._id.toString(), username: user.username },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" }
  );

  return new Response(JSON.stringify({ message: "Login successful" }), {
    status: 200,
    headers: {
      "Set-Cookie": `token=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Strict`,
      "Content-Type": "application/json",
    },
  });
}

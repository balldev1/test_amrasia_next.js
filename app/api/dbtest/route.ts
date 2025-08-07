import dbConnect from "@/lib/mongodb";

export async function GET(request: any) {
  try {
    await dbConnect();
    return new Response(
      JSON.stringify({ message: "MongoDB connected successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        message: "MongoDB connection failed",
        error: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

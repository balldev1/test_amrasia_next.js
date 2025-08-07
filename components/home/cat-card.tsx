"use client";

import { useState, useEffect } from "react";

type Cat = { imageId: string; path: string };
type Comment = {
  _id: string;
  comment: string;
  createdAt: string;
  userId: { username: string };
};

export default function CatCard() {
  const [cat, setCat] = useState<Cat | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loadingCat, setLoadingCat] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [error, setError] = useState("");

  // ดึงรูปแมว
  async function fetchRandomCat() {
    setLoadingCat(true);
    setError("");
    try {
      const res = await fetch("/api/cat/random", {
        cache: "no-store",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to load cat image");
      const data = await res.json();
      setCat(data);
      fetchComments(data.imageId); // ดึงคอมเมนต์ของรูปนี้ด้วย
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoadingCat(false);
    }
  }

  // ดึงคอมเมนต์ของรูปปัจจุบัน
  async function fetchComments(imageId: string) {
    setLoadingComments(true);
    try {
      const res = await fetch(`/api/comments?imageId=${imageId}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to load comments");
      const data = await res.json();
      setComments(data);
    } catch (err: any) {
      setError(err.message || "Unknown error loading comments");
    } finally {
      setLoadingComments(false);
    }
  }

  // เพิ่มคอมเมนต์ใหม่
  async function handleAddComment() {
    if (!newComment.trim() || !cat) return;

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageId: cat.imageId,
          comment: newComment.trim(),
        }),
      });
      if (!res.ok) throw new Error("Failed to add comment");
      const savedComment = await res.json();
      setComments((prev) => [savedComment, ...prev]); // เพิ่มขึ้นบนสุด
      setNewComment("");
    } catch (err: any) {
      setError(err.message || "Unknown error adding comment");
    }
  }

  // โหลดรูปแมวตอนเริ่ม
  useEffect(() => {
    fetchRandomCat();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-6 p-4">
      {loadingCat && <p>Loading cat image...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {cat && (
        <>
          <img
            src={cat.path}
            alt="Random Cat"
            className="max-w-xs rounded-lg shadow-lg"
            width={400}
            height={400}
          />

          <button
            className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={fetchRandomCat}
            disabled={loadingCat}
          >
            เปลี่ยนรูป
          </button>

          <div className="w-full max-w-md">
            <h3 className="text-lg font-semibold mb-2">Comments</h3>
            <textarea
              rows={3}
              className="w-full p-2 border rounded mb-2"
              placeholder="เพิ่มคอมเมนต์..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              className="bg-green-600 cursor-pointer text-white px-4 py-2 rounded hover:bg-green-700 mb-4"
              onClick={handleAddComment}
              disabled={newComment.trim() === ""}
            >
              เพิ่มคอมเมนต์
            </button>

            {loadingComments && <p>Loading comments...</p>}

            {!loadingComments && comments.length === 0 && (
              <p className="italic">ยังไม่มีคอมเมนต์</p>
            )}

            <ul className="space-y-3 max-h-64 overflow-y-auto">
              {comments.map((c) => (
                <li
                  key={c._id}
                  className="border p-2 rounded bg-gray-50 shadow-sm"
                >
                  <p className="text-sm text-black">{c.comment}</p>
                  <p className="text-xs text-gray-500">
                    โดย: {c.userId?.username || "ไม่ทราบชื่อ"} |{" "}
                    {new Date(c.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

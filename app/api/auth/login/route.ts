import axios from "axios";
import { NextResponse } from "next/server";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://doorrite-api.onrender.com/api/v1";
// const isProd = process.env.NODE_ENV === "production";

export async function POST(req: Request) {
  const body = await req.json();

  const apiRes = await axios.post(`${API_BASE}/admin/login`, body, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });

  const backendCookies = apiRes.headers["set-cookie"];
  const res = NextResponse.json(apiRes.data, { status: apiRes.status });

  if (backendCookies) {
    backendCookies.forEach((c) => {
      // Directly set the full raw cookie string
      res.headers.append("set-cookie", c);
    });
  }

  return res;
}

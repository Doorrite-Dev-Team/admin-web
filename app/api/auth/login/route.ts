import axios from "axios";
import { NextResponse } from "next/server";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://doorrite-api.onrender.com/api/v1";

// POST /api/auth/login
export async function POST(req: Request) {
  const body = await req.json();

  try {
    // Use centralized axios instance (respects NEXT_PUBLIC_API_URL / baseURL)
    const apiRes = await axios.post(`${API_BASE}/admin/login`, body, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    console.log(1);

    const backendCookies = apiRes.headers["set-cookie"];
    const res = NextResponse.json(apiRes.data, { status: apiRes.status });
    console.log(2);
    if (backendCookies) {
      backendCookies.forEach((c: string) => {
        // Pass backend cookies through to the client
        res.headers.append("set-cookie", c);
      });
    }
    console.log(3);
    return res;
  } catch (err) {
    // err is unknown by default in TS; cast to a narrow interface to access properties safely
    type ErrLike = {
      code?: string | number;
      message?: string;
      response?: { status?: number; data?: unknown };
    };
    const anyErr = err as ErrLike;
    const code = anyErr?.code || anyErr?.response?.status;

    // Backend not reachable
    if (
      code === "ECONNREFUSED" ||
      String(anyErr?.message || "").includes("ECONNREFUSED") ||
      String(anyErr?.message || "").includes("connect ECONNREFUSED")
    ) {
      return NextResponse.json(
        {
          error:
            "Backend service unreachable. Please ensure the API server is running.",
        },
        { status: 502 },
      );
    }

    // If backend returned a response, forward its status and message
    if (anyErr?.response) {
      const status = anyErr.response.status || 500;
      const data = anyErr.response.data || { error: anyErr.message };
      return NextResponse.json(data, { status });
    }

    // Fallback generic error
    const message = anyErr?.message || "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

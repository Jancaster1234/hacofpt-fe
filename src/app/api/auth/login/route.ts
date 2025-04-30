// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
  // Các trường khác nếu có từ backend
}

interface LoginRequest {
  username: string;
  password: string;
}

export async function POST(req: Request) {
  try {
    // Parse request body từ client
    const { email, password } = await req.json();

    // Chuyển đổi email thành username nếu cần
    const username = email; // hoặc logic chuyển đổi phù hợp

    // Gọi API login thực từ backend
    const backendResponse = await fetch(`${process.env.BACKEND_API_URL}/api/v1/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password
      } as LoginRequest)
    });

    // Kiểm tra response từ backend
    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return NextResponse.json(
        {
          error: errorData.message || "Invalid credentials",
          errorCode: errorData.errorCode || "AUTH_FAILED"
        },
        { status: backendResponse.status }
      );
    }

    // Parse dữ liệu từ backend
    const authData: LoginResponse = await backendResponse.json();

    // Kiểm tra refresh token
    if (!authData.refreshToken) {
      return NextResponse.json(
        { error: "Failed to generate refresh token", errorCode: "TOKEN_GENERATION_FAILED" },
        { status: 500 }
      );
    }

    // Tạo response và set cookie
    const res = NextResponse.json(authData);
    res.cookies.set("refreshToken", authData.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: authData.expiresIn || 86400, // 1 ngày nếu không có expiresIn
      sameSite: "strict"
    });

    // Có thể set thêm access token nếu cần
    res.cookies.set("accessToken", authData.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: authData.expiresIn || 3600, // 1 giờ nếu không có expiresIn
      sameSite: "strict"
    });

    return res;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error", errorCode: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
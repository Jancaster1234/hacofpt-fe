// src/app/api/notifications/user/[userId]/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: { userId: string } }
) {
  // Wait for the params to be resolved
  const { userId } = await context.params;

  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("Unauthorized request - missing or invalid auth header");
      return NextResponse.json(
        { error: "Unauthorized", errorCode: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    const url = `${process.env.NEXT_PUBLIC_API_URL}/communication-service/api/v1/notifications/user/${userId}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        {
          error: { message: error.message || "Failed to fetch notifications" },
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
}

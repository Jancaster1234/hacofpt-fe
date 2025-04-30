import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const code = url.searchParams.get("code");

        if (!code) {
            return NextResponse.json(
                { error: "No code provided" },
                { status: 400 }
            );
        }

        // Send code to backend
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/identity-service/api/v1/auth/outbound/authentication?code=${code}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
            }
        );

        if (!response.ok) {
            const error = await response.json();
            console.error("Backend error:", error);
            return NextResponse.json(error, { status: response.status });
        }

        const res = await response.json();

        // Check if user needs to create password
        const myInfoResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/identity-service/api/v1/users/my-info`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${res.data.token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        const resMyInfo = await myInfoResponse.json();
        if (resMyInfo?.code === 1000 && resMyInfo?.data?.noPassword == true) {
            // If password doesn't exist, redirect to create password page
            const script = `
                <script>
                    localStorage.setItem('accessToken', '${res?.data?.token}');
                    window.location.href = '/create-password';
                </script>
            `;
            return new NextResponse(script, {
                headers: { 'Content-Type': 'text/html' },
            });
        }
        // Store token in localStorage
        const script = `
            <script>
                localStorage.setItem('accessToken', '${res.data.token}');
                window.location.href = '/';
            </script>
        `;
        return new NextResponse(script, {
            headers: { 'Content-Type': 'text/html' },
        });

    } catch (error) {
        console.error("Authentication error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
} 
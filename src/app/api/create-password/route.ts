// src/app/api/create-password/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { token, password } = await request.json();

        if (!token) {
            return NextResponse.json(
                { message: 'Invalid token' },
                { status: 400 }
            );
        }

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/identity-service/api/v1/users/create-password`,
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    data: {
                        password: password
                    }
                }),
            }
        );

        if (!response.ok) {
            const error = await response.json();
            return NextResponse.json(
                { message: error.message || 'Failed to create password' },
                { status: response.status }
            );
        }

        return NextResponse.json(
            { message: 'Password created successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Create password error:', error);
        return NextResponse.json(
            { message: 'Failed to create password' },
            { status: 500 }
        );
    }
} 
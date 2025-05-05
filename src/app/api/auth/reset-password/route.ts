// src/app/api/auth/reset-password/route.ts
import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, otp, newPassword, confirmPassword } = body;

        if (!email || !otp || !newPassword || !confirmPassword) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        if (newPassword.length < 3) {
            return NextResponse.json(
                { error: 'Password must have at least 3 characters' },
                { status: 400 }
            );
        }

        if (newPassword !== confirmPassword) {
            return NextResponse.json(
                { error: 'Passwords do not match' },
                { status: 400 }
            );
        }

        const response = await fetch(`${API_URL}/identity-service/api/v1/users/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                data: {
                    email,
                    otp,
                    newPassword,
                    confirmPassword,
                },
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            return NextResponse.json(
                { error: error || 'Failed to reset password' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Error in reset password:', error);
        return NextResponse.json(
            { error: 'Failed to process reset password request' },
            { status: 500 }
        );
    }
} 
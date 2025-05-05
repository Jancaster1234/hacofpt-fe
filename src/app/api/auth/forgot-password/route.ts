// src/app/api/auth/forgot-password/route.ts
import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        const response = await fetch(`${API_URL}/identity-service/api/v1/users/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: { email } }),
        });

        if (!response.ok) {
            const error = await response.json();
            return NextResponse.json(
                { error: error || 'Failed to process forgot password request' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Error in forgot password:', error);
        return NextResponse.json(
            { error: 'Failed to process forgot password request' },
            { status: 500 }
        );
    }
} 
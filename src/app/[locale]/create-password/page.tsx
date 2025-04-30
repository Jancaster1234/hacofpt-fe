/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import CreatePasswordForm from './_components/CreatePasswordForm';

export default function CreatePasswordPage() {
    return (
        <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                    Create Password
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Please create a password for your account
                </p>
            </div>

            <CreatePasswordForm />
        </div>
    );
} 
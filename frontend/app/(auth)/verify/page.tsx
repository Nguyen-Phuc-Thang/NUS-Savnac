'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function VerifyPage() {
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const router = useRouter();
    const [code, setCode] = useState("");

    const handleVerify = async () => {
        if (!code) {
            alert("Please enter the verification code.");
            return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                code: code,
            }),
        });

        if (response.ok) {
            alert("Account verified successfully! Please log in.");
            router.replace("/login");
        } else {
            alert("Invalid verification code. Please try again.");
        }
    }

    return (
        <div className="flex flex-col width-full min-h-screen items-center justify-center gap-4">
            <div className='font-heading text-4xl font-bold'>Verify Your Account</div>
            <div className='font-sans text-muted-foreground mt-4'>
                A verification code has been sent to your email: <span className="font-medium">{email}</span>. Please enter the code below to verify your account.
            </div>
            <div className="w-full max-w-sm">
                <Input
                    type="text"
                    placeholder="Enter verification code"
                    className="w-full max-w-sm font-sans h-12 border border-input focus-visible:ring-2 focus-visible:ring-secondary focus-visible:outline-none focus-visible:border-secondary"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />
            </div>
            <Button className="w-full max-w-sm mt-3 font-sans text-md h-12 hover:bg-secondary" onClick={handleVerify}>
                Verify Account
            </Button>
        </div>
    );
}
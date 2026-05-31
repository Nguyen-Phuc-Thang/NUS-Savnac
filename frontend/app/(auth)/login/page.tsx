"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";


export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Form signals states
    const [emailEmpty, setEmailEmpty] = useState(false);
    const [passwordEmpty, setPasswordEmpty] = useState(false);

    const handleLogin = async () => {
        if (!email) {
            setEmailEmpty(true);
        } else {
            setEmailEmpty(false);
        }

        if (!password) {
            setPasswordEmpty(true);
        } else {
            setPasswordEmpty(false);
        }

        if (!email || !password) {
            return;
        }

        console.log("Logging in user with email:", email);
        const response = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (response?.error) {
            alert("Invalid email or password. Please try again.");
        }

        if (response?.ok) {
            alert("Login successfully!");
            router.replace("/dashboard");
        }
    }


    return (
        <div className="flex flex-col width-full min-h-screen items-center justify-center gap-4">
            <div className='font-heading text-4xl font-bold'>Greetings from <span className="text-primary">NUS</span> <span className="text-secondary">Savnac</span>!</div>
            <button className="w-full max-w-sm mt-5 font-sans text-md h-12 flex items-center justify-center border border-input rounded hover:bg-primary hover:text-white">
                <img src="/microsoft-logo.png" alt="Microsoft Logo" width={20} height={20} className="inline-block mr-2" />
                Continue with Microsoft
            </button>
            <div className="flex w-full max-w-sm items-center gap-3 mt-4">
                <div className="h-px flex-1 bg-border"></div>
                <span className="text-xs font-sans font-medium tracking-[0.2em] text-muted-foreground">OR</span>
                <div className="h-px flex-1 bg-border"></div>
            </div>
            <div className='font-sans text-muted-foreground mt-4'>
                Login with your email and password
            </div>
            <Field className="w-full max-w-sm">
                <FieldLabel className="font-sans text-lg">Email</FieldLabel>
                <Input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full max-w-sm font-sans h-12 border border-input focus-visible:ring-2 focus-visible:ring-secondary focus-visible:outline-none focus-visible:border-secondary"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <FieldDescription className={'font-sans text-xs text-muted-foreground ' + (emailEmpty ? 'text-red-500' : '') + ' ml-3'}>
                    {emailEmpty ? 'Email is required' : ''}
                </FieldDescription>
            </Field>

            <Field className="w-full max-w-sm">
                <FieldLabel className="font-sans text-lg">Password</FieldLabel>
                <Input
                    type="password"
                    placeholder="Enter your password"
                    className="w-full max-w-sm font-sans h-12 border border-input focus-visible:ring-2 focus-visible:ring-secondary focus-visible:outline-none focus-visible:border-secondary"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <FieldDescription className={'font-sans text-xs text-muted-foreground ' + (passwordEmpty ? 'text-red-500' : '') + ' ml-3'}>
                    {passwordEmpty ? 'Password is required' : ''}
                </FieldDescription>
            </Field>
            <Button className="w-full max-w-sm mt-3 font-sans text-md h-12 hover:bg-secondary" onClick={handleLogin}>
                Login
            </Button>
            <div className="text-sm text-muted-foreground font-sans mt-2">
                Don't have an account? <a href="/register" className="text-primary hover:underline hover:text-secondary">Create one</a>
            </div>
        </div>
    )
}
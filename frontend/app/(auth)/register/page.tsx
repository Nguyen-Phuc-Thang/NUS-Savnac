"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


export default function RegisterPage() {
    const router = useRouter();
    const [conditionMatches, setConditionMatches] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        specialChar: false,
    });

    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    // Form signals states
    const [emailAlreadyExists, setEmailAlreadyExists] = useState(false);
    const [displayNameEmpty, setDisplayNameEmpty] = useState(false);
    const [emailEmpty, setEmailEmpty] = useState(false);
    const [passwordEmpty, setPasswordEmpty] = useState(false);
    const [nusEmailRequired, setNusEmailRequired] = useState(false);

    const handleRegister = async () => {

        if (!displayName) {
            setDisplayNameEmpty(true);
            return;
        } else {
            setDisplayNameEmpty(false);
        }

        if (!email) {
            setEmailEmpty(true);
            return;
        } else {
            setEmailEmpty(false);
        }

        if (email && !email.endsWith("@u.nus.edu")) {
            setNusEmailRequired(true);
            return;
        } else {
            setNusEmailRequired(false);
        }

        const isValid = Object.values(conditionMatches).every((match) => match);
        if (!isValid) {
            alert("Please ensure your password meets all the requirements.");
            return;
        }

        console.log("Registering user with email:", email);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: displayName,
                email: email,
                password: password,
            }),
        });

        if (response.ok) {
            router.push("/verify?email=" + email);
        } else if (response.status === 500) {
            setEmailAlreadyExists(true);
        }
    }

    useEffect(() => {
        setConditionMatches({
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        });
    }, [password]);

    return (
        <div className="flex flex-col width-full min-h-screen items-center justify-center gap-4">
            <div className='h-20'></div>
            <div className='font-heading text-4xl font-bold'>Create a <span className="text-primary">new</span> <span className="text-secondary">account</span></div>
            <div className='font-sans text-muted-foreground mt-4'>
                Filling in your details below
            </div>

            <Field className="w-full max-w-sm">
                <FieldLabel className="font-sans text-lg">Display Name</FieldLabel>
                <Input
                    type="text"
                    placeholder="Enter your display name"
                    className="w-full max-w-sm font-sans h-12 border border-input focus-visible:ring-2 focus-visible:ring-secondary focus-visible:outline-none focus-visible:border-secondary"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                />
                <FieldDescription className={'font-sans text-xs text-muted-foreground ' + (displayNameEmpty ? 'text-red-500' : '') + ' ml-3'}>
                    {displayNameEmpty ? 'Display name is required' : ''}
                </FieldDescription>
            </Field>

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
                <FieldDescription className={'font-sans text-xs text-muted-foreground ' + (nusEmailRequired ? 'text-red-500' : '') + ' ml-3'}>
                    {nusEmailRequired ? 'Please use your NUS email address' : ''}
                </FieldDescription>
                <FieldDescription className={'font-sans text-xs text-muted-foreground ' + (emailAlreadyExists ? 'text-red-500' : '') + ' ml-3'}>
                    {emailAlreadyExists ? 'This email already exists' : ''}
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
                <FieldDescription className={'font-sans text-xs text-muted-foreground ' + (conditionMatches.length ? 'text-[#56A85F]' : '') + ' ml-3'}>
                    Must be at least 8 characters long
                </FieldDescription>
                <FieldDescription className={'font-sans text-xs text-muted-foreground ' + (conditionMatches.uppercase ? 'text-[#56A85F]' : '') + ' ml-3'}>
                    Must contain at least one uppercase letter
                </FieldDescription>
                <FieldDescription className={'font-sans text-xs text-muted-foreground ' + (conditionMatches.lowercase ? 'text-[#56A85F]' : '') + ' ml-3'}>
                    Must contain at least one lowercase letter
                </FieldDescription>
                <FieldDescription className={'font-sans text-xs text-muted-foreground ' + (conditionMatches.number ? 'text-[#56A85F]' : '') + ' ml-3'}>
                    Must contain at least one number
                </FieldDescription>
                <FieldDescription className={'font-sans text-xs text-muted-foreground ' + (conditionMatches.specialChar ? 'text-[#56A85F]' : '') + ' ml-3'}>
                    Must contain at least one special character
                </FieldDescription>
            </Field>
            <Button className="w-full max-w-sm mt-3 font-sans text-md h-12 hover:bg-secondary" onClick={handleRegister}>
                Register
            </Button>
            <div className="text-sm text-muted-foreground font-sans mt-2">
                Already have an account? <a href="/login" className="text-primary hover:underline hover:text-secondary">Login</a>
            </div>
            <div className='h-20'></div>
        </div>
    )
}
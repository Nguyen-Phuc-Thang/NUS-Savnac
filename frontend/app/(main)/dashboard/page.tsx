"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { toast } from "sonner";

export default function DashboardPage() {
    const { data: session } = useSession();

    useEffect(() => {
        toast.success("Welcome back " + session?.user?.name + "!");
    }, []);

    return (
        <div className="flex flex-col width-full min-h-screen gap-4">
            <div className="font-heading text-4xl font-bold">Dashboard</div>
        </div>
    );
}
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";



export default function SchedulerPage() {
    const { data: session } = useSession();

    const [events, setEvents] = useState([]);

    useEffect(() => {
        if (!session?.user?.id) {
            return;
        }

    }, [session?.user?.id]);

    return (
        <div className="flex flex-col width-full min-h-screen gap-4 ml-6 mt-6">
            <div className="font-heading text-4xl font-bold">Scheduler</div>
            <div>
            </div>

            <div className='flex flex-row'>
                <div>

                </div>
                <div>

                </div>

                <div>

                </div>
            </div>
        </div>
    );
}
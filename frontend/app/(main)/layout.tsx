import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/app-sidebar";

export default async function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(
        authOptions
    );

    if (!session) {
        redirect("/login");
    }

    return (
        <TooltipProvider>
            <SidebarProvider>
                <AppSidebar
                    uid={session.user?.id ?? ""}
                    displayName={session.user?.name ?? "User"}
                    email={session.user?.email ?? ""}
                />
                <main className="flex min-h-svh flex-1 flex-col font-sans">
                    <header className="flex h-14 items-center gap-2 border-b border-border/60 px-4">
                        <SidebarTrigger className="shrink-0" />
                    </header>
                    <div className="flex-1 p-4 font-sans">
                        {children}
                    </div>
                </main>
            </SidebarProvider>
        </TooltipProvider>
    )
}
"use client"

import Link from "next/link"
import { signOut } from "next-auth/react"
import { usePathname } from "next/navigation"
import {
    CalendarRange,
    LayoutDashboard,
    ListTodo,
    LogOut,
    Settings,
    TimerReset,
    UserRound,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"

interface AppSidebarProps {
    uid: string
    displayName: string
    email: string
}

const navigationItems = [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Scheduler", href: "/scheduler", icon: CalendarRange },
    { title: "Task", href: "/task", icon: ListTodo },
    { title: "Pomodoro", href: "/pomodoro", icon: TimerReset },
]

function getInitials(displayName: string, email: string) {
    const nameParts = displayName.trim().split(/\s+/).filter(Boolean)

    if (nameParts.length >= 2) {
        return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
    }

    if (nameParts.length === 1) {
        return nameParts[0].slice(0, 2).toUpperCase()
    }

    return email.slice(0, 2).toUpperCase()
}

export function AppSidebar({ uid, displayName, email }: AppSidebarProps) {
    const pathname = usePathname()
    const initials = getInitials(displayName, email)

    return (
        <Sidebar collapsible="icon" className="font-sans">
            <SidebarHeader className="border-b border-sidebar-border/60 font-sans">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="h-auto w-full rounded-xl px-3 py-3 text-left"
                            data-user-id={uid}
                        >
                            <div className="flex items-start gap-3">
                                <Avatar className="size-9 border border-sidebar-border bg-sidebar-accent text-sidebar-accent-foreground">
                                    <AvatarFallback className="bg-transparent text-xs font-semibold text-inherit">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0 flex-1">
                                    <div className="truncate text-sm font-semibold text-sidebar-foreground font-sans">
                                        {displayName}
                                    </div>
                                    <div className="truncate text-xs text-sidebar-foreground/70 font-sans">
                                        {email}
                                    </div>
                                </div>
                            </div>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" align="start" sideOffset={8} className="w-56">
                        <DropdownMenuLabel className="flex flex-col gap-0.5 font-sans">
                            <span className="text-sm font-medium text-foreground">{displayName}</span>
                            <span className="truncate text-xs font-normal text-muted-foreground">{email}</span>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/profile" className="flex w-full items-center gap-2 font-sans">
                                <UserRound className="size-4" />
                                <span>Profile</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="gap-2 text-destructive focus:text-destructive font-sans"
                            onSelect={(event) => {
                                event.preventDefault()
                                void signOut({ callbackUrl: "/login" })
                            }}
                        >
                            <LogOut className="size-4" />
                            <span>Logout</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarHeader>

            <SidebarContent className="font-sans">
                <SidebarGroup className="font-sans">
                    <SidebarMenu>
                        {navigationItems.map((item) => {
                            const Icon = item.icon
                            const isActive = pathname === item.href

                            return (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                                        <Link href={item.href}>
                                            <Icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-sidebar-border/60 font-sans">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Settings">
                            <Link href="/settings">
                                <Settings />
                                <span>Settings</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}

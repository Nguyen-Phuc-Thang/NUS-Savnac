import type { Metadata } from "next";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export const metadata: Metadata = {
  title: "NUS Savnac",
  description: "A website for Orbital 26",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col">
        <SidebarProvider>
          <AppSidebar />
          <main className="flex-1">
            {children}
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}

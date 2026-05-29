import type { Metadata } from "next";
import "../globals.css";


export const metadata: Metadata = {
    title: "NUS Savnac",
    description: "A website for Orbital 26",
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <div>
            {children}
        </div>
    );
}

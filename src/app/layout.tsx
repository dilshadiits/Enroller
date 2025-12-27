import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Enroller - Lead Management System",
    description: "Manage course admissions, track leads, and handle agent commissions",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                {/* Google Fonts removed for offline compatibility */}
            </head>
            <body suppressHydrationWarning>
                {children}
            </body>
        </html>
    );
}

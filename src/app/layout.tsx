import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Enroller - Lead Management System",
    description: "Manage course admissions, track leads, and handle agent commissions",
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
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

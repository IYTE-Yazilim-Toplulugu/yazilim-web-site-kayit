import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import React from "react";
import { ThemeProvider } from "next-themes";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["300", "400", "600", "700"],
    variable: "--font-poppins",
});

export const metadata: Metadata = {
    title: "IZTECH Yazilim Society",
    description: "Software for Everyone",
};



export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${poppins.variable} antialiased selection:bg-bite-tongue selection:text-primary-foreground`}
            >
                <ThemeProvider defaultTheme="dark">
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}

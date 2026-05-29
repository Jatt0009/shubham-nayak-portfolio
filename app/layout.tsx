import type { Metadata } from "next";
import "./globals.css";
import ClientRootBoundary from "@/components/ClientRootBoundary";
import CustomCursor from "@/components/CustomCursor";
import SmoothEntrance from "@/components/SmoothEntrance";

export const metadata: Metadata = {
  title: "Shubham Nayak | UI/UX Designer",
  description: "Premium UI/UX Designer portfolio showcasing high-end experiences, dynamic animations, and thoughtful product design.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=cabinet-grotesk@400,500,700&f[]=satoshi@400,500,700,900&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-background text-foreground antialiased selection:bg-accent/30">
        <ClientRootBoundary>
          <CustomCursor />
          <SmoothEntrance>{children}</SmoothEntrance>
        </ClientRootBoundary>
      </body>
    </html>
  );
}
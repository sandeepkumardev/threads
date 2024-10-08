import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Topbar from "@/components/shared/Topbar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import RightSidebar from "@/components/shared/RightSidebar";
import Bottombar from "@/components/shared/Bottombar";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Threads",
  description: "A next-gen social network",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <ClerkProvider>
          <Topbar />
          <main className="flex flex-row">
            <LeftSidebar />

            <section className="main-container">
              <div className="w-full max-x-4xl">{children}</div>
            </section>

            <RightSidebar />
          </main>
          <Bottombar />
        </ClerkProvider>
      </body>
    </html>
  );
}

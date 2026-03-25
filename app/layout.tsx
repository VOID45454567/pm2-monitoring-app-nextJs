import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PM2 Monitor",
  description: "Monitor your PM2 processes and test results",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-gray-900 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">PM2 Monitor</h1>
            <div className="space-x-4">
              <a href="/" className="hover:text-gray-300">
                Processes
              </a>
              <a href="/tests" className="hover:text-gray-300">
                Tests
              </a>
            </div>
          </div>
        </nav>
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}

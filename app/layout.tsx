import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SurveyProvider } from "@/context/SurveyContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Research Survey",
  description: "Study on Task Approaches and Learning Experiences with Modern Generative Tools",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SurveyProvider>
          <div className="min-h-screen bg-apple-gray-50">
            {/* Top Bar */}
            <header className="apple-card rounded-none border-x-0 border-t-0 py-6 px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto">
                <h1 className="apple-heading-4">
                  Group 6
                </h1>
              </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
              {children}
            </main>
          </div>
        </SurveyProvider>
      </body>
    </html>
  );
}

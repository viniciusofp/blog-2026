import BlogHeader from "@/components/blog/BlogHeader";
import SubscribeFooter from "@/components/blog/SubscribeFooter";
import Footer from "@/components/Footer";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Hanken_Grotesk } from "next/font/google";
import React from "react";
import "./styles.css";

export const metadata = {
  description: "A blank template using Payload in a Next.js app.",
  title: "Payload Blank Template",
};

const geist = Hanken_Grotesk({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-sans",
});

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props;

  return (
    <html lang="en" className={geist.className}>
      <body>
        <TooltipProvider>
          <main className="mx-auto my-8 max-w-xl px-6 lg:max-w-2xl">
            <BlogHeader />
            {children}
            <SubscribeFooter />
            <Footer />
          </main>
        </TooltipProvider>
      </body>
    </html>
  );
}

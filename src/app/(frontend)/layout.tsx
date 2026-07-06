import BlogHeader from "@/components/blog/BlogHeader";
import SubscribeFooter from "@/components/blog/SubscribeFooter";
import Footer from "@/components/Footer";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Cormorant_Garamond, Hanken_Grotesk } from "next/font/google";
import React from "react";
import "./styles.css";
import { WebVitals } from "@/components/WebVitals";
import GoogleAnalytics from "@/components/GoogleAnalytics";

// export const metadata = {
//   description: "A blank template using Payload in a Next.js app.",
//   title: "Payload Blank Template",
// };

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-sans",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-serif",
});

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props;

  return (
    <html lang="en" className={`${hanken.variable} ${cormorant.variable}`}>
      <body className="font-sans">
        <TooltipProvider>
          <main className="mx-auto my-8 max-w-xl px-6 lg:max-w-3xl">
            <BlogHeader />
            {children}
            <SubscribeFooter />
            <Footer />
            {/* Google Analytics - @next/third-parties optimized - loads after hydration */}
            <GoogleAnalytics />
            {/* Core Web Vitals Tracking */}
            <WebVitals />
          </main>
        </TooltipProvider>
      </body>
    </html>
  );
}

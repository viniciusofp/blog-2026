import React from "react";
import "./styles.css";
import { Hanken_Grotesk } from "next/font/google";
import BlogHeader from "@/components/blog/BlogHeader";
import SubscribeFooter from "@/components/blog/SubscribeFooter";
import Link from "next/link";

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
        <main>{children}</main>
      </body>
    </html>
  );
}

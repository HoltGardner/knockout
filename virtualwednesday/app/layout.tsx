import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Overture from "@/components/Overture";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VirtualWednesday",
  description: "A new kind of virtual experience, for everyone. Feel heard.",
  metadataBase: new URL("https://virtualwednesday.com"),
  openGraph: {
    title: "VirtualWednesday",
    description: "A new kind of virtual experience, for everyone. Feel heard.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f4f3f0",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={geist.variable}>
      <body>
        <Overture />
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}

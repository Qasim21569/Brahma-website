import type { Metadata } from "next";
import { Newsreader, Manrope } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { ScrollRevealProvider } from "@/components/providers/ScrollRevealProvider";

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Brahma Group | Architectural Integrity in Hospitality Investment",
  description:
    "Brahma Group is a hospitality investment group handling acquisition, management, and operations across the full lifecycle of a hotel asset.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${manrope.variable} scroll-smooth`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body-md text-body-md antialiased">
        <SmoothScrollProvider>
          <ScrollRevealProvider>
            {children}
          </ScrollRevealProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}

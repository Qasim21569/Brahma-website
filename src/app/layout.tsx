import type { Metadata } from "next";
import { Newsreader, Manrope } from "next/font/google";
import { MotionConfig } from "motion/react";
import Intro from "@/components/Intro";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

const SITE_NAME = "Brahmas Management and Investment Group";
const SITE_DESCRIPTION =
  "Brahmas Management and Investment Group (BMIG) is a hospitality investment group handling acquisition, management, and operations across the full lifecycle of a hotel asset.";
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

const SHARE_IMAGE = {
  url: "/web-app-manifest-512x512.png",
  width: 512,
  height: 512,
  alt: "BRAHMAS Management and Investment Group",
} as const;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "BRAHMAS",
  title: {
    default: `${SITE_NAME} | BMIG`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Brahmas",
    "BMIG",
    "hospitality investment",
    "hotel acquisitions",
    "Florida hotels",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "business",
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    title: "BRAHMAS",
    statusBarStyle: "default",
  },
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [SHARE_IMAGE],
  },
  twitter: {
    card: "summary",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [SHARE_IMAGE.url],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${manrope.variable} dark`}
      data-intro="skip"
      suppressHydrationWarning
    >
      <head>
        {/*
          ── INTRO BOOT ──
          Runs before paint. Decides play vs skip, owns the scroll lock and the
          two JS timers (release / done), handles click/key skip. Motion is 100%
          CSS; this only flips `data-intro` on <html>.

          ⚠️ Timers MUST match the CSS delays in globals.css — the full schedule
          is documented there. release tR=7150ms, done tD=8000ms.

          Note the two escape hatches, both of which matter at this length:
            · sessionStorage 'brahma:intro-played' — plays once per session
            · prefers-reduced-motion — skips entirely, never plays
            · any pointerdown/keydown skips to a 450ms exit
        */}
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var d=document.documentElement,KEY='brahma:intro-played',played=false,reduce=false;try{played=sessionStorage.getItem(KEY)==='1'}catch(e){}try{reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){}if(played||reduce){d.setAttribute('data-intro','skip');return}d.setAttribute('data-intro','play');d.setAttribute('data-intro-lock','');if('scrollRestoration' in history)history.scrollRestoration='manual';try{window.scrollTo(0,0)}catch(e){}var tR=7150,tD=8000,released=false,done=false,timerR,timerD;function fire(n){try{document.dispatchEvent(new Event(n))}catch(e){}}function release(){if(released)return;released=true;d.setAttribute('data-intro-released','');fire('brahma:intro-release')}function cleanup(){document.removeEventListener('pointerdown',onSkip);document.removeEventListener('keydown',onSkip)}function finish(){if(done)return;done=true;release();d.setAttribute('data-intro','done');d.removeAttribute('data-intro-lock');try{sessionStorage.setItem(KEY,'1')}catch(e){}fire('brahma:intro-done');cleanup()}function onSkip(){if(done)return;d.setAttribute('data-intro','exit');clearTimeout(timerR);clearTimeout(timerD);release();setTimeout(finish,460)}timerR=setTimeout(release,tR);timerD=setTimeout(finish,tD);document.addEventListener('pointerdown',onSkip);document.addEventListener('keydown',onSkip)}catch(e){try{document.documentElement.setAttribute('data-intro','skip')}catch(_){}}})();`,
          }}
        />
      </head>
      <body className="font-body-md text-body-md antialiased">
        <Intro />
        <MotionConfig reducedMotion="user">
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </MotionConfig>
      </body>
    </html>
  );
}

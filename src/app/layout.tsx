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
  weight: ["400", "500", "700"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Brahmas Management and Investment Group | BMIG",
  description:
    "Brahmas Management and Investment Group (BMIG) is a hospitality investment group handling acquisition, management, and operations across the full lifecycle of a hotel asset.",
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
          CSS; this only flips `data-intro` on <html>. Timers MUST match the CSS
          delays in globals.css:  release tR=2500ms, done tD=3350ms.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var d=document.documentElement,KEY='brahma:intro-played',played=false,reduce=false;try{played=sessionStorage.getItem(KEY)==='1'}catch(e){}try{reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){}if(played||reduce){d.setAttribute('data-intro','skip');return}d.setAttribute('data-intro','play');d.setAttribute('data-intro-lock','');if('scrollRestoration' in history)history.scrollRestoration='manual';try{window.scrollTo(0,0)}catch(e){}var tR=2500,tD=3350,released=false,done=false,timerR,timerD;function fire(n){try{document.dispatchEvent(new Event(n))}catch(e){}}function release(){if(released)return;released=true;d.setAttribute('data-intro-released','');fire('brahma:intro-release')}function cleanup(){document.removeEventListener('pointerdown',onSkip);document.removeEventListener('keydown',onSkip)}function finish(){if(done)return;done=true;release();d.setAttribute('data-intro','done');d.removeAttribute('data-intro-lock');try{sessionStorage.setItem(KEY,'1')}catch(e){}fire('brahma:intro-done');cleanup()}function onSkip(){if(done)return;d.setAttribute('data-intro','exit');clearTimeout(timerR);clearTimeout(timerD);release();setTimeout(finish,460)}timerR=setTimeout(release,tR);timerD=setTimeout(finish,tD);document.addEventListener('pointerdown',onSkip);document.addEventListener('keydown',onSkip)}catch(e){try{document.documentElement.setAttribute('data-intro','skip')}catch(_){}}})();`,
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

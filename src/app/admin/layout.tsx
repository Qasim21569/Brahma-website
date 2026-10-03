import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · BRAHMAS Admin" },
  robots: { index: false, follow: false },
};

/**
 * Admin root. Deliberately plain: no intro curtain, no Lenis, no motion — those
 * live in the (site) layout. Light surface, readable type, nothing animated.
 */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-container-low font-sans text-[15px] text-primary antialiased">
      {children}
    </div>
  );
}

import type { Metadata, Viewport } from "next";
import BottomNav from "@/components/BottomNav";
import DisclaimerModal from "@/components/DisclaimerModal";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "離乳食チェック",
    template: "%s | 離乳食チェック",
  },
  description: "離乳食のアレルギーチェックを、時期に合わせて順番に記録できるアプリ",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fffaf3" },
    { media: "(prefers-color-scheme: dark)", color: "#1d1a17" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-full">
        <main className="mx-auto w-full max-w-md px-4 pt-6 pb-[calc(5rem+env(safe-area-inset-bottom))]">
          {children}
        </main>
        <BottomNav />
        <DisclaimerModal />
      </body>
    </html>
  );
}

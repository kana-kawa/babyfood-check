import type { MetadataRoute } from "next";

// ホーム画面に追加したときのアプリ名・表示のしかた
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "離乳食チェック",
    short_name: "離乳食チェック",
    description: "離乳食のアレルギーチェックを、時期に合わせて順番に記録できるアプリ",
    start_url: "/",
    display: "standalone",
    background_color: "#fffaf3",
    theme_color: "#fffaf3",
    lang: "ja",
    icons: [{ src: "/icon", sizes: "512x512", type: "image/png", purpose: "any" }],
  };
}

import type { Metadata } from "next";
import { Suspense } from "react";
import FoodList from "@/components/FoodList";

export const metadata: Metadata = { title: "食材" };

export default function Page() {
  return (
    <section>
      <h1 className="mb-4 text-2xl font-bold">食材</h1>
      {/* URL の絞り込み条件を読む部分は、ブラウザで表示するときに描画する */}
      <Suspense fallback={<p className="text-muted">読み込み中…</p>}>
        <FoodList />
      </Suspense>
    </section>
  );
}

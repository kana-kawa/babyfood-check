import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import FoodRecordSection from "@/components/FoodRecordSection";
import { AllergenBadge } from "@/components/badges";
import { foods, getFood } from "@/data/foods";
import { CATEGORY_LABELS, STAGE_LABELS, STAGE_MONTHS } from "@/types/food";

// 全食材の詳細ページをビルド時に作っておく
export function generateStaticParams() {
  return foods.map((f) => ({ id: f.id }));
}

export async function generateMetadata({ params }: PageProps<"/foods/[id]">) {
  const { id } = await params;
  return { title: getFood(id)?.name ?? "食材が見つかりません" };
}

/** 食材詳細（F-07・F-12）と記録（F-08・F-09） */
export default function Page({ params }: PageProps<"/foods/[id]">) {
  return (
    <article className="space-y-5">
      <Link href="/foods" className="text-sm text-muted">
        ‹ 食材一覧
      </Link>
      {/* URL の id を読む部分は Suspense の中に置き、画面の枠はすぐ表示できるようにする */}
      <Suspense fallback={<p className="text-muted">読み込み中…</p>}>
        <FoodDetail params={params} />
      </Suspense>
    </article>
  );
}

async function FoodDetail({ params }: { params: PageProps<"/foods/[id]">["params"] }) {
  const { id } = await params;
  const food = getFood(id);
  if (!food) notFound();
  const months = STAGE_MONTHS[food.stage];

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold">{food.name}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
          <span className="rounded-full bg-accent-soft px-3 py-1 font-bold text-accent">
            {STAGE_LABELS[food.stage]}（{months.min}ヶ月ごろ〜）
          </span>
          <span className="rounded-full border border-border bg-surface px-3 py-1">
            {CATEGORY_LABELS[food.category]}
          </span>
          <AllergenBadge allergen={food.allergen} />
        </div>
      </header>

      {food.firstTimeNote && (
        <section
          className={`rounded-2xl p-4 text-sm ${
            food.allergen === "specific" ? "bg-danger-soft" : "bg-accent-soft"
          }`}
        >
          <h2 className="font-bold">初めて与えるときの注意</h2>
          <p className="mt-1 leading-relaxed">{food.firstTimeNote}</p>
        </section>
      )}

      <section className="rounded-2xl border border-border bg-surface p-4 text-sm">
        <h2 className="font-bold">与え方のポイント</h2>
        <p className="mt-1 leading-relaxed">{food.tips}</p>
      </section>

      <FoodRecordSection foodId={food.id} />
    </div>
  );
}

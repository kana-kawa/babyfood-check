import Link from "next/link";

export default function NotFound() {
  return (
    <section className="space-y-4 text-center">
      <h1 className="text-xl font-bold">ページが見つかりません</h1>
      <Link href="/foods" className="inline-block font-bold text-accent underline">
        食材一覧へ
      </Link>
    </section>
  );
}

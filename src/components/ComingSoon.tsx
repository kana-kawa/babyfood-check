/** ステップ4で中身を作るまでの仮ページ */
export default function ComingSoon({ title }: { title: string }) {
  return (
    <section>
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="mt-4 rounded-2xl border border-border bg-surface p-6 text-center text-muted">準備中です</p>
    </section>
  )
}

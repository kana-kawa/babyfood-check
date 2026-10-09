import type { Metadata } from "next";
import ProfileForm from "@/components/ProfileForm";

export const metadata: Metadata = { title: "マイページ" };

export default function Page() {
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">マイページ</h1>

      <div>
        <h2 className="mb-2 text-lg font-bold">赤ちゃんのプロフィール</h2>
        <ProfileForm />
      </div>

      <div className="space-y-3 rounded-2xl border border-border bg-surface p-4 text-sm leading-relaxed">
        <h2 className="text-lg font-bold">記録の保存について</h2>
        <p>
          記録は<strong>このスマホのブラウザの中だけ</strong>に保存され、外部には送信されません。
          別のスマホや別のブラウザからは見られません。
        </p>
        <p>
          記録が消えないように、<strong>ホーム画面に追加して、いつもそこから開いてください</strong>。
          シークレットモードや、LINE などのアプリの中では開かないでください。
          ブラウザの「履歴とサイトデータの消去」をすると、記録も消えます。
        </p>
        <h3 className="pt-2 font-bold">ホーム画面への追加方法</h3>
        <dl className="space-y-2">
          <div>
            <dt className="font-bold">iPhone（Safari）</dt>
            <dd className="text-muted">画面下の共有ボタン（□に↑）→「ホーム画面に追加」→「追加」</dd>
          </div>
          <div>
            <dt className="font-bold">Android（Chrome）</dt>
            <dd className="text-muted">右上のメニュー（︙）→「ホーム画面に追加」→「追加」</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

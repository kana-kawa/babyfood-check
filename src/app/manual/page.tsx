import type { Metadata } from "next";

export const metadata: Metadata = { title: "アレルギー対応マニュアル" };

const levels = [
  {
    title: "すぐに 119番（救急車）",
    className: "border-danger bg-danger-soft",
    titleClass: "text-danger",
    symptoms: [
      "息が苦しそう、ゼーゼー・ヒューヒューする、せきが止まらない",
      "ぐったりしている、呼びかけへの反応が弱い、意識がぼんやりしている",
      "くちびるや顔色が青白い・紫色",
      "何度も吐く、ずっと泣き続けておなかを痛がる",
    ],
    action: "ためらわずに 119番 へ。食べた物（パッケージ）を持っていきましょう。",
  },
  {
    title: "できるだけ早く受診（その日のうちに）",
    className: "border-accent bg-accent-soft",
    titleClass: "text-accent",
    symptoms: [
      "じんましん・赤みが、口のまわりから体へ広がってきた",
      "まぶたやくちびるがはれてきた",
      "1回吐いた、下痢をした（ほかの症状はなく、元気はある）",
    ],
    action:
      "かかりつけの小児科に電話して受診しましょう。夜間・休日で受診するか迷うときは #8000 に相談を。様子が悪くなったらすぐ 119番。",
  },
  {
    title: "様子を見て、次に与える前に相談",
    className: "border-border bg-surface",
    titleClass: "",
    symptoms: ["口のまわりが少し赤くなったが、しばらくして消えた。機嫌もよく元気"],
    action:
      "アプリに「症状あり」と記録し、その食材を次に与える前に、かかりつけ医に相談しましょう。",
  },
];

/** アレルギー症状が出たときの対応マニュアル（F-11） */
export default function Page() {
  return (
    <article className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">アレルギー対応マニュアル</h1>
        <p className="mt-2 text-sm text-muted">
          症状は食べてすぐ〜2時間ほどで出ることが多く、急に悪くなることもあります。食後はしばらく様子を見てください。
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3">
        <a
          href="tel:119"
          className="flex h-16 flex-col items-center justify-center rounded-2xl bg-danger font-bold text-white"
        >
          <span className="text-xl">119</span>
          <span className="text-xs">救急車</span>
        </a>
        <a
          href="tel:%238000"
          className="flex h-16 flex-col items-center justify-center rounded-2xl bg-accent font-bold text-white"
        >
          <span className="text-xl">#8000</span>
          <span className="text-xs">子ども医療電話相談</span>
        </a>
      </div>

      {levels.map((level) => (
        <section key={level.title} className={`rounded-2xl border-2 p-4 ${level.className}`}>
          <h2 className={`text-lg font-bold ${level.titleClass}`}>{level.title}</h2>
          <p className="mt-2 text-sm font-bold">こんなとき</p>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">
            {level.symptoms.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <p className="mt-3 text-sm leading-relaxed">{level.action}</p>
        </section>
      ))}

      <section className="rounded-2xl border border-border bg-surface p-4 text-sm leading-relaxed">
        <h2 className="text-lg font-bold">#8000（子ども医療電話相談）とは</h2>
        <p className="mt-1">
          夜間や休日に、子どもの急な病気やけがについて、小児科医や看護師に電話で相談できる窓口です。
          受付時間は都道府県によって違います。
        </p>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-4 text-sm leading-relaxed">
        <h2 className="text-lg font-bold">受診のときに伝えること</h2>
        <ul className="mt-1 list-disc space-y-1 pl-5">
          <li>食べた物と量（パッケージや原材料表示があれば持参）</li>
          <li>食べた時刻と、症状が出た時刻</li>
          <li>症状の様子（写真や動画があると伝わりやすい）</li>
          <li>これまでに試した食材と結果（このアプリの記録を見せましょう）</li>
        </ul>
      </section>

      <p className="text-xs leading-relaxed text-muted">
        このアプリは医療行為の代わりになるものではありません。内容は一般的な目安です。
        かかりつけ医の指示がある場合は、そちらを優先してください。
      </p>
    </article>
  );
}

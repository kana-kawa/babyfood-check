'use client'

import { useAppData } from '@/hooks/useAppData'

/** 初回起動時の免責表示。同意すると次回からは表示しない */
export default function DisclaimerModal() {
  const { data, acceptDisclaimer } = useAppData()
  if (!data || data.disclaimerAccepted) return null

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="disclaimer-title"
        className="w-full max-w-sm rounded-2xl bg-surface p-6 shadow-lg"
      >
        <h2 id="disclaimer-title" className="text-lg font-bold">
          ご利用の前に
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed">
          <li>このアプリは医療行為の代わりになるものではありません。</li>
          <li>食べ始める時期や量は、厚生労働省「授乳・離乳の支援ガイド」をもとにした目安です。</li>
          <li>
            <strong>かかりつけ医の指示がある場合は、そちらを優先してください。</strong>
          </li>
          <li>記録はこの端末の中だけに保存され、外部には送信されません。</li>
        </ul>
        <button
          type="button"
          onClick={acceptDisclaimer}
          className="mt-6 h-12 w-full rounded-full bg-accent font-bold text-white"
        >
          同意して始める
        </button>
      </div>
    </div>
  )
}

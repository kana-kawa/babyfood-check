'use client'

import { useState, type FormEvent } from 'react'
import { todayString } from '@/lib/age'
import type { CheckResult } from '@/types/record'

export interface RecordValues {
  date: string
  result: CheckResult
  memo: string
}

const RESULTS: { value: CheckResult; label: string; activeClass: string }[] = [
  { value: 'ok', label: '食べた（問題なし）', activeClass: 'border-ok bg-ok-soft text-ok' },
  { value: 'reaction', label: 'アレルギー症状あり', activeClass: 'border-danger bg-danger-soft text-danger' },
]

/** チェック記録の入力フォーム（新規・編集で共通） */
export default function RecordForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial?: RecordValues
  submitLabel: string
  onSubmit: (values: RecordValues) => void
  onCancel?: () => void
}) {
  const [date, setDate] = useState(() => initial?.date ?? todayString())
  const [result, setResult] = useState<CheckResult>(initial?.result ?? 'ok')
  const [memo, setMemo] = useState(initial?.memo ?? '')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!date) return
    onSubmit({ date, result, memo: memo.trim() })
    if (!initial) setMemo('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label className="block text-sm">
        <span className="font-bold">日付</span>
        <input
          type="date"
          required
          value={date}
          max={todayString()}
          onChange={(e) => setDate(e.target.value)}
          className="mt-1 block h-11 w-full rounded-xl border border-border bg-surface px-3"
        />
      </label>

      <fieldset>
        <legend className="text-sm font-bold">結果</legend>
        <div className="mt-1 grid grid-cols-2 gap-2">
          {RESULTS.map((r) => (
            <label
              key={r.value}
              className={`flex h-12 cursor-pointer items-center justify-center rounded-xl border-2 text-sm font-bold ${
                result === r.value ? r.activeClass : 'border-border text-muted'
              }`}
            >
              <input
                type="radio"
                name="result"
                value={r.value}
                checked={result === r.value}
                onChange={() => setResult(r.value)}
                className="sr-only"
              />
              {r.label}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="block text-sm">
        <span className="font-bold">メモ</span>
        <span className="ml-1 text-muted">（量・症状など）</span>
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          rows={2}
          placeholder="例：小さじ1。食後30分で口のまわりが少し赤くなった"
          className="mt-1 block w-full rounded-xl border border-border bg-surface px-3 py-2"
        />
      </label>

      <div className="flex gap-2">
        {onCancel && (
          <button type="button" onClick={onCancel} className="h-12 flex-1 rounded-full border border-border font-bold">
            やめる
          </button>
        )}
        <button type="submit" className="h-12 flex-1 rounded-full bg-accent font-bold text-white">
          {submitLabel}
        </button>
      </div>
    </form>
  )
}

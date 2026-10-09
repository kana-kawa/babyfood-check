'use client'

import { useState } from 'react'
import { stepwiseFoods } from '@/data/foods'
import { formatDate } from '@/lib/format'
import type { AppData, CheckRecord } from '@/types/record'
import { StatusBadge } from './badges'
import RecordForm from './RecordForm'

type HistoryItem =
  | { kind: 'check'; record: CheckRecord }
  | { kind: 'stepwise'; id: string; date: string; result: CheckRecord['result']; stepLabel: string }

/** 1つの食材の記録の履歴。新しい順に表示し、編集・削除できる（F-09） */
export default function RecordHistory({
  foodId,
  data,
  onUpdate,
  onDelete,
  onDeleteStepwise,
}: {
  foodId: string
  data: AppData
  onUpdate: (record: CheckRecord) => void
  onDelete: (id: string) => void
  onDeleteStepwise: (id: string) => void
}) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [confirmingId, setConfirmingId] = useState<string | null>(null)

  const items: HistoryItem[] = [
    ...data.records.filter((r) => r.foodId === foodId).map((record) => ({ kind: 'check' as const, record })),
    ...data.stepwiseRecords.flatMap((r) => {
      const sw = stepwiseFoods.find((s) => s.id === r.stepwiseId)
      const step = sw?.steps[r.stepIndex]
      if (!sw || !step || step.foodId !== foodId) return []
      return [
        {
          kind: 'stepwise' as const,
          id: r.id,
          date: r.date,
          result: r.result,
          stepLabel: `${sw.name} ステップ${r.stepIndex + 1}：${step.label} ${step.amount}`,
        },
      ]
    }),
  ]
  // 新しい日付が上。同じ日なら後から記録したものが上
  const sorted = items
    .map((item, i) => ({ item, i }))
    .sort((a, b) => dateOf(b.item).localeCompare(dateOf(a.item)) || b.i - a.i)
    .map(({ item }) => item)

  if (sorted.length === 0) {
    return <p className="text-sm text-muted">まだ記録はありません</p>
  }

  return (
    <div>
      <h3 className="font-bold">これまでの記録</h3>
      <ul className="mt-2 space-y-2">
        {sorted.map((item) => {
          const id = item.kind === 'check' ? item.record.id : item.id
          const result = item.kind === 'check' ? item.record.result : item.result

          if (item.kind === 'check' && editingId === id) {
            return (
              <li key={id} className="rounded-2xl border-2 border-accent bg-surface p-4">
                <RecordForm
                  initial={item.record}
                  submitLabel="保存する"
                  onSubmit={(values) => {
                    onUpdate({ ...item.record, ...values })
                    setEditingId(null)
                  }}
                  onCancel={() => setEditingId(null)}
                />
              </li>
            )
          }

          return (
            <li key={id} className="rounded-2xl border border-border bg-surface p-4 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold">{formatDate(dateOf(item))}</span>
                <StatusBadge status={result} />
              </div>
              {item.kind === 'stepwise' && <p className="mt-1 text-muted">{item.stepLabel}</p>}
              {item.kind === 'check' && item.record.memo && (
                <p className="mt-1 whitespace-pre-wrap">{item.record.memo}</p>
              )}

              {confirmingId === id ? (
                <div className="mt-3 flex items-center gap-2">
                  <span className="flex-1 font-bold text-danger">この記録を削除しますか？</span>
                  <button
                    type="button"
                    onClick={() => setConfirmingId(null)}
                    className="h-9 rounded-full border border-border px-4"
                  >
                    いいえ
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (item.kind === 'check') onDelete(id)
                      else onDeleteStepwise(id)
                      setConfirmingId(null)
                    }}
                    className="h-9 rounded-full bg-danger px-4 font-bold text-white"
                  >
                    はい
                  </button>
                </div>
              ) : (
                <div className="mt-2 flex justify-end gap-4 text-muted">
                  {item.kind === 'check' && (
                    <button type="button" onClick={() => setEditingId(id)} className="underline">
                      編集
                    </button>
                  )}
                  <button type="button" onClick={() => setConfirmingId(id)} className="underline">
                    削除
                  </button>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function dateOf(item: HistoryItem): string {
  return item.kind === 'check' ? item.record.date : item.date
}

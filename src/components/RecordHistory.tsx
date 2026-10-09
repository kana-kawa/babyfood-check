'use client'

import { useState } from 'react'
import { stepwiseFoods } from '@/data/foods'
import { formatDate } from '@/lib/format'
import type { AppData, CheckRecord, StepwiseRecord } from '@/types/record'
import { StatusBadge } from './badges'
import RecordForm from './RecordForm'

type HistoryItem =
  | { kind: 'check'; record: CheckRecord }
  | { kind: 'stepwise'; record: StepwiseRecord; stepLabel: string }

/** 1つの食材の記録の履歴。新しい順に表示し、編集・削除できる（F-09） */
export default function RecordHistory({
  foodId,
  data,
  onUpdate,
  onDelete,
  onUpdateStepwise,
  onDeleteStepwise,
}: {
  foodId: string
  data: AppData
  onUpdate: (record: CheckRecord) => void
  onDelete: (id: string) => void
  onUpdateStepwise: (record: StepwiseRecord) => void
  onDeleteStepwise: (id: string) => void
}) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [confirmingId, setConfirmingId] = useState<string | null>(null)

  const items: HistoryItem[] = [
    ...data.records.filter((r) => r.foodId === foodId).map((record) => ({ kind: 'check' as const, record })),
    ...data.stepwiseRecords.flatMap((record) => {
      const sw = stepwiseFoods.find((s) => s.id === record.stepwiseId)
      const step = sw?.steps[record.stepIndex]
      if (!sw || !step || step.foodId !== foodId) return []
      const stepLabel = `${sw.name} ステップ${record.stepIndex + 1}：${step.label} ${step.amount}`
      return [{ kind: 'stepwise' as const, record, stepLabel }]
    }),
  ]
  // 新しい日付が上。同じ日なら後から記録したものが上
  const sorted = items
    .map((item, i) => ({ item, i }))
    .sort((a, b) => b.item.record.date.localeCompare(a.item.record.date) || b.i - a.i)
    .map(({ item }) => item)

  if (sorted.length === 0) {
    return <p className="text-sm text-muted">まだ記録はありません</p>
  }

  return (
    <div>
      <h3 className="font-bold">これまでの記録</h3>
      <ul className="mt-2 space-y-2">
        {sorted.map((item) => {
          const { record } = item

          if (editingId === record.id) {
            return (
              <li key={record.id} className="rounded-2xl border-2 border-accent bg-surface p-4">
                {item.kind === 'stepwise' && <p className="mb-3 text-sm text-muted">{item.stepLabel}</p>}
                <RecordForm
                  initial={record}
                  submitLabel="保存する"
                  onSubmit={(values) => {
                    if (item.kind === 'check') onUpdate({ ...item.record, ...values })
                    else onUpdateStepwise({ ...item.record, ...values })
                    setEditingId(null)
                  }}
                  onCancel={() => setEditingId(null)}
                />
              </li>
            )
          }

          return (
            <li key={record.id} className="rounded-2xl border border-border bg-surface p-4 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold">{formatDate(record.date)}</span>
                <StatusBadge status={record.result} />
              </div>
              {item.kind === 'stepwise' && <p className="mt-1 text-muted">{item.stepLabel}</p>}
              {record.memo && <p className="mt-1 whitespace-pre-wrap">{record.memo}</p>}

              {confirmingId === record.id ? (
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
                      if (item.kind === 'check') onDelete(record.id)
                      else onDeleteStepwise(record.id)
                      setConfirmingId(null)
                    }}
                    className="h-9 rounded-full bg-danger px-4 font-bold text-white"
                  >
                    はい
                  </button>
                </div>
              ) : (
                <div className="mt-2 flex justify-end gap-4 text-muted">
                  <button type="button" onClick={() => setEditingId(record.id)} className="underline">
                    編集
                  </button>
                  <button type="button" onClick={() => setConfirmingId(record.id)} className="underline">
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

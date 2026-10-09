'use client'

import Link from 'next/link'
import { useState } from 'react'
import { formatDate, formatDaysAgo } from '@/lib/format'
import { stepwiseState } from '@/lib/stepwise'
import { STAGE_LABELS, STAGE_MONTHS, type Stage, type StepwiseFood } from '@/types/food'
import type { CheckResult, StepwiseRecord } from '@/types/record'
import RecordForm, { type RecordValues } from './RecordForm'

/** 卵・乳製品・小麦の段階の進み具合と、その場での記録（F-01b） */
export default function StepwiseCard({
  sw,
  records,
  stage,
  today,
  onRecord,
}: {
  sw: StepwiseFood
  records: StepwiseRecord[]
  stage: Stage | null
  today: string
  onRecord: (stepIndex: number, values: RecordValues) => void
}) {
  const [justRecorded, setJustRecorded] = useState<CheckResult | null>(null)
  const state = stepwiseState(sw, records, stage, today)
  const total = sw.steps.length

  const record = (stepIndex: number, values: RecordValues) => {
    onRecord(stepIndex, values)
    setJustRecorded(values.result)
  }

  const last =
    'lastDate' in state && state.lastDate && state.daysSince !== undefined
      ? `前回 ${formatDate(state.lastDate)}（${formatDaysAgo(state.daysSince)}）`
      : null

  const doneCount =
    state.kind === 'completed' ? total : state.kind === 'in-progress' ? state.nextIndex : state.kind === 'reaction' ? state.stepIndex : 0

  return (
    <section className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="font-bold">{sw.name}</h3>
        <span className="text-xs text-muted">
          {doneCount}/{total} ステップ
        </span>
      </div>
      <div className="mt-2 flex gap-1" aria-hidden>
        {sw.steps.map((_, i) => (
          <span key={i} className={`h-1.5 flex-1 rounded-full ${i < doneCount ? 'bg-accent' : 'bg-border'}`} />
        ))}
      </div>

      {state.kind === 'not-yet' && (
        <p className="mt-3 text-sm text-muted">
          {STAGE_LABELS[state.startStage]}（{STAGE_MONTHS[state.startStage].min}ヶ月ごろ）から始めます
        </p>
      )}

      {state.kind === 'completed' && (
        <p className="mt-3 text-sm">
          すべてのステップが終わりました 🎉 {last && <span className="text-muted">{last}</span>}
        </p>
      )}

      {state.kind === 'reaction' && (
        <div className="mt-3 space-y-3 text-sm">
          <div className="rounded-xl bg-danger-soft p-3 text-danger">
            <p className="font-bold">
              {formatDate(state.lastDate)}（{formatDaysAgo(state.daysSince)}）に症状が出ました
            </p>
            <p className="mt-1">先に進める前に、かかりつけ医に相談してください。</p>
            <Link href="/manual" className="mt-2 inline-block font-bold underline">
              症状が出たときの対応を見る
            </Link>
          </div>
          <p className="text-muted">
            医師と相談して同じ量（{sw.steps[state.stepIndex].label} {sw.steps[state.stepIndex].amount}）で再開したら記録してください。
          </p>
          <StepRecorder key={`${state.kind}-${state.stepIndex}`} onSubmit={(values) => record(state.stepIndex, values)} />
        </div>
      )}

      {state.kind === 'in-progress' && (
        <div className="mt-3 space-y-3 text-sm">
          <p>
            <span className="text-muted">次：</span>
            <span className="font-bold">
              {sw.steps[state.nextIndex].label} {sw.steps[state.nextIndex].amount}
            </span>
          </p>
          {last && <p className="text-muted">{last}</p>}
          {state.lockedUntil ? (
            <p className="rounded-xl bg-background p-3 text-muted">
              {STAGE_LABELS[state.lockedUntil]}（{STAGE_MONTHS[state.lockedUntil].min}ヶ月ごろ）になったら進めます
            </p>
          ) : state.daysUntilNext > 0 ? (
            <p className="rounded-xl bg-background p-3 text-muted">
              あと <span className="font-bold text-foreground">{state.daysUntilNext}日</span> あけてから進めましょう
            </p>
          ) : (
            <StepRecorder
              key={`${state.kind}-${state.nextIndex}`}
              onSubmit={(values) => record(state.nextIndex, values)}
            />
          )}
        </div>
      )}

      {justRecorded === 'ok' && <p className="mt-3 text-sm font-bold text-ok">記録しました</p>}
      {justRecorded === 'reaction' && state.kind !== 'reaction' && (
        <p className="mt-3 text-sm font-bold text-danger">記録しました</p>
      )}
    </section>
  )
}

/** 「記録する」を押すと、日付・結果・メモの入力欄が開く */
function StepRecorder({ onSubmit }: { onSubmit: (values: RecordValues) => void }) {
  const [open, setOpen] = useState(false)
  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="h-11 w-full rounded-full bg-accent text-sm font-bold text-white"
      >
        このステップを記録する
      </button>
    )
  }
  return (
    <div className="rounded-xl border border-border p-3">
      <RecordForm
        submitLabel="記録する"
        onSubmit={(values) => {
          onSubmit(values)
          setOpen(false)
        }}
        onCancel={() => setOpen(false)}
      />
    </div>
  )
}

'use client'

import Link from 'next/link'
import { useState } from 'react'
import { getFood, stepwiseFoods } from '@/data/foods'
import { useAppData } from '@/hooks/useAppData'
import { ageInMonths, isStageAvailable, stageForMonths, todayString } from '@/lib/age'
import { foodStatus } from '@/lib/progress'
import { STAGE_LABELS } from '@/types/food'
import { StatusBadge } from './badges'
import RecordForm from './RecordForm'
import RecordHistory from './RecordHistory'
import StepwiseCard from './StepwiseCard'

/** 食材詳細ページの記録部分（F-08・F-09） */
export default function FoodRecordSection({ foodId }: { foodId: string }) {
  const app = useAppData()
  const [saved, setSaved] = useState(false)
  const food = getFood(foodId)
  if (!food) return null
  if (!app.data) return <p className="text-muted">読み込み中…</p>

  const { data } = app
  const today = todayString()
  const stage = data.profile ? stageForMonths(ageInMonths(data.profile.birthDate, today)) : null
  const info = foodStatus(foodId, data)
  const sw = stepwiseFoods.find((s) => s.id === food.stepwiseId)

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-bold">記録</h2>
        <StatusBadge status={info.status} />
      </div>

      {info.status === 'reaction' ? (
        <div className="rounded-2xl bg-danger-soft p-4 text-sm text-danger">
          <p className="font-bold">アレルギー症状が記録されています</p>
          <p className="mt-1">次に与える前に、かかりつけ医に相談してください。</p>
          <Link href="/manual" className="mt-2 inline-block font-bold underline">
            症状が出たときの対応を見る
          </Link>
        </div>
      ) : (
        info.hadReaction && (
          <p className="rounded-xl bg-accent-soft p-3 text-sm">過去に症状が出たことがあります。様子をよく見てください。</p>
        )
      )}

      {data.profile && !isStageAvailable(food.stage, stage) && (
        <p className="rounded-xl bg-background p-3 text-sm text-muted">
          この食材は{STAGE_LABELS[food.stage]}からの食材です。
        </p>
      )}

      {sw ? (
        <>
          <p className="text-sm text-muted">
            {food.name}は「{sw.name}」として、少しずつ量を増やしながら記録します。
          </p>
          <StepwiseCard
            sw={sw}
            records={data.stepwiseRecords}
            stage={stage}
            today={today}
            onRecord={(stepIndex, result) =>
              app.addStepwiseRecord({ stepwiseId: sw.id, stepIndex, date: today, result, memo: '' })
            }
          />
        </>
      ) : (
        <div className="rounded-2xl border border-border bg-surface p-4">
          <RecordForm
            submitLabel="記録する"
            onSubmit={(values) => {
              app.addRecord({ foodId, ...values })
              setSaved(true)
            }}
          />
          {saved && <p className="mt-3 text-sm font-bold text-ok">記録しました</p>}
        </div>
      )}

      <RecordHistory
        foodId={foodId}
        data={data}
        onUpdate={app.updateRecord}
        onDelete={app.deleteRecord}
        onDeleteStepwise={app.deleteStepwiseRecord}
      />
    </section>
  )
}

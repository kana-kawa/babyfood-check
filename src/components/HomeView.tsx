'use client'

import Link from 'next/link'
import { stepwiseFoods } from '@/data/foods'
import { useAppData } from '@/hooks/useAppData'
import { ageInMonths, stageForMonths, todayString } from '@/lib/age'
import { isWeekdayMorning } from '@/lib/format'
import { stageProgress } from '@/lib/progress'
import { recommend } from '@/lib/recommend'
import { CATEGORY_LABELS, STAGE_LABELS, STAGE_MONTHS } from '@/types/food'
import { AllergenBadge } from './badges'
import ProgressBar from './ProgressBar'
import StepwiseCard from './StepwiseCard'

/** トップページ（F-01・F-01b・F-02） */
export default function HomeView() {
  const { data, addStepwiseRecord } = useAppData()
  if (!data) return <p className="text-muted">読み込み中…</p>

  if (!data.profile) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-bold">ようこそ</h1>
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p>まずは赤ちゃんのプロフィールを登録しましょう。月齢に合わせて、次に試す食材をご案内します。</p>
          <Link
            href="/profile"
            className="mt-4 flex h-12 items-center justify-center rounded-full bg-accent font-bold text-white"
          >
            プロフィールを登録する
          </Link>
        </div>
      </section>
    )
  }

  const today = todayString()
  const months = ageInMonths(data.profile.birthDate, today)
  const stage = stageForMonths(months)
  const rec = recommend(data, stage, today)
  const progress = stageProgress(data)

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm text-muted">{data.profile.nickname}</p>
        <h1 className="text-2xl font-bold">
          {months >= 0 ? `${months}ヶ月` : 'まもなく誕生'}
          <span className="ml-2 text-base font-normal text-muted">
            {stage ? `離乳食 ${STAGE_LABELS[stage]}` : '離乳食開始前'}
          </span>
        </h1>
      </header>

      <section>
        <h2 className="text-lg font-bold">今日の新しい食材</h2>
        {stage === null ? (
          <p className="mt-2 rounded-2xl border border-border bg-surface p-4 text-sm">
            離乳食は {STAGE_MONTHS.early.min}〜{STAGE_MONTHS.early.max}ヶ月ごろから始めます。始める時期は、赤ちゃんの様子を見てかかりつけ医とも相談しましょう。
          </p>
        ) : rec.kind === 'tried-today' ? (
          <div className="mt-2 rounded-2xl border border-border bg-surface p-4 text-sm">
            <p>
              今日は
              {rec.foods.map((f, i) => (
                <span key={f.id}>
                  {i > 0 && '・'}
                  <Link href={`/foods/${f.id}`} className="font-bold text-accent underline">
                    {f.name}
                  </Link>
                </span>
              ))}
              を試しました。
            </p>
            <p className="mt-1 text-muted">新しい食材は1日1種類までにして、また明日試しましょう。</p>
          </div>
        ) : rec.foods.length === 0 ? (
          <p className="mt-2 rounded-2xl border border-border bg-surface p-4 text-sm">
            今の時期の食材はすべてチェックしました 🎉
          </p>
        ) : (
          <>
            <p className="mt-1 text-sm text-muted">どちらか1つを選んで試しましょう</p>
            <ul className="mt-2 grid grid-cols-2 gap-3">
              {rec.foods.map((f) => (
                <li key={f.id}>
                  <Link
                    href={`/foods/${f.id}`}
                    className="flex h-full flex-col gap-1 rounded-2xl border-2 border-accent-soft bg-surface p-4"
                  >
                    <span className="text-lg font-bold">{f.name}</span>
                    <span className="text-xs text-muted">{CATEGORY_LABELS[f.category]}</span>
                    <AllergenBadge allergen={f.allergen} />
                    <span className="mt-auto pt-2 text-sm font-bold text-accent">詳しく見る ›</span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
        {stage !== null && <TimingNotice />}
      </section>

      <section>
        <h2 className="text-lg font-bold">少しずつ量を増やす食材</h2>
        <p className="mt-1 text-sm text-muted">ほかの食材と並行して、日をあけながら進めます</p>
        <div className="mt-2 space-y-3">
          {stepwiseFoods.map((sw) => (
            <StepwiseCard
              key={sw.id}
              sw={sw}
              records={data.stepwiseRecords}
              stage={stage}
              today={today}
              onRecord={(stepIndex, result) =>
                addStepwiseRecord({ stepwiseId: sw.id, stepIndex, date: today, result, memo: '' })
              }
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold">チェックの進み具合</h2>
        <div className="mt-2 space-y-3 rounded-2xl border border-border bg-surface p-4">
          {progress.map((p) => (
            <ProgressBar
              key={p.stage}
              label={p.stage === 'all' ? '全体' : STAGE_LABELS[p.stage]}
              checked={p.checked}
              total={p.total}
              emphasized={p.stage === 'all' || p.stage === stage}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

/** 新しい食材は平日の午前中に（要件 3.1-6） */
function TimingNotice() {
  const good = isWeekdayMorning()
  return (
    <p
      className={`mt-3 rounded-xl p-3 text-sm ${
        good ? 'bg-background text-muted' : 'bg-accent-soft font-bold text-foreground'
      }`}
    >
      {good
        ? '新しい食材は、すぐ受診できる平日の午前中に試しましょう。'
        : '今は土日か午後です。新しい食材は、すぐ受診できる平日の午前中に試すのがおすすめです。'}
    </p>
  )
}

import { daysBetween, isStageAvailable } from '@/lib/age'
import type { Stage, StepwiseFood } from '@/types/food'
import type { StepwiseRecord } from '@/types/record'

export type StepwiseState =
  /** まだ着手できる時期ではない */
  | { kind: 'not-yet'; startStage: Stage }
  /** 最後の記録が「症状あり」。進めずに受診・相談をうながす */
  | { kind: 'reaction'; stepIndex: number; lastDate: string; daysSince: number }
  | {
      kind: 'in-progress'
      /** 次に試すステップ */
      nextIndex: number
      lastDate?: string
      daysSince?: number
      /** 次のステップに進めるまであと何日か（0 なら今日進める） */
      daysUntilNext: number
      /** 次のステップの時期にまだ達していなければ、その時期 */
      lockedUntil?: Stage
    }
  | { kind: 'completed'; lastDate: string; daysSince: number }

/** 段階食材の今の状態を、記録から求める（F-01b） */
export function stepwiseState(
  sw: StepwiseFood,
  records: StepwiseRecord[],
  currentStage: Stage | null,
  today: string,
): StepwiseState {
  const own = records.filter((r) => r.stepwiseId === sw.id)
  if (own.length === 0 && !isStageAvailable(sw.stage, currentStage)) {
    return { kind: 'not-yet', startStage: sw.stage }
  }

  const lastDate = own.reduce<string | undefined>((max, r) => (!max || r.date > max ? r.date : max), undefined)
  const daysSince = lastDate ? daysBetween(lastDate, today) : undefined

  // 一番新しい日に「症状あり」があれば止める
  const lastReaction = own.find((r) => r.date === lastDate && r.result === 'reaction')
  if (lastReaction && lastDate && daysSince !== undefined) {
    return { kind: 'reaction', stepIndex: lastReaction.stepIndex, lastDate, daysSince }
  }

  const ok = own.filter((r) => r.result === 'ok')
  const done = Math.max(-1, ...ok.map((r) => r.stepIndex))
  if (done >= sw.steps.length - 1 && lastDate && daysSince !== undefined) {
    return { kind: 'completed', lastDate, daysSince }
  }

  const nextIndex = done + 1
  let daysUntilNext = 0
  if (done >= 0) {
    const doneDate = ok.filter((r) => r.stepIndex === done).reduce((max, r) => (r.date > max ? r.date : max), '')
    daysUntilNext = Math.max(0, sw.steps[done].minDaysBeforeNext - daysBetween(doneDate, today))
  }
  const nextStage = sw.steps[nextIndex].fromStage ?? sw.stage
  return {
    kind: 'in-progress',
    nextIndex,
    lastDate,
    daysSince,
    daysUntilNext,
    lockedUntil: isStageAvailable(nextStage, currentStage) ? undefined : nextStage,
  }
}

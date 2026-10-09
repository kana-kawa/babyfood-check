import { STAGES, STAGE_MONTHS, type Stage } from '@/types/food'

function parseDate(s: string): { y: number; m: number; d: number } {
  const [y, m, d] = s.split('-').map(Number)
  return { y, m, d }
}

function daysInMonth(y: number, m: number): number {
  return new Date(y, m, 0).getDate()
}

/**
 * 満の月齢。月末生まれは、その月に同じ日がなければ月末日で1ヶ月とみなす（例: 1/31 生まれ → 2/28 で1ヶ月）。
 * 生まれる前の日付なら負の数を返す。
 */
export function ageInMonths(birthDate: string, today: string): number {
  const b = parseDate(birthDate)
  const t = parseDate(today)
  let months = (t.y - b.y) * 12 + (t.m - b.m)
  const isMonthEnd = t.d === daysInMonth(t.y, t.m)
  if (t.d < b.d && !isMonthEnd) months -= 1
  return months
}

/** 月齢から時期区分を求める。離乳食開始前（5ヶ月未満）は null、18ヶ月を過ぎても完了期 */
export function stageForMonths(months: number): Stage | null {
  if (months < STAGE_MONTHS.early.min) return null
  for (const stage of STAGES) {
    if (months <= STAGE_MONTHS[stage].max) return stage
  }
  return 'complete'
}

/** その食材の時期が、今の時期で食べられるか */
export function isStageAvailable(foodStage: Stage, currentStage: Stage | null): boolean {
  if (currentStage === null) return false
  return STAGES.indexOf(foodStage) <= STAGES.indexOf(currentStage)
}

/** 端末の日付（今日）を YYYY-MM-DD で返す */
export function todayString(now: Date = new Date()): string {
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

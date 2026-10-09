import { foods } from '@/data/foods'
import { isStageAvailable } from '@/lib/age'
import { buildStatusMap } from '@/lib/progress'
import { STAGES, type Food, type Stage } from '@/types/food'
import type { AppData } from '@/types/record'

export type Recommendation =
  /** 今日すでに新しい食材を試した（1日1種類） */
  | { kind: 'tried-today'; foods: Food[] }
  /** 次に試す食材の候補（この時期の食材をすべて試していれば空） */
  | { kind: 'candidates'; foods: Food[] }

/** 今日はじめて記録した食材（段階食材は別枠なので除く） */
function foodsFirstTriedOn(today: string, data: AppData): Food[] {
  const firstDate = new Map<string, string>()
  for (const r of data.records) {
    const d = firstDate.get(r.foodId)
    if (!d || r.date < d) firstDate.set(r.foodId, r.date)
  }
  return foods.filter((f) => !f.stepwiseId && firstDate.get(f.id) === today)
}

/** 「次に試す食材」の候補を求める（要件定義書 3.1） */
export function recommend(data: AppData, currentStage: Stage | null, today: string, count = 2): Recommendation {
  const triedToday = foodsFirstTriedOn(today, data)
  if (triedToday.length > 0) return { kind: 'tried-today', foods: triedToday }

  const statuses = buildStatusMap(data)
  const candidates = foods
    .filter(
      (f) =>
        !f.stepwiseId &&
        isStageAvailable(f.stage, currentStage) &&
        statuses.get(f.id)?.status === 'unchecked',
    )
    .sort((a, b) => STAGES.indexOf(a.stage) - STAGES.indexOf(b.stage) || a.priority - b.priority)
  return { kind: 'candidates', foods: candidates.slice(0, count) }
}

import { foods, stepwiseFoods } from '@/data/foods'
import { STAGES, type Food, type Stage } from '@/types/food'
import type { AppData, CheckResult } from '@/types/record'

export type FoodStatus = 'unchecked' | 'ok' | 'reaction'

export interface FoodStatusInfo {
  status: FoodStatus
  /** 過去に一度でも「症状あり」の記録がある */
  hadReaction: boolean
  lastDate?: string
}

interface Entry {
  date: string
  result: CheckResult
}

/** 食材ごとの記録（通常の記録＋段階食材の記録）を集める */
function entriesByFood(data: AppData): Map<string, Entry[]> {
  const map = new Map<string, Entry[]>()
  const push = (foodId: string, entry: Entry) => {
    const list = map.get(foodId)
    if (list) list.push(entry)
    else map.set(foodId, [entry])
  }
  for (const r of data.records) push(r.foodId, r)
  for (const r of data.stepwiseRecords) {
    const step = stepwiseFoods.find((s) => s.id === r.stepwiseId)?.steps[r.stepIndex]
    if (step) push(step.foodId, r)
  }
  return map
}

function toStatusInfo(entries: Entry[] | undefined): FoodStatusInfo {
  if (!entries || entries.length === 0) return { status: 'unchecked', hadReaction: false }
  const lastDate = entries.reduce((max, e) => (e.date > max ? e.date : max), entries[0].date)
  // 一番新しい日の結果で決める。同じ日に「症状あり」があれば、安全のため症状ありを優先
  const latest = entries.filter((e) => e.date === lastDate)
  return {
    status: latest.some((e) => e.result === 'reaction') ? 'reaction' : 'ok',
    hadReaction: entries.some((e) => e.result === 'reaction'),
    lastDate,
  }
}

/** 全食材のチェック状況をまとめて求める */
export function buildStatusMap(data: AppData): Map<string, FoodStatusInfo> {
  const entries = entriesByFood(data)
  return new Map(foods.map((f) => [f.id, toStatusInfo(entries.get(f.id))]))
}

export function foodStatus(foodId: string, data: AppData): FoodStatusInfo {
  return toStatusInfo(entriesByFood(data).get(foodId))
}

export interface StageProgress {
  stage: Stage | 'all'
  checked: number
  total: number
}

/** 時期ごと・全体の「チェック済み／品目数」（F-02） */
export function stageProgress(data: AppData): StageProgress[] {
  const statuses = buildStatusMap(data)
  const count = (list: Food[]) => ({
    checked: list.filter((f) => statuses.get(f.id)?.status !== 'unchecked').length,
    total: list.length,
  })
  return [
    ...STAGES.map((stage) => ({ stage, ...count(foods.filter((f) => f.stage === stage)) })),
    { stage: 'all' as const, ...count(foods) },
  ]
}

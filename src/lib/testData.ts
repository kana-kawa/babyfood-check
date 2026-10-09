import { createInitialData } from '@/lib/storage'
import type { StepwiseId } from '@/types/food'
import type { AppData, CheckRecord, CheckResult, StepwiseRecord } from '@/types/record'

// テスト用に記録データを手軽に作るための関数

let seq = 0

export function rec(foodId: string, date: string, result: CheckResult = 'ok'): CheckRecord {
  return { id: `r${++seq}`, foodId, date, result, memo: '' }
}

export function step(
  stepwiseId: StepwiseId,
  stepIndex: number,
  date: string,
  result: CheckResult = 'ok',
): StepwiseRecord {
  return { id: `s${++seq}`, stepwiseId, stepIndex, date, result, memo: '' }
}

export function makeData(records: CheckRecord[] = [], stepwiseRecords: StepwiseRecord[] = []): AppData {
  return { ...createInitialData(), records, stepwiseRecords }
}

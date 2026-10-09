import type { StepwiseId } from './food'

export interface Profile {
  /** 名前（ニックネーム可） */
  nickname: string
  /** 生年月日 YYYY-MM-DD */
  birthDate: string
}

/** ok = 食べた（問題なし）、reaction = アレルギー症状あり */
export type CheckResult = 'ok' | 'reaction'

export interface CheckRecord {
  id: string
  foodId: string
  /** YYYY-MM-DD */
  date: string
  result: CheckResult
  memo: string
}

/** 卵・乳製品・小麦の段階ごとの記録 */
export interface StepwiseRecord {
  id: string
  stepwiseId: StepwiseId
  /** stepwise.json の steps の何番目か（0 から） */
  stepIndex: number
  /** YYYY-MM-DD */
  date: string
  result: CheckResult
  memo: string
}

export interface AppData {
  version: 1
  profile: Profile | null
  records: CheckRecord[]
  stepwiseRecords: StepwiseRecord[]
  /** 初回起動時の免責表示に同意したか */
  disclaimerAccepted: boolean
}

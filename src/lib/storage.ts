import type { AppData, CheckRecord, Profile, StepwiseRecord } from '@/types/record'
import { STEPWISE_IDS } from '@/types/food'

export const STORAGE_KEY = 'babyfood-check:v1'

export function createInitialData(): AppData {
  return { version: 1, profile: null, records: [], stepwiseRecords: [], disclaimerAccepted: false }
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function isResult(v: unknown): boolean {
  return v === 'ok' || v === 'reaction'
}

function isProfile(v: unknown): v is Profile {
  return isObject(v) && typeof v.nickname === 'string' && typeof v.birthDate === 'string' && DATE_RE.test(v.birthDate)
}

function isCheckRecord(v: unknown): v is CheckRecord {
  return (
    isObject(v) &&
    typeof v.id === 'string' &&
    typeof v.foodId === 'string' &&
    typeof v.date === 'string' &&
    DATE_RE.test(v.date) &&
    isResult(v.result) &&
    typeof v.memo === 'string'
  )
}

function isStepwiseRecord(v: unknown): v is StepwiseRecord {
  return (
    isObject(v) &&
    typeof v.id === 'string' &&
    (STEPWISE_IDS as readonly unknown[]).includes(v.stepwiseId) &&
    Number.isInteger(v.stepIndex) &&
    (v.stepIndex as number) >= 0 &&
    typeof v.date === 'string' &&
    DATE_RE.test(v.date) &&
    isResult(v.result) &&
    typeof v.memo === 'string'
  )
}

/** 保存された文字列を AppData に戻す。壊れている部分は捨て、読めないときは初期値を返す */
export function parseAppData(raw: string | null): AppData {
  if (!raw) return createInitialData()
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return createInitialData()
  }
  if (!isObject(parsed) || parsed.version !== 1) return createInitialData()
  return {
    version: 1,
    profile: isProfile(parsed.profile) ? parsed.profile : null,
    records: Array.isArray(parsed.records) ? parsed.records.filter(isCheckRecord) : [],
    stepwiseRecords: Array.isArray(parsed.stepwiseRecords) ? parsed.stepwiseRecords.filter(isStepwiseRecord) : [],
    disclaimerAccepted: parsed.disclaimerAccepted === true,
  }
}

// localStorage が使えない環境（プライベートモード・容量オーバーなど）では、開いている間だけメモリに持つ
let memoryRaw: string | null = null
let useMemory = false

export function readRaw(): string | null {
  if (useMemory) return memoryRaw
  try {
    return window.localStorage.getItem(STORAGE_KEY)
  } catch {
    return memoryRaw
  }
}

function writeRaw(raw: string): void {
  memoryRaw = raw
  try {
    window.localStorage.setItem(STORAGE_KEY, raw)
  } catch {
    useMemory = true
  }
}

export function loadAppData(): AppData {
  return parseAppData(readRaw())
}

export function saveAppData(data: AppData): void {
  writeRaw(JSON.stringify(data))
}

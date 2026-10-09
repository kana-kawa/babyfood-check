'use client'

import { useCallback, useSyncExternalStore } from 'react'
import { STORAGE_KEY, parseAppData, readRaw, saveAppData } from '@/lib/storage'
import type { AppData, CheckRecord, Profile, StepwiseRecord } from '@/types/record'

const CHANGE_EVENT = 'babyfood-check:change'

// 同じ文字列なら同じオブジェクトを返す（useSyncExternalStore が無限に再描画しないように）
let cachedRaw: string | null | undefined
let cachedData: AppData

function getSnapshot(): AppData {
  const raw = readRaw()
  if (raw !== cachedRaw) {
    cachedRaw = raw
    cachedData = parseAppData(raw)
  }
  return cachedData
}

// サーバー側の描画では端末のデータを読めないので「読み込み中」として null を返す
function getServerSnapshot(): AppData | null {
  return null
}

function subscribe(onChange: () => void): () => void {
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) onChange()
  }
  window.addEventListener(CHANGE_EVENT, onChange)
  window.addEventListener('storage', onStorage) // 別のタブでの変更
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange)
    window.removeEventListener('storage', onStorage)
  }
}

function update(fn: (data: AppData) => AppData): void {
  saveAppData(fn(getSnapshot()))
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

type NewCheckRecord = Omit<CheckRecord, 'id'>
type NewStepwiseRecord = Omit<StepwiseRecord, 'id'>

/** 端末に保存した記録を読み書きする。data が null の間は読み込み中 */
export function useAppData() {
  const data: AppData | null = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const setProfile = useCallback((profile: Profile) => update((d) => ({ ...d, profile })), [])

  const addRecord = useCallback(
    (record: NewCheckRecord) =>
      update((d) => ({ ...d, records: [...d.records, { ...record, id: crypto.randomUUID() }] })),
    [],
  )

  const updateRecord = useCallback(
    (record: CheckRecord) =>
      update((d) => ({ ...d, records: d.records.map((r) => (r.id === record.id ? record : r)) })),
    [],
  )

  const deleteRecord = useCallback(
    (id: string) => update((d) => ({ ...d, records: d.records.filter((r) => r.id !== id) })),
    [],
  )

  const addStepwiseRecord = useCallback(
    (record: NewStepwiseRecord) =>
      update((d) => ({
        ...d,
        stepwiseRecords: [...d.stepwiseRecords, { ...record, id: crypto.randomUUID() }],
      })),
    [],
  )

  const updateStepwiseRecord = useCallback(
    (record: StepwiseRecord) =>
      update((d) => ({
        ...d,
        stepwiseRecords: d.stepwiseRecords.map((r) => (r.id === record.id ? record : r)),
      })),
    [],
  )

  const deleteStepwiseRecord = useCallback(
    (id: string) =>
      update((d) => ({ ...d, stepwiseRecords: d.stepwiseRecords.filter((r) => r.id !== id) })),
    [],
  )

  const acceptDisclaimer = useCallback(() => update((d) => ({ ...d, disclaimerAccepted: true })), [])

  return {
    data,
    setProfile,
    addRecord,
    updateRecord,
    deleteRecord,
    addStepwiseRecord,
    updateStepwiseRecord,
    deleteStepwiseRecord,
    acceptDisclaimer,
  }
}

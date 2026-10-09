'use client'

import { useState, type FormEvent } from 'react'
import { useAppData } from '@/hooks/useAppData'
import { ageInMonths, stageForMonths, todayString } from '@/lib/age'
import { STAGE_LABELS } from '@/types/food'
import type { Profile } from '@/types/record'

/** プロフィールの登録・編集（F-10） */
export default function ProfileForm() {
  const { data, setProfile } = useAppData()
  if (!data) return <p className="text-muted">読み込み中…</p>
  // 保存済みの値で入力欄を初期化するため、読み込みが終わってからフォームを出す
  return <Form initial={data.profile} onSave={setProfile} />
}

function Form({ initial, onSave }: { initial: Profile | null; onSave: (p: Profile) => void }) {
  const [nickname, setNickname] = useState(initial?.nickname ?? '')
  const [birthDate, setBirthDate] = useState(initial?.birthDate ?? '')
  const [saved, setSaved] = useState(false)

  const today = todayString()
  const months = birthDate ? ageInMonths(birthDate, today) : null
  const stage = months !== null ? stageForMonths(months) : null

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!nickname.trim() || !birthDate) return
    onSave({ nickname: nickname.trim(), birthDate })
    setSaved(true)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border bg-surface p-4">
      <label className="block text-sm">
        <span className="font-bold">名前</span>
        <span className="ml-1 text-muted">（ニックネームでも大丈夫です）</span>
        <input
          type="text"
          required
          value={nickname}
          onChange={(e) => {
            setNickname(e.target.value)
            setSaved(false)
          }}
          placeholder="例：はなちゃん"
          className="mt-1 block h-11 w-full rounded-xl border border-border bg-surface px-3"
        />
      </label>
      <label className="block text-sm">
        <span className="font-bold">生年月日</span>
        <input
          type="date"
          required
          value={birthDate}
          max={today}
          onChange={(e) => {
            setBirthDate(e.target.value)
            setSaved(false)
          }}
          className="mt-1 block h-11 w-full rounded-xl border border-border bg-surface px-3"
        />
      </label>
      {months !== null && months >= 0 && (
        <p className="text-sm">
          今日で <span className="font-bold">{months}ヶ月</span>
          <span className="ml-2 text-muted">{stage ? `離乳食 ${STAGE_LABELS[stage]}` : '離乳食開始前'}</span>
        </p>
      )}
      <button type="submit" className="h-12 w-full rounded-full bg-accent font-bold text-white">
        保存する
      </button>
      {saved && <p className="text-sm font-bold text-ok">保存しました</p>}
    </form>
  )
}

'use client'

import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { foods } from '@/data/foods'
import { useAppData } from '@/hooks/useAppData'
import { buildStatusMap } from '@/lib/progress'
import { searchFoods } from '@/lib/search'
import { CATEGORIES, CATEGORY_LABELS, STAGES, STAGE_LABELS, type Category, type Stage } from '@/types/food'
import { AllergenBadge, StatusBadge } from './badges'

function pick<T extends string>(value: string | null, allowed: readonly T[]): T | null {
  return allowed.includes(value as T) ? (value as T) : null
}

/** 食材一覧・検索・絞り込み（F-03〜F-06）。条件は URL に残す */
export default function FoodList() {
  const params = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const { data } = useAppData()

  // 日本語入力の変換中に文字が崩れないよう、入力欄の値は手元で持つ
  const [query, setQuery] = useState(() => params.get('q') ?? '')
  const stage = pick<Stage>(params.get('stage'), STAGES)
  const category = pick<Category>(params.get('category'), CATEGORIES)

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params.toString())
    if (value) next.set(key, value)
    else next.delete(key)
    const qs = next.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  const statuses = data ? buildStatusMap(data) : null
  const list = searchFoods(foods, query).filter(
    (f) => (!stage || f.stage === stage) && (!category || f.category === category),
  )

  return (
    <div className="space-y-3">
      <input
        type="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setParam('q', e.target.value.trim() || null)
        }}
        placeholder="食材名で検索（例：たまご）"
        aria-label="食材名で検索"
        className="h-12 w-full rounded-full border border-border bg-surface px-5"
      />

      <FilterChips
        label="時期"
        options={STAGES.map((s) => ({ value: s, label: STAGE_LABELS[s] }))}
        selected={stage}
        onSelect={(v) => setParam('stage', v)}
      />
      <FilterChips
        label="カテゴリ"
        options={CATEGORIES.map((c) => ({ value: c, label: CATEGORY_LABELS[c] }))}
        selected={category}
        onSelect={(v) => setParam('category', v)}
      />

      <p className="text-sm text-muted">{list.length} 品目</p>
      {list.length === 0 ? (
        <p className="rounded-2xl border border-border bg-surface p-6 text-center text-muted">
          見つかりませんでした
        </p>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
          {list.map((f) => (
            <li key={f.id}>
              <Link href={`/foods/${f.id}`} className="flex items-center gap-3 px-4 py-3">
                {statuses && <StatusBadge status={statuses.get(f.id)?.status ?? 'unchecked'} compact />}
                <span className="min-w-0 flex-1">
                  <span className="block font-bold">{f.name}</span>
                  <span className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-muted">
                    {STAGE_LABELS[f.stage]}・{CATEGORY_LABELS[f.category]}
                    <AllergenBadge allergen={f.allergen} />
                  </span>
                </span>
                <span className="text-muted" aria-hidden>
                  ›
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function FilterChips<T extends string>({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string
  options: { value: T; label: string }[]
  selected: T | null
  onSelect: (value: T | null) => void
}) {
  const chip = (active: boolean) =>
    `shrink-0 rounded-full border px-3 py-1.5 text-sm ${
      active ? 'border-accent bg-accent font-bold text-white' : 'border-border bg-surface'
    }`
  return (
    <div role="group" aria-label={label} className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
      <button type="button" className={chip(selected === null)} onClick={() => onSelect(null)}>
        すべて
      </button>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={selected === o.value}
          className={chip(selected === o.value)}
          onClick={() => onSelect(selected === o.value ? null : o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

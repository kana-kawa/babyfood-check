import type { FoodStatus } from '@/lib/progress'
import { ALLERGEN_LABELS, type Allergen } from '@/types/food'

const STATUS_STYLES: Record<FoodStatus, { label: string; short: string; className: string }> = {
  unchecked: { label: '未チェック', short: '未', className: 'bg-background text-muted border border-border' },
  ok: { label: '食べた（問題なし）', short: '✓', className: 'bg-ok-soft text-ok' },
  reaction: { label: '症状あり', short: '⚠', className: 'bg-danger-soft text-danger' },
}

/** チェック状況のマーク。compact なら記号だけ */
export function StatusBadge({ status, compact = false }: { status: FoodStatus; compact?: boolean }) {
  const s = STATUS_STYLES[status]
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full text-xs font-bold ${s.className} ${
        compact ? 'h-7 w-7' : 'px-3 py-1'
      }`}
      aria-label={compact ? s.label : undefined}
      title={s.label}
    >
      {compact ? s.short : s.label}
    </span>
  )
}

/** アレルギー注意食材のマーク（F-12） */
export function AllergenBadge({ allergen }: { allergen: Allergen }) {
  if (!allergen) return null
  const specific = allergen === 'specific'
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[11px] font-bold ${
        specific ? 'bg-danger-soft text-danger' : 'bg-accent-soft text-accent'
      }`}
    >
      {specific ? '⚠️ ' : '△ '}
      {ALLERGEN_LABELS[allergen]}
    </span>
  )
}

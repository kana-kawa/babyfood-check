/** 「初期 12/27」のような進捗の横棒（F-02） */
export default function ProgressBar({
  label,
  checked,
  total,
  emphasized = false,
}: {
  label: string
  checked: number
  total: number
  emphasized?: boolean
}) {
  const percent = total === 0 ? 0 : Math.round((checked / total) * 100)
  return (
    <div>
      <div className={`flex justify-between text-sm ${emphasized ? 'font-bold' : ''}`}>
        <span>{label}</span>
        <span>
          {checked}/{total} 品目
        </span>
      </div>
      <div
        className="mt-1 h-2 overflow-hidden rounded-full bg-border"
        role="progressbar"
        aria-label={label}
        aria-valuenow={checked}
        aria-valuemin={0}
        aria-valuemax={total}
      >
        <div className="h-full rounded-full bg-accent" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}

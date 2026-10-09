/** YYYY-MM-DD → 10月5日 */
export function formatDate(date: string): string {
  const [, m, d] = date.split('-').map(Number)
  return `${m}月${d}日`
}

/** 経過日数 → 今日／昨日／3日前 */
export function formatDaysAgo(days: number): string {
  if (days <= 0) return '今日'
  if (days === 1) return '昨日'
  return `${days}日前`
}

/** 新しい食材を試すのに向いた時間か（平日の午前中）。祝日は判定しない */
export function isWeekdayMorning(now: Date = new Date()): boolean {
  const day = now.getDay()
  return day !== 0 && day !== 6 && now.getHours() < 12
}

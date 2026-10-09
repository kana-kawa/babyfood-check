import type { Food } from '@/types/food'

/** 検索用に文字をそろえる：全角/半角の統一、カタカナ→ひらがな、英字は小文字、空白は除去 */
export function normalize(text: string): string {
  return text
    .normalize('NFKC')
    .replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60))
    .toLowerCase()
    .replace(/\s+/g, '')
}

/** 食材名（漢字など）と読み（ひらがな）の両方で部分一致検索する。空なら全件 */
export function searchFoods(foods: Food[], query: string): Food[] {
  const q = normalize(query)
  if (!q) return foods
  return foods.filter((f) => normalize(f.name).includes(q) || normalize(f.kana).includes(q))
}

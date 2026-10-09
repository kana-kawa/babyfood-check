import { describe, expect, it } from 'vitest'
import { foods } from '@/data/foods'
import { normalize, searchFoods } from '@/lib/search'

const names = (q: string) => searchFoods(foods, q).map((f) => f.name)

describe('normalize', () => {
  it('converts katakana (full/half width) to hiragana and removes spaces', () => {
    expect(normalize('タマゴ')).toBe('たまご')
    expect(normalize('ﾊﾞﾅﾅ')).toBe('ばなな')
    expect(normalize(' に ん じん ')).toBe('にんじん')
    expect(normalize('ＡＢＣ')).toBe('abc')
  })
})

describe('searchFoods', () => {
  it('finds by hiragana, katakana, and kanji', () => {
    expect(names('にんじん')).toContain('にんじん')
    expect(names('ニンジン')).toContain('にんじん')
    expect(names('ほうれんそう')).toContain('ほうれん草')
    expect(names('鮭')).toContain('鮭')
    expect(names('さけ')).toContain('鮭')
    expect(names('ｷｬﾍﾞﾂ')).toContain('キャベツ')
  })

  it('finds by other names (aliases)', () => {
    expect(names('たまご')).toEqual(expect.arrayContaining(['卵黄', '全卵']))
    expect(names('タマゴ')).toEqual(expect.arrayContaining(['卵黄', '全卵']))
    expect(names('しゃけ')).toContain('鮭')
    expect(names('パスタ')).toContain('スパゲッティ')
  })

  it('matches partially', () => {
    const result = names('とり')
    expect(result).toContain('鶏ささみ')
    expect(result).toContain('鶏肉（むね・もも）')
  })

  it('returns all foods for an empty query', () => {
    expect(searchFoods(foods, '')).toHaveLength(foods.length)
    expect(searchFoods(foods, '   ')).toHaveLength(foods.length)
  })

  it('returns nothing when no food matches', () => {
    expect(searchFoods(foods, 'ステーキ')).toEqual([])
  })
})

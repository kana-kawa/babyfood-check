import { describe, expect, it } from 'vitest'
import { recommend } from '@/lib/recommend'
import { makeData, rec, step } from '@/lib/testData'

const TODAY = '2026-10-10'
const names = (r: ReturnType<typeof recommend>) => r.foods.map((f) => f.name)

describe('recommend', () => {
  it('suggests the two safest foods of the stage first', () => {
    const r = recommend(makeData(), 'early', TODAY)
    expect(r.kind).toBe('candidates')
    expect(names(r)).toEqual(['10倍がゆ', 'じゃがいも'])
  })

  it('skips checked foods (including ones with reactions)', () => {
    const data = makeData([rec('rice-porridge', '2026-10-01'), rec('potato', '2026-10-02', 'reaction')])
    expect(names(recommend(data, 'early', TODAY))).toEqual(['さつまいも', 'にんじん'])
  })

  it('never suggests stepwise foods or foods of later stages', () => {
    const all = recommend(makeData(), 'early', TODAY, 1000).foods
    expect(all.some((f) => f.stepwiseId)).toBe(false)
    expect(all.every((f) => f.stage === 'early')).toBe(true)
    expect(all).toHaveLength(25) // 初期27品目 − 卵黄・うどん
  })

  it('suggests earlier stages first', () => {
    const all = recommend(makeData(), 'middle', TODAY, 1000).foods
    expect(all[0].stage).toBe('early')
    expect(all.at(-1)?.stage).toBe('middle')
  })

  it('puts shrimp, crab, soba, peanut, and walnut last', () => {
    const all = names(recommend(makeData(), 'complete', TODAY, 1000))
    expect(all.slice(-5)).toEqual(['えび', 'かに', 'そば', '落花生', 'くるみ'])
  })

  it('suggests nothing before weaning starts', () => {
    expect(recommend(makeData(), null, TODAY)).toEqual({ kind: 'candidates', foods: [] })
  })

  it('stops suggesting once a new food was tried today (one per day)', () => {
    const data = makeData([rec('rice-porridge', '2026-10-01'), rec('rice-porridge', TODAY), rec('carrot', TODAY)])
    const r = recommend(data, 'early', TODAY)
    expect(r.kind).toBe('tried-today')
    expect(names(r)).toEqual(['にんじん'])
  })

  it('does not count stepwise records as today’s new food', () => {
    const data = makeData([], [step('egg', 0, TODAY)])
    expect(recommend(data, 'early', TODAY).kind).toBe('candidates')
  })
})

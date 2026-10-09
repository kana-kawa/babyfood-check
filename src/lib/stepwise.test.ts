import { describe, expect, it } from 'vitest'
import { stepwiseFoods } from '@/data/foods'
import { stepwiseState } from '@/lib/stepwise'
import { step } from '@/lib/testData'

const egg = stepwiseFoods.find((s) => s.id === 'egg')!
const dairy = stepwiseFoods.find((s) => s.id === 'dairy')!

describe('stepwiseState', () => {
  it('waits until the start stage', () => {
    expect(stepwiseState(egg, [], null, '2026-10-10')).toEqual({ kind: 'not-yet', startStage: 'early' })
    expect(stepwiseState(dairy, [], 'early', '2026-10-10')).toEqual({ kind: 'not-yet', startStage: 'middle' })
  })

  it('starts from the first step', () => {
    expect(stepwiseState(egg, [], 'early', '2026-10-10')).toEqual({
      kind: 'in-progress',
      nextIndex: 0,
      lastDate: undefined,
      daysSince: undefined,
      daysUntilNext: 0,
      lockedUntil: undefined,
    })
  })

  it('counts the days until the next step', () => {
    const records = [step('egg', 0, '2026-10-01')]
    expect(stepwiseState(egg, records, 'early', '2026-10-02')).toMatchObject({
      kind: 'in-progress',
      nextIndex: 1,
      lastDate: '2026-10-01',
      daysSince: 1,
      daysUntilNext: 2,
    })
    expect(stepwiseState(egg, records, 'early', '2026-10-04')).toMatchObject({ nextIndex: 1, daysUntilNext: 0 })
  })

  it('ignores records of other stepwise foods', () => {
    const records = [step('wheat', 0, '2026-10-01')]
    expect(stepwiseState(egg, records, 'early', '2026-10-02')).toMatchObject({ nextIndex: 0, daysUntilNext: 0 })
  })

  it('stops after a reaction', () => {
    const records = [step('egg', 0, '2026-10-01'), step('egg', 1, '2026-10-04', 'reaction')]
    expect(stepwiseState(egg, records, 'early', '2026-10-05')).toEqual({
      kind: 'reaction',
      stepIndex: 1,
      lastDate: '2026-10-04',
      daysSince: 1,
    })
  })

  it('resumes when the same step is eaten again without a reaction', () => {
    const records = [step('egg', 1, '2026-10-04', 'reaction'), step('egg', 1, '2026-10-20')]
    expect(stepwiseState(egg, records, 'early', '2026-10-21')).toMatchObject({ kind: 'in-progress', nextIndex: 2 })
  })

  it('locks steps that need a later stage', () => {
    const records = [0, 1, 2, 3, 4].map((i) => step('egg', i, `2026-10-0${i + 1}`))
    expect(stepwiseState(egg, records, 'early', '2026-10-20')).toMatchObject({
      kind: 'in-progress',
      nextIndex: 5,
      lockedUntil: 'middle',
    })
    expect(stepwiseState(egg, records, 'middle', '2026-10-20')).toMatchObject({ nextIndex: 5, lockedUntil: undefined })
  })

  it('completes after the last step', () => {
    const records = [step('egg', egg.steps.length - 1, '2027-06-01')]
    expect(stepwiseState(egg, records, 'complete', '2027-06-03')).toEqual({
      kind: 'completed',
      lastDate: '2027-06-01',
      daysSince: 2,
    })
  })
})

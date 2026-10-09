import { describe, expect, it } from 'vitest'
import { foodStatus, stageProgress } from '@/lib/progress'
import { makeData, rec, step } from '@/lib/testData'

describe('foodStatus', () => {
  it('is unchecked without records', () => {
    expect(foodStatus('carrot', makeData())).toEqual({ status: 'unchecked', hadReaction: false })
  })

  it('follows the latest record and remembers past reactions', () => {
    const data = makeData([rec('carrot', '2026-10-01', 'reaction'), rec('carrot', '2026-10-05', 'ok')])
    expect(foodStatus('carrot', data)).toEqual({ status: 'ok', hadReaction: true, lastDate: '2026-10-05' })
  })

  it('does not depend on the order records were added', () => {
    const data = makeData([rec('carrot', '2026-10-05', 'reaction'), rec('carrot', '2026-10-01', 'ok')])
    expect(foodStatus('carrot', data).status).toBe('reaction')
  })

  it('treats a reaction on the same day as a reaction', () => {
    const data = makeData([rec('carrot', '2026-10-05', 'reaction'), rec('carrot', '2026-10-05', 'ok')])
    expect(foodStatus('carrot', data).status).toBe('reaction')
  })

  it('reflects stepwise records on the linked food', () => {
    const data = makeData([], [step('egg', 0, '2026-10-01'), step('egg', 5, '2026-11-20', 'reaction')])
    expect(foodStatus('egg-yolk', data).status).toBe('ok')
    expect(foodStatus('whole-egg', data).status).toBe('reaction')
    expect(foodStatus('yogurt', data).status).toBe('unchecked')
  })
})

describe('stageProgress', () => {
  it('counts foods per stage and overall', () => {
    const empty = stageProgress(makeData())
    expect(empty.map((p) => [p.stage, p.checked, p.total])).toEqual([
      ['early', 0, 27],
      ['middle', 0, 34],
      ['late', 0, 31],
      ['complete', 0, 28],
      ['all', 0, 120],
    ])
  })

  it('counts checked foods including stepwise ones', () => {
    const data = makeData(
      [rec('carrot', '2026-10-01'), rec('carrot', '2026-10-02'), rec('tofu', '2026-10-03', 'reaction')],
      [step('egg', 0, '2026-10-01')],
    )
    const progress = stageProgress(data)
    expect(progress.find((p) => p.stage === 'early')?.checked).toBe(3)
    expect(progress.find((p) => p.stage === 'all')?.checked).toBe(3)
  })
})

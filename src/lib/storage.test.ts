import { describe, expect, it } from 'vitest'
import { createInitialData, parseAppData } from '@/lib/storage'

const valid = {
  version: 1,
  profile: { nickname: 'はなちゃん', birthDate: '2026-04-15' },
  records: [{ id: 'r1', foodId: 'carrot', date: '2026-10-10', result: 'ok', memo: '小さじ1' }],
  stepwiseRecords: [{ id: 's1', stepwiseId: 'egg', stepIndex: 0, date: '2026-10-09', result: 'ok', memo: '' }],
  disclaimerAccepted: true,
}

describe('parseAppData', () => {
  it('reads valid data', () => {
    expect(parseAppData(JSON.stringify(valid))).toEqual(valid)
  })

  it('returns initial data for empty, broken, or unknown data', () => {
    const initial = createInitialData()
    expect(parseAppData(null)).toEqual(initial)
    expect(parseAppData('')).toEqual(initial)
    expect(parseAppData('{broken')).toEqual(initial)
    expect(parseAppData('[]')).toEqual(initial)
    expect(parseAppData(JSON.stringify({ ...valid, version: 2 }))).toEqual(initial)
  })

  it('drops only the broken parts', () => {
    const data = parseAppData(
      JSON.stringify({
        ...valid,
        profile: { nickname: 'はな', birthDate: '10月1日' },
        records: [...valid.records, { id: 'r2', foodId: 'tofu', date: '2026-10-10', result: 'maybe', memo: '' }],
        stepwiseRecords: [...valid.stepwiseRecords, { ...valid.stepwiseRecords[0], id: 's2', stepwiseId: 'fish' }],
        disclaimerAccepted: 'yes',
      }),
    )
    expect(data.profile).toBeNull()
    expect(data.records).toEqual(valid.records)
    expect(data.stepwiseRecords).toEqual(valid.stepwiseRecords)
    expect(data.disclaimerAccepted).toBe(false)
  })
})

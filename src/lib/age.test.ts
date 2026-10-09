import { describe, expect, it } from 'vitest'
import { ageInMonths, isStageAvailable, stageForMonths, todayString } from '@/lib/age'

describe('ageInMonths', () => {
  it('counts full months', () => {
    expect(ageInMonths('2026-04-15', '2026-10-15')).toBe(6) // 誕生日（月）当日
    expect(ageInMonths('2026-04-15', '2026-10-14')).toBe(5) // 前日
    expect(ageInMonths('2026-04-15', '2026-10-27')).toBe(6)
    expect(ageInMonths('2026-04-15', '2026-04-15')).toBe(0)
  })

  it('crosses years', () => {
    expect(ageInMonths('2025-11-20', '2026-10-19')).toBe(10)
    expect(ageInMonths('2025-11-20', '2026-11-20')).toBe(12)
  })

  it('handles month-end births', () => {
    expect(ageInMonths('2026-01-31', '2026-02-28')).toBe(1)
    expect(ageInMonths('2026-01-31', '2026-02-27')).toBe(0)
    expect(ageInMonths('2026-03-31', '2026-04-30')).toBe(1)
    expect(ageInMonths('2026-03-31', '2026-05-30')).toBe(1)
    expect(ageInMonths('2026-03-31', '2026-05-31')).toBe(2)
  })

  it('handles leap years', () => {
    expect(ageInMonths('2027-01-29', '2028-02-29')).toBe(13)
    expect(ageInMonths('2028-02-29', '2029-02-28')).toBe(12)
    expect(ageInMonths('2028-02-29', '2028-03-28')).toBe(0)
    expect(ageInMonths('2028-02-29', '2028-03-29')).toBe(1)
  })

  it('returns a negative value before birth', () => {
    expect(ageInMonths('2026-10-10', '2026-09-10')).toBe(-1)
  })
})

describe('stageForMonths', () => {
  it.each([
    [-1, null],
    [0, null],
    [4, null],
    [5, 'early'],
    [6, 'early'],
    [7, 'middle'],
    [8, 'middle'],
    [9, 'late'],
    [11, 'late'],
    [12, 'complete'],
    [18, 'complete'],
    [19, 'complete'],
  ])('%i months → %s', (months, stage) => {
    expect(stageForMonths(months)).toBe(stage)
  })
})

describe('isStageAvailable', () => {
  it('allows foods of the current and earlier stages', () => {
    expect(isStageAvailable('early', 'middle')).toBe(true)
    expect(isStageAvailable('middle', 'middle')).toBe(true)
    expect(isStageAvailable('late', 'middle')).toBe(false)
  })

  it('allows nothing before weaning starts', () => {
    expect(isStageAvailable('early', null)).toBe(false)
  })
})

describe('todayString', () => {
  it('formats the local date', () => {
    expect(todayString(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05')
  })
})

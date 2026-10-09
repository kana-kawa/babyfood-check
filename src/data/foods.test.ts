import { describe, expect, it } from 'vitest'
import { foods, stepwiseFoods } from '@/data/foods'
import { ALLERGENS, CATEGORIES, STAGES, STEPWISE_IDS } from '@/types/food'

describe('foods.json', () => {
  it('has 100〜120 foods', () => {
    expect(foods.length).toBeGreaterThanOrEqual(100)
    expect(foods.length).toBeLessThanOrEqual(120)
  })

  it('has unique ids', () => {
    const ids = foods.map((f) => f.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('has hiragana-only kana', () => {
    for (const f of foods) expect(f.kana, f.id).toMatch(/^[ぁ-ゖー]+$/)
  })

  it('has hiragana-only aliases', () => {
    for (const f of foods) for (const a of f.aliases ?? []) expect(a, f.id).toMatch(/^[ぁ-ゖー]+$/)
  })

  it('uses only defined stage / category / allergen values', () => {
    for (const f of foods) {
      expect(STAGES, f.id).toContain(f.stage)
      expect(CATEGORIES, f.id).toContain(f.category)
      expect([...ALLERGENS, null], f.id).toContain(f.allergen)
    }
  })

  it('has unique priorities within each stage', () => {
    for (const stage of STAGES) {
      const priorities = foods.filter((f) => f.stage === stage).map((f) => f.priority)
      expect(new Set(priorities).size, stage).toBe(priorities.length)
    }
  })

  it('links stepwiseId to an existing stepwise food', () => {
    const ids = stepwiseFoods.map((s) => s.id)
    for (const f of foods.filter((f) => f.stepwiseId)) expect(ids, f.id).toContain(f.stepwiseId)
  })

  it('puts specific allergens (non-stepwise) after non-allergen foods of the same stage', () => {
    for (const stage of STAGES) {
      const inStage = foods.filter((f) => f.stage === stage)
      const lastSafe = Math.max(0, ...inStage.filter((f) => f.allergen === null).map((f) => f.priority))
      for (const f of inStage.filter((f) => f.allergen === 'specific' && !f.stepwiseId)) {
        expect(f.priority, f.id).toBeGreaterThan(lastSafe)
      }
    }
  })

  it('has firstTimeNote for every allergen food', () => {
    for (const f of foods.filter((f) => f.allergen)) expect(f.firstTimeNote, f.id).toBeTruthy()
  })

  it('has tips for every food', () => {
    for (const f of foods) expect(f.tips, f.id).toBeTruthy()
  })
})

describe('stepwise.json', () => {
  it('has egg / dairy / wheat', () => {
    expect(stepwiseFoods.map((s) => s.id).sort()).toEqual([...STEPWISE_IDS].sort())
  })

  it('has valid steps', () => {
    for (const s of stepwiseFoods) {
      expect(STAGES, s.id).toContain(s.stage)
      expect(s.steps.length, s.id).toBeGreaterThan(0)
      s.steps.forEach((step, i) => {
        if (i === s.steps.length - 1) expect(step.minDaysBeforeNext, `${s.id}[${i}]`).toBe(0)
        else expect(step.minDaysBeforeNext, `${s.id}[${i}]`).toBeGreaterThan(0)
        if (step.fromStage) expect(STAGES, `${s.id}[${i}]`).toContain(step.fromStage)
      })
    }
  })

  it('never moves fromStage backwards', () => {
    for (const s of stepwiseFoods) {
      let current = STAGES.indexOf(s.stage)
      for (const step of s.steps) {
        const next = STAGES.indexOf(step.fromStage ?? s.stage)
        expect(next, s.id).toBeGreaterThanOrEqual(current)
        current = next
      }
    }
  })

  it('links every step to a food of the same stepwise group', () => {
    for (const s of stepwiseFoods) {
      for (const step of s.steps) {
        expect(foods.find((f) => f.id === step.foodId)?.stepwiseId, `${s.id}: ${step.foodId}`).toBe(s.id)
      }
    }
  })

  it('has an entry food in foods.json for each stepwise food', () => {
    for (const s of stepwiseFoods) {
      expect(foods.some((f) => f.stepwiseId === s.id && f.stage === s.stage), s.id).toBe(true)
    }
  })
})

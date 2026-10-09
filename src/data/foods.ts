import type { Food, StepwiseFood } from '@/types/food'
import foodsJson from './foods.json'
import stepwiseJson from './stepwise.json'

// JSON の文字列は型が string になるため、ここで型を付ける（値の正しさは foods.test.ts で確認する）
export const foods = foodsJson as Food[]
export const stepwiseFoods = stepwiseJson as StepwiseFood[]

export function getFood(id: string): Food | undefined {
  return foods.find((f) => f.id === id)
}

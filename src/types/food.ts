/** 食べ始められる時期（離乳食の時期区分） */
export const STAGES = ['early', 'middle', 'late', 'complete'] as const
export type Stage = (typeof STAGES)[number]

export const STAGE_LABELS: Record<Stage, string> = {
  early: '初期',
  middle: '中期',
  late: '後期',
  complete: '完了期',
}

/** 各時期の月齢の目安（厚生労働省「授乳・離乳の支援ガイド」） */
export const STAGE_MONTHS: Record<Stage, { min: number; max: number }> = {
  early: { min: 5, max: 6 },
  middle: { min: 7, max: 8 },
  late: { min: 9, max: 11 },
  complete: { min: 12, max: 18 },
}

export const CATEGORIES = [
  'grain',
  'vegetable_fruit',
  'protein_fish',
  'protein_meat',
  'protein_bean',
  'protein_egg',
  'protein_dairy',
  'other',
] as const
export type Category = (typeof CATEGORIES)[number]

export const CATEGORY_LABELS: Record<Category, string> = {
  grain: '炭水化物',
  vegetable_fruit: '野菜・果物',
  protein_fish: '魚',
  protein_meat: '肉',
  protein_bean: '豆',
  protein_egg: '卵',
  protein_dairy: '乳製品',
  other: 'その他',
}

/** specific = 特定原材料（8品目）、recommended = 特定原材料に準ずるもの（20品目） */
export const ALLERGENS = ['specific', 'recommended'] as const
export type Allergen = (typeof ALLERGENS)[number] | null

export const ALLERGEN_LABELS: Record<NonNullable<Allergen>, string> = {
  specific: '特定原材料',
  recommended: '特定原材料に準ずる',
}

export const STEPWISE_IDS = ['egg', 'dairy', 'wheat'] as const
export type StepwiseId = (typeof STEPWISE_IDS)[number]

export interface Food {
  id: string
  name: string
  /** ひらがな読み（検索用） */
  kana: string
  category: Category
  stage: Stage
  allergen: Allergen
  /** 時期の中で候補に出す順番（小さいほど先） */
  priority: number
  /** 段階的に量を増やす食材。通常の候補からは外し、別枠で進める */
  stepwiseId?: StepwiseId
  /** 与え方のポイント */
  tips: string
  /** 初めて与えるときの注意（アレルギー注意食材のみ） */
  firstTimeNote?: string
}

export interface StepwiseStep {
  label: string
  amount: string
  /** 次のステップに進むまでに空ける日数（最後のステップは 0） */
  minDaysBeforeNext: number
  /** このステップに進めるようになる時期（省略時は食材の時期） */
  fromStage?: Stage
}

export interface StepwiseFood {
  id: StepwiseId
  name: string
  /** 着手できる時期 */
  stage: Stage
  steps: StepwiseStep[]
}

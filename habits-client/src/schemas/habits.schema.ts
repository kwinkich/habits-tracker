import * as z from 'zod'

export const createDynamicHabitsSchema = (habitKeys: Array<string>) => {
  const schemaShape: Record<string, z.ZodTypeAny> = {
    photos: z.array(z.instanceof(File)).default([]),
    dayCount: z
      .number()
      .min(1, 'Day count must be at least 1')
      .optional()
      .or(z.literal(0))
      .or(z.literal(undefined)),
  }

  habitKeys.forEach((key) => {
    schemaShape[key] = z.boolean().default(false)
  })

  return z.object(schemaShape)
}

export type HabitsFormData = z.infer<ReturnType<typeof createDynamicHabitsSchema>>

export const FALLBACK_HABITS = [
  'isReadBook',
  'isLearnEnglish',
  'isSport',
  'isCoding',
  'isWakeUpEarly',
  'isSleepWell',
  'noSugar',
]

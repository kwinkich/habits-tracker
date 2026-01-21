import { Checkbox } from '@/components/ui/checkbox'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import type { UseFormReturn } from 'react-hook-form'
import type { HabitsFormData } from '@/schemas/habits.schema'

interface HabitItem {
  key: string
  emoji: string
  label: string
  type: string
}

interface HabitsSectionProps {
  form: UseFormReturn<HabitsFormData>
  habitsList: Array<HabitItem>
}

export function HabitsSection({ form, habitsList }: HabitsSectionProps) {
  return (
    <div className="bg-zinc-800/50 backdrop-blur-sm rounded-2xl p-6 border border-zinc-700">
      <h2 className="text-xl font-semibold mb-6">Today's Habits</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {habitsList.map(({ key, emoji, label, type }) => (
          <FormField
            key={key}
            control={form.control}
            name={key}
            render={({ field }) => {
              const booleanField = field as unknown as {
                value: boolean
                onChange: (value: boolean) => void
                onBlur: () => void
                ref: React.Ref<unknown>
              }

              return (
                <FormItem>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50 hover:bg-zinc-900 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{emoji}</span>
                      <div>
                        <FormLabel className="text-base font-medium cursor-pointer">
                          {label}
                        </FormLabel>
                        <p className="text-xs text-zinc-400 capitalize">
                          {type}
                        </p>
                      </div>
                    </div>
                    <FormControl>
                      <Checkbox
                        checked={booleanField.value}
                        onCheckedChange={field.onChange}
                        onBlur={field.onBlur}
                        ref={field.ref}
                        className="h-6 w-6 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
        ))}
      </div>
    </div>
  )
}

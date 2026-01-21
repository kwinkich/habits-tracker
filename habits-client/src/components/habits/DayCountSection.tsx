import { Input } from '@/components/ui/input'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import type { UseFormReturn } from 'react-hook-form'
import type { HabitsFormData } from '@/schemas/habits.schema'

interface DayCountSectionProps {
  form: UseFormReturn<HabitsFormData>
}

export function DayCountSection({ form }: DayCountSectionProps) {
  return (
    <div className="bg-zinc-800/50 backdrop-blur-sm rounded-2xl p-6 border border-zinc-700">
      <h2 className="text-xl font-semibold mb-6">Additional Info</h2>

      <FormField
        control={form.control}
        name="dayCount"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <span className="text-lg">#</span>
              </div>
              <div className="flex-1">
                <FormLabel className="text-base font-medium">
                  Day Count
                </FormLabel>
                <p className="text-sm text-zinc-400">Track your streak</p>
              </div>
            </div>

            <FormControl className="mt-4">
              <Input
                placeholder="Enter day number (e.g., 42)"
                {...field}
                value={(field.value as string | number | undefined) ?? ''}
                onChange={(e) => {
                  const value = e.target.value
                  if (value === '') {
                    field.onChange(undefined)
                  } else {
                    const num = parseInt(value)
                    if (!isNaN(num)) {
                      field.onChange(num)
                    }
                  }
                }}
                className="bg-zinc-900 border-zinc-700 h-12 text-lg"
              />
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

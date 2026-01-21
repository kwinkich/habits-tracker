// hooks/useHabitsQuery.ts
import { useQuery } from '@tanstack/react-query'
import { habitsAPI } from './habits.api'
import type { HabitConfig } from './habits.api'

export const useHabitsConfig = () => {
  return useQuery({
    queryKey: ['habits-config'],
    queryFn: () => habitsAPI.getConfig(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export const useHabits = () => {
  const { data, isLoading, error, refetch } = useHabitsConfig()

  const habitsList = data?.habits
    ? (Object.entries(data.habits).map(([key, value]) => ({
        key,
        ...value,
      })) as Array<{ key: string } & HabitConfig>)
    : []

  // Сортировка по order
  habitsList.sort((a, b) => a.order - b.order)

  const habitKeys = habitsList.map((h) => h.key)

  return {
    config: data,
    loading: isLoading,
    error: error ? error.message : null,
    habitKeys,
    habitsList,
    refreshConfig: refetch,
  }
}

// hooks/useSendReport.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { habitsAPI } from './habits.api'

export const useSendReport = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: {
      [key: string]: any
      photos: Array<File>
      dayCount: number
    }) => {
      // Прямая передача данных в API без лишних преобразований
      return habitsAPI.sendReport(data)
    },
    onSuccess: () => {
      // Инвалидируем кеш конфига после успешной отправки
      queryClient.invalidateQueries({ queryKey: ['habits-config'] })
    },
    onError: (error) => {
      console.error('Error sending report:', error)
    },
  })
}

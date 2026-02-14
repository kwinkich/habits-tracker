import { api } from './ky.config'

export interface HabitConfig {
  type: 'boolean' | 'number' | 'text'
  label: string
  emoji: string
  order: number
  active: boolean
}

export interface HabitsConfig {
  habits: Record<string, HabitConfig>
  version: string
  lastUpdated: string
}

export interface HabitsConfigResponse {
  success: boolean
  habits: Record<string, HabitConfig>
  dayCount: number
  version: string
  lastUpdated: string
}

export interface ReportResponse {
  success: boolean
  message: string
  photosCount: number
  asAlbum: boolean
  caption: string
}

export const habitsAPI = {
  // Получение конфига привычек
  getConfig: async (): Promise<HabitsConfigResponse> => {
    return api.get('api/habits/config').json<HabitsConfigResponse>()
  },

  // Отправка отчета
  sendReport: async (data: {
    [key: string]: any
    photos: Array<File>
    dayCount?: number
  }): Promise<ReportResponse> => {
    const formData = new FormData()

    // Добавляем фото
    if (data.photos.length > 0) {
      data.photos.forEach((photo: File) => {
        formData.append('photos', photo)
      })
    }

    // Добавляем все остальные поля (кроме photos)
    Object.keys(data).forEach((key) => {
      if (key !== 'photos') {
        // Only append dayCount if it's defined and greater than 0
        if (key === 'dayCount' && (data[key] === undefined || data[key] === null || data[key] === 0)) {
          return
        }
        formData.append(key, String(data[key]))
      }
    })

    return api
      .post('api/habits/report', { body: formData })
      .json<ReportResponse>()
  },

  // Альтернативный метод отправки (если альбом не работает)
  sendReportSingle: async (data: {
    [key: string]: any
    photos: Array<File>
    dayCount?: number
  }): Promise<ReportResponse> => {
    const formData = new FormData()

    if (data.photos.length > 0) {
      data.photos.forEach((photo: File) => {
        formData.append('photos', photo)
      })
    }

    Object.keys(data).forEach((key) => {
      if (key !== 'photos') {
        // Only append dayCount if it's defined and greater than 0
        if (key === 'dayCount' && (data[key] === undefined || data[key] === null || data[key] === 0)) {
          return
        }
        formData.append(key, String(data[key]))
      }
    })

    return api
      .post('api/habits/report-single', { body: formData })
      .json<ReportResponse>()
  },
}

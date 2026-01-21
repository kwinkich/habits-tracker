import type { ChangeEvent, RefObject } from 'react'
import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useHabits } from '@/api/useHabits'
import { useSendReport } from '@/api/useSendReport'
import {
  createDynamicHabitsSchema,
  FALLBACK_HABITS,
  type HabitsFormData,
} from '@/schemas/habits.schema'

export interface UseHabitsFormReturn {
  form: ReturnType<typeof useForm<HabitsFormData>>
  fileInputRef: RefObject<HTMLInputElement | null>
  files: Array<File>
  configLoading: boolean
  configError: string | null
  habitKeys: Array<string>
  habitsList: Array<{
    key: string
    emoji: string
    label: string
    type: string
    order: number
    active: boolean
  }>
  sendReportMutation: ReturnType<typeof useSendReport>
  refreshConfig: () => void
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleRemoveFile: (index: number) => void
  handleButtonClick: () => void
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>
  defaultValues: Record<string, unknown>
}

export function useHabitsForm(): UseHabitsFormReturn {
  const sendReportMutation = useSendReport()

  const {
    loading: configLoading,
    error: configError,
    habitKeys,
    habitsList,
    refreshConfig,
  } = useHabits()

  const DynamicHabitsSchema = createDynamicHabitsSchema(habitKeys)

  const defaultValues: Record<string, unknown> = {
    photos: [],
    dayCount: 0,
  }

  if (habitKeys.length > 0) {
    habitKeys.forEach((key) => {
      defaultValues[key] = false
    })
  } else {
    FALLBACK_HABITS.forEach((key) => {
      defaultValues[key] = false
    })
  }

  const form = useForm<HabitsFormData>({
    resolver: zodResolver(DynamicHabitsSchema),
    defaultValues,
  })

  const fileInputRef = useRef<HTMLInputElement>(null)
  const files = (form.watch('photos') as Array<File>) || []

  useEffect(() => {
    if (habitKeys.length > 0) {
      habitKeys.forEach((key) => {
        if (!form.getValues(key) && form.getValues(key) !== false) {
          form.setValue(key, false)
        }
      })
    }
  }, [habitKeys, form])

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (!selectedFiles) return

    const newFiles = Array.from(selectedFiles)
    const currentFiles = form.getValues('photos') as Array<File>
    const totalFiles = [...currentFiles, ...newFiles]

    form.setValue('photos', totalFiles, { shouldValidate: true })

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemoveFile = (index: number) => {
    const currentFiles = form.getValues('photos') as Array<File>
    const newFiles = currentFiles.filter((_, i) => i !== index)
    form.setValue('photos', newFiles, { shouldValidate: true })
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleSubmit = async (values: HabitsFormData) => {
    try {
      const data: Record<string, unknown> = {
        photos: values.photos || [],
        dayCount: values.dayCount ? Number(values.dayCount) : 1,
      }

      habitKeys.forEach((key) => {
        data[key] = values[key] || false
      })

      await sendReportMutation.mutateAsync(data as Parameters<typeof sendReportMutation.mutateAsync>[0])

      form.reset(defaultValues)

      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      console.log('Report sent successfully!')
    } catch (error) {
      console.error('Error sending report:', error)
    }
  }

  const onSubmit = form.handleSubmit(handleSubmit)

  return {
    form,
    fileInputRef,
    files,
    configLoading,
    configError,
    habitKeys,
    habitsList,
    sendReportMutation,
    refreshConfig,
    handleFileChange,
    handleRemoveFile,
    handleButtonClick,
    onSubmit,
    defaultValues,
  }
}

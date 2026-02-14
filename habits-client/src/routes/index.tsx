import { createFileRoute } from '@tanstack/react-router'
import { Form } from '@/components/ui/form'
import { useHabitsForm } from '@/hooks/useHabitsForm'
import {
  LoadingState,
  ErrorState,
  EmptyState,
  PhotoUploadSection,
  HabitsSection,
  DayCountSection,
  SubmitSection,
  ConfigFooter,
} from '@/components/habits'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const {
    form,
    fileInputRef,
    files,
    config,
    configLoading,
    configError,
    habitsList,
    sendReportMutation,
    refreshConfig,
    handleFileChange,
    handleRemoveFile,
    handleButtonClick,
    onSubmit,
  } = useHabitsForm()

  if (configLoading) {
    return <LoadingState />
  }

  if (configError) {
    return <ErrorState error={configError} onRetry={refreshConfig} />
  }

  if (habitsList.length === 0) {
    return <EmptyState onRefresh={refreshConfig} />
  }

  return (
    <div className="bg-zinc-900  text-white min-h-screen py-8 flex flex-col items-center  justify-center  gap-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">Daily Habits Tracker</h1>
        <p className="text-zinc-400">
          Track your daily progress • {habitsList.length} active habits
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-6 w-full max-w-2xl px-4"
        >
          <PhotoUploadSection
            form={form}
            files={files}
            fileInputRef={fileInputRef}
            onFileChange={handleFileChange}
            onRemoveFile={handleRemoveFile}
            onButtonClick={handleButtonClick}
          />

          <HabitsSection form={form} habitsList={habitsList} />

          <DayCountSection form={form} currentDayCount={config?.dayCount} />

          <SubmitSection
            isPending={sendReportMutation.isPending}
            isError={sendReportMutation.isError}
            isSuccess={sendReportMutation.isSuccess}
            error={sendReportMutation.error}
            onRefresh={refreshConfig}
          />
        </form>
      </Form>

      <ConfigFooter habitsCount={habitsList.length} onRefresh={refreshConfig} />
    </div>
  )
}

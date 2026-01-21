import { Button } from '@/components/ui/button'

interface ErrorStateProps {
  error: string
  onRetry: () => void
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="bg-zinc-900 w-screen text-white h-screen py-4 flex flex-col items-center justify-center gap-12">
      <h1 className="text-3xl font-bold text-center">Habits Tracker</h1>
      <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 max-w-md">
        <p className="text-red-300">⚠️ Error loading habits configuration</p>
        <p className="text-red-400 text-sm mt-2">{error}</p>
        <Button
          variant="outline"
          className="mt-4 border-red-700 text-red-300 hover:bg-red-900/30"
          onClick={onRetry}
        >
          Retry
        </Button>
      </div>
    </div>
  )
}

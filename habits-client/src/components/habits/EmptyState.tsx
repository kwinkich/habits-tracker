import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  onRefresh: () => void
}

export function EmptyState({ onRefresh }: EmptyStateProps) {
  return (
    <div className="bg-zinc-900 w-screen text-white h-screen py-4 flex flex-col items-center justify-center gap-12">
      <h1 className="text-3xl font-bold text-center">Habits Tracker</h1>
      <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-6 max-w-md text-center">
        <p className="text-yellow-300 text-lg mb-2">No habits configured</p>
        <p className="text-yellow-400 text-sm mb-4">
          Use the Telegram bot commands to add habits first:
        </p>
        <div className="bg-zinc-800 p-3 rounded text-sm font-mono text-left">
          <p className="text-cyan-300">
            /addhabit key=isMeditate type=boolean label="🧘 Meditation"
            emoji=🧘 order=1
          </p>
        </div>
        <Button
          variant="outline"
          className="mt-4 bg-zinc-800 text-white hover:bg-zinc-900/30"
          onClick={onRefresh}
        >
          Refresh Config
        </Button>
      </div>
    </div>
  )
}

import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SubmitSectionProps {
  isPending: boolean
  isError: boolean
  isSuccess: boolean
  error: Error | null
  onRefresh: () => void
}

export function SubmitSection({
  isPending,
  isError,
  isSuccess,
  error,
  onRefresh,
}: SubmitSectionProps) {
  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <Button
          type="button"
          variant="outline"
          className="border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-900 hover:text-white"
          onClick={onRefresh}
          disabled={isPending}
        >
          Refresh Config
        </Button>

        <Button
          type="submit"
          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold text-lg px-8 py-6 rounded-xl transition-all hover:scale-[1.02]"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Sending Report...
            </>
          ) : (
            'Submit Daily Report'
          )}
        </Button>
      </div>

      {isError && (
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
          <p className="text-red-300 font-medium">Error sending report</p>
          <p className="text-red-400 text-sm mt-1">
            {error instanceof Error ? error.message : 'Unknown error occurred'}
          </p>
        </div>
      )}

      {isSuccess && (
        <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
          <p className="text-green-300 font-medium">
            ✅ Report sent successfully!
          </p>
          <p className="text-green-400 text-sm mt-1">
            Your daily progress has been recorded.
          </p>
        </div>
      )}
    </>
  )
}

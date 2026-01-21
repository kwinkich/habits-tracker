import { Loader2 } from 'lucide-react'

export function LoadingState() {
  return (
    <div className="bg-zinc-900 w-screen text-white h-screen py-4 flex flex-col items-center justify-center gap-12">
      <Loader2 className="h-8 w-8 animate-spin" />
      <p className="text-lg">Loading habits configuration...</p>
    </div>
  )
}

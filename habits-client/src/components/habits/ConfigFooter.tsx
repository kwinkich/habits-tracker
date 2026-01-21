interface ConfigFooterProps {
  habitsCount: number
  onRefresh: () => void
}

export function ConfigFooter({ habitsCount, onRefresh }: ConfigFooterProps) {
  return (
    <div className="text-center text-sm text-zinc-500 mt-4">
      <p>
        Configured {habitsCount} habits •
        <button
          onClick={onRefresh}
          className="ml-2 bg-zinc-800 text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
        >
          Refresh
        </button>
      </p>
      <p className="text-xs mt-1">
        Use Telegram bot commands to manage habits: /addhabit, /updatehabit,
        /deletehabit
      </p>
    </div>
  )
}

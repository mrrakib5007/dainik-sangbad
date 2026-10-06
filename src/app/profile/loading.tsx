export default function ProfileLoading() {
  return (
    <main className="min-h-[calc(100vh-250px)] bg-neutral-50 dark:bg-zinc-950 py-10 px-4 sm:px-6 lg:px-8 animate-pulse">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xs overflow-hidden">
          <div className="h-28 sm:h-36 bg-zinc-200 dark:bg-zinc-800" />

          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 -mt-14 sm:-mt-16 mb-6">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white dark:border-zinc-900 bg-zinc-200 dark:bg-zinc-800 shrink-0" />

              <div className="flex items-center gap-2">
                <div className="h-8 w-28 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-8 w-24 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
              </div>
            </div>

            <div className="space-y-2 flex flex-col items-center sm:items-start">
              <div className="flex items-center gap-2">
                <div className="h-6 w-44 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-5 w-20 rounded-full bg-zinc-200 dark:bg-zinc-800" />
              </div>
              <div className="h-4 w-52 rounded-md bg-zinc-200 dark:bg-zinc-800" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs">
          <div className="h-5 w-28 rounded-md bg-zinc-200 dark:bg-zinc-800 mb-4 pb-3" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800"
              >
                <div className="w-8 h-8 rounded-lg bg-zinc-200 dark:bg-zinc-700 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-16 rounded-md bg-zinc-200 dark:bg-zinc-700" />
                  <div className="h-4 w-32 rounded-md bg-zinc-200 dark:bg-zinc-700" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
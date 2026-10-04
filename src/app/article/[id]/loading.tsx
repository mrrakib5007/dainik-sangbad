
export default function Loading() {
  return (
    <div className="bg-neutral-50 min-h-screen py-8 animate-pulse">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6 flex items-center justify-between">
          <div className="h-5 w-36 bg-neutral-200 rounded-md"></div>
          <div className="h-6 w-20 bg-neutral-200 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <main className="lg:col-span-8 bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="space-y-3">
              <div className="h-8 sm:h-10 bg-neutral-200 rounded-md w-full"></div>
              <div className="h-8 sm:h-10 bg-neutral-200 rounded-md w-3/4"></div>
            </div>

            <div className="flex items-center justify-between border-y border-neutral-100 py-3 gap-4">
              <div className="h-4 w-28 bg-neutral-200 rounded"></div>
              <div className="h-4 w-40 bg-neutral-200 rounded"></div>
            </div>

            <div className="w-full aspect-video bg-neutral-200 rounded-xl"></div>

            <div className="space-y-3">
              <div className="h-4 bg-neutral-200 rounded w-full"></div>
              <div className="h-4 bg-neutral-200 rounded w-full"></div>
              <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
              <div className="h-4 bg-neutral-200 rounded w-full"></div>
              <div className="h-4 bg-neutral-200 rounded w-4/6"></div>
            </div>

            <div className="w-full aspect-video bg-neutral-200 rounded-xl"></div>

            <div className="space-y-3">
              <div className="h-4 bg-neutral-200 rounded w-full"></div>
              <div className="h-4 bg-neutral-200 rounded w-full"></div>
              <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
            </div>
          </main>

          <aside className="lg:col-span-4 space-y-5">
            <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-4">
              <div className="h-5 bg-neutral-200 rounded w-1/2"></div>
              <div className="h-16 bg-neutral-100 rounded-xl"></div>
            </div>

            <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-4">
              <div className="h-5 bg-neutral-200 rounded w-1/2"></div>
              <div className="h-12 bg-neutral-100 rounded-xl"></div>
            </div>

            <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-4">
              <div className="h-5 bg-neutral-200 rounded w-2/5"></div>
              <div className="space-y-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="h-8 w-6 bg-neutral-200 rounded"></div>
                    <div className="space-y-1.5 flex-1">
                      <div className="h-3.5 bg-neutral-200 rounded w-full"></div>
                      <div className="h-3.5 bg-neutral-200 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
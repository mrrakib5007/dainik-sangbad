
export default function CategoryLoading() {
  return (
    <div className="bg-neutral-50 min-h-screen py-8 animate-pulse">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-2 pb-3 mb-8 border-b-2 border-neutral-200">
          <div className="w-2.5 h-2.5 bg-neutral-300 rounded-full inline-block"></div>
          <div className="h-8 w-32 bg-neutral-200 rounded-md"></div>
        </div>

        <main>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white border border-neutral-200 rounded-2xl overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-video w-full bg-neutral-200"></div>
                  <div className="p-4 pb-0 space-y-2">
                    <div className="h-3 w-16 bg-neutral-200 rounded"></div>
                    <div className="h-4 w-full bg-neutral-200 rounded"></div>
                    <div className="h-4 w-3/4 bg-neutral-200 rounded"></div>
                    <div className="h-3 w-full bg-neutral-200 rounded pt-1"></div>
                  </div>
                </div>
                <div className="p-4 pt-3">
                  <div className="h-3 w-28 bg-neutral-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
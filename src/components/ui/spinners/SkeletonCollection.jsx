export const SkeletonCollection = () => {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-600 flex items-center gap-3">
        <div className="w-7 h-7 rounded bg-gray-200 dark:bg-neutral-700" />
        <div className="flex flex-col gap-2">
          <div className="w-28 h-5 rounded bg-gray-200 dark:bg-neutral-700" />
          <div className="w-40 h-2 rounded bg-gray-200 dark:bg-neutral-700" />
        </div>
      </div>

      {/* Posts */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="border-b border-gray-200 dark:border-gray-600 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-neutral-700" />
            <div className="flex flex-col gap-2">
              <div className="w-32 h-3 rounded bg-gray-200 dark:bg-neutral-700" />
              <div className="w-20 h-2 rounded bg-gray-200 dark:bg-neutral-700" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="w-full h-3 rounded bg-gray-200 dark:bg-neutral-700" />
            <div className="w-3/5 h-3 rounded bg-gray-200 dark:bg-neutral-700" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const SkeletonProfile = () => {
  return (
    <div className="animate-pulse">
      {/* Banner */}
      <div className="h-36 w-full bg-gray-200 dark:bg-neutral-700" />

      {/* Info */}
      <div className="px-4 pb-4 border-b border-gray-200 dark:border-gray-600">
        <div className="flex justify-between items-end -mt-12">
          <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-neutral-600 border-4 border-white dark:border-bg-dark" />
          <div className="w-28 h-9 rounded-full bg-gray-200 dark:bg-neutral-700" />
        </div>
        <div className="mt-3 flex flex-col gap-3">
          <div className="w-40 h-5 rounded bg-gray-200 dark:bg-neutral-700" />
          <div className="w-64 h-3 rounded bg-gray-200 dark:bg-neutral-700" />
          <div className="flex gap-4">
            <div className="w-24 h-3 rounded bg-gray-200 dark:bg-neutral-700" />
            <div className="w-24 h-3 rounded bg-gray-200 dark:bg-neutral-700" />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex border-b border-gray-200 dark:border-gray-600">
        <div className="flex-1 py-3 flex flex-col items-center gap-2">
          <div className="w-10 h-5 rounded bg-gray-200 dark:bg-neutral-700" />
          <div className="w-20 h-2 rounded bg-gray-200 dark:bg-neutral-700" />
        </div>
        <div className="flex-1 py-3 flex flex-col items-center gap-2 border-l border-gray-200 dark:border-gray-600">
          <div className="w-10 h-5 rounded bg-gray-200 dark:bg-neutral-700" />
          <div className="w-20 h-2 rounded bg-gray-200 dark:bg-neutral-700" />
        </div>
      </div>
    </div>
  );
};

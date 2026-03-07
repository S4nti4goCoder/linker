export const SkeletonPost = () => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-600 p-4 animate-pulse">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-neutral-700" />
        <div className="flex flex-col gap-2">
          <div className="w-32 h-3 rounded bg-gray-200 dark:bg-neutral-700" />
          <div className="w-20 h-2 rounded bg-gray-200 dark:bg-neutral-700" />
        </div>
      </div>
      <div className="flex flex-col gap-2 mb-3">
        <div className="w-full h-3 rounded bg-gray-200 dark:bg-neutral-700" />
        <div className="w-4/5 h-3 rounded bg-gray-200 dark:bg-neutral-700" />
        <div className="w-3/5 h-3 rounded bg-gray-200 dark:bg-neutral-700" />
      </div>
      <div className="flex gap-4 mt-4">
        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-neutral-700" />
        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-neutral-700" />
      </div>
    </div>
  );
};

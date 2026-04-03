const SkeletonMessageItem = () => (
  <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-600">
    <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-neutral-700 shrink-0" />
    <div className="flex-1 flex flex-col gap-2">
      <div className="w-32 h-3 rounded bg-gray-200 dark:bg-neutral-700" />
      <div className="w-48 h-2 rounded bg-gray-200 dark:bg-neutral-700" />
    </div>
    <div className="w-10 h-2 rounded bg-gray-200 dark:bg-neutral-700" />
  </div>
);

export const SkeletonMessage = () => {
  return (
    <div className="animate-pulse">
      <SkeletonMessageItem />
      <SkeletonMessageItem />
      <SkeletonMessageItem />
      <SkeletonMessageItem />
      <SkeletonMessageItem />
    </div>
  );
};

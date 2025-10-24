import { Icon } from "@iconify/react";

export const HomePage = () => {
  return (
    <main className="flex min-h-screen bg-white dark:bg-bg-dark max-w-[1200px] mx-auto">
      <section className="flex flex-col w-full h-screen">
        <article className="flex flex-col h-screen overflow-hidden border border-gray-200 border-t-0 border-b-0 dark:border-gray-600">
          <div className="sticky top-0 z-10 border-b border-gray-200 dark:border-gray-600 px-4 py-3">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold">INICIO</h1>
              <button className="flex gap-2">
                <span className="font-semibold text-gray-500/80">
                  200 usuarios
                </span>
                <Icon
                  icon="mdi:dots-vertical"
                  className="text-2xl text-gray-400"
                />
              </button>
            </div>
          </div>
          Principal
        </article>
        <article>Sidebar derecho</article>
      </section>
    </main>
  );
};

'use client';

import { useLoadingStore } from './store/loadingStore';

export default function Home() {
  const { isLoading, setLoading } = useLoadingStore();

  const toggleLoading = () => {
    setLoading(!isLoading);
  };

  const simulateLoading = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-8 py-32 px-16 bg-white dark:bg-black">
        <h1 className="text-4xl font-bold text-black dark:text-zinc-50">
          Loading
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 text-center max-w-md">
          Click the buttons below to toggle the loading state and see the ship animation with backdrop.
        </p>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <button
            onClick={toggleLoading}
            className="flex h-12 px-8 items-center justify-center rounded-full bg-black dark:bg-white text-white dark:text-black transition-colors hover:bg-zinc-800 dark:hover:bg-zinc-200"
          >
            Loading
          </button>
          <button
            onClick={simulateLoading}
            className="flex h-12 px-8 items-center justify-center rounded-full border border-black dark:border-white text-black dark:text-white transition-colors hover:bg-black/5 dark:hover:bg-white/5"
          >
            Loading (3s)
          </button>
        </div>
      </main>
    </div>
  );
}

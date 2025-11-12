'use client';

import { useLoadingStore } from '../store/loadingStore';
import Ship from './Ship';

export default function LoadingOverlay() {
  const isLoading = useLoadingStore((state) => state.isLoading);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Ship width={400} height={400} />
    </div>
  );
}

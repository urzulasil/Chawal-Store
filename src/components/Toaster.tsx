'use client';

import { Toaster as SonnerToaster } from 'sonner';

export function Toaster() {
  return (
    <SonnerToaster
      position="top-center"
      richColors
      closeButton
      toastOptions={{
        style: { fontFamily: 'inherit' },
        classNames: {
          toast: 'border border-gray-200 shadow-lg',
        },
      }}
    />
  );
}

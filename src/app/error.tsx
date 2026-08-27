"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <p className="text-5xl">⚠️</p>
      <h1 className="text-xl font-semibold">Xatolik yuz berdi</h1>
      <p className="max-w-sm text-text-muted">
        Kutilmagan xatolik sodir bo'ldi. Iltimos, qayta urinib ko'ring.
      </p>
      <Button onClick={reset}>Qayta urinish</Button>
    </div>
  );
}

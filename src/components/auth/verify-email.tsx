"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/react";

export function VerifyEmail() {
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [message, setMessage] = useState("");
  const mutation = trpc.auth.verifyEmail.useMutation();

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Tasdiqlash havolasi noto'g'ri");
      return;
    }
    mutation
      .mutateAsync({ token })
      .then(() => setStatus("ok"))
      .catch((err) => {
        setStatus("error");
        setMessage(err instanceof Error ? err.message : "Xatolik yuz berdi");
      });
  }, [token, mutation]);

  return (
    <div className="flex flex-col items-center gap-3 py-6 text-center">
      {status === "loading" && (
        <>
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="body-sm text-text-secondary">Email tasdiqlanmoqda…</p>
        </>
      )}
      {status === "ok" && (
        <>
          <span className="flex size-14 items-center justify-center rounded-full bg-success/10 text-success">
            <CheckCircle2 className="size-7" />
          </span>
          <h2 className="h4">Email tasdiqlandi</h2>
          <p className="body-sm text-text-secondary">
            Endi hisobingiz faollashtirildi.
          </p>
          <Button asChild className="mt-2">
            <Link href="/login">Kirish</Link>
          </Button>
        </>
      )}
      {status === "error" && (
        <>
          <span className="flex size-14 items-center justify-center rounded-full bg-error/10 text-error">
            <XCircle className="size-7" />
          </span>
          <h2 className="h4">Xatolik</h2>
          <p className="body-sm text-text-secondary">{message}</p>
          <Button asChild variant="secondary" className="mt-2">
            <Link href="/login">Kirish sahifasiga</Link>
          </Button>
        </>
      )}
    </div>
  );
}

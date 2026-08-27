import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <p className="text-6xl font-bold text-primary">404</p>
      <h1 className="text-xl font-semibold">Sahifa topilmadi</h1>
      <p className="max-w-sm text-text-muted">
        Siz qidirayotgan sahifa mavjud emas yoki o'chirib yuborilgan bo'lishi
        mumkin.
      </p>
      <Button asChild>
        <Link href="/dashboard">Boshqaruvga qaytish</Link>
      </Button>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, ArrowLeft, Sparkles, Briefcase, GraduationCap, HeartPulse, Wallet, Palette, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/trpc/react";
import { cn } from "@/lib/utils";

const DIRECTIONS = [
  { id: "personal", label: "Shaxsiy", icon: User },
  { id: "career", label: "Ish / Karyera", icon: Briefcase },
  { id: "study", label: "O'qish", icon: GraduationCap },
  { id: "health", label: "Sog'liq", icon: HeartPulse },
  { id: "finance", label: "Moliyaviy", icon: Wallet },
  { id: "creative", label: "Ijod", icon: Palette },
];

const STEPS = ["Yo'nalish", "Maqsad", "Yakun"];

export function OnboardingForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [goalTitle, setGoalTitle] = useState("");

  const createGoal = trpc.goal.create.useMutation();

  const toggle = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const finish = async () => {
    if (goalTitle.trim()) {
      await createGoal.mutateAsync({ title: goalTitle.trim() });
    }
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col px-4 py-12">
      {/* Progress dots */}
      <div className="mb-10 flex items-center justify-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={cn(
                "flex size-8 items-center justify-center rounded-full text-sm font-medium transition-colors",
                i <= step
                  ? "bg-primary text-white"
                  : "bg-surface-hover text-text-muted",
              )}
            >
              {i < step ? <Check className="size-4" /> : i + 1}
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "h-0.5 w-10 rounded-full transition-colors",
                  i < step ? "bg-primary" : "bg-surface-hover",
                )}
              />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25 }}
          className="flex flex-1 flex-col"
        >
          {step === 0 && (
            <div className="flex flex-col gap-6">
              <div className="text-center">
                <h1 className="h2">Nimadan boshlamoqchisiz?</h1>
                <p className="body mt-2 text-text-secondary">
                  Bir nechtasini tanlang — bu asosiy yo'nalishlarni shakllantiradi.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {DIRECTIONS.map((d) => {
                  const active = selected.includes(d.id);
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => toggle(d.id)}
                      aria-pressed={active}
                      className={cn(
                        "flex flex-col items-center gap-2 rounded-lg border p-5 text-center transition-all",
                        active
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border bg-surface hover:bg-surface-hover",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-10 items-center justify-center rounded-lg",
                          active
                            ? "bg-primary text-white"
                            : "bg-surface-hover text-text-secondary",
                        )}
                      >
                        <d.icon className="size-5" />
                      </span>
                      <span className="body-sm font-medium">{d.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-col gap-6">
              <div className="text-center">
                <h1 className="h2">Birinchi maqsadingiz nima?</h1>
                <p className="body mt-2 text-text-secondary">
                  Ixtiyoriy — keyinroq ham qo'shishingiz mumkin.
                </p>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="goal">Maqsad sarlavhasi</Label>
                <Input
                  id="goal"
                  placeholder="Masalan: Todo Logic ilovasini yakunlash"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col items-center gap-6 text-center">
              <span className="flex size-16 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-glow">
                <Sparkles className="size-8" />
              </span>
              <div>
                <h1 className="h2">Tayyormisiz?</h1>
                <p className="body mt-2 text-text-secondary">
                  {selected.length > 0
                    ? `Tanlangan yo'nalishlar: ${selected.length} ta.`
                    : "Yo'nalish tanlanmadi — istalgan vaqtda sozlashingiz mumkin."}
                </p>
                {goalTitle.trim() && (
                  <p className="mt-3 body-sm">
                    Birinchi maqsad:{" "}
                    <span className="font-medium text-text-primary">
                      {goalTitle.trim()}
                    </span>
                  </p>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="mt-10 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          <ArrowLeft className="size-4" /> Orqaga
        </Button>

        {step < STEPS.length - 1 ? (
          <div className="flex gap-2">
            {step === 0 && (
              <Button variant="ghost" onClick={() => setStep(2)}>
                O'tkazib yuborish
              </Button>
            )}
            <Button onClick={() => setStep((s) => s + 1)}>
              Keyingi <ArrowRight className="size-4" />
            </Button>
          </div>
        ) : (
          <Button onClick={finish} loading={createGoal.isPending}>
            Boshlash <ArrowRight className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

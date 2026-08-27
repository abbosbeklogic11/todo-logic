"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Target,
  ListTodo,
  Flame,
  Timer,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  CalendarDays,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";

const features = [
  {
    icon: Target,
    title: "Maqsadlar va bosqichlar",
    description:
      "Katta maqsadni bosqichlarga (milestone) bo'ling va har biri uchun vazifalar yarating.",
  },
  {
    icon: ListTodo,
    title: "Vazifalar boshqaruvi",
    description:
      "List, Kanban (drag-drop) va taqvim ko'rinishlari. Filtrlar va ustuvorlik darajasi.",
  },
  {
    icon: Flame,
    title: "Odatlar (habits)",
    description:
      "Kundalik odatlarni kuzating, streak hisoblang va barqarorlikka erishing.",
  },
  {
    icon: Timer,
    title: "Fokus vaqti",
    description:
      "Pomodoriga o'xshash fokus rejimi bilan chalg'ishlarni kamaytiring (v2).",
  },
  {
    icon: TrendingUp,
    title: "Real vaqtda statistika",
    description:
      "Bajarilgan vazifalar, progress va streak'lar asosida shakllangan analitika.",
  },
  {
    icon: Sparkles,
    title: "AI yordamchi",
    description:
      "Kunlik rejani avtomatik tuzuvchi AI yordamchi (v2 bosqichida).",
  },
];

const steps = [
  {
    icon: Target,
    title: "Maqsad qo'ying",
    description: "Katta natija sari birinchi qadam — aniq maqsad belgilang.",
  },
  {
    icon: ListTodo,
    title: "Bosqichlarga ajrating",
    description: "Maqsadni bajariladigan vazifalarga bo'ling va kunda bajaring.",
  },
  {
    icon: TrendingUp,
    title: "Progressni kuzating",
    description: "Barcha o'zgarishlar avtomatik aks etadi — natijangiz ko'z oldida.",
  },
];

const reveal = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 opacity-60"
            style={{
              background:
                "radial-gradient(60% 50% at 50% 0%, color-mix(in srgb, var(--primary) 18%, transparent), transparent 70%)",
            }}
          />
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28 lg:px-8">
            <div className="flex flex-col gap-6">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-text-secondary">
                <Sparkles className="size-3.5 text-primary" />
                Maqsadlar · Vazifalar · Odatlar
              </span>
              <h1 className="h1">
                Maqsadlaringizni{" "}
                <span className="text-gradient">mantiqli</span> boshqaring
              </h1>
              <p className="body-lg max-w-xl text-text-secondary">
                Todo Logic — vazifalar, maqsadlar, odatlar va fokus vaqtini
                bir joyda jamlagan premium vosita. Birinchi taassurot: bu
                tayyor mahsulot.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="lg" asChild>
                  <Link href="/register">
                    Bepul boshlash <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/login">Kirish</Link>
                </Button>
              </div>
            </div>

            {/* App preview mock */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative"
            >
              <Card className="shadow-xl">
                <CardContent className="flex flex-col gap-5 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="caption">Faol maqsadlar</p>
                      <p className="stat">3</p>
                    </div>
                    <ProgressRing value={68} size={88} />
                  </div>
                  <div className="flex flex-col gap-2.5">
                    {[
                      { t: "Landing sahifani tayyorlash", done: true },
                      { t: "Auth oqimini loyihalash", done: true },
                      { t: "Dashboard statistikasi", done: false },
                      { t: "Odat kuzatuvi modulini qo'shish", done: false },
                    ].map((item) => (
                      <div
                        key={item.t}
                        className="flex items-center gap-3 rounded-md border border-border bg-surface px-3 py-2.5"
                      >
                        {item.done ? (
                          <CheckCircle2 className="size-5 shrink-0 text-success" />
                        ) : (
                          <div className="size-5 shrink-0 rounded-md border-2 border-border" />
                        )}
                        <span
                          className={
                            item.done
                              ? "body-sm text-text-muted line-through"
                              : "body-sm text-text-primary"
                          }
                        >
                          {item.t}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <div className="absolute -bottom-6 -left-6 hidden size-28 rounded-2xl border border-border bg-surface p-4 shadow-lg sm:flex sm:flex-col sm:justify-center sm:gap-1">
                <CalendarDays className="size-5 text-secondary" />
                <p className="caption">Bugun</p>
                <p className="text-sm font-semibold">5 vazifa</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="h2">Barcha kerakli narsa — bitta ilova</h2>
            <p className="body mt-3 text-text-secondary">
              Sizga kerak bo'ladigan har bir vosita, ehtiyojdan ortig'i emas.
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                variants={reveal}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Card className="h-full hover:-translate-y-1 hover:shadow-md">
                  <CardContent className="flex h-full flex-col gap-3 p-6">
                    <span className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <f.icon className="size-5" />
                    </span>
                    <h3 className="h4">{f.title}</h3>
                    <p className="body-sm text-text-secondary">
                      {f.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section
          id="how"
          className="border-y border-border bg-surface"
        >
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="h2">Qanday ishlaydi</h2>
              <p className="body mt-3 text-text-secondary">
                Uchrashuvdan natijagacha — uch oddiy qadam.
              </p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {steps.map((s, i) => (
                <motion.div
                  key={s.title}
                  variants={reveal}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="flex flex-col items-center gap-4 text-center"
                >
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-glow">
                    <s.icon className="size-6" />
                  </div>
                  <div>
                    <p className="caption">Qadam {i + 1}</p>
                    <h3 className="h4 mt-1">{s.title}</h3>
                    <p className="body-sm mt-1 text-text-secondary">
                      {s.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <Card className="overflow-hidden border-0 bg-brand-gradient text-white">
            <CardContent className="flex flex-col items-center gap-5 p-10 text-center sm:p-14">
              <h2 className="h2 text-white">Bugun birinchi qadam qo'ying</h2>
              <p className="body-lg max-w-xl text-white/80">
                Ro'yxatdan o'tish bir daqiqa. Maqsadingizga birinchi yaqinlashgan
                vazifangizni hoziroq yarating.
              </p>
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90"
                asChild
              >
                <Link href="/register">
                  Bepul boshlash <ArrowRight className="size-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
}

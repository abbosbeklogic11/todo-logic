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
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80&auto=format&fit=crop",
  },
  {
    icon: ListTodo,
    title: "Vazifalar boshqaruvi",
    description:
      "List, Kanban (drag-drop) va taqvim ko'rinishlari. Filtrlar va ustuvorlik darajasi.",
    image:
      "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&q=80&auto=format&fit=crop",
  },
  {
    icon: Flame,
    title: "Odatlar (habits)",
    description:
      "Kundalik odatlarni kuzating, streak hisoblang va barqarorlikka erishing.",
    image:
      "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&q=80&auto=format&fit=crop",
  },
  {
    icon: Timer,
    title: "Fokus vaqti",
    description:
      "Pomodoriga o'xshash fokus rejimi bilan chalg'ishlarni kamaytiring (v2).",
    image:
      "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=600&q=80&auto=format&fit=crop",
  },
  {
    icon: TrendingUp,
    title: "Real vaqtda statistika",
    description:
      "Bajarilgan vazifalar, progress va streak'lar asosida shakllangan analitika.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80&auto=format&fit=crop",
  },
  {
    icon: Sparkles,
    title: "AI yordamchi",
    description:
      "Kunlik rejani avtomatik tuzuvchi AI yordamchi (v2 bosqichida).",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80&auto=format&fit=crop",
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

            {/* App preview — rasmli, responsive */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative"
            >
              <div className="relative overflow-hidden rounded-2xl shadow-xl ring-1 ring-border">
                <img
                  src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=900&q=80&auto=format&fit=crop"
                  alt="Ish stolida reja va noutbuk"
                  className="h-[320px] w-full object-cover sm:h-[380px] lg:h-[440px]"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4">
                  <Card className="border-white/20 bg-white/95 shadow-lg backdrop-blur dark:bg-zinc-900/90">
                    <CardContent className="flex flex-col gap-3 p-4 sm:p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="caption">Faol maqsadlar</p>
                          <p className="stat">3</p>
                        </div>
                        <ProgressRing value={68} size={72} />
                      </div>
                      <div className="hidden flex-col gap-2 sm:flex">
                        {[
                          { t: "Landing sahifani tayyorlash", done: true },
                          { t: "Auth oqimini loyihalash", done: true },
                          { t: "Dashboard statistikasi", done: false },
                        ].map((item) => (
                          <div
                            key={item.t}
                            className="flex items-center gap-2.5 rounded-md border border-border bg-surface px-3 py-2"
                          >
                            {item.done ? (
                              <CheckCircle2 className="size-4 shrink-0 text-success" />
                            ) : (
                              <div className="size-4 shrink-0 rounded-md border-2 border-border" />
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
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 hidden rounded-2xl border border-border bg-surface p-3 shadow-lg sm:flex sm:flex-col sm:gap-1 lg:-left-6 lg:p-4">
                <CalendarDays className="size-5 text-secondary" />
                <p className="caption">Bugun</p>
                <p className="text-sm font-semibold">5 vazifa</p>
              </div>
              <div className="absolute -top-3 -right-3 hidden items-center gap-2 rounded-full border border-border bg-surface px-3 py-2 shadow-lg sm:flex lg:-right-4">
                <span className="flex size-7 items-center justify-center rounded-full bg-success/15 text-success">
                  <CheckCircle2 className="size-4" />
                </span>
                <span className="pr-1 text-xs font-medium">68% bajarildi</span>
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
                <Card className="group h-full overflow-hidden hover:-translate-y-1 hover:shadow-md">
                  <div className="relative h-36 overflow-hidden sm:h-40">
                    <img
                      src={f.image}
                      alt={f.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <span className="absolute bottom-3 left-3 flex size-9 items-center justify-center rounded-lg bg-white/95 text-primary shadow backdrop-blur dark:bg-zinc-900/90">
                      <f.icon className="size-5" />
                    </span>
                  </div>
                  <CardContent className="flex h-full flex-col gap-2 p-5 sm:p-6">
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

        {/* CTA — rasmli */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <Card className="relative overflow-hidden border-0">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80&auto=format&fit=crop"
              alt="Jamoa bilan ishlash"
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-brand-gradient opacity-[0.92]" />
            <CardContent className="relative flex flex-col items-center gap-5 p-8 text-center text-white sm:p-12 lg:p-14">
              <h2 className="h2 text-white">Bugun birinchi qadam qo'ying</h2>
              <p className="body-lg max-w-xl text-white/90">
                Ro'yxatdan o'tish bir daqiqa. Maqsadingizga birinchi yaqinlashgan
                vazifangizni hoziroq yarating.
              </p>
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-[#111827] hover:bg-white/90 dark:bg-white dark:text-[#111827]"
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

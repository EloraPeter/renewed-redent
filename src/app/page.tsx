"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import mochihappy from "/Projects/My Websites/student-class-reminder/renewed-redent/public/mochi-happy.png";
import mochistudy from "/Projects/My Websites/student-class-reminder/renewed-redent/public/mochi-study.png";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function Home() {
  return (
    <div className="min-h-screen text-black dark:text-gray-100 overflow-x-hidden">

      {/* ───────── HERO ───────── */}
      <section className="relative max-w-7xl mx-auto px-5 pt-16 pb-20 md:pt-24 grid grid-cols-1 md:grid-cols-2 gap-14 items-center">

        {/* Glow blob */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-400/20 blur-3xl rounded-full" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="space-y-6 z-10"
        >
          <h1 className="text-4xl text-black dark:text-gray-100 sm:text-5xl lg:text-6xl font-extrabold leading-tight">
            Stay consistent.
            <br />
            Stay motivated.
            <br />
            <span className="text-orange-600 dark:text-orange-400">
              Mochi watches your back 🐹
            </span>
          </h1>

          <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 max-w-xl">
            MochiDo is a gentle but powerful academic reminder system for students
            and lecturers — combining smart scheduling, emotional motivation,
            and adorable accountability.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <GlowButton href="/signup" label="Get Started Free" />
            <Link
              href="/login"
              className="px-8 py-4 rounded-xl border border-orange-400/40 text-orange-700 dark:text-orange-300 hover:bg-orange-400/10 transition text-center"
            >
              Login
            </Link>
          </div>
        </motion.div>

        {/* Mascot */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative w-full h-[280px] sm:h-[340px] md:h-[420px]"
        >
          <div className="absolute inset-0 bg-orange-400/30 blur-3xl rounded-full" />
          <Image
            src={mochihappy}
            alt="Mochi mascot"
            fill
            className="object-contain relative z-10"
          />
        </motion.div>
      </section>

      {/* ───────── STATS ───────── */}
      <section className="py-14 bg-white/70 dark:bg-gray-900/70 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <Stat value="24/7" label="Smart Reminders" />
          <Stat value="100%" label="Deadline Coverage" />
          <Stat value="0%" label="Nagging Stress" />
          <Stat value="∞" label="Mochi Support" />
        </div>
      </section>

      {/* ───────── HOW IT WORKS ───────── */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-orange-600">
            How MochiDo works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <StepCard step="1" title="Add your academics">
              Courses, assignments, classes, routines — everything in one place.
            </StepCard>
            <StepCard step="2" title="Mochi tracks for you">
              Deadlines, streaks, missed tasks, progress — automatically.
            </StepCard>
            <StepCard step="3" title="Get human reminders">
              Gentle nudges, emotional feedback, and celebration when you win.
            </StepCard>
          </div>
        </div>
      </section>

      {/* ───────── FEATURES ───────── */}
      <section className="py-20 bg-gradient-to-b from-orange-100/50 to-transparent">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">
            Why MochiDo feels different
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <FeatureCard
              title="Emotion-aware reminders"
              description="Mochi responds to your behavior — not just your schedule."
              img={mochistudy}
            />
            <FeatureCard
              title="Designed for burnout"
              description="Built for real students, real pressure, real life."
              img={mochihappy}
            />
            <FeatureCard
              title="Lecturer-friendly"
              description="Less chasing, more clarity, better class flow."
              img={mochihappy}
            />
          </div>
        </div>
      </section>

      {/* ───────── FINAL CTA ───────── */}
      <section className="py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="max-w-4xl mx-auto px-6 text-center space-y-6"
        >
          <h2 className="text-4xl font-extrabold">
            Your academics don’t have to hurt.
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Let Mochi help you stay consistent, calm, and in control.
          </p>
          <GlowButton href="/signup" label="Start with Mochi 🐹" />
        </motion.div>
      </section>
    </div>
  );
}

/* ───────── COMPONENTS ───────── */

function GlowButton({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="relative inline-flex items-center justify-center px-8 py-4 font-semibold text-white rounded-xl bg-green-600 hover:bg-green-700 transition shadow-lg"
    >
      <span className="absolute inset-0 blur-xl bg-green-500/40 rounded-xl" />
      <span className="relative">{label}</span>
    </Link>
  );
}

function FeatureCard({ title, description, img }: any) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="relative bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-xl border border-orange-400/20 hover:shadow-orange-400/40 transition"
    >
      <div className="absolute inset-0 rounded-2xl bg-orange-400/10 blur-2xl opacity-0 hover:opacity-100 transition" />
      <div className="relative z-10 space-y-4">
        <div className="w-20 h-20 relative">
          <Image src={img} alt={title} fill className="object-contain" />
        </div>
        <h3 className="text-xl font-semibold text-orange-600">{title}</h3>
        <p className="text-gray-700 dark:text-gray-300">{description}</p>
      </div>
    </motion.div>
  );
}

function StepCard({ step, title, children }: any) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg text-center">
      <div className="text-4xl font-extrabold text-orange-500 mb-3">{step}</div>
      <h4 className="text-xl font-semibold mb-2">{title}</h4>
      <p className="text-gray-700 dark:text-gray-300">{children}</p>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-3xl font-extrabold text-orange-600">{value}</div>
      <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
    </div>
  );
}

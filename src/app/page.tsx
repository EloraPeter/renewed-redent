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
    <div className="min-h-screen overflow-x-hidden bg-white dark:bg-gray-900">

      {/* ───────── HERO ───────── */}
      <section className="relative max-w-7xl mx-auto px-5 pt-16 pb-20 md:pt-24 md:pt-32 grid grid-cols-1 md:grid-cols-2 gap-14 items-center">

        {/* Glow blob */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-400/20 dark:bg-orange-500/30 blur-3xl rounded-full" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="space-y-6 z-10"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900 dark:text-white">
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
              className="px-8 py-4 rounded-xl border border-orange-400/40 dark:border-orange-400/60 text-orange-700 dark:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-500/5 transition text-center font-medium"
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
          <div className="absolute inset-0 bg-orange-400/30 dark:bg-orange-500/40 blur-3xl rounded-full" />
          <Image
            src={mochihappy}
            alt="Mochi mascot"
            fill
            className="object-contain relative z-10"
          />
        </motion.div>
      </section>

      {/* ───────── STATS ───────── */}
      <section className="py-14 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <Stat value="24/7" label="Smart Reminders" />
          <Stat value="100%" label="Deadline Coverage" />
          <Stat value="0%" label="Nagging Stress" />
          <Stat value="∞" label="Mochi Support" />
        </div>
      </section>

      {/* ───────── HOW IT WORKS ───────── */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            How MochiDo works
            <span className="block text-orange-600 dark:text-orange-400 mt-2">🐹</span>
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
      <section className="py-20 bg-gradient-to-b from-orange-50/50 to-gray-50/50 dark:from-orange-500/5 dark:to-gray-800/30">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-14 text-gray-900 dark:text-white">
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
      <section className="py-24 bg-gradient-to-t from-gray-50/50 to-transparent dark:from-gray-900/50 dark:to-transparent">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="max-w-4xl mx-auto px-6 text-center space-y-6"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
            Your academics don't have to hurt.
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
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
      className="group relative inline-flex items-center justify-center px-8 py-4 font-semibold text-white rounded-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-xl hover:shadow-green-500/25 active:scale-95"
    >
      <span className="absolute inset-0 blur-xl bg-gradient-to-r from-green-500/50 to-green-600/50 dark:from-green-400/60 dark:to-green-500/60 rounded-xl opacity-75 group-hover:opacity-100 transition" />
      <span className="relative z-10">{label}</span>
    </Link>
  );
}

function FeatureCard({ title, description, img }: any) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="relative group bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl hover:shadow-orange-400/25 hover:border-orange-400/40 transition-all duration-300 overflow-hidden"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-400/5 to-orange-500/5 dark:from-orange-500/10 dark:to-orange-600/10 blur-xl group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10 space-y-4">
        <div className="w-20 h-20 mx-auto relative bg-gradient-to-br from-orange-50/50 to-orange-100/50 dark:from-orange-500/10 dark:to-orange-600/20 rounded-2xl p-4">
          <Image src={img} alt={title} fill className="object-contain" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">{title}</h3>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

function StepCard({ step, title, children }: any) {
  return (
    <div className="group bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl border border-gray-200/50 dark:border-gray-700/50 hover:border-orange-400/40 transition-all duration-300 hover:bg-white dark:hover:bg-gray-900">
      <div className="text-4xl font-extrabold bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-400 dark:to-orange-500 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform">{step}</div>
      <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{title}</h4>
      <p className="text-gray-700 dark:text-gray-300">{children}</p>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="group">
      <div className="text-3xl font-extrabold bg-gradient-to-r from-orange-600 to-orange-500 dark:from-orange-400 dark:to-orange-300 bg-clip-text text-transparent group-hover:scale-110 transition-all duration-300">{value}</div>
      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-medium">{label}</div>
    </div>
  );
}
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import mochistudy from "../../public/mochi-study.png";
import mochihappy from "../../public/mochi-happy.png";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-orange-50/50 via-white to-pink-50/30 dark:from-gray-900/50 dark:via-gray-900 dark:to-slate-900/50">

      {/* ───────── HERO ───────── */}
      <section className="relative max-w-7xl mx-auto px-5 pt-16 pb-20 md:pt-24 md:pb-32 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        {/* Enhanced Glow blobs */}
        <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-gradient-to-r from-orange-400/30 via-pink-400/20 to-orange-400/30 blur-3xl rounded-full animate-pulse" />
        <div className="absolute top-1/2 right-0 w-[300px] h-[300px] bg-gradient-to-b from-pink-400/20 to-orange-400/20 blur-3xl rounded-full -animate-pulse animation-delay-2000" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="space-y-8 z-10"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-orange-100/80 dark:bg-orange-900/50 backdrop-blur-sm rounded-full text-sm font-medium text-orange-800 dark:text-orange-200 max-w-max border border-orange-200/50">
            ✨ New: AI-powered study coach
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black leading-[0.9] tracking-tight bg-gradient-to-r from-gray-900 via-orange-600 to-pink-600 dark:from-white dark:via-orange-400 dark:to-pink-400 bg-clip-text text-transparent">
            Stay consistent.
            <br />
            Stay motivated.
            <br />
            <span>Mochi watches your back 🐹</span>
          </h1>

          <p className="text-xl sm:text-2xl text-gray-700 dark:text-gray-300 max-w-lg leading-relaxed">
            MochiDo is a gentle but powerful academic reminder system for students
            and lecturers — combining smart scheduling, emotional motivation,
            and adorable accountability.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <GlowButton href="/signup" label="Get Started Free" />
            <Link
              href="/login"
              className="group relative px-8 py-4 font-semibold rounded-2xl bg-white/80 dark:bg-white/10 backdrop-blur-xl border border-orange-200/50 dark:border-orange-400/30 text-orange-900 dark:text-orange-200 hover:bg-white dark:hover:bg-white/20 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 text-lg"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-pink-400/20 blur-xl rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative">Login</span>
            </Link>
          </div>
        </motion.div>

        {/* Enhanced Mascot */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          className="relative w-full h-[320px] sm:h-[400px] md:h-[500px] lg:h-[600px]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400/40 via-pink-400/30 to-orange-500/40 blur-3xl rounded-3xl animate-pulse" />
          <div className="absolute -inset-4 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-3xl blur-xl animate-ping" />
          <Image
            src={mochihappy}
            alt="Mochi mascot"
            fill
            className="object-contain relative z-20 drop-shadow-2xl"
          />
        </motion.div>
      </section>

      {/* ───────── STATS ───────── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 to-pink-500/5" />
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center relative z-10">
          <Stat value="24/7" label="Smart Reminders" icon="🔔" />
          <Stat value="100%" label="Deadline Coverage" icon="✅" />
          <Stat value="0%" label="Nagging Stress" icon="😌" />
          <Stat value="∞" label="Mochi Support" icon="🐹" />
        </div>
      </section>

      {/* ───────── HOW IT WORKS ───────── */}
      <section className="py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-50/30 to-pink-50/30 dark:from-orange-900/20 dark:to-pink-900/20" />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-orange-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-6">
              How MochiDo works
            </h2>
            <div className="w-28 h-1 bg-gradient-to-r from-orange-400 to-pink-400 mx-auto rounded-full" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard step="1" title="Add your academics" />
            <StepCard step="2" title="Mochi tracks for you" />
            <StepCard step="3" title="Get human reminders" />
          </div>
        </div>
      </section>

      {/* ───────── FEATURES ───────── */}
      <section className="py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-100/30 via-white/50 to-pink-100/30 dark:from-orange-900/20 dark:via-gray-900/30 dark:to-pink-900/20" />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 mb-6">
              Why MochiDo feels different
            </h2>
            <div className="w-28 h-1 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-400 mx-auto rounded-full" />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-pink-500/5 to-orange-500/10" />
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-orange-400/20 to-pink-400/20 blur-3xl rounded-full animate-pulse" />
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="max-w-4xl mx-auto px-6 text-center space-y-8 relative z-10"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-2xl backdrop-blur-sm shadow-2xl">
            <span>🐹</span>
            Ready to stay consistent?
          </div>
          <h2 className="text-5xl lg:text-6xl xl:text-7xl font-black bg-gradient-to-r from-gray-900 via-orange-600 to-pink-600 dark:from-white dark:via-orange-400 dark:to-pink-400 bg-clip-text text-transparent leading-tight">
            Your academics don’t have to hurt.
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Let Mochi help you stay consistent, calm, and in control.
          </p>
          <GlowButton href="/signup" label="Start with Mochi 🐹" size="lg" />
        </motion.div>
      </section>
    </div>
  );
}

/* ───────── COMPONENTS ───────── */

function GlowButton({ href, label, size = "md" }: { href: string; label: string; size?: "md" | "lg" }) {
  return (
    <Link
      href={href}
      className={`
        relative inline-flex items-center justify-center px-8 py-4 ${size === 'lg' ? 'px-12 py-5 text-lg' : 'text-base'} 
        font-bold text-white rounded-2xl bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 
        hover:from-green-600 hover:via-green-700 hover:to-emerald-700 
        transition-all duration-300 shadow-2xl hover:shadow-3xl hover:-translate-y-2 
        backdrop-blur-xl border border-green-400/30 hover:border-green-500/50
        before:absolute before:inset-0 before:bg-gradient-to-r before:from-green-400/50 before:to-emerald-400/50 
        before:blur-xl before:rounded-2xl before:opacity-75 hover:before:opacity-100 before:transition-all before:duration-300
      `}
    >
      <span className="relative z-10 flex items-center gap-2">{label}</span>
    </Link>
  );
}

function FeatureCard({ title, description, img }: any) {
  return (
    <motion.div
      whileHover={{ y: -12, transition: { duration: 0.3 } }}
      className="group relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-white/50 dark:border-gray-700/50 hover:border-orange-400/50 hover:shadow-orange-500/20 transition-all duration-500 overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 via-pink-400/5 to-orange-400/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10 space-y-6">
        <div className="w-24 h-24 relative mx-auto group-hover:scale-110 transition-transform duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400/30 to-pink-400/30 rounded-2xl blur-xl group-hover:animate-ping" />
          <Image src={img} alt={title} fill className="object-contain relative z-10 drop-shadow-lg" />
        </div>
        <div className="space-y-3 text-center">
          <h3 className="text-2xl font-black bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
            {title}
          </h3>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}

function StepCard({ step, title }: any) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
      className="group relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-white/50 dark:border-gray-700/50 hover:border-orange-400/50 hover:shadow-orange-500/20 hover:-translate-y-4 transition-all duration-500 text-center"
    >
      {/* Step number background */}
      <div className="absolute -inset-2 bg-gradient-to-r from-orange-400/20 to-pink-400/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
      
      <div className="relative z-10 space-y-6">
        <div className="w-20 h-20 mx-auto flex items-center justify-center bg-gradient-to-r from-orange-500 to-pink-500 text-3xl font-black text-white rounded-3xl shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 drop-shadow-lg">
          {step}
        </div>
        <h4 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-orange-600 transition-colors duration-300">
          {title}
        </h4>
        <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-pink-400 mx-auto rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </motion.div>
  );
}

function Stat({ value, label, icon }: { value: string; label: string; icon: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.1, transition: { duration: 0.3 } }}
      className="group relative p-6 rounded-3xl bg-gradient-to-b from-white/50 to-white/20 dark:from-gray-900/50 dark:to-gray-800/30 backdrop-blur-xl border border-white/40 dark:border-gray-700/50 hover:border-orange-400/50 shadow-xl hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-500"
    >
      <div className="text-4xl mb-4 opacity-75 group-hover:opacity-100 transition-opacity">{icon}</div>
      <div className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-all duration-300">
        {value}
      </div>
      <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">{label}</div>
    </motion.div>
  );
}
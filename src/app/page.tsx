// src/app/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import mochihappy from "/Projects/My Websites/student-class-reminder/renewed-redent/public/mochi-happy.png";
import mochistudy from "/Projects/My Websites/student-class-reminder/renewed-redent/public/mochi-study.png";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-orange-100 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">

      {/* ───────── HERO ───────── */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-orange-700 dark:text-orange-400">
            Study smarter.  
            <br />
            Stay motivated.  
            <br />
            <span className="text-orange-600 dark:text-orange-300">
              Mochi’s got you 🐹
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-xl">
            MochiDo is a smart academic reminder and motivation system designed
            for students and lecturers. Track courses, assignments, routines,
            deadlines — and get emotional support from Mochi when things get tough.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/signup"
              className="px-8 py-4 bg-green-600 text-white font-semibold rounded-xl shadow-lg hover:scale-105 hover:bg-green-700 transition"
            >
              Get Started Free
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-orange-600 text-white font-semibold rounded-xl shadow-lg hover:scale-105 hover:bg-orange-700 transition"
            >
              Login
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative w-full h-[360px] md:h-[420px]"
        >
          <Image
            src={mochihappy}
            alt="Mochi mascot"
            fill
            className="object-contain drop-shadow-2xl"
          />
        </motion.div>
      </section>

      {/* ───────── WHO IT’S FOR ───────── */}
      <section className="py-20 bg-white/70 dark:bg-gray-900/70 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-4xl font-bold text-center text-orange-600 dark:text-orange-400 mb-12"
          >
            Built for real academic life
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <AudienceCard
              title="For Students"
              points={[
                "Never miss assignments or tests again",
                "Daily reminders that feel human, not robotic",
                "Build healthy study routines and streaks",
                "Emotional motivation when burnout hits",
              ]}
            />

            <AudienceCard
              title="For Lecturers"
              points={[
                "Manage multiple classes effortlessly",
                "Automated reminders & summaries",
                "Less micromanagement, better engagement",
                "Clear overview of student activity",
              ]}
            />
          </div>
        </div>
      </section>

      {/* ───────── FEATURES ───────── */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-orange-700 dark:text-orange-400 mb-14">
            Why students love MochiDo
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <FeatureCard
              title="Smart Tracking"
              description="Courses, assignments, deadlines, routines — all in one intelligent dashboard that actually helps you stay consistent."
              img={mochistudy}
            />
            <FeatureCard
              title="Emotional Feedback"
              description="Mochi reacts to your progress. Celebrate wins, feel supported during slumps, and stay encouraged."
              img={mochihappy}
            />
            <FeatureCard
              title="Automatic Reminders"
              description="Daily, weekly, and deadline-based reminders that adapt to your schedule and workload."
              img={mochihappy}
            />
          </div>
        </div>
      </section>

      {/* ───────── CTA ───────── */}
      <section className="py-24 bg-gradient-to-r from-orange-100 to-orange-200 dark:from-gray-800 dark:to-gray-700">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="max-w-4xl mx-auto text-center px-6 space-y-6"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-orange-700 dark:text-orange-300">
            Turn stress into structure 📚
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            MochiDo helps you stay organized, motivated, and emotionally supported
            throughout your academic journey.
          </p>
          <Link
            href="/signup"
            className="inline-block px-10 py-5 bg-green-600 text-white font-bold rounded-2xl shadow-xl hover:scale-105 hover:bg-green-700 transition"
          >
            Join MochiDo Today
          </Link>
        </motion.div>
      </section>
    </div>
  );
}

/* ───────── COMPONENTS ───────── */

function FeatureCard({
  title,
  description,
  img,
}: {
  title: string;
  description: string;
  img: any;
}) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center space-y-4"
    >
      <div className="relative w-28 h-28 mx-auto">
        <Image src={img} alt={title} fill className="object-contain" />
      </div>
      <h3 className="text-xl font-semibold text-orange-700 dark:text-orange-300">
        {title}
      </h3>
      <p className="text-gray-700 dark:text-gray-300">
        {description}
      </p>
    </motion.div>
  );
}

function AudienceCard({
  title,
  points,
}: {
  title: string;
  points: string[];
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
    >
      <h3 className="text-2xl font-bold text-orange-600 dark:text-orange-300 mb-4">
        {title}
      </h3>
      <ul className="space-y-3 text-gray-700 dark:text-gray-300">
        {points.map((point, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-green-500 font-bold">✓</span>
            {point}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

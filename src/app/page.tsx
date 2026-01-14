// src/app/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion"; // for subtle animations
import mochihappy from "@/public/mochi-happy.png"; // example mascot image
import mochistudy from "@/public/mochi-study.png";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto px-6 py-16 gap-8">
        <div className="flex-1 space-y-6">
          <h1 className="text-5xl md:text-6xl font-extrabold text-orange-700 dark:text-orange-400 leading-tight">
            Welcome to <span className="text-orange-600 dark:text-orange-300">MochiDo</span> 🐹
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-lg">
            Your smart academic companion for students and lecturers. Track courses, assignments, routines, and get emotional motivation from Mochi, your personal hamster mascot!
          </p>
          <div className="flex gap-4 mt-4">
            <Link href="/login" className="px-6 py-3 bg-orange-600 text-white rounded-lg shadow hover:bg-orange-700 transition">
              Login
            </Link>
            <Link href="/signup" className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition">
              Sign Up
            </Link>
          </div>
        </div>
        <motion.div
          className="flex-1 relative w-full h-80 md:h-96"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Image
            src={mochihappy}
            alt="Mochi the Hamster"
            className="object-contain"
            fill
          />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="bg-white dark:bg-gray-900 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-orange-600 dark:text-orange-400 mb-12">
            Why MochiDo?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <FeatureCard
              title="Smart Course & Assignment Tracking"
              description="Keep all your courses, assignments, and deadlines in one place, and get Mochi's emotional nudges when tasks are due!"
              img={mochistudy}
            />
            <FeatureCard
              title="Emotional Motivation"
              description="Mochi reacts to your progress: happy when you finish, concerned if you miss deadlines, celebrating your streaks!"
              img={mochihappy}
            />
            <FeatureCard
              title="Lecturer Notifications"
              description="Automated daily and weekly summaries, so lecturers can manage classes and assignments stress-free."
              img={mochihappy}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-orange-50 dark:bg-gray-800">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-bold text-orange-700 dark:text-orange-400">
            Ready to make academic life fun and productive?
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-lg">
            Join MochiDo today and transform how you manage studies, routines, and motivation.
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-4 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition"
          >
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
}

// Feature Card Component
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
      className="bg-orange-50 dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col items-center text-center"
      whileHover={{ scale: 1.05 }}
    >
      <div className="w-32 h-32 relative mb-4">
        <Image src={img} alt={title} fill className="object-contain" />
      </div>
      <h3 className="text-xl font-semibold text-orange-700 dark:text-orange-300 mb-2">{title}</h3>
      <p className="text-gray-700 dark:text-gray-300">{description}</p>
    </motion.div>
  );
}

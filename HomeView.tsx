/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Gift, Users, GraduationCap, ArrowRight, Sparkles, Globe, Shield } from 'lucide-react';
import { motion } from 'motion/react';
import Logo from './Logo';

interface HomeViewProps {
  onNavigate: (tab: 'home' | 'donate' | 'volunteer' | 'workshops' | 'admin') => void;
}

export default function HomeView({ onNavigate }: HomeViewProps) {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-6 pt-6">
        {/* Central Logo Emblem */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center pt-2"
        >
          <Logo className="w-20 h-20" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-6xl font-display font-medium tracking-tight text-gray-900 leading-tight"
        >
          Aspire<span className="text-purple-600">Bridge</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl sm:text-2xl font-light text-slate-500 max-w-2xl mx-auto font-sans"
        >
          Bridging aspirations and opportunities.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="pt-6"
        >
          <div className="h-1.5 w-24 bg-gradient-to-r from-purple-600 to-yellow-500 rounded-full mx-auto" />
        </motion.div>
      </section>

      {/* Core Action Callouts (The 3 Buttons Requested) */}
      <section className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Action 1: Donate */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="group relative bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-lg transition-all text-left flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="inline-flex p-3 rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-650 group-hover:text-white transition-colors duration-300">
                <Gift className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-medium text-slate-800">Donate</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Support our mission by donating essential items like clothing, books, educational supplies, and jewellery to help level the learning field.
              </p>
            </div>
            <button
              onClick={() => onNavigate('donate')}
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors group/btn"
              id="btn-navigate-donate"
            >
              Start Donation
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* Action 2: Volunteer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
            className="group relative bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-lg transition-all text-left flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="inline-flex p-3 rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-650 group-hover:text-white transition-colors duration-300">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-medium text-slate-800">Volunteer</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Become a volunteer or apply to join our core operations team. Give back your time, skills, and energy to guide aspiring children.
              </p>
            </div>
            <button
              onClick={() => onNavigate('volunteer')}
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors group/btn"
              id="btn-navigate-volunteer"
            >
              Join the Team
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* Action 3: Join a Workshop */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
            className="group relative bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-lg transition-all text-left flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="inline-flex p-3 rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-650 group-hover:text-white transition-colors duration-300">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-medium text-slate-800">Join a Workshop</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Enroll in free, high-impact Generative AI and core tech skill cohorts designed to build launching pads for students and young learners.
              </p>
            </div>
            <button
              onClick={() => onNavigate('workshops')}
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors group/btn"
              id="btn-navigate-workshops"
            >
              Explore Workshops
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* About Section / Vision Details */}
      <section className="bg-slate-50 rounded-3xl p-8 md:p-12 max-w-5xl mx-auto border border-purple-50/60 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-display font-medium text-slate-900 tracking-tight">
              Why We Exist
            </h2>
            <p className="text-slate-600 leading-relaxed text-base">
              AspireBridge is a committed grassroots initiative designed to level the playing field for young people of diverse backgrounds. We recognize that talent and curiosity exist everywhere, but structure, materials, and mentoring opportunities do not.
            </p>
            <p className="text-slate-600 leading-relaxed text-base border-l-4 border-yellow-400 pl-4 bg-yellow-50/20 py-2 rounded-r-lg">
              We focus on addressing immediate, fundamental needs by mobilizing educational resources and essential supplies, while creating long-term opportunities through digital literacy programs, advanced AI workshops, and peer mentorship networks that prepare our youth to lead tomorrow.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-xs">
                <Globe className="w-3.5 h-3.5 text-purple-600" />
                Global Mindset
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-xs">
                {/* Replaced generic Heart icon with actual miniature logo */}
                <Logo className="w-3.5 h-3.5" />
                Community First
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-xs">
                <Shield className="w-3.5 h-3.5 text-purple-600" />
                Trusted & Transparent
              </div>
            </div>
          </div>

          {/* Core Focus Areas */}
          <div className="space-y-5">
            {/* Resource Redistribution */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex gap-4">
              <div className="p-3 bg-purple-50 rounded-xl h-fit text-purple-600">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-display font-medium text-slate-800">Resource Redistribution</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  We collect and distribute essential resources including Clothing, Jewellery, Books, and Educational Supplies. We verify, sort, and deliver them directly to eager learning centers.
                </p>
              </div>
            </div>

            {/* Generative AI Workshops */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex gap-4">
              <div className="p-3 bg-purple-50 rounded-xl h-fit text-yellow-600">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-display font-medium text-slate-800">Generative AI Workshops</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Explore the future of technology through hands-on workshops designed for students and young learners. Topics include AI Essentials & Digital Literacy, Prompt Engineering, ChatGPT and Gemini, Google AI Studio, AI Image Generation, AI Video Generation (Veo, Flow, Sora), AI-Powered Content Creation, and CapCut.
                </p>
              </div>
            </div>

            {/* Meaningful Peer Mentoring */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex gap-4">
              <div className="p-3 bg-purple-50 rounded-xl h-fit text-purple-600">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-display font-medium text-slate-800">Meaningful Peer Mentoring</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  We deliver interactive peer tutoring, focus on essential workshops, and advance digital literacy to bridge educational gaps and unlock potential.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action panel at bottom */}
      <section className="max-w-5xl mx-auto rounded-3xl bg-slate-900 text-white p-8 md:p-12 text-center space-y-6 relative overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.15),transparent_50%)]" />
        <div className="relative space-y-3 max-w-2xl mx-auto">
          <h2 className="text-3xl font-display font-medium tracking-tight">Ready to bridge the opportunity gap?</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Whether you want to sponsor materials, instruct/mentor, or sign up as an eager student learner, your role makes our shared bridge stronger.
          </p>
        </div>
        <div className="relative flex flex-wrap justify-center gap-4 pt-3">
          <button
            onClick={() => onNavigate('donate')}
            className="px-6 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-500 transition-colors cursor-pointer"
            id="btn-bottom-donate"
          >
            Donate Materials
          </button>
          <button
            onClick={() => onNavigate('volunteer')}
            className="px-6 py-2.5 rounded-xl bg-slate-800 text-slate-200 text-sm font-semibold hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
            id="btn-bottom-volunteer"
          >
            Become a Volunteer
          </button>
        </div>
      </section>
    </div>
  );
}

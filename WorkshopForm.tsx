/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GraduationCap, BookOpen, AlertCircle, Calendar, Sparkles, ArrowLeft, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { saveWorkshopSignup } from '../lib/storage';

interface WorkshopFormProps {
  onSuccess: () => void;
  onNavigateHome: () => void;
}

const AVAILABLE_WORKSHOPS = [
  'AI Essentials and Digital Literacy',
  'Prompt Engineering',
  'ChatGPT and Gemini',
  'Google AI Studio',
  'AI Image Generation',
  'AI Video Generation (Veo, Flow, Sora)',
  'AI-Powered Content Creation',
  'CapCut and Video Editing with AI'
];

export default function WorkshopForm({ onSuccess, onNavigateHome }: WorkshopFormProps) {
  // Form State
  const [name, setName] = useState('');
  const [ageClass, setAgeClass] = useState('');
  const [institution, setInstitution] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [workshopTitle, setWorkshopTitle] = useState(AVAILABLE_WORKSHOPS[0]);
  const [level, setLevel] = useState<'beginner' | 'intermediate'>('beginner');
  const [parentContact, setParentContact] = useState('');

  // UI state
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validations
    if (!name.trim()) return setErrorMessage('Please provide your name.');
    if (!ageClass.trim()) return setErrorMessage('Please specify your age or school grade/class.');
    if (!institution.trim()) return setErrorMessage('Please specify your school or college.');
    if (!contactNumber.trim()) return setErrorMessage('Please specify your contact phone number.');
    if (!workshopTitle) return setErrorMessage('Please select a workshop.');

    setIsSubmitting(true);
    try {
      // Save
      await saveWorkshopSignup({
        name,
        ageClass,
        institution,
        contactNumber,
        workshopTitle,
        level,
        parentContact: parentContact.trim() || undefined,
      });

      setIsSubmitted(true);
      if (onSuccess) {
        onSuccess();
      }
    } catch (e: any) {
      setErrorMessage(e?.message || 'Failed to submit registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-xl mx-auto bg-white rounded-2xl border border-purple-100 p-8 text-center space-y-6 shadow-md"
      >
        <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto text-purple-600">
          <BookOpen className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-display font-medium text-slate-900">Registration Success!</h3>
          <p className="text-slate-500 text-sm">
            Awesome, <span className="font-semibold text-slate-100">{name}</span>! You are successfully registered for <span className="font-semibold text-purple-600">"{workshopTitle}"</span>.
          </p>
        </div>

        <div className="bg-purple-50 rounded-xl p-4 text-left text-xs text-purple-800 space-y-1.5 border border-purple-150 font-sans">
          <div className="font-semibold flex items-center gap-1.5 text-purple-900">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            Class Access Logged
          </div>
          <div>We have saved your seat. Workshop details, calendar invitations, and classroom link/location details will be sent directly to your phone contact number <strong className="font-semibold">{contactNumber}</strong> prior to the start date.</div>
        </div>

        <div className="pt-4 flex gap-3 justify-center">
          <button
            onClick={onNavigateHome}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
            id="success-w-home"
          >
            Back to Home
          </button>
          <button
            onClick={() => {
              setName('');
              setAgeClass('');
              setInstitution('');
              setContactNumber('');
              setWorkshopTitle(AVAILABLE_WORKSHOPS[0]);
              setLevel('beginner');
              setParentContact('');
              setIsSubmitted(false);
            }}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-750 transition cursor-pointer"
            id="success-new-w-btn"
          >
            Register for Another
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 text-left">
      {/* Header back button */}
      <div className="flex justify-between items-center">
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-purple-600 transition font-medium cursor-pointer"
          id="btn-w-back-home"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>
        <span className="text-xs font-mono text-slate-400">Class Signup Portal</span>
      </div>

      <div className="bg-white rounded-3xl border border-purple-50 shadow-xs overflow-hidden">
        {/* Top bar decor */}
        <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-yellow-500 h-2.5" />

        <div className="p-8 md:p-10 space-y-6">
          <div className="space-y-1.5">
            <h2 className="text-2xl font-display font-medium text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-purple-600" />
              Register for a Workshop
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed font-sans">
              Join a nurturing cohort of ambitious learners. Our free Generative AI and core technology workshops provide hands-on skill-building for school, college, and university students seeking to confidently navigate the digital future.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMessage && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2.5 text-xs text-rose-700 font-sans" id="w-error-alert">
                <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold text-slate-700" htmlFor="w-fullname">
                  Student Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="w-fullname"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-purple-500 focus:ring-2 focus:ring-purple-55/50 bg-slate-50/50 transition-all font-sans"
                  placeholder="e.g. Carlos Gomez"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold text-slate-700" htmlFor="w-age">
                  Age / Class (Grade) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="w-age"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-purple-500 focus:ring-2 focus:ring-purple-55/50 bg-slate-50/50 transition-all font-sans"
                  placeholder="e.g. 15 years old / 9th Grade"
                  value={ageClass}
                  onChange={(e) => setAgeClass(e.target.value)}
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold text-slate-700" htmlFor="w-institution">
                  School / College / University <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="w-institution"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-purple-500 focus:ring-2 focus:ring-purple-55/50 bg-slate-50/50 transition-all font-sans"
                  placeholder="e.g. Clifton High School"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold text-slate-700" htmlFor="w-contact">
                  Contact Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  id="w-contact"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-purple-500 focus:ring-2 focus:ring-purple-55/50 bg-slate-50/50 transition-all font-sans"
                  placeholder="e.g. +31 6 12345678"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold text-slate-700" htmlFor="w-title">
                  Workshop to Attend <span className="text-rose-500">*</span>
                </label>
                <select
                  id="w-title"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-purple-500 focus:ring-2 focus:ring-purple-55/50 bg-slate-50/50 transition-all font-sans cursor-pointer"
                  value={workshopTitle}
                  onChange={(e) => setWorkshopTitle(e.target.value)}
                >
                  {AVAILABLE_WORKSHOPS.map((workshop) => (
                    <option key={workshop} value={workshop}>
                      {workshop}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold text-slate-700" htmlFor="w-level">
                  Preferred Skill Level <span className="text-rose-500">*</span>
                </label>
                <select
                  id="w-level"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-purple-500 focus:ring-2 focus:ring-purple-55/50 bg-slate-50/50 transition-all font-sans cursor-pointer"
                  value={level}
                  onChange={(e) => setLevel(e.target.value as any)}
                >
                  <option value="beginner">Beginner (Zero prior experience)</option>
                  <option value="intermediate">Intermediate (Some foundation built)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <div className="flex justify-between">
                <label className="block text-xs font-semibold text-slate-700" htmlFor="w-parent">
                  Parent / Guardian Contact Info
                </label>
                <span className="text-[10px] text-slate-400 font-medium font-sans">Required if student is under 18</span>
              </div>
              <input
                type="text"
                id="w-parent"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-purple-500 focus:ring-2 focus:ring-purple-55/50 bg-slate-50/50 transition-all font-sans"
                placeholder="e.g. Elena Gomez (Mother) / +57 321 444 8888"
                value={parentContact}
                onChange={(e) => setParentContact(e.target.value)}
              />
            </div>

            <div className="pt-4 border-t border-slate-150 flex justify-end gap-3">
              <button
                type="button"
                onClick={onNavigateHome}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                id="w-cancel"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition cursor-pointer"
                id="w-submit"
              >
                <Send className="w-3.5 h-3.5" />
                Register Seat
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

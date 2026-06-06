/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Users, ShieldAlert, GraduationCap, Heart, ClipboardCheck, ArrowLeft, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { saveVolunteer, saveTeamApplication } from '../lib/storage';

interface VolunteerFormViewProps {
  onSuccess: () => void;
  onNavigateHome: () => void;
}

type Mode = 'volunteer' | 'team';

export default function VolunteerFormView({ onSuccess, onNavigateHome }: VolunteerFormViewProps) {
  const [activeMode, setActiveMode] = useState<Mode>('volunteer');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [lastSubmittedName, setLastSubmittedName] = useState('');
  const [errorMess, setErrorMess] = useState('');

  // --- VOLUNTEER FORM STATES ---
  const [vName, setVName] = useState('');
  const [vEmail, setVEmail] = useState('');
  const [vPhone, setVPhone] = useState('');
  const [vAge, setVAge] = useState('');
  const [vCity, setVCity] = useState('');
  const [vInstitution, setVInstitution] = useState('');
  const [vSkills, setVSkills] = useState('');
  const [vAvailability, setVAvailability] = useState('');
  const [vWhy, setVWhy] = useState('');
  const [vArea, setVArea] = useState('Teaching / Workshop Mentoring');

  // --- CORE TEAM FORM STATES ---
  const [tName, setTName] = useState('');
  const [tAge, setTAge] = useState('');
  const [tContact, setTContact] = useState('');
  const [tSkills, setTSkills] = useState('');
  const [tExperience, setTExperience] = useState('');
  const [tWhy, setTWhy] = useState('');
  const [tTeam, setTTeam] = useState('AI Mentorship');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVolunteerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMess('');

    // Validations
    if (!vName.trim()) return setErrorMess('Please enter your full name.');
    if (!vEmail.trim()) return setErrorMess('Please enter your email address.');
    if (!vEmail.includes('@') || !vEmail.includes('.')) return setErrorMess('Please enter a valid email address.');
    if (!vPhone.trim()) return setErrorMess('Please enter your phone number.');
    if (!vAge) return setErrorMess('Please enter your age.');
    if (isNaN(Number(vAge)) || Number(vAge) <= 0) return setErrorMess('Please enter a valid age.');
    if (!vCity.trim()) return setErrorMess('Please enter your city.');
    if (!vInstitution.trim()) return setErrorMess('Please enter your school/college/university.');
    if (!vSkills.trim()) return setErrorMess('Please outline some of your skills.');
    if (!vAvailability.trim()) return setErrorMess('Please enter your availability details.');
    if (!vWhy.trim()) return setErrorMess('Please explain why you want to volunteer.');

    setIsSubmitting(true);
    try {
      // Save Volunteer State
      await saveVolunteer({
        fullName: vName,
        email: vEmail,
        phone: vPhone,
        age: Number(vAge),
        city: vCity,
        institution: vInstitution,
        skills: vSkills,
        availability: vAvailability,
        whyVolunteer: vWhy,
        area: vArea as any,
      });

      setLastSubmittedName(vName);
      setIsSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (e: any) {
      setErrorMess(e?.message || 'Failed to submit volunteer application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTeamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMess('');

    // Validations
    if (!tName.trim()) return setErrorMess('Please enter your name.');
    if (!tAge) return setErrorMess('Please enter your age.');
    if (isNaN(Number(tAge)) || Number(tAge) <= 0) return setErrorMess('Please enter a valid age.');
    if (!tContact.trim()) return setErrorMess('Please enter your contact information.');
    if (!tSkills.trim()) return setErrorMess('Please specify your skills.');
    if (!tWhy.trim()) return setErrorMess('Please express your motivations to join.');

    setIsSubmitting(true);
    try {
      // Save Core Team
      await saveTeamApplication({
        fullName: tName,
        age: Number(tAge),
        contact: tContact,
        skills: tSkills,
        experience: tExperience ? tExperience.trim() : 'None declared',
        whyJoin: tWhy,
        team: tTeam,
        weeklyHours: 0, // removed hours selection, default placeholder
      });

      setLastSubmittedName(tName);
      setIsSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (e: any) {
      setErrorMess(e?.message || 'Failed to submit core team application. Please try again.');
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
          <ClipboardCheck className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-display font-medium text-slate-900">Application Submitted!</h3>
          <p className="text-slate-500 text-sm">
            Thank you, <span className="font-semibold text-slate-850">{lastSubmittedName}</span>. Your application for the {activeMode === 'volunteer' ? 'volunteer cohort' : 'core committee team'} is being reviewed.
          </p>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 text-left text-xs text-slate-600 space-y-1.5 border border-slate-100 font-sans">
          <div className="font-semibold text-slate-800">What is the next step?</div>
          <div>Our administration reviews entries weekly. We will reach out to you via your provided contact handles to coordinate a quick 15-minute video introduction & alignment conversation.</div>
        </div>

        <div className="pt-4 flex gap-3 justify-center">
          <button
            onClick={onNavigateHome}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
            id="success-v-home"
          >
            Back to Home
          </button>
          <button
            onClick={() => {
              setVName(''); setVEmail(''); setVPhone(''); setVAge(''); setVCity(''); setVInstitution(''); setVSkills(''); setVAvailability(''); setVWhy('');
              setTName(''); setTAge(''); setTContact(''); setTSkills(''); setTExperience(''); setTWhy('');
              setIsSubmitted(false);
            }}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-750 transition cursor-pointer"
            id="success-new-v-btn"
          >
            Submit Another Request
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 text-left">
      {/* Header back link */}
      <div className="flex justify-between items-center">
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-purple-600 transition font-medium cursor-pointer"
          id="btn-v-back-home"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>
        <span className="text-xs font-mono text-slate-400">Join our Workforce</span>
      </div>

      {/* Mode Switches */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl max-w-sm mx-auto border border-slate-200/60 shadow-2xs">
        <button
          onClick={() => { setActiveMode('volunteer'); setErrorMess(''); }}
          className={`flex-1 py-2.5 rounded-xl text-xs font-semibold font-display tracking-tight transition-all duration-200 cursor-pointer ${activeMode === 'volunteer' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-purple-600'}`}
          id="toggle-tab-volunteer"
        >
          Volunteer Form
        </button>
        <button
          onClick={() => { setActiveMode('team'); setErrorMess(''); }}
          className={`flex-1 py-2.5 rounded-xl text-xs font-semibold font-display tracking-tight transition-all duration-200 cursor-pointer ${activeMode === 'team' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-purple-600'}`}
          id="toggle-tab-team"
        >
          Core Team Application
        </button>
      </div>

      {/* Main Form container */}
      <div className="bg-white rounded-3xl border border-purple-50 shadow-xs overflow-hidden">
        {/* Banner Decoration */}
        <div className="h-2.5 bg-gradient-to-r from-purple-600 via-purple-500 to-yellow-500" />

        <div className="p-8 md:p-10 space-y-6">
          {activeMode === 'volunteer' ? (
            <div className="space-y-1.5">
              <h2 className="text-2xl font-display font-medium text-slate-900 flex items-center gap-2">
                <Heart className="w-5 h-5 text-purple-600" />
                Become an AspireBridge Volunteer
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed font-sans">
                Offer your unique skills and spare time to deliver workshops, coordinate logistics, or create engaging media content.
              </p>
            </div>
          ) : (
            <div className="space-y-1.5">
              <h2 className="text-2xl font-display font-medium text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                Apply to the Core Committee Team
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed font-sans">
                The AspireBridge Core Committee is responsible for steering our structural growth. Core members organize workshop curriculum, manage resource redistribution logistics, coordinate partner relations, and lead local chapters.
              </p>
            </div>
          )}

          {errorMess && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2.5 text-xs text-rose-700 font-sans" id="v-error-banner">
              <ShieldAlert className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
              <span>{errorMess}</span>
            </div>
          )}

          {/* VOLUNTEER FORM */}
          {activeMode === 'volunteer' && (
            <form onSubmit={handleVolunteerSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5 text-left">
                  <label className="block text-xs font-semibold text-slate-700" htmlFor="vol-fullname">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="vol-fullname"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-purple-500 focus:ring-2 focus:ring-purple-55/50 bg-slate-50/50 transition-all font-sans"
                    placeholder="Amara Okafor"
                    value={vName}
                    onChange={(e) => setVName(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="block text-xs font-semibold text-slate-700" htmlFor="vol-age">
                    Age <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="vol-age"
                    min="1"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-purple-500 focus:ring-2 focus:ring-purple-55/50 bg-slate-50/50 transition-all font-sans"
                    placeholder="21"
                    value={vAge}
                    onChange={(e) => setVAge(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="block text-xs font-semibold text-slate-700" htmlFor="vol-city">
                    City <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="vol-city"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-purple-500 focus:ring-2 focus:ring-purple-55/50 bg-slate-50/50 transition-all font-sans"
                    placeholder="Enugu"
                    value={vCity}
                    onChange={(e) => setVCity(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="block text-xs font-semibold text-slate-700" htmlFor="vol-institution">
                    School / College / University <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="vol-institution"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-purple-500 focus:ring-2 focus:ring-purple-55/50 bg-slate-50/50 transition-all font-sans"
                    placeholder="e.g. University of Nigeria"
                    value={vInstitution}
                    onChange={(e) => setVInstitution(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="block text-xs font-semibold text-slate-700" htmlFor="vol-email">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="vol-email"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-purple-500 focus:ring-2 focus:ring-purple-55/50 bg-slate-50/50 transition-all font-sans"
                    placeholder="amara@example.com"
                    value={vEmail}
                    onChange={(e) => setVEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="block text-xs font-semibold text-slate-700" htmlFor="vol-phone">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="vol-phone"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-purple-500 focus:ring-2 focus:ring-purple-55/50 bg-slate-50/50 transition-all font-sans"
                    placeholder="+234 80 1234 5678"
                    value={vPhone}
                    onChange={(e) => setVPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold text-slate-700" htmlFor="vol-area">
                  Which area are you interested in volunteering? <span className="text-rose-500">*</span>
                </label>
                <select
                  id="vol-area"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-purple-500 focus:ring-2 focus:ring-purple-55/50 bg-slate-50/50 transition-all font-sans cursor-pointer"
                  value={vArea}
                  onChange={(e) => setVArea(e.target.value)}
                >
                  <option value="Teaching / Workshop Mentoring">Teaching / Workshop Mentoring</option>
                  <option value="Content and Media Creation">Content and Media Creation</option>
                  <option value="Social Work">Social Work</option>
                </select>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold text-slate-700" htmlFor="vol-skills">
                  Your Skills <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="vol-skills"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-purple-500 focus:ring-2 focus:ring-purple-55/50 bg-slate-50/50 transition-all font-sans"
                  placeholder="e.g. Graphic design, math tutoring, local coordination"
                  value={vSkills}
                  onChange={(e) => setVSkills(e.target.value)}
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold text-slate-700" htmlFor="vol-availability">
                  Availability <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="vol-availability"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-purple-500 focus:ring-2 focus:ring-purple-55/50 bg-slate-50/50 transition-all font-sans"
                  placeholder="e.g. Saturdays afternoons, or 3hr weekly remote on evenings"
                  value={vAvailability}
                  onChange={(e) => setVAvailability(e.target.value)}
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold text-slate-700" htmlFor="vol-why">
                  Why do you want to volunteer with AspireBridge? <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="vol-why"
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-purple-500 focus:ring-2 focus:ring-purple-55/50 bg-slate-50/50 transition-all font-sans"
                  placeholder="Please clarify your alignment with AspireBridge goals..."
                  value={vWhy}
                  onChange={(e) => setVWhy(e.target.value)}
                />
              </div>

              <div className="pt-4 border-t border-slate-150 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onNavigateHome}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                  id="v-form-cancel"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 transition cursor-pointer"
                  id="v-form-submit"
                >
                  <Send className="w-3.5 h-3.5" />
                  Submit Volunteer Application
                </button>
              </div>
            </form>
          )}

          {/* CORE TEAM FORM */}
          {activeMode === 'team' && (
            <form onSubmit={handleTeamSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5 text-left">
                  <label className="block text-xs font-semibold text-slate-700" htmlFor="team-fullname">
                    Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="team-fullname"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-purple-500 focus:ring-2 focus:ring-purple-55/50 bg-slate-50/50 transition-all font-sans"
                    placeholder="Your Name"
                    value={tName}
                    onChange={(e) => setTName(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="block text-xs font-semibold text-slate-700" htmlFor="team-age">
                    Age <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="team-age"
                    min="1"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-purple-500 focus:ring-2 focus:ring-purple-55/50 bg-slate-50/50 transition-all font-sans"
                    placeholder="26"
                    value={tAge}
                    onChange={(e) => setTAge(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5 text-left col-span-1 sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700" htmlFor="team-contact">
                    Contact Info (Email / Social Handle / Phone) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="team-contact"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-purple-500 focus:ring-2 focus:ring-purple-55/50 bg-slate-50/50 transition-all font-sans"
                    placeholder="e.g. nikhil.m@example.com / +91 9876543210"
                    value={tContact}
                    onChange={(e) => setTContact(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5 text-left col-span-1 sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700" htmlFor="team-select">
                    Which team would you like to join? <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="team-select"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-purple-500 focus:ring-2 focus:ring-purple-55/50 bg-slate-50/50 transition-all font-sans cursor-pointer"
                    value={tTeam}
                    onChange={(e) => setTTeam(e.target.value)}
                  >
                    <option value="AI Mentorship">AI Mentorship</option>
                    <option value="Content Production">Content Production</option>
                    <option value="Social Impact">Social Impact</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold text-slate-700" htmlFor="team-skills">
                  Specific Skills / Strengths <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="team-skills"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-purple-500 focus:ring-2 focus:ring-purple-55/50 bg-slate-50/50 transition-all font-sans"
                  placeholder="e.g. curriculum designer, logistics management, copywriting"
                  value={tSkills}
                  onChange={(e) => setTSkills(e.target.value)}
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold text-slate-700" htmlFor="team-experience">
                  Previous Experience (if any)
                </label>
                <textarea
                  id="team-experience"
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-purple-500 focus:ring-2 focus:ring-purple-55/50 bg-slate-50/50 transition-all font-sans"
                  placeholder="Detail any background or previous roles..."
                  value={tExperience}
                  onChange={(e) => setTExperience(e.target.value)}
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold text-slate-700" htmlFor="team-why">
                  Why do you want to join AspireBridge? <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="team-why"
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-purple-500 focus:ring-2 focus:ring-purple-55/50 bg-slate-50/50 transition-all font-sans"
                  placeholder="Your driving motivation to expand educational access..."
                  value={tWhy}
                  onChange={(e) => setTWhy(e.target.value)}
                />
              </div>

              <div className="pt-4 border-t border-slate-150 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onNavigateHome}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                  id="team-cancel"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 transition cursor-pointer"
                  id="team-submit"
                >
                  <Send className="w-3.5 h-3.5" />
                  Submit Core Application
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

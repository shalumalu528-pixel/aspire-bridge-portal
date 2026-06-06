/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, Users, GraduationCap, Home, ShieldCheck, Sparkles, Instagram } from 'lucide-react';
import HomeView from './HomeView';
import DonateForm from './DonateForm';
import VolunteerFormView from './VolunteerFormView';
import WorkshopForm from './WorkshopForm.tsx';
import AdminDashboardView from './AdminDashboardView';
import AdminLoginView from './AdminLoginView';
import Logo from './Logo';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

type Tab = 'home' | 'donate' | 'volunteer' | 'workshops' | 'admin';

export default function App() {
  const [currentTab, setCurrentTab] = useState<Tab>('home');
  const [authUser, setAuthUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // Trigger feedback banner on success
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleActionSuccess = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 4500);
  };

  useEffect(() => {
    if (!auth) {
      setAuthUser(null);
      setIsAdmin(false);
      setIsLoadingAuth(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setAuthUser(firebaseUser);
      if (firebaseUser) {
        if (firebaseUser.email === 'aspire.bridge01@gmail.com') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          // Auto sign out unauthorized accounts instantly
          signOut(auth).finally(() => {
            handleActionSuccess('Access Denied. Authorized workspace credentials required.');
            setCurrentTab('home');
          });
        }
      } else {
        setIsAdmin(false);
      }
      setIsLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col justify-between font-sans text-slate-800 antialiased selection:bg-purple-100 selection:text-slate-900">
      
      {/* Dynamic Success Notification Banner */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
          >
            <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-xl border border-slate-800 flex items-center gap-3.5">
              <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div className="flex-1 text-left">
                <h4 className="text-xs font-bold font-display uppercase tracking-wider text-slate-400">System Notification</h4>
                <p className="text-xs text-slate-200 font-sans mt-0.5">{successMessage}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Layout Header */}
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-purple-100/40 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Logo Brand Title with Logo Component */}
          <button
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-2 group transition text-left cursor-pointer"
            id="brand-logo-trigger"
          >
            <Logo showText={true} className="w-9 h-9" />
          </button>

          {/* Core Navigation Items */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200/40">
            <button
              onClick={() => setCurrentTab('home')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-tight cursor-pointer transition-all ${
                currentTab === 'home' ? 'bg-white text-purple-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              id="nav-home"
            >
              Home
            </button>
            <button
              onClick={() => setCurrentTab('donate')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-tight cursor-pointer transition-all ${
                currentTab === 'donate' ? 'bg-white text-purple-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              id="nav-donate"
            >
              Donate
            </button>
            <button
              onClick={() => setCurrentTab('volunteer')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-tight cursor-pointer transition-all ${
                currentTab === 'volunteer' ? 'bg-white text-purple-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              id="nav-volunteer"
            >
              Volunteer
            </button>
            <button
              onClick={() => setCurrentTab('workshops')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-tight cursor-pointer transition-all ${
                currentTab === 'workshops' ? 'bg-white text-purple-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              id="nav-workshops"
            >
              Workshops
            </button>
          </nav>

          {/* Admin Switch and Access Button */}
          {isAdmin && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentTab('admin')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer border ${
                  currentTab === 'admin'
                    ? 'bg-purple-900 border-purple-900 text-white shadow-xs'
                    : 'bg-white hover:bg-purple-50 text-slate-600 border-slate-200 hover:text-purple-600 hover:border-purple-200'
                }`}
                id="nav-admin-dashboard"
              >
                <ShieldCheck className="w-4 h-4 text-yellow-500" />
                <span>Admin Office</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Dynamic View Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            {currentTab === 'home' && (
              <HomeView onNavigate={(tab) => setCurrentTab(tab)} />
            )}

            {currentTab === 'donate' && (
              <DonateForm
                onSuccess={() => handleActionSuccess('Generous donation registered successfully!')}
                onNavigateHome={() => setCurrentTab('home')}
              />
            )}

            {currentTab === 'volunteer' && (
              <VolunteerFormView
                onSuccess={() => handleActionSuccess('Workforce application submitted successfully!')}
                onNavigateHome={() => setCurrentTab('home')}
              />
            )}

            {currentTab === 'workshops' && (
              <WorkshopForm
                onSuccess={() => handleActionSuccess('Workshop enrollment recorded successfully!')}
                onNavigateHome={() => setCurrentTab('home')}
              />
            )}

            {currentTab === 'admin' && (
              isLoadingAuth ? (
                <div className="py-20 text-center text-slate-500 text-xs font-semibold flex flex-col items-center justify-center gap-3 font-sans">
                  <svg className="animate-spin h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4m2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Verifying workspace credentials...</span>
                </div>
              ) : isAdmin ? (
                <AdminDashboardView />
              ) : (
                <AdminLoginView
                  onBackToHome={() => setCurrentTab('home')}
                  onLoginSuccess={() => setCurrentTab('admin')}
                />
              )
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer Navigation (Ideal for simple mobile viewing) */}
      <footer className="bg-white border-t border-slate-100 py-8 text-center text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          
          {/* Quick link bottom shortcuts */}
          <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 text-slate-500 font-semibold">
            <button onClick={() => setCurrentTab('home')} className="hover:text-purple-600 transition cursor-pointer" id="foot-home">Home</button>
            <button onClick={() => setCurrentTab('donate')} className="hover:text-purple-600 transition cursor-pointer" id="foot-donate">Donate</button>
            <button onClick={() => setCurrentTab('volunteer')} className="hover:text-purple-600 transition cursor-pointer" id="foot-vol">Volunteer</button>
            <button onClick={() => setCurrentTab('workshops')} className="hover:text-purple-600 transition cursor-pointer" id="foot-work">Workshops</button>
            <button onClick={() => setCurrentTab('admin')} className="text-slate-400 hover:text-purple-600 transition cursor-pointer font-sans" id="foot-admin">
              {isAdmin ? 'Admin Dashboard' : 'Admin Login'}
            </button>
          </div>

          <div className="h-px w-12 bg-slate-100 mx-auto" />

          {/* Copy section */}
          <div className="space-y-2 flex flex-col items-center">
            {/* Elegant tiny brand logo placed in footer */}
            <Logo className="w-7 h-7" />
            <p className="font-semibold text-slate-600">
              AspireBridge – Youth-led initiative bridging aspirations and opportunities.
            </p>
            <p className="text-[10px] text-slate-450 max-w-sm mx-auto leading-relaxed">
              Serving our community through material support, targeted peer mentoring, and dynamic workshops to build launching pads.
            </p>
            
            {/* Professional Queries & Collaborations contact box with custom purple/yellow theme styling */}
            <div className="pt-3 max-w-md mx-auto w-full">
              <div className="bg-purple-50/60 rounded-2xl px-6 py-3.5 border border-purple-100/50 text-center space-y-2 hover:border-yellow-400/40 transition-colors duration-300">
                <p className="text-slate-500 font-semibold text-[11px]">
                  For any queries, collaborations, or partnership opportunities, please contact us at:
                </p>
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5">
                  <a 
                    href="mailto:aspire.bridge01@gmail.com" 
                    className="inline-flex items-center gap-1 text-purple-700 hover:text-yellow-600 font-bold text-xs transition-colors border-b border-purple-100/60 hover:border-yellow-400 pb-0.5"
                  >
                    <span>aspire.bridge01@gmail.com</span>
                  </a>
                  <span className="text-slate-300 hidden sm:inline">|</span>
                  <a 
                    href="https://instagram.com/aspirebridge_" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-purple-700 hover:text-yellow-600 font-bold text-xs transition-colors border-b border-purple-100/60 hover:border-yellow-400 pb-0.5"
                  >
                    <Instagram className="w-3.5 h-3.5 text-purple-600" />
                    <span>@aspirebridge_</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Sticky Mobile Bar Navigation (Hidden on desktop) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 flex justify-around py-3 px-2 shadow-lg">
        <button
          onClick={() => setCurrentTab('home')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition cursor-pointer ${currentTab === 'home' ? 'text-purple-600' : 'text-slate-400'}`}
          id="mob-nav-home"
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setCurrentTab('donate')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition cursor-pointer ${currentTab === 'donate' ? 'text-purple-600' : 'text-slate-400'}`}
          id="mob-nav-donate"
        >
          <Gift className="w-5 h-5" />
          <span>Donate</span>
        </button>

        <button
          onClick={() => setCurrentTab('volunteer')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition cursor-pointer ${currentTab === 'volunteer' ? 'text-purple-600' : 'text-slate-400'}`}
          id="mob-nav-volunteer"
        >
          <Users className="w-5 h-5" />
          <span>Volunteer</span>
        </button>

        <button
          onClick={() => setCurrentTab('workshops')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition cursor-pointer ${currentTab === 'workshops' ? 'text-purple-600' : 'text-slate-400'}`}
          id="mob-nav-workshops"
        >
          <GraduationCap className="w-5 h-5" />
          <span>Workshops</span>
        </button>
      </div>
    </div>
  );
}

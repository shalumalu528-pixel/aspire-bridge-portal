/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, LogIn, ArrowLeft, AlertCircle } from 'lucide-react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from './firebase';
import Logo from './Logo';

interface AdminLoginViewProps {
  onBackToHome: () => void;
  onLoginSuccess: (email: string) => void;
}

export default function AdminLoginView({ onBackToHome, onLoginSuccess }: AdminLoginViewProps) {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleGoogleSignIn = async () => {
    if (!auth) {
      setErrorMessage('Firebase Authentication is not configured or unavailable right now.');
      return;
    }

    setIsLoggingIn(true);
    setErrorMessage('');

    try {
      const provider = new GoogleAuthProvider();
      // Configure prompt to always select account to make testing easier
      provider.setCustomParameters({ prompt: 'select_account' });
      
      const result = await signInWithPopup(auth, provider);
      const userEmail = result.user?.email || '';

      if (userEmail === 'aspire.bridge01@gmail.com') {
        onLoginSuccess(userEmail);
      } else {
        // If external user logs in, reject access clearly with helpful message
        setErrorMessage(`Access Denied. Your account (${userEmail}) is not authorized to access the Admin Office. Only secure admin workspace accounts can login.`);
      }
    } catch (error: any) {
      console.error('Sign-in error:', error);
      let errMsg = 'Failed to authenticate via Google.';
      
      if (error?.code === 'auth/popup-blocked') {
        errMsg = 'The sign-in popup was blocked by your browser. Please enable popups for this page and try again.';
      } else if (error?.code === 'auth/cancelled-popup-request') {
        errMsg = 'The sign-in request was cancelled. Please try again.';
      } else if (error?.code === 'auth/unauthorized-domain') {
        errMsg = `This domain (${window.location.hostname}) is not whitelisted or authorized in your Firebase Project settings.`;
      } else if (error?.code === 'auth/configuration-not-found' || error?.code === 'auth/operation-not-allowed') {
        errMsg = 'Google Sign-In is not enabled as an identity provider in your Firebase Console.';
      } else if (error?.message) {
        errMsg = error.message;
      }
      setErrorMessage(errMsg);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-8 text-left py-6">
      {/* Back button */}
      <div>
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-purple-600 transition font-medium cursor-pointer"
          id="btn-login-back-home"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>
      </div>

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="bg-white rounded-3xl border border-purple-100 shadow-md overflow-hidden"
      >
        <div className="h-2 bg-gradient-to-r from-purple-800 to-indigo-600" />
        
        <div className="p-8 md:p-10 space-y-6 text-center">
          {/* Logo & Branding */}
          <div className="flex flex-col items-center space-y-3">
            <div className="p-3.5 bg-purple-50 rounded-2xl text-purple-700">
              <Logo className="w-12 h-12" />
            </div>
            <div>
              <h2 className="text-xl font-display font-semibold text-slate-950">Admin Office Access</h2>
              <p className="text-xs text-slate-400 mt-1">Authorized AspireBridge Personnel Only</p>
            </div>
          </div>

          <div className="bg-slate-50/80 rounded-2xl p-4 text-left border border-slate-100 space-y-2.5 font-sans">
            <div className="flex items-center gap-1.5 text-amber-600">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xs font-semibold">Access Restriction Policy</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Administrative functions, applicant screening, and database monitoring tools are locked under Zero-Trust protocols. Access is strictly granted to:
            </p>
            <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-200/60 inline-flex items-center gap-1.5 text-xs font-mono font-bold text-indigo-700">
              aspire.bridge01@gmail.com
            </div>
          </div>

          {errorMessage && (
            <div
              className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-2.5 text-left text-xs text-rose-700 font-sans"
              id="login-error-banner"
            >
              <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block mb-0.5">Authentication Error</span>
                <p className="leading-relaxed">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Action Trigger */}
          <div className="pt-2">
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoggingIn}
              className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-2xl text-sm font-semibold transition-all shadow-xs border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 hover:border-purple-200 hover:shadow-purple-50 cursor-pointer disabled:opacity-60"
              id="btn-google-signin"
            >
              {isLoggingIn ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4m2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="text-slate-500">Authenticating...</span>
                </>
              ) : (
                <>
                  {/* Flat Google vector icon */}
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.47 15.01 1 12 1 7.24 1 3.2 3.73 1.24 7.74l3.84 2.98C6.01 7.42 8.78 5.04 12 5.04z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.73 2.89c2.18-2.01 3.44-4.97 3.44-8.62z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.08 14.72c-.24-.72-.38-1.5-.38-2.31s.14-1.59.38-2.31L1.24 7.12C.45 8.72 0 10.51 0 12.4s.45 3.68 1.24 5.28l3.84-2.96z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.73-2.89c-1.04.7-2.37 1.11-3.96 1.11-3.22 0-5.99-2.38-6.96-5.69l-3.84 2.96C3.2 20.27 7.24 23 12 23z"
                    />
                  </svg>
                  <span>Sign in with Google</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

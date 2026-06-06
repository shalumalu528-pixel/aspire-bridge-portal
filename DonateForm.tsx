/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Gift, Sparkles, MapPin, AlertCircle, Phone, ArrowLeft, Send, CheckCircle2, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import { saveDonation } from './storage';

interface DonateFormProps {
  onSuccess: () => void;
  onNavigateHome: () => void;
}

export default function DonateForm({ onSuccess, onNavigateHome }: DonateFormProps) {
  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [donationType, setDonationType] = useState<'clothing' | 'books' | 'educational_supplies' | 'jewellery' | 'other'>('clothing');
  const [quantity, setQuantity] = useState('');
  const [preference, setPreference] = useState<'pickup' | 'dropoff'>('dropoff');
  const [message, setMessage] = useState('');

  // UI state
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMess, setErrorMess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMess('');

    // Field validations
    if (!fullName.trim()) {
      setErrorMess('Please provide your full name.');
      return;
    }
    if (!phone.trim()) {
      setErrorMess('Please provide a phone / WhatsApp contact number.');
      return;
    }
    if (!city.trim()) {
      setErrorMess('Please provide your city of residence.');
      return;
    }
    if (!quantity.trim()) {
      setErrorMess('Please describe the items or quantity.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Call storage helper to save donation
      await saveDonation({
        fullName,
        phone,
        city,
        donationType: donationType as any,
        quantity,
        preference,
        message,
      });

      setIsSubmitted(true);
      if (onSuccess) {
        onSuccess();
      }
    } catch (e: any) {
      setErrorMess(e?.message || 'Failed to register donation. Please try again.');
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
        <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto text-purple-500">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-display font-medium text-slate-900">Donation Registered!</h3>
          <p className="text-slate-500 text-sm">
            Thank you, <span className="font-semibold text-slate-800">{fullName}</span>, for supporting AspireBridge. Your generosity serves as a launching pad for dreams.
          </p>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 text-left text-xs text-slate-600 space-y-1.5 border border-slate-100">
          <div className="font-semibold text-slate-800">What happens next?</div>
          <div>
            {preference === 'pickup'
              ? "Our regional volunteers will review your address city and coordinate a pickup time."
              : "You preferred drop-off. We will send you our closest collection hub address."}
          </div>
        </div>

        <div className="pt-4 flex gap-3 justify-center">
          <button
            onClick={onNavigateHome}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
            id="success-home-btn"
          >
            Back to Home
          </button>
          <button
            onClick={() => {
              // reset
              setFullName('');
              setPhone('');
              setCity('');
              setDonationType('clothing');
              setQuantity('');
              setMessage('');
              setIsSubmitted(false);
            }}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 transition cursor-pointer"
            id="success-new-donation-btn"
          >
            Submit Another Donation
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 text-left">
      {/* Back Header */}
      <div className="flex justify-between items-center">
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-purple-600 transition font-medium cursor-pointer"
          id="btn-back-home"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>
        <span className="text-xs font-mono text-slate-400">Step 1 of 1</span>
      </div>

      <div className="bg-white rounded-3xl border border-purple-50 shadow-xs overflow-hidden">
        {/* Visual header decoration */}
        <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-yellow-500 h-2.5" />
        
        <div className="p-8 md:p-10 space-y-6">
          <div className="space-y-1.5">
            <h2 className="text-2xl font-display font-medium text-slate-900 flex items-center gap-2">
              <Gift className="w-6 h-6 text-purple-600" />
              Donate to AspireBridge
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              We believe in leveling the playing field. By contributing essential supplies — Clothing, Books, Educational Supplies, and Jewellery — you directly empower students and young learners on their educational journey with immediate local impact.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMess && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2.5 text-xs text-rose-700" id="error-alert">
                <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                <span>{errorMess}</span>
              </div>
            )}

            {/* Grid Layout fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold text-slate-700" htmlFor="donate-fullname">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="donate-fullname"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-purple-500 focus:ring-2 focus:ring-purple-55/50 bg-slate-50/50 transition-all font-sans"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold text-slate-700" htmlFor="donate-phone">
                  Phone / WhatsApp Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  id="donate-phone"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-purple-500 focus:ring-2 focus:ring-purple-55/50 bg-slate-50/50 transition-all font-sans"
                  placeholder="e.g. +233 241234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold text-slate-700" htmlFor="donate-city">
                  City <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  id="donate-city"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-purple-500 focus:ring-2 focus:ring-purple-55/50 bg-slate-50/50 transition-all font-sans"
                  placeholder="Accra / Singapore"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold text-slate-700" htmlFor="donate-type">
                  Donation Type <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="donate-type"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-purple-500 focus:ring-2 focus:ring-purple-55/50 bg-slate-50/50 transition-all font-sans appearance-none cursor-pointer"
                    value={donationType}
                    onChange={(e) => setDonationType(e.target.value as any)}
                  >
                    <option value="clothing">Clothing</option>
                    <option value="books">Books</option>
                    <option value="educational_supplies">Educational Supplies</option>
                    <option value="jewellery">Jewellery</option>
                    <option value="other">Other Items</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-semibold text-slate-700" htmlFor="donate-quantity">
                Item Details / Quantity <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="donate-quantity"
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-purple-500 focus:ring-2 focus:ring-purple-55/50 bg-slate-50/50 transition-all font-sans"
                placeholder="Specify quantities (e.g. 15 medium-sized boxes, 4 bags of winter jumpers, 10 necklaces/earrings)"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            <div className="space-y-3 text-left">
              <span className="block text-xs font-semibold text-slate-700">How would you like to deliver these?</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className={`border rounded-xl p-4 flex items-start gap-3 cursor-pointer transition-all ${preference === 'dropoff' ? 'border-purple-500 bg-purple-50/20' : 'border-slate-200 hover:border-purple-200'}`}>
                  <input
                    type="radio"
                    name="preference"
                    value="dropoff"
                    checked={preference === 'dropoff'}
                    className="mt-1 text-purple-600 focus:ring-purple-500"
                    onChange={() => setPreference('dropoff')}
                  />
                  <div>
                    <span className="block text-xs font-semibold text-slate-800">Drop-off yourself</span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">I will deliver to an AspireBridge collection hub</span>
                  </div>
                </label>

                <label className={`border rounded-xl p-4 flex items-start gap-3 cursor-pointer transition-all ${preference === 'pickup' ? 'border-purple-500 bg-purple-50/20' : 'border-slate-200 hover:border-purple-200'}`}>
                  <input
                    type="radio"
                    name="preference"
                    value="pickup"
                    checked={preference === 'pickup'}
                    className="mt-1 text-purple-600 focus:ring-purple-500"
                    onChange={() => setPreference('pickup')}
                  />
                  <div>
                    <span className="block text-xs font-semibold text-slate-800">Request Pickup</span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">An AspireBridge handler should pick up from me</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-semibold text-slate-700" htmlFor="donate-message">
                Optional Message
              </label>
              <textarea
                id="donate-message"
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:border-purple-500 focus:ring-2 focus:ring-purple-55/50 bg-slate-50/50 transition-all font-sans"
                placeholder="Any special remarks or delivery timing details..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <div className="pt-4 border-t border-slate-150 flex justify-end gap-3">
              <button
                type="button"
                onClick={onNavigateHome}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                id="btn-donate-cancel"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-purple-850 hover:bg-slate-800 transition cursor-pointer"
                id="btn-donate-submit"
              >
                <Send className="w-3.5 h-3.5" />
                Register Donation
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

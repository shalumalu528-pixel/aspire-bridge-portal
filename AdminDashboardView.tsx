/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  getDonations,
  getVolunteers,
  getTeamApplications,
  getWorkshopSignups,
  updateDonationStatus,
  updateVolunteerStatus,
  updateTeamApplicationStatus,
  purgeMockPlaceholders
} from '../lib/storage';
import { Donation, Volunteer, TeamApplication, WorkshopSignup } from '../types';
import { auth, isFirebaseConfigured } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import {
  LayoutDashboard,
  Gift,
  Users,
  GraduationCap,
  Sparkles,
  Search,
  Filter,
  CheckCircle,
  Clock,
  RotateCcw,
  UserCheck,
  Briefcase,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  MapPin,
  ChevronDown,
  Database,
  Wifi,
  WifiOff
} from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminDashboardView() {
  const [activeSubTab, setActiveSubTab] = useState<'donations' | 'volunteers' | 'team_apps' | 'workshops'>('donations');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Core Data States
  const [donations, setDonations] = useState<Donation[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [teamApps, setTeamApps] = useState<TeamApplication[]>([]);
  const [workshops, setWorkshops] = useState<WorkshopSignup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMess, setErrorMess] = useState('');

  // Live Firestore Connection Test Statuses
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [connectionError, setConnectionError] = useState<string>('');

  const handleTestConnection = async () => {
    setConnectionStatus('testing');
    setConnectionError('');
    try {
      if (!isFirebaseConfigured) {
        throw new Error('Firebase configuration is not set up. Please replace placeholders in firebase-applet-config.json first.');
      }
      // Query "donations" with limit 1; this is public-readable and serves as a perfect connection check
      const { collection, getDocs, limit, query } = await import('firebase/firestore');
      const { db: firestoreDb } = await import('../lib/firebase');
      if (!firestoreDb) {
        throw new Error('Firebase database instance could not be initialized.');
      }
      const q = query(collection(firestoreDb, 'donations'), limit(1));
      await getDocs(q);
      setConnectionStatus('success');
    } catch (e: any) {
      console.error(e);
      setConnectionStatus('error');
      // Format firestore error nicely
      let msg = e?.message || String(e);
      if (msg.includes('apiKey') || msg.includes('auth') || msg.includes('invalid-api-key') || msg.includes('API key')) {
        msg = 'Invalid Firebase API Key. Please verify the apiKey in firebase-applet-config.json is correct.';
      } else if (msg.includes('offline') || msg.includes('client is offline')) {
        msg = 'The client is offline or Firebase servers are unreachable. Check your network.';
      } else if (msg.includes('project') || msg.includes('not found') || msg.includes('PROJECT_NOT_FOUND')) {
        msg = 'Project id "aspirebridge-01" was not found or is restricted. Please check the projectId and appId configuration.';
      }
      setConnectionError(msg);
    }
  };

  // Load Data
  const loadAllData = async () => {
    setIsLoading(true);
    setErrorMess('');
    try {
      const [dons, vols, apps, works] = await Promise.all([
        getDonations(),
        getVolunteers(),
        getTeamApplications(),
        getWorkshopSignups()
      ]);
      setDonations(dons);
      setVolunteers(vols);
      setTeamApps(apps);
      setWorkshops(works);
    } catch (e: any) {
      console.error(e);
      setErrorMess(e?.message || 'Failed to load live Firestore datasets.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Actions
  const handleUpdateDonation = async (id: string, newStatus: 'pending' | 'confirmed' | 'completed') => {
    try {
      const list = await updateDonationStatus(id, newStatus);
      setDonations(list);
    } catch (e: any) {
      alert(e?.message || 'Failed to update donation status.');
    }
  };

  const handleUpdateVolunteer = async (id: string, newStatus: 'pending' | 'reviewed' | 'accepted' | 'declined') => {
    try {
      const list = await updateVolunteerStatus(id, newStatus);
      setVolunteers(list);
    } catch (e: any) {
      alert(e?.message || 'Failed to update volunteer status.');
    }
  };

  const handleUpdateTeamApp = async (id: string, newStatus: 'pending' | 'reviewed' | 'accepted' | 'declined') => {
    try {
      const list = await updateTeamApplicationStatus(id, newStatus);
      setTeamApps(list);
    } catch (e: any) {
      alert(e?.message || 'Failed to update team application status.');
    }
  };

  const handleResetData = async () => {
    if (isFirebaseConfigured) {
      alert("Cannot reset cloud database records directly from client-side buttons when connected to live Firestore. Manage records via the Firebase console.");
      return;
    }
    if (confirm('Are you sure you want to reset all records to the default mock seeded values? Your new submissions will be removed.')) {
      localStorage.removeItem('ab_donations');
      localStorage.removeItem('ab_volunteers');
      localStorage.removeItem('ab_team_apps');
      localStorage.removeItem('ab_workshops');
      await loadAllData();
    }
  };

  const handlePurgeTestData = async () => {
    if (!isFirebaseConfigured) {
      alert("This tool is only active when connected to a live Firestore database. In offline mode, use the Reset Datasets button to reset local state.");
      return;
    }
    
    const count = donations.length + volunteers.length + teamApps.length + workshops.length;
    if (count === 0) {
      alert("No records found to clean up.");
      return;
    }

    if (confirm("Are you sure you want to permanently delete all default test records and placeholder demo data from your live Firebase Firestore? This will remove all default test registrations, placeholder participants, and initial demo requests. Real production data will not be affected. This action is irreversible.")) {
      setIsLoading(true);
      setErrorMess('');
      try {
        const stats = await purgeMockPlaceholders();
        alert(`Purge Completed Successfully!\n` +
          `- ${stats.donationsDeleted} Test Donations deleted\n` +
          `- ${stats.volunteersDeleted} Test Volunteer applications deleted\n` +
          `- ${stats.teamAppsDeleted} Test Core Team applications deleted\n` +
          `- ${stats.workshopsDeleted} Test Workshop signups deleted\n\n` +
          `All default test and placeholder demo records are now cleared. Only genuine production documents remain.`);
        await loadAllData();
      } catch (e: any) {
        console.error(e);
        setErrorMess(e?.message || "Failed to purge database placeholders.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleLogout = async () => {
    if (auth) {
      try {
        await signOut(auth);
      } catch (err) {
        console.error("Error signing out:", err);
      }
    }
  };

  // Stats Analytics
  const totalDonationsCount = donations.length;
  const totalVolunteersCount = volunteers.length;
  const totalTeamAppsCount = teamApps.length;
  const totalWorkshopsCount = workshops.length;

  const donationStatusCounts = donations.reduce(
    (acc, d) => {
      acc[d.status] = (acc[d.status] || 0) + 1;
      return acc;
    },
    { pending: 0, confirmed: 0, completed: 0 } as Record<string, number>
  );

  // Category distributions
  const donationCategories = donations.reduce(
    (acc, d) => {
      let type = d.donationType as string;
      if (type === 'clothes' || type === 'clothing') {
        type = 'clothing';
      } else if (type === 'stationery' || type === 'educational_supplies') {
        type = 'educational supplies';
      } else if (type === 'jewellery') {
        type = 'jewellery';
      } else if (type === 'books') {
        type = 'books';
      } else if (type === 'food' || type === 'money') {
        // Exclude food and money completely as requested by the user
        return acc;
      } else {
        type = 'other';
      }
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    },
    { clothing: 0, jewellery: 0, books: 0, 'educational supplies': 0, other: 0 } as Record<string, number>
  );

  return (
    <div className="space-y-8 text-left max-w-6xl mx-auto">
      {/* Firebase Status Badge & Alert Box */}
      <div className="bg-white rounded-2xl border border-purple-100/60 p-5 shadow-sm flex flex-col gap-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${isFirebaseConfigured ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
              <Database className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs font-bold font-display uppercase tracking-wider text-slate-400">Database Connection Status</h4>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`w-2 h-2 rounded-full ${isFirebaseConfigured ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                <p className="text-xs font-semibold text-slate-800">
                  {isFirebaseConfigured ? 'Connected to live Firebase Firestore' : 'Running in Local Storage Fallback Mode'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleTestConnection}
              disabled={connectionStatus === 'testing'}
              className="px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-700 transition-colors rounded-lg border border-slate-200 hover:border-purple-200 disabled:opacity-55"
            >
              {connectionStatus === 'testing' ? 'Verifying Link...' : 'Test Connection'}
            </button>
          </div>
        </div>

        {/* Status Responses */}
        {connectionStatus !== 'idle' && (
          <div className={`text-xs p-3 rounded-xl border ${
            connectionStatus === 'success' 
              ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
              : connectionStatus === 'error'
              ? 'bg-red-50 border-red-100 text-red-800'
              : 'bg-indigo-50 border-indigo-100 text-indigo-800'
          }`}>
            {connectionStatus === 'testing' && (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4m2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Pinging Firebase Firestore Cloud server...
              </span>
            )}
            {connectionStatus === 'success' && (
              <span>✔ <strong>Connection Verified Successfully:</strong> Connected to Firestore project <strong>aspirebridge-01</strong>. Data is saving live in real-time.</span>
            )}
            {connectionStatus === 'error' && (
              <div className="space-y-1">
                <p className="font-semibold">✖ Connection Verification Failed</p>
                <p className="opacity-90">{connectionError}</p>
              </div>
            )}
          </div>
        )}

        <div className="text-left text-[11px] text-slate-500 font-sans border-t border-slate-100 pt-3">
          {isFirebaseConfigured ? (
            <span>All volunteer applications, workshop registrations, donation submissions, and core team applications are wired to auto-synchronize live into Cloud Firestore.</span>
          ) : (
            <span>
              To connect your real database, paste your configuration block in <code className="bg-slate-100 px-1.5 py-0.5 rounded text-purple-700 font-mono font-bold">firebase-applet-config.json</code> at the project root with the <code className="font-mono">apiKey</code>, <code className="font-mono">appId</code>, and <code className="font-mono">messagingSenderId</code> values.
            </span>
          )}
        </div>
      </div>

      {/* Title block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-medium text-slate-950 flex items-center gap-2">
            <LayoutDashboard className="w-7 h-7 text-indigo-500" />
            AspireBridge Admin Office
          </h2>
          <p className="text-slate-500 text-xs">
            Review live client-side portal submissions, manage states, and monitor programmatic goals.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isFirebaseConfigured ? (
            <button
              onClick={handlePurgeTestData}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-pink-700 bg-pink-50 hover:bg-pink-100 rounded-xl border border-pink-200 transition-all cursor-pointer"
              id="btn-purge-test-data"
            >
              <Database className="w-3.5 h-3.5 text-pink-600" />
              Purge Live Test Data
            </button>
          ) : (
            <button
              onClick={handleResetData}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 transition-all cursor-pointer"
              id="btn-seed-reset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Datasets
            </button>
          )}

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200 transition-all cursor-pointer font-sans"
            id="btn-admin-logout"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M19 12H9m10 0l-3-3m3 3l-3 3" />
            </svg>
            Sign Out
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="bg-purple-50/50 border border-purple-100/50 text-purple-700 rounded-xl p-4 text-center flex items-center justify-center gap-2 text-xs font-semibold">
          <svg className="animate-spin h-5 w-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Fetching live Firestore documents...
        </div>
      )}

      {errorMess && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-xs font-medium">
          {errorMess}
        </div>
      )}

      {/* Metrics Grid Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Donations</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Gift className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-display font-semibold text-slate-900">{totalDonationsCount}</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-slate-400 font-sans">
                {donationStatusCounts.pending} pending checkout
              </span>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Volunteers</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-display font-semibold text-slate-900">{totalVolunteersCount}</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-sm font-semibold font-sans">
                {volunteers.filter((v) => v.status === 'accepted').length} Active
              </span>
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Core Team Apps</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-display font-semibold text-slate-900">{totalTeamAppsCount}</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-sm font-semibold font-sans">
                {teamApps.filter((t) => t.status === 'pending').length} Under Review
              </span>
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Workshops</span>
            <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-display font-semibold text-slate-900">{totalWorkshopsCount}</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-slate-400 font-sans">Enrolled Seats filled</span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Category Dist & Status Split Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Donation Types */}
        <div className="bg-white p-6 rounded-3xl border border-slate-150 shadow-xs lg:col-span-2 space-y-5">
          <div className="flex justify-between items-center border-b border-slate-50 pb-3">
            <h3 className="text-sm font-semibold text-slate-800 tracking-tight flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Donation Type Distribution
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Calculated Metrics</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(donationCategories).map(([category, count]) => {
              const maxVal = Math.max(...(Object.values(donationCategories) as number[]), 1);
              const percent = Math.round(((count as number) / maxVal) * 100);
              return (
                <div key={category} className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-600">
                    <span className="capitalize font-medium">{category}</span>
                    <span className="font-semibold text-slate-800">{count} item{count !== 1 && 's'}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        category === 'books'
                          ? 'bg-blue-500'
                          : category === 'educational supplies'
                          ? 'bg-teal-500'
                          : category === 'clothing'
                          ? 'bg-orange-500'
                          : category === 'jewellery'
                          ? 'bg-purple-500'
                          : 'bg-slate-400'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Verification Status Wheel */}
        <div className="bg-white p-6 rounded-3xl border border-slate-150 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-800 border-b border-slate-50 pb-3">
              Donation Progress States
            </h3>

            <div className="space-y-3.5">
              {/* Pending */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-amber-400 rounded-full" />
                  <span className="text-xs text-slate-600">Pending Pickup / Review</span>
                </div>
                <span className="text-xs font-mono font-semibold text-slate-800">
                  {donationStatusCounts.pending} ({Math.round(((donationStatusCounts.pending || 0) / (totalDonationsCount || 1)) * 100)}%)
                </span>
              </div>

              {/* Confirmed */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-400 rounded-full" />
                  <span className="text-xs text-slate-600">Confirmed Booking</span>
                </div>
                <span className="text-xs font-mono font-semibold text-slate-800">
                  {donationStatusCounts.confirmed} ({Math.round(((donationStatusCounts.confirmed || 0) / (totalDonationsCount || 1)) * 100)}%)
                </span>
              </div>

              {/* Completed */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                  <span className="text-xs text-slate-600">Completed Deliveries</span>
                </div>
                <span className="text-xs font-mono font-semibold text-slate-800">
                  {donationStatusCounts.completed} ({Math.round(((donationStatusCounts.completed || 0) / (totalDonationsCount || 1)) * 100)}%)
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-50 text-[11px] text-slate-400 leading-relaxed font-sans">
            Pending items should be coordinated via the registration contacts. Verify clothing state before dropoff confirmation.
          </div>
        </div>
      </div>

      {/* Main List Table Filter Block */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Sub Navigation */}
        <div className="flex flex-wrap bg-slate-50 border-b border-slate-100 p-2 gap-1">
          <button
            onClick={() => { setActiveSubTab('donations'); setSearchTerm(''); setStatusFilter('all'); }}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer tracking-tight transition-all ${
              activeSubTab === 'donations' ? 'bg-white text-emerald-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
            id="subtab-donations"
          >
            Donations List
          </button>
          <button
            onClick={() => { setActiveSubTab('volunteers'); setSearchTerm(''); setStatusFilter('all'); }}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer tracking-tight transition-all ${
              activeSubTab === 'volunteers' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
            id="subtab-volunteers"
          >
            Volunteers
          </button>
          <button
            onClick={() => { setActiveSubTab('team_apps'); setSearchTerm(''); setStatusFilter('all'); }}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer tracking-tight transition-all ${
              activeSubTab === 'team_apps' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
            id="subtab-teamapps"
          >
            Core Team Apps
          </button>
          <button
            onClick={() => { setActiveSubTab('workshops'); setSearchTerm(''); setStatusFilter('all'); }}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer tracking-tight transition-all ${
              activeSubTab === 'workshops' ? 'bg-white text-teal-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
            id="subtab-workshops"
          >
            Workshop Signups
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-slate-100 bg-white grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Search by name, contact, city...`}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-slate-300 focus:outline-hidden bg-slate-50/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div>
            {activeSubTab === 'donations' && (
              <select
                className="w-full py-2 px-3 border border-slate-200 rounded-xl text-xs bg-slate-50/50 focus:outline-hidden"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Donation Statuses</option>
                <option value="pending">Pending Status</option>
                <option value="confirmed">Confirmed Status</option>
                <option value="completed">Completed Status</option>
              </select>
            )}

            {(activeSubTab === 'volunteers' || activeSubTab === 'team_apps') && (
              <select
                className="w-full py-2 px-3 border border-slate-200 rounded-xl text-xs bg-slate-50/50 focus:outline-hidden"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Application Statuses</option>
                <option value="pending">Pending Application</option>
                <option value="reviewed">Under Review</option>
                <option value="accepted">Accepted Position</option>
                <option value="declined">Declined Application</option>
              </select>
            )}
          </div>
        </div>

        {/* Grid List View Body */}
        <div className="overflow-x-auto">
          {/* 1. DONATIONS SUBTAB CONTENT */}
          {activeSubTab === 'donations' && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  <th className="py-3.5 px-5">Donor Details</th>
                  <th className="py-3.5 px-5">Location / Method</th>
                  <th className="py-3.5 px-5">Type & Description</th>
                  <th className="py-3.5 px-5">State Action</th>
                  <th className="py-3.5 px-5 text-right">Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {donations
                  .filter((item) => {
                    const matchSearch =
                      item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      item.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      item.phone.includes(searchTerm);
                    const matchFilter = statusFilter === 'all' || item.status === statusFilter;
                    return matchSearch && matchFilter;
                  })
                  .map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-5">
                        <div className="font-medium text-slate-800">{item.fullName}</div>
                        <div className="text-[11px] text-slate-400">{item.phone}</div>
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-semibold text-slate-700">{item.city}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 capitalize mt-0.5">
                          Preference: {item.preference}
                        </div>
                      </td>
                      <td className="py-4 px-5 max-w-xs">
                        <div className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase bg-slate-100 text-slate-700 font-mono mb-1">
                          {item.donationType}
                        </div>
                        <div className="font-sans text-slate-600 line-clamp-2">{item.quantity}</div>
                        {item.message && (
                          <div className="text-[10px] italic text-slate-400 mt-1">"{item.message}"</div>
                        )}
                      </td>
                      <td className="py-4 px-5">
                        <div className="relative inline-block w-36">
                          <select
                            className={`w-full py-1.5 px-2.5 rounded-lg border text-xs font-semibold appearance-none bg-white pr-7 focus:outline-hidden ${
                              item.status === 'completed'
                                ? 'border-emerald-200 text-emerald-700 bg-emerald-50/20'
                                : item.status === 'confirmed'
                                ? 'border-blue-200 text-blue-700 bg-blue-50/20'
                                : 'border-amber-200 text-amber-700 bg-amber-50/20'
                            }`}
                            value={item.status}
                            onChange={(e) => handleUpdateDonation(item.id, e.target.value as any)}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500" />
                        </div>
                      </td>
                      <td className="py-4 px-5 text-right text-slate-400 font-mono text-[10px]">
                        {new Date(item.createdAt).toLocaleDateString('en-GB', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                    </tr>
                  ))}
                {donations.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No donations registered yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {/* 2. VOLUNTEERS SUBTAB CONTENT */}
          {activeSubTab === 'volunteers' && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  <th className="py-3.5 px-5">Volunteer Info</th>
                  <th className="py-3.5 px-5">School & Availability</th>
                  <th className="py-3.5 px-5">Aspiration Area</th>
                  <th className="py-3.5 px-5">Skills & Motivation</th>
                  <th className="py-3.5 px-5">Status Select</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                {volunteers
                  .filter((item) => {
                    const matchSearch =
                      item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      item.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      item.institution.toLowerCase().includes(searchTerm.toLowerCase());
                    const matchFilter = statusFilter === 'all' || item.status === statusFilter;
                    return matchSearch && matchFilter;
                  })
                  .map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-5">
                        <div className="font-semibold text-slate-900">{item.fullName}</div>
                        <div className="text-[11px] text-slate-400">Age: {item.age} • City: {item.city}</div>
                      </td>
                      <td className="py-4 px-5">
                        <div className="font-medium text-slate-700">{item.institution}</div>
                        <div className="text-[10px] text-slate-400 mt-1">Avail: {item.availability}</div>
                      </td>
                      <td className="py-4 px-5">
                        <span className="inline-block bg-blue-50 text-blue-700 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md font-mono">
                          {item.area}
                        </span>
                      </td>
                      <td className="py-4 px-5 max-w-xs space-y-1">
                        <div>
                          <strong className="font-semibold text-slate-700">Skills:</strong> {item.skills}
                        </div>
                        <div className="text-[11px] text-slate-400 italic">"Why: {item.whyVolunteer}"</div>
                      </td>
                      <td className="py-4 px-5">
                        <div className="relative inline-block w-32">
                          <select
                            className={`w-full py-1 px-2 rounded-lg border text-xs font-semibold appearance-none bg-white pr-6 ${
                              item.status === 'accepted'
                                ? 'border-emerald-200 text-emerald-700 bg-emerald-50/20'
                                : item.status === 'declined'
                                ? 'border-rose-200 text-rose-700 bg-rose-50/20'
                                : item.status === 'reviewed'
                                ? 'border-indigo-200 text-indigo-700 bg-indigo-50/20'
                                : 'border-slate-250 text-slate-600'
                            }`}
                            value={item.status}
                            onChange={(e) => handleUpdateVolunteer(item.id, e.target.value as any)}
                          >
                            <option value="pending">Pending</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="accepted">Accepted</option>
                            <option value="declined">Declined</option>
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}

          {/* 3. TEAM APPLICATIONS */}
          {activeSubTab === 'team_apps' && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  <th className="py-3.5 px-5">Core Applicant</th>
                  <th className="py-3.5 px-5">Chosen Team & Commitment</th>
                  <th className="py-3.5 px-5">Experience Background</th>
                  <th className="py-3.5 px-5">Core Values Motivation</th>
                  <th className="py-3.5 px-5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                {teamApps
                  .filter((item) => {
                    const matchSearch =
                      item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      item.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      item.skills.toLowerCase().includes(searchTerm.toLowerCase());
                    const matchFilter = statusFilter === 'all' || item.status === statusFilter;
                    return matchSearch && matchFilter;
                  })
                  .map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-5">
                        <div className="font-semibold text-slate-900">{item.fullName}</div>
                        <div className="text-[10px] text-slate-400 mt-1 max-w-[180px] break-all">{item.contact}</div>
                        <div className="text-[10px] text-slate-500">Age: {item.age}</div>
                      </td>
                      <td className="py-4 px-5">
                        <div className="font-semibold text-indigo-700 font-display">{item.team} Department</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{item.weeklyHours} hours weekly commitment</div>
                      </td>
                      <td className="py-4 px-5 max-w-xs space-y-1">
                        <div>
                          <strong className="font-semibold text-slate-700">Skills:</strong> {item.skills}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          <strong className="font-semibold text-slate-700 font-display">Exp:</strong> {item.experience}
                        </div>
                      </td>
                      <td className="py-4 px-5 max-w-xxs text-[11px] text-slate-400 italic">
                        "{item.whyJoin}"
                      </td>
                      <td className="py-4 px-5">
                        <div className="relative inline-block w-32">
                          <select
                            className={`w-full py-1 px-2 rounded-lg border text-xs font-semibold appearance-none bg-white pr-6 ${
                              item.status === 'accepted'
                                ? 'border-emerald-200 text-emerald-700 bg-emerald-50/20'
                                : item.status === 'declined'
                                ? 'border-rose-200 text-rose-700 bg-rose-50/20'
                                : item.status === 'reviewed'
                                ? 'border-indigo-200 text-indigo-700 bg-indigo-50/20'
                                : 'border-slate-250 text-slate-600'
                            }`}
                            value={item.status}
                            onChange={(e) => handleUpdateTeamApp(item.id, e.target.value as any)}
                          >
                            <option value="pending">Pending</option>
                            <option value="reviewed">Under Review</option>
                            <option value="accepted">Accepted</option>
                            <option value="declined">Declined</option>
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}

          {/* 4. WORKSHOPS LIST */}
          {activeSubTab === 'workshops' && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  <th className="py-3.5 px-5">Student registration</th>
                  <th className="py-3.5 px-5">School / College</th>
                  <th className="py-3.5 px-5">Course Topic</th>
                  <th className="py-3.5 px-5">Preferred Level</th>
                  <th className="py-3.5 px-5">Parent/Guardian Info</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                {workshops
                  .filter((item) => {
                    return (
                      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      item.workshopTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      item.institution.toLowerCase().includes(searchTerm.toLowerCase())
                    );
                  })
                  .map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-5">
                        <div className="font-semibold text-slate-900">{item.name}</div>
                        <div className="text-[11px] text-slate-400">Class/Age: {item.ageClass}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-1">ph: {item.contactNumber}</div>
                      </td>
                      <td className="py-4 px-5 text-slate-700">
                        {item.institution}
                      </td>
                      <td className="py-4 px-5">
                        <span className="font-semibold text-teal-700 font-display">{item.workshopTitle}</span>
                        <div className="text-[9px] text-slate-400 font-mono mt-0.5">
                          Registered: {new Date(item.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <span className={`inline-block text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md font-mono ${
                          item.level === 'intermediate' ? 'bg-indigo-50 text-indigo-700' : 'bg-teal-50 text-teal-700'
                        }`}>
                          {item.level}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-slate-500 italic max-w-xs">
                        {item.parentContact || <span className="text-slate-300 not-italic text-[10px]">None provided</span>}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

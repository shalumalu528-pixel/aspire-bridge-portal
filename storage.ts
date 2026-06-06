/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Donation, Volunteer, TeamApplication, WorkshopSignup } from '../types';
import { db, isFirebaseConfigured, handleFirestoreError, OperationType } from './firebase';
import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

// Seed data fallback
const DEFAULT_DONATIONS: Donation[] = [
  {
    id: 'don-1',
    fullName: 'David Kojo',
    phone: '+233 24 555 1212',
    city: 'Accra',
    donationType: 'books',
    quantity: '30 High school Mathematics & Science textbooks',
    preference: 'pickup',
    message: 'Hoping these science books help children prepare for university entrance examinations.',
    status: 'completed',
    createdAt: '2026-05-15T10:30:00Z',
  },
  {
    id: 'don-2',
    fullName: 'Sarah Chen',
    phone: '+65 9123 4567',
    city: 'Singapore',
    donationType: 'educational_supplies',
    quantity: '50 packs of pencils, 100 notebooks, 30 rulers',
    preference: 'dropoff',
    message: 'Leftover stock from our community center drive. Boxed and labeled.',
    status: 'confirmed',
    createdAt: '2526-06-01T14:15:00Z',
  },
  {
    id: 'don-3',
    fullName: 'Liam Patel',
    phone: '+44 7911 123456',
    city: 'London',
    donationType: 'jewellery',
    quantity: '15 pieces of handcrafted community jewellery for school fundraising',
    preference: 'dropoff',
    message: 'Handcrafted items from our local community center collection drive.',
    status: 'completed',
    createdAt: '2026-06-02T09:00:00Z',
  },
  {
    id: 'don-4',
    fullName: 'Fatima Al-Sayed',
    phone: '+971 50 123 4567',
    city: 'Dubai',
    donationType: 'clothing',
    quantity: '2 big bags of warm winter jackets and children sweathers',
    preference: 'pickup',
    message: 'All items are washed, packed, and in like-new conditions.',
    status: 'pending',
    createdAt: '2026-06-03T18:45:00Z',
  },
  {
    id: 'don-5',
    fullName: 'Marcus Vance',
    phone: '+1 415 555 2673',
    city: 'San Francisco',
    donationType: 'other',
    quantity: '5 educational board games and 10 dynamic drawing sets',
    preference: 'dropoff',
    message: 'All games are complete and drawing sets are brand new. Let me know drop-off timings.',
    status: 'pending',
    createdAt: '2026-06-04T07:20:00Z',
  }
];

const DEFAULT_VOLUNTEERS: Volunteer[] = [
  {
    id: 'vol-1',
    fullName: 'Amara Okafor',
    email: 'amara@example.com',
    phone: '+234 80 5555 1212',
    age: 21,
    city: 'Enugu',
    institution: 'University of Nigeria',
    skills: 'Public Speaking, Active listening, basic math coaching',
    availability: 'Saturdays, 10 AM to 4 PM',
    whyVolunteer: 'I believe educational equity is the cornerstone of sustainable development. I want to pass on the support I received as a pupil.',
    area: 'teaching',
    status: 'accepted',
    createdAt: '2026-05-20T11:00:00Z',
  },
  {
    id: 'vol-2',
    fullName: 'Kenji Sato',
    email: 'kenji@example.com',
    phone: '+81 90 1234 5678',
    age: 23,
    city: 'Tokyo',
    institution: 'Waseda University',
    skills: 'Video editing, poster illustration, social media writing',
    availability: '3-4 hours on weekdays (Remote)',
    whyVolunteer: 'AspireBridge does incredible ground-level work. I can help scale their digital outreach and spread awareness internationally.',
    area: 'content',
    status: 'reviewed',
    createdAt: '2026-06-01T08:30:00Z',
  },
  {
    id: 'vol-3',
    fullName: 'Emily Watson',
    email: 'emily@example.com',
    phone: '+44 7911 111111',
    age: 19,
    city: 'Bristol',
    institution: 'University of Bristol',
    skills: 'Logistics assistance, registration support, enthusiastic helper',
    availability: 'Weekends primarily',
    whyVolunteer: 'I want to build real-world coordination skills while providing meaningful help to underprivileged youth.',
    area: 'events',
    status: 'pending',
    createdAt: '2026-06-03T16:00:00Z',
  }
];

const DEFAULT_TEAM_APPLICATIONS: TeamApplication[] = [
  {
    id: 'team-1',
    fullName: 'Nikhil Mehta',
    age: 26,
    contact: 'nikhil.m@example.com / +91 98765 43210',
    skills: 'Node.js, React, database tuning, architectural designs',
    experience: '2 years as Software Engineer at leading tech firm. Managed cloud migrations.',
    whyJoin: 'AspireBridge is in constant need of technical refinement. I want to volunteer my structural tech expertise to build robust back-office tools.',
    team: 'Tech',
    weeklyHours: 12,
    status: 'accepted',
    createdAt: '2026-05-10T14:00:00Z',
  },
  {
    id: 'team-2',
    fullName: 'Claire Dubois',
    age: 28,
    contact: 'claire.dubois@example.com',
    skills: 'Grant writing, non-profit outreach, fundraising strategies',
    experience: 'Assisted local community centers secure 3 international micro-grants in 2024-2025.',
    whyJoin: 'I am passionate about building bridges for youth. I have the grant drafting chops that can directly boost AspireBridge funding pools.',
    team: 'Outreach',
    weeklyHours: 8,
    status: 'pending',
    createdAt: '2026-06-02T11:20:00Z',
  }
];

const DEFAULT_WORKSHOPS: WorkshopSignup[] = [
  {
    id: 'work-1',
    name: 'Tariq Al-Farsi',
    ageClass: '11th Grade',
    institution: 'Muscat Public School',
    contactNumber: '+968 9123 4321',
    workshopTitle: 'AI Essentials: Generative Thinking',
    level: 'beginner',
    parentContact: 'Father: Salim Al-Farsi (+968 9123 9999)',
    createdAt: '2026-05-28T09:40:00Z',
  },
  {
    id: 'work-2',
    name: 'Lin Sophie',
    ageClass: 'University Freshman',
    institution: 'Nanyang Technological University',
    contactNumber: '+65 8821 3456',
    workshopTitle: 'Introduction to Web Crafting',
    level: 'intermediate',
    createdAt: '2026-06-01T15:30:00Z',
  },
  {
    id: 'work-3',
    name: 'Zoe Jenkins',
    ageClass: '10th Grade',
    institution: 'Clifton High School',
    contactNumber: '+44 7700 900077',
    workshopTitle: 'Public Speaking & Leadership',
    level: 'beginner',
    parentContact: 'Guardian: Arthur Jenkins (zoe.parent@example.com)',
    createdAt: '2026-06-03T11:15:00Z',
  },
  {
    id: 'work-4',
    name: 'Carlos Gomez',
    ageClass: '9th Grade',
    institution: 'Colegio Bolivar',
    contactNumber: '+57 321 444 5555',
    workshopTitle: 'Creative Writing Lab',
    level: 'beginner',
    parentContact: 'Mother: Elena Gomez (+57 321 444 8888)',
    createdAt: '2026-06-04T08:10:00Z',
  }
];

// Helper to sort collections by creation timestamp descending
const sortByDateDesc = <T extends { createdAt: string }>(items: T[]): T[] => {
  return [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// --- donations ---

export const getDonations = async (): Promise<Donation[]> => {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase Firestore is not configured');
  }
  try {
    const snap = await getDocs(collection(db, 'donations'));
    const list: Donation[] = [];
    snap.forEach((docSnap) => {
      list.push({ ...docSnap.data() as Donation, id: docSnap.id });
    });
    return sortByDateDesc(list);
  } catch (e) {
    handleFirestoreError(e, OperationType.LIST, 'donations');
  }
};

export const saveDonation = async (donation: Omit<Donation, 'id' | 'status' | 'createdAt'>): Promise<Donation> => {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase Firestore is not configured');
  }
  const newId = `don-${Date.now()}`;
  const record: Donation = {
    ...donation,
    id: newId,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  try {
    const docRef = doc(db, 'donations', newId);
    await setDoc(docRef, record);
    return record;
  } catch (e) {
    handleFirestoreError(e, OperationType.CREATE, `donations/${newId}`);
  }
};

export const updateDonationStatus = async (id: string, status: 'pending' | 'confirmed' | 'completed'): Promise<Donation[]> => {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase Firestore is not configured');
  }
  try {
    const docRef = doc(db, 'donations', id);
    await updateDoc(docRef, { status });
    return await getDonations();
  } catch (e) {
    handleFirestoreError(e, OperationType.UPDATE, `donations/${id}`);
  }
};


// --- volunteers ---

export const getVolunteers = async (): Promise<Volunteer[]> => {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase Firestore is not configured');
  }
  try {
    const snap = await getDocs(collection(db, 'volunteers'));
    const list: Volunteer[] = [];
    snap.forEach((docSnap) => {
      list.push({ ...docSnap.data() as Volunteer, id: docSnap.id });
    });
    return sortByDateDesc(list);
  } catch (e) {
    handleFirestoreError(e, OperationType.LIST, 'volunteers');
  }
};

export const saveVolunteer = async (volunteer: Omit<Volunteer, 'id' | 'status' | 'createdAt'>): Promise<Volunteer> => {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase Firestore is not configured');
  }
  const newId = `vol-${Date.now()}`;
  const record: Volunteer = {
    ...volunteer,
    id: newId,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  try {
    const docRef = doc(db, 'volunteers', newId);
    await setDoc(docRef, record);
    return record;
  } catch (e) {
    handleFirestoreError(e, OperationType.CREATE, `volunteers/${newId}`);
  }
};

export const updateVolunteerStatus = async (id: string, status: 'pending' | 'reviewed' | 'accepted' | 'declined'): Promise<Volunteer[]> => {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase Firestore is not configured');
  }
  try {
    const docRef = doc(db, 'volunteers', id);
    await updateDoc(docRef, { status });
    return await getVolunteers();
  } catch (e) {
    handleFirestoreError(e, OperationType.UPDATE, `volunteers/${id}`);
  }
};


// --- teamApplications ---

export const getTeamApplications = async (): Promise<TeamApplication[]> => {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase Firestore is not configured');
  }
  try {
    const snap = await getDocs(collection(db, 'teamApplications'));
    const list: TeamApplication[] = [];
    snap.forEach((docSnap) => {
      list.push({ ...docSnap.data() as TeamApplication, id: docSnap.id });
    });
    return sortByDateDesc(list);
  } catch (e) {
    handleFirestoreError(e, OperationType.LIST, 'teamApplications');
  }
};

export const saveTeamApplication = async (app: Omit<TeamApplication, 'id' | 'status' | 'createdAt'>): Promise<TeamApplication> => {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase Firestore is not configured');
  }
  const newId = `team-${Date.now()}`;
  const record: TeamApplication = {
    ...app,
    id: newId,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  try {
    const docRef = doc(db, 'teamApplications', newId);
    await setDoc(docRef, record);
    return record;
  } catch (e) {
    handleFirestoreError(e, OperationType.CREATE, `teamApplications/${newId}`);
  }
};

export const updateTeamApplicationStatus = async (id: string, status: 'pending' | 'reviewed' | 'accepted' | 'declined'): Promise<TeamApplication[]> => {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase Firestore is not configured');
  }
  try {
    const docRef = doc(db, 'teamApplications', id);
    await updateDoc(docRef, { status });
    return await getTeamApplications();
  } catch (e) {
    handleFirestoreError(e, OperationType.UPDATE, `teamApplications/${id}`);
  }
};


// --- workshopRegistrations ---

export const getWorkshopSignups = async (): Promise<WorkshopSignup[]> => {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase Firestore is not configured');
  }
  try {
    const snap = await getDocs(collection(db, 'workshopRegistrations'));
    const list: WorkshopSignup[] = [];
    snap.forEach((docSnap) => {
      list.push({ ...docSnap.data() as WorkshopSignup, id: docSnap.id });
    });
    return sortByDateDesc(list);
  } catch (e) {
    handleFirestoreError(e, OperationType.LIST, 'workshopRegistrations');
  }
};

export const saveWorkshopSignup = async (signup: Omit<WorkshopSignup, 'id' | 'createdAt'>): Promise<WorkshopSignup> => {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase Firestore is not configured');
  }
  const newId = `work-${Date.now()}`;
  const record: WorkshopSignup = {
    ...signup,
    id: newId,
    createdAt: new Date().toISOString(),
  };

  try {
    const docRef = doc(db, 'workshopRegistrations', newId);
    await setDoc(docRef, record);
    return record;
  } catch (e) {
    handleFirestoreError(e, OperationType.CREATE, `workshopRegistrations/${newId}`);
  }
};

export const deleteDonation = async (id: string): Promise<void> => {
  if (!isFirebaseConfigured || !db) return;
  try {
    const docRef = doc(db, 'donations', id);
    await deleteDoc(docRef);
  } catch (e) {
    handleFirestoreError(e, OperationType.DELETE, `donations/${id}`);
  }
};

export const deleteVolunteer = async (id: string): Promise<void> => {
  if (!isFirebaseConfigured || !db) return;
  try {
    const docRef = doc(db, 'volunteers', id);
    await deleteDoc(docRef);
  } catch (e) {
    handleFirestoreError(e, OperationType.DELETE, `volunteers/${id}`);
  }
};

export const deleteTeamApplication = async (id: string): Promise<void> => {
  if (!isFirebaseConfigured || !db) return;
  try {
    const docRef = doc(db, 'teamApplications', id);
    await deleteDoc(docRef);
  } catch (e) {
    handleFirestoreError(e, OperationType.DELETE, `teamApplications/${id}`);
  }
};

export const deleteWorkshopSignup = async (id: string): Promise<void> => {
  if (!isFirebaseConfigured || !db) return;
  try {
    const docRef = doc(db, 'workshopRegistrations', id);
    await deleteDoc(docRef);
  } catch (e) {
    handleFirestoreError(e, OperationType.DELETE, `workshopRegistrations/${id}`);
  }
};

// Specialized purge function to delete all default placeholders and test applications
export const purgeMockPlaceholders = async (): Promise<{
  donationsDeleted: number;
  volunteersDeleted: number;
  teamAppsDeleted: number;
  workshopsDeleted: number;
}> => {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase Firestore is not configured');
  }

  const mockNames = new Set([
    'david kojo', 'sarah chen', 'liam patel', 'fatima al-sayed', 'marcus vance',
    'amara okafor', 'kenji sato', 'emily watson',
    'nikhil mehta', 'claire dubois',
    'tariq al-farsi', 'lin sophie', 'zoe jenkins', 'carlos gomez'
  ]);

  const mockIds = new Set([
    'don-1', 'don-2', 'don-3', 'don-4', 'don-5',
    'vol-1', 'vol-2', 'vol-3',
    'team-1', 'team-2',
    'work-1', 'work-2', 'work-3', 'work-4'
  ]);

  let donationsDeleted = 0;
  let volunteersDeleted = 0;
  let teamAppsDeleted = 0;
  let workshopsDeleted = 0;

  // 1. Purge donations
  try {
    const snap = await getDocs(collection(db, 'donations'));
    for (const docSnap of snap.docs) {
      const data = docSnap.data();
      const nameLower = (data.fullName || '').toLowerCase().trim();
      if (mockIds.has(docSnap.id) || mockNames.has(nameLower)) {
        await deleteDoc(docSnap.ref);
        donationsDeleted++;
      }
    }
  } catch (e) {
    console.error("Purging donations failed:", e);
  }

  // 2. Purge volunteers
  try {
    const snap = await getDocs(collection(db, 'volunteers'));
    for (const docSnap of snap.docs) {
      const data = docSnap.data();
      const nameLower = (data.fullName || '').toLowerCase().trim();
      if (mockIds.has(docSnap.id) || mockNames.has(nameLower)) {
        await deleteDoc(docSnap.ref);
        volunteersDeleted++;
      }
    }
  } catch (e) {
    console.error("Purging volunteers failed:", e);
  }

  // 3. Purge teamApplications
  try {
    const snap = await getDocs(collection(db, 'teamApplications'));
    for (const docSnap of snap.docs) {
      const data = docSnap.data();
      const nameLower = (data.fullName || '').toLowerCase().trim();
      if (mockIds.has(docSnap.id) || mockNames.has(nameLower)) {
        await deleteDoc(docSnap.ref);
        teamAppsDeleted++;
      }
    }
  } catch (e) {
    console.error("Purging teamApps failed:", e);
  }

  // 4. Purge workshopRegistrations
  try {
    const snap = await getDocs(collection(db, 'workshopRegistrations'));
    for (const docSnap of snap.docs) {
      const data = docSnap.data();
      const nameLower = (data.name || '').toLowerCase().trim();
      if (mockIds.has(docSnap.id) || mockNames.has(nameLower)) {
        await deleteDoc(docSnap.ref);
        workshopsDeleted++;
      }
    }
  } catch (e) {
    console.error("Purging workshops failed:", e);
  }

  return {
    donationsDeleted,
    volunteersDeleted,
    teamAppsDeleted,
    workshopsDeleted
  };
};

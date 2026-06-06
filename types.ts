/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Donation {
  id: string;
  fullName: string;
  phone: string;
  city: string;
  donationType: 'clothing' | 'jewellery' | 'books' | 'educational_supplies' | 'other' | 'clothes' | 'stationery';
  quantity: string;
  preference: 'pickup' | 'dropoff';
  message: string;
  status: 'pending' | 'confirmed' | 'completed';
  createdAt: string;
}

export interface Volunteer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  age: number;
  city: string;
  institution: string; // school/college/university
  skills: string;
  availability: string;
  whyVolunteer: string;
  area: 'events' | 'content' | 'outreach' | 'teaching' | 'media' | 'tech';
  status: 'pending' | 'reviewed' | 'accepted' | 'declined';
  createdAt: string;
}

export interface TeamApplication {
  id: string;
  fullName: string;
  age: number;
  contact: string;
  skills: string;
  experience: string;
  whyJoin: string;
  team: string; // Events, Content, Outreach, Teaching, Media, Tech
  weeklyHours: number;
  status: 'pending' | 'reviewed' | 'accepted' | 'declined';
  createdAt: string;
}

export interface WorkshopSignup {
  id: string;
  name: string;
  ageClass: string;
  institution: string; // school/college
  contactNumber: string;
  workshopTitle: string;
  level: 'beginner' | 'intermediate';
  parentContact?: string;
  createdAt: string;
}

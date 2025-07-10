import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  setDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage, auth } from './firebase';

// Types
export interface Gym {
  id?: string;
  name: string;
  address: string;
  description: string;
  phone: string;
  email: string;
  openingHours: string;
  photos: string[];
  features?: string[]; // Add features array
  order?: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  // Keeping backward compatibility fields
  title?: string;
  image?: string;
  link?: string;
}

export interface Transformation {
  id?: string;
  name: string;
  beforeImage: string;
  afterImage: string;
  duration: string;
  goal: string;
  testimonial: string;
  order?: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface TrainerMedia {
  url: string;
  caption?: string;
  categoryTag: 'Gallery' | 'Before/After' | 'Certification' | 'Training' | 'Other';
  altText?: string;
  order?: number;
}

export interface TrainerVideo {
  url: string;
  title: string;
  description?: string;
  type: 'upload' | 'embed';
  thumbnail?: string;
  order?: number;
}

export interface TrainerProfile {
  id?: string;
  name: string;
  slug: string;
  role: string;
  bioShort: string;
  bioLong: string;
  experienceYears: number;
  specializations: string[];
  certifications: string[];
  
  // Media
  profileImage: string;
  heroImage?: string;
  heroVideo?: string;
  images: TrainerMedia[];
  videos: TrainerVideo[];
  
  // Settings
  featuredFlag: boolean;
  acceptingNewClientsFlag: boolean;
  
  // Social & Contact
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    twitter?: string;
  };
  
  // Legacy fields for backward compatibility
  image?: string;
  experience?: string;
  specialization?: string;
  
  // System fields
  order?: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Keep legacy interface for backward compatibility
export interface Trainer extends TrainerProfile {}

export interface Membership {
  id?: string;
  name: string;
  price: {
    monthly: string;
    quarterly: string;
    halfyearly: string;
    annual: string;
  };
  type: string;
  features: string[];
  isPopular: boolean;
  order?: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface BlogPost {
  id?: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  category: string;
  order?: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface ContactRequest {
  id?: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'new' | 'read' | 'responded';
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface AddOnService {
  id?: string;
  name: string;
  description: string;
  price: {
    perSession?: string;
    monthly?: string;
    oneTime?: string;
  };
  features: string[];
  category: 'training' | 'nutrition' | 'wellness' | 'other';
  isPopular: boolean;
  isActive: boolean;
  order?: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface ServiceBooking {
  id?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  membershipId?: string;
  membershipName?: string;
  addOnServices: {
    serviceId: string;
    serviceName: string;
    price: string;
    pricingType: 'perSession' | 'monthly' | 'oneTime';
  }[];
  totalAmount: string;
  preferredStartDate?: string;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Payment {
  id?: string;
  // User Information
  fullName: string;
  email: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  
  // Membership Details
  membershipId: string;
  membershipName: string;
  membershipType: string;
  duration: 'monthly' | 'quarterly' | 'halfyearly' | 'annual';
  
  // Pricing Information
  originalPrice: number;
  finalAmount: number;
  couponCode?: string;
  discountAmount?: number;
  
  // Payment Details
  upiId: string;
  payeeName: string;
  transactionNote: string;
  
  // Screenshot & Verification
  screenshotUrl: string;
  
  // Status & Timestamps
  status: 'pending' | 'verified' | 'rejected';
  paymentDate: Timestamp;
  verificationDate?: Timestamp;
  order?: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// TeamMember interface
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    twitter?: string;
  };
}

// Generic CRUD operations
class FirebaseService<T> {
  constructor(private collectionName: string) {}

  async getAll(): Promise<T[]> {
    const q = query(
      collection(db, this.collectionName), 
      orderBy('order', 'asc'),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as T[];
  }

  async getById(id: string): Promise<T | null> {
    const docRef = doc(db, this.collectionName, id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as T;
    }
    return null;
  }

  async create(data: Omit<T, 'id'>): Promise<string> {
    // Get the current max order to append new item at the end
    const existingItems = await this.getAll();
    const maxOrder = existingItems.reduce((max, item: any) => 
      Math.max(max, item.order || 0), -1);
    
    const docData = {
      ...data,
      order: maxOrder + 1,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    const docRef = await addDoc(collection(db, this.collectionName), docData);
    return docRef.id;
  }

  async update(id: string, data: Partial<T>): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  }

  async delete(id: string): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    await deleteDoc(docRef);
  }

  onSnapshot(callback: (items: T[]) => void): () => void {
    const q = query(
      collection(db, this.collectionName), 
      orderBy('order', 'asc'),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];
      
      // Debug logging for trainers collection
      if (this.collectionName === 'trainers') {
        console.log(`Fetched ${items.length} trainers:`, items);
      }
      
      callback(items);
    }, (error) => {
      console.error(`Error in ${this.collectionName} onSnapshot:`, error);
    });
  }

  // Batch update orders for reordering
  async updateOrder(items: (T & { id: string; order: number })[]): Promise<void> {
    const batch = writeBatch(db);
    
    items.forEach(item => {
      const docRef = doc(db, this.collectionName, item.id);
      batch.update(docRef, { 
        order: item.order,
        updatedAt: Timestamp.now()
      });
    });

    await batch.commit();
  }
}

// Service instances
export const gymsService = new FirebaseService<Gym>('gyms');
export const transformationsService = new FirebaseService<Transformation>('transformations');
export const trainersService = new FirebaseService<Trainer>('trainers');
export const membershipsService = new FirebaseService<Membership>('memberships');
export const blogService = new FirebaseService<BlogPost>('blog_posts');
export const contactsService = new FirebaseService<ContactRequest>('contact_requests');
export const addOnServicesService = new FirebaseService<AddOnService>('add_on_services');
export const serviceBookingsService = new FirebaseService<ServiceBooking>('service_bookings');

// Specialized Payments Service (orders by paymentDate instead of order field)
class PaymentsService {
  private readonly collectionName = 'payments';

  async getAll(): Promise<Payment[]> {
    const q = query(
      collection(db, this.collectionName), 
      orderBy('paymentDate', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Payment[];
  }

  async getById(id: string): Promise<Payment | null> {
    const docRef = doc(db, this.collectionName, id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as Payment;
    }
    return null;
  }

  async create(data: Omit<Payment, 'id'>): Promise<string> {
    const docData = {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    const docRef = await addDoc(collection(db, this.collectionName), docData);
    return docRef.id;
  }

  async update(id: string, data: Partial<Payment>): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  }

  async delete(id: string): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    await deleteDoc(docRef);
  }

  onSnapshot(callback: (items: Payment[]) => void): () => void {
    const q = query(
      collection(db, this.collectionName), 
      orderBy('paymentDate', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Payment[];
      
      console.log(`Fetched ${items.length} payments:`, items);
      callback(items);
    }, (error) => {
      console.error(`Error in payments onSnapshot:`, error);
    });
  }
}

export const paymentsService = new PaymentsService();

// Team member service
export const teamMemberService = {
  // Get all team members with real-time updates
  onSnapshot: (callback: (members: TeamMember[]) => void) => {
    const q = query(collection(db, 'teamMembers'));
    return onSnapshot(q, (snapshot) => {
      const members: TeamMember[] = [];
      snapshot.forEach((doc) => {
        members.push({
          id: doc.id,
          ...doc.data() as Omit<TeamMember, 'id'>
        });
      });
      callback(members);
    });
  },

  // Get all team members once
  getAll: async (): Promise<TeamMember[]> => {
    const q = query(collection(db, 'teamMembers'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<TeamMember, 'id'>
    }));
  },

  // Get a single team member
  getById: async (id: string): Promise<TeamMember | null> => {
    const docRef = doc(db, 'teamMembers', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data() as Omit<TeamMember, 'id'>
      };
    }
    return null;
  },

  // Create a new team member
  create: async (member: Omit<TeamMember, 'id'>): Promise<string> => {
    const docRef = await addDoc(collection(db, 'teamMembers'), member);
    return docRef.id;
  },

  // Update a team member
  update: async (id: string, data: Partial<Omit<TeamMember, 'id'>>): Promise<void> => {
    const docRef = doc(db, 'teamMembers', id);
    await updateDoc(docRef, data);
  },

  // Delete a team member
  delete: async (id: string): Promise<void> => {
    const docRef = doc(db, 'teamMembers', id);
    await deleteDoc(docRef);
  }
};

// Single Gym Profile Service
class GymProfileService {
  private readonly PROFILE_ID = 'main_gym_profile';
  
  async getGymProfile(): Promise<Gym | null> {
    try {
      const docRef = doc(db, 'gym_profile', this.PROFILE_ID);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Gym;
      }
      return null;
    } catch (error) {
      console.error('Error fetching gym profile:', error);
      throw error;
    }
  }
  
  async updateGymProfile(gymData: Omit<Gym, 'id'>): Promise<void> {
    try {
      const docRef = doc(db, 'gym_profile', this.PROFILE_ID);
      await setDoc(docRef, {
        ...gymData,
        updatedAt: Timestamp.now()
      }, { merge: true });
    } catch (error) {
      console.error('Error updating gym profile:', error);
      throw error;
    }
  }
  
  onSnapshot(callback: (gym: Gym | null) => void): () => void {
    const docRef = doc(db, 'gym_profile', this.PROFILE_ID);
    return onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() } as Gym);
      } else {
        callback(null);
      }
    });
  }
}

export const gymProfileService = new GymProfileService();

// File upload service with Cloudinary (simplified - no CORS issues)
export const uploadImage = async (file: File, path: string): Promise<string> => {
  // Check if user is authenticated
  if (!auth.currentUser) {
    throw new Error('Authentication required for file upload');
  }

  // Check if user is admin
  if (auth.currentUser.email !== 'admin@rebuild.com') {
    throw new Error('Admin privileges required for file upload');
  }

  // Use Cloudinary upload service
  const { uploadImageWithFallback } = await import('./uploadService');
  return await uploadImageWithFallback(file, path);
};

export const deleteImage = async (url: string): Promise<void> => {
  // Check authentication
  if (!auth.currentUser || auth.currentUser.email !== 'admin@rebuild.com') {
    throw new Error('Admin privileges required for file deletion');
  }

  try {
    const imageRef = ref(storage, url);
    await deleteObject(imageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
    // Don't throw error for deletion, as it might not exist
  }
};

// Contact form submission (for public use)
export const submitContactForm = async (contactData: Omit<ContactRequest, 'id' | 'status'>): Promise<void> => {
  await contactsService.create({
    ...contactData,
    status: 'new'
  });
};

// Public upload function for payment screenshots (no authentication required)
export const uploadPaymentScreenshot = async (file: File): Promise<string> => {
  try {
    // Use Cloudinary upload service for payment screenshots
    const { cloudinaryService } = await import('./cloudinaryService');
    return await cloudinaryService.uploadImage(file, 'payments', {
      tags: ['payment_screenshot', 'rebuild_gym', 'user_upload'],
      context: {
        upload_type: 'payment_screenshot',
        uploaded_via: 'payment_flow'
      }
    });
  } catch (error) {
    console.error('Error uploading payment screenshot:', error);
    throw new Error(`Payment screenshot upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Utility functions for trainer profiles
export const generateTrainerSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

export const validateTrainerSlug = async (slug: string, excludeId?: string): Promise<boolean> => {
  const trainers = await trainersService.getAll();
  return !trainers.some(trainer => 
    trainer.slug === slug && trainer.id !== excludeId
  );
};

// Enhanced trainer service with profile-specific methods
class EnhancedTrainerService extends FirebaseService<TrainerProfile> {
  constructor() {
    super('trainers');
  }

  async getBySlug(slug: string): Promise<TrainerProfile | null> {
    const trainers = await this.getAll();
    const trainer = trainers.find(t => t.slug === slug);
    return trainer || null;
  }

  async createWithSlug(data: Omit<TrainerProfile, 'id' | 'slug'>): Promise<string> {
    const baseSlug = generateTrainerSlug(data.name);
    let slug = baseSlug;
    let counter = 1;
    
    // Ensure unique slug
    while (!(await validateTrainerSlug(slug))) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    return await this.create({ ...data, slug });
  }

  async updateWithSlug(id: string, data: Partial<TrainerProfile>): Promise<void> {
    if (data.name && !data.slug) {
      const baseSlug = generateTrainerSlug(data.name);
      let slug = baseSlug;
      let counter = 1;
      
      // Ensure unique slug
      while (!(await validateTrainerSlug(slug, id))) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      
      data.slug = slug;
    }
    
    return await this.update(id, data);
  }

  async getFeatured(): Promise<TrainerProfile[]> {
    const trainers = await this.getAll();
    return trainers.filter(trainer => trainer.featuredFlag).slice(0, 6);
  }

  async getAcceptingClients(): Promise<TrainerProfile[]> {
    const trainers = await this.getAll();
    return trainers.filter(trainer => trainer.acceptingNewClientsFlag);
  }
}

// Export enhanced trainer service
export const enhancedTrainersService = new EnhancedTrainerService();

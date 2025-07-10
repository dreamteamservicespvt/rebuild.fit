import {
  collection,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db } from './firebase';

export interface DropdownOptions {
  roles: string[];
  experiences: string[];
  specializations: string[];
  updatedAt?: Date;
}

const COLLECTION_NAME = 'dropdown_options';
const DOCUMENT_ID = 'trainer_options';

class DropdownOptionsService {
  private currentOptions: DropdownOptions = {
    roles: [],
    experiences: [],
    specializations: [],
  };

  // Default options to initialize with
  private defaultOptions: DropdownOptions = {
    roles: [
      "Head Trainer",
      "Senior Trainer", 
      "Fitness Coach",
      "Personal Trainer",
      "Nutrition Specialist",
      "Fitness Manager",
      "Group Fitness Instructor",
      "Yoga Instructor",
      "Strength Coach"
    ],
    experiences: [
      "1+ Years",
      "2+ Years", 
      "3+ Years",
      "5+ Years",
      "7+ Years",
      "10+ Years",
      "15+ Years",
      "20+ Years"
    ],
    specializations: [
      "Strength Training",
      "Weight Loss",
      "Bodybuilding", 
      "Functional Fitness",
      "CrossFit",
      "Nutrition",
      "Sports Performance",
      "Rehabilitation",
      "Yoga & Flexibility",
      "HIIT",
      "Kettlebell Training"
    ]
  };

  async initializeOptions(): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      // Initialize with default options
      await setDoc(docRef, {
        ...this.defaultOptions,
        updatedAt: new Date(),
      });
      this.currentOptions = { ...this.defaultOptions };
    } else {
      this.currentOptions = docSnap.data() as DropdownOptions;
    }
  }

  onSnapshot(callback: (options: DropdownOptions) => void): () => void {
    const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
    return onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        this.currentOptions = doc.data() as DropdownOptions;
        callback(this.currentOptions);
      }
    });
  }

  async addRole(role: string): Promise<void> {
    if (!role.trim() || this.currentOptions.roles.includes(role.trim())) {
      return;
    }

    const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
    await updateDoc(docRef, {
      roles: arrayUnion(role.trim()),
      updatedAt: new Date(),
    });
  }

  async addExperience(experience: string): Promise<void> {
    if (!experience.trim() || this.currentOptions.experiences.includes(experience.trim())) {
      return;
    }

    const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
    await updateDoc(docRef, {
      experiences: arrayUnion(experience.trim()),
      updatedAt: new Date(),
    });
  }

  async addSpecialization(specialization: string): Promise<void> {
    if (!specialization.trim() || this.currentOptions.specializations.includes(specialization.trim())) {
      return;
    }

    const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
    await updateDoc(docRef, {
      specializations: arrayUnion(specialization.trim()),
      updatedAt: new Date(),
    });
  }

  async removeRole(role: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
    await updateDoc(docRef, {
      roles: arrayRemove(role),
      updatedAt: new Date(),
    });
  }

  async removeExperience(experience: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
    await updateDoc(docRef, {
      experiences: arrayRemove(experience),
      updatedAt: new Date(),
    });
  }

  async removeSpecialization(specialization: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
    await updateDoc(docRef, {
      specializations: arrayRemove(specialization),
      updatedAt: new Date(),
    });
  }

  getCurrentOptions(): DropdownOptions {
    return this.currentOptions;
  }

  getRoles(): string[] {
    return this.currentOptions.roles;
  }

  getExperiences(): string[] {
    return this.currentOptions.experiences;
  }

  getSpecializations(): string[] {
    return this.currentOptions.specializations;
  }
}

export const dropdownOptionsService = new DropdownOptionsService();

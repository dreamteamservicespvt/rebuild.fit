import { gymProfileService } from '../lib/firebaseServices';

const sampleGymData = {
  name: "REBUILD FITNESS GYM",
  address: "Oppo Bala Tripura Sundari Temple St, Jawaharlal Street, Kakinada, Andhra Pradesh 533001",
  description: "Welcome to Rebuild Fitness Gym, your premier destination for achieving your fitness goals. Our state-of-the-art TRAINERS features the latest equipment, expert trainers, and a motivating environment designed to help you rebuild your body and transform your life. Whether you're a beginner or an experienced athlete, we have everything you need to succeed.",
  phone: "+91 9876543210",
  email: "info@rebuildfitness.com", 
  openingHours: "Monday - Friday: 5:00 AM - 10:00 PM\nSaturday - Sunday: 6:00 AM - 8:00 PM",
  photos: [
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
    "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80"
  ]
};

export const populateGymProfile = async () => {
  try {
    await gymProfileService.updateGymProfile(sampleGymData);
    console.log('Gym profile populated successfully!');
  } catch (error) {
    throw error;
  }
};

// Run immediately if called directly
if (import.meta.env.DEV) {
  populateGymProfile();
}

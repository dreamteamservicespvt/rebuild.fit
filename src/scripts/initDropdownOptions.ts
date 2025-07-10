import { dropdownOptionsService } from '../lib/dropdownOptionsService';

// This script initializes the dropdown options in Firestore
// Run this once to populate the database with default options
export const initializeDropdownOptions = async () => {
  try {
    console.log('Initializing dropdown options...');
    await dropdownOptionsService.initializeOptions();
    console.log('Dropdown options initialized successfully!');
  } catch (error) {
    console.error('Failed to initialize dropdown options:', error);
    throw error;
  }
};

// Call this if running directly
if (typeof window === 'undefined') {
  initializeDropdownOptions().then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  }).catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
}

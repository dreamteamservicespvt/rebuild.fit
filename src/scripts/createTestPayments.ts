import { paymentsService } from '@/lib/firebaseServices';
import { Timestamp } from 'firebase/firestore';

// Function to create test payments for testing the admin dashboard
export const createTestPayments = async () => {
  const testPayments = [
    {
      // User Information
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+91-9876543210',
      gender: 'male' as const,
      
      // Membership Details
      membershipId: 'test-membership-1',
      membershipName: 'STRENGTHENING',
      membershipType: 'premium',
      duration: 'quarterly' as const,
      
      // Pricing Information
      originalPrice: 5499,
      finalAmount: 5499,
      
      // Payment Details
      upiId: 'sagar.a.tej@ybl',
      payeeName: 'AKULA SAGAR/Sri Devi',
      transactionNote: 'John Doe - STRENGTHENING (3 Months) - ₹5,499 - Payment',
      
      // Screenshot & Verification
      screenshotUrl: 'https://via.placeholder.com/400x600/333/fff?text=Payment+Screenshot',
      
      // Status & Timestamps
      status: 'pending' as const,
      paymentDate: Timestamp.now()
    },
    {
      // User Information
      fullName: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+91-9876543211',
      gender: 'female' as const,
      
      // Membership Details
      membershipId: 'test-membership-2',
      membershipName: 'STRENGTHENING',
      membershipType: 'premium',
      duration: 'monthly' as const,
      
      // Pricing Information
      originalPrice: 1999,
      finalAmount: 1999,
      
      // Payment Details
      upiId: 'sagar.a.tej@ybl',
      payeeName: 'AKULA SAGAR/Sri Devi',
      transactionNote: 'Jane Smith - STRENGTHENING (1 Month) - ₹1,999 - Payment',
      
      // Screenshot & Verification
      screenshotUrl: 'https://via.placeholder.com/400x600/333/fff?text=Payment+Screenshot+2',
      
      // Status & Timestamps
      status: 'verified' as const,
      paymentDate: Timestamp.fromDate(new Date(Date.now() - 24 * 60 * 60 * 1000)) // 1 day ago
    },
    {
      // User Information
      fullName: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      phone: '+91-9876543212',
      gender: 'male' as const,
      
      // Membership Details
      membershipId: 'test-membership-3',
      membershipName: 'STRENGTHENING',
      membershipType: 'premium',
      duration: 'annual' as const,
      
      // Pricing Information
      originalPrice: 11999,
      finalAmount: 11999,
      
      // Payment Details
      upiId: 'sagar.a.tej@ybl',
      payeeName: 'AKULA SAGAR/Sri Devi',
      transactionNote: 'Mike Johnson - STRENGTHENING (12 Months) - ₹11,999 - Payment',
      
      // Screenshot & Verification
      screenshotUrl: 'https://via.placeholder.com/400x600/333/fff?text=Payment+Screenshot+3',
      
      // Status & Timestamps
      status: 'rejected' as const,
      paymentDate: Timestamp.fromDate(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)) // 2 days ago
    }
  ];

  try {
    console.log('Creating test payments...');
    
    for (const payment of testPayments) {
      const paymentId = await paymentsService.create(payment);
      console.log(`Created test payment: ${paymentId} for ${payment.fullName}`);
    }
    
    console.log('All test payments created successfully!');
    return true;
  } catch (error) {
    console.error('Error creating test payments:', error);
    return false;
  }
};

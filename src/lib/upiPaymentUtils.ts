import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import { Timestamp } from 'firebase/firestore';

export interface UPIPaymentDetails {
  upiId: string;
  payeeName: string;
  amount: number;
  currency: string;
  transactionNote: string;
}

export interface PaymentReceiptData {
  paymentId: string;
  fullName: string;
  email: string;
  phone: string;
  membershipName: string;
  membershipType: string;
  duration: string;
  originalPrice: number;
  finalAmount: number;
  couponCode?: string;
  discountAmount?: number;
  paymentDate: Date;
  transactionNote: string;
}

// UPI QR Code Generation
export const generateUPIQRCode = async (paymentDetails: UPIPaymentDetails): Promise<string> => {
  const { upiId, payeeName, amount, currency, transactionNote } = paymentDetails;
  
  // Construct UPI URL with proper encoding
  const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=${currency}&tn=${encodeURIComponent(transactionNote)}`;
  
  try {
    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(upiUrl, {
      errorCorrectionLevel: 'M',
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: 300
    });
    
    return qrCodeDataUrl;
  } catch (error) {
    throw new Error('Failed to generate UPI QR code');
  }
};

// Format UPI transaction description
export const formatUpiDescription = (
  userName: string,
  serviceName: string,
  originalPrice: number,
  finalAmount: number,
  couponCode?: string
): string => {
  let description = `${userName} is paying ₹${finalAmount} to Rebuild Gym for ${serviceName}`;
  
  if (couponCode && originalPrice > finalAmount) {
    const savings = originalPrice - finalAmount;
    description += ` (${couponCode} saved ₹${savings})`;
  }
  
  return description;
};

// Generate UPI Intent URL for mobile apps
export const generateUPIIntentUrl = (paymentDetails: UPIPaymentDetails): string => {
  const { upiId, payeeName, amount, currency, transactionNote } = paymentDetails;
  
  return `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=${currency}&tn=${encodeURIComponent(transactionNote)}`;
};

// PDF Receipt Generation
export const generatePaymentReceipt = async (receiptData: PaymentReceiptData): Promise<Blob> => {
  const doc = new jsPDF();
  
  // Constants
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  const lineHeight = 7;
  
  // Colors
  const primaryColor = [255, 243, 24]; // Rebuild Yellow
  const darkColor = [0, 0, 0];
  const grayColor = [128, 128, 128];
  
  // Header
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, pageWidth, 35, 'F');
  
  // Company Logo/Name
  doc.setFontSize(24);
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.text('REBUILD.FIT', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Payment Receipt', pageWidth / 2, 27, { align: 'center' });
  
  // Reset colors
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  
  let yPosition = 50;
  
  // Title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('MEMBERSHIP PAYMENT RECEIPT', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;
  
  // Receipt Details
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Receipt ID: ${receiptData.paymentId}`, margin, yPosition);
  doc.text(`Date: ${receiptData.paymentDate.toLocaleDateString()}`, pageWidth - margin, yPosition, { align: 'right' });
  yPosition += 15;
  
  // Customer Information
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('CUSTOMER INFORMATION', margin, yPosition);
  yPosition += 10;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Name: ${receiptData.fullName}`, margin, yPosition);
  yPosition += lineHeight;
  doc.text(`Email: ${receiptData.email}`, margin, yPosition);
  yPosition += lineHeight;
  doc.text(`Phone: ${receiptData.phone}`, margin, yPosition);
  yPosition += 15;
  
  // Membership Details
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('MEMBERSHIP DETAILS', margin, yPosition);
  yPosition += 10;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Plan: ${receiptData.membershipName}`, margin, yPosition);
  yPosition += lineHeight;
  doc.text(`Type: ${receiptData.membershipType}`, margin, yPosition);
  yPosition += lineHeight;
  doc.text(`Duration: ${receiptData.duration}`, margin, yPosition);
  yPosition += 15;
  
  // Payment Summary
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('PAYMENT SUMMARY', margin, yPosition);
  yPosition += 10;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  // Original Price
  doc.text(`Original Price:`, margin, yPosition);
  doc.text(`₹${receiptData.originalPrice.toFixed(2)}`, pageWidth - margin, yPosition, { align: 'right' });
  yPosition += lineHeight;
  
  // Discount (if applicable)
  if (receiptData.couponCode && receiptData.discountAmount && receiptData.discountAmount > 0) {
    doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
    doc.text(`Discount (${receiptData.couponCode}):`, margin, yPosition);
    doc.text(`-₹${receiptData.discountAmount.toFixed(2)}`, pageWidth - margin, yPosition, { align: 'right' });
    yPosition += lineHeight;
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  }
  
  // Line separator
  doc.setLineWidth(0.5);
  doc.line(margin, yPosition + 2, pageWidth - margin, yPosition + 2);
  yPosition += 10;
  
  // Final Amount
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`Total Amount Paid:`, margin, yPosition);
  doc.text(`₹${receiptData.finalAmount.toFixed(2)}`, pageWidth - margin, yPosition, { align: 'right' });
  yPosition += 15;
  
  // Transaction Note
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  doc.text(`Transaction Note: ${receiptData.transactionNote}`, margin, yPosition);
  yPosition += 20;
  
  // Footer
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.setFontSize(8);
  doc.text('Thank you for choosing Rebuild.Fit!', pageWidth / 2, pageHeight - 30, { align: 'center' });
  doc.text('For any queries, contact us at support@rebuild.fit', pageWidth / 2, pageHeight - 25, { align: 'center' });
  
  // Generate and return PDF as blob
  return doc.output('blob');
};

// Copy to clipboard utility
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    return false;
  }
};

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Get duration display name
export const getDurationDisplayName = (duration: string): string => {
  switch (duration) {
    case 'monthly':
      return '1 Month';
    case 'quarterly':
      return '3 Months';
    case 'halfyearly':
      return '6 Months';
    case 'annual':
      return '1 Year';
    default:
      return duration;
  }
};

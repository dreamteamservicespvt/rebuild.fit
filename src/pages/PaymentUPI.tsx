import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  QrCode, Copy, Upload, CheckCircle, ArrowRight, 
  Smartphone, CreditCard, Clock, User, Mail, Phone, Users, Calendar 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { membershipsService, paymentsService, uploadPaymentScreenshot, type Membership } from '@/lib/firebaseServices';
import LoadingScreen from '@/components/LoadingScreen';
import PaymentHeader from '@/components/PaymentHeader';
import { toast } from '@/lib/toast';
import { 
  generateUPIQRCode, 
  generateUPIIntentUrl, 
  formatUpiDescription, 
  copyToClipboard,
  formatCurrency,
  getDurationDisplayName,
  type UPIPaymentDetails 
} from '@/lib/upiPaymentUtils';
import { Timestamp } from 'firebase/firestore';

const PaymentUPI = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Extract user and membership data from URL params
  const membershipId = searchParams.get('membership');
  const duration = searchParams.get('duration') as 'monthly' | 'quarterly' | 'halfyearly' | 'annual';
  const fullName = searchParams.get('fullName');
  const email = searchParams.get('email');
  const phone = searchParams.get('phone');
  const gender = searchParams.get('gender') as 'male' | 'female' | 'other';

  const [membership, setMembership] = useState<Membership | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [upiIntentUrl, setUpiIntentUrl] = useState<string>('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState(false);

  // UPI Payment Configuration
  const UPI_ID = 'sagar.a.tej@ybl';
  const PAYEE_NAME = 'AKULA SAGAR/Sri Devi';

  useEffect(() => {
    document.title = "Payment - UPI Payment | REBUILD.fit";
    
    // Validate required parameters
    if (!membershipId || !duration || !fullName || !email || !phone || !gender) {
      toast.error("Invalid Request", "Missing required information. Please start from the beginning.");
      navigate('/membership');
      return;
    }

    // Fetch membership details and generate QR code
    const initializePayment = async () => {
      try {
        const membershipData = await membershipsService.getById(membershipId);
        if (!membershipData) {
          toast.error("Membership Not Found", "The selected membership plan could not be found");
          navigate('/membership');
          return;
        }
        
        setMembership(membershipData);
        
        // Generate UPI QR Code
        const priceString = membershipData.price[duration] || '0';
        const price = parseInt(priceString.replace(/,/g, ''));
        const transactionNote = formatUpiDescription(
          fullName,
          `${membershipData.name} (${getDurationDisplayName(duration)})`,
          price,
          price
        );

        const paymentDetails: UPIPaymentDetails = {
          upiId: UPI_ID,
          payeeName: PAYEE_NAME,
          amount: price,
          currency: 'INR',
          transactionNote
        };

        const qrCode = await generateUPIQRCode(paymentDetails);
        const intentUrl = generateUPIIntentUrl(paymentDetails);
        
        setQrCodeUrl(qrCode);
        setUpiIntentUrl(intentUrl);

      } catch (error) {
        toast.error("Error", "Failed to initialize payment. Please try again.");
        navigate('/membership');
      } finally {
        setLoading(false);
      }
    };

    initializePayment();
  }, [membershipId, duration, fullName, email, phone, gender, navigate]);

  const handleCopyUPI = async () => {
    const success = await copyToClipboard(UPI_ID);
    if (success) {
      setCopied(true);
      toast.success("Copied!", "UPI ID copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error("Error", "Failed to copy UPI ID");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Invalid File", "Please upload an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File Too Large", "Please upload an image smaller than 5MB");
      return;
    }

    setScreenshot(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setScreenshotPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitPayment = async () => {
    if (!screenshot || !membership) {
      toast.error("Upload Required", "Please upload payment screenshot");
      return;
    }

    setUploading(true);

    try {
      // Upload screenshot to Cloudinary (public upload)
      const screenshotUrl = await uploadPaymentScreenshot(screenshot);
      
      // Create payment record
      const priceString = membership.price[duration] || '0';
      const price = parseInt(priceString.replace(/,/g, ''));
      const transactionNote = formatUpiDescription(
        fullName!,
        `${membership.name} (${getDurationDisplayName(duration)})`,
        price,
        price
      );

      const paymentData = {
        // User Information
        fullName: fullName!,
        email: email!,
        phone: phone!,
        gender: gender!,
        
        // Membership Details
        membershipId: membershipId!,
        membershipName: membership.name,
        membershipType: membership.type,
        duration,
        
        // Pricing Information
        originalPrice: price,
        finalAmount: price,
        
        // Payment Details
        upiId: UPI_ID,
        payeeName: PAYEE_NAME,
        transactionNote,
        
        // Screenshot & Verification
        screenshotUrl,
        
        // Status & Timestamps
        status: 'pending' as const,
        paymentDate: Timestamp.now()
      };

      const paymentId = await paymentsService.create(paymentData);
      
      toast.success("Payment Submitted", "Your payment has been submitted for verification");
      
      // Navigate to success page
      navigate(`/payment/success?paymentId=${paymentId}`);

    } catch (error) {
      toast.error("Submission Failed", "Failed to submit payment. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const getPrice = () => {
    if (!membership) return 0;
    // Remove commas from price string before parsing
    const priceString = membership.price[duration] || '0';
    return parseInt(priceString.replace(/,/g, ''));
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-rebuild-black text-white">
      {/* Payment Header */}
      <PaymentHeader 
        currentStep={2} 
        onBack={() => navigate(-1)}
        backText="Back to User Info"
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pt-8 sm:pt-12">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bebas font-bold mb-4">
            COMPLETE YOUR PAYMENT
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
            Scan the QR code below with any UPI app to complete your {membership?.name} membership payment
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* UPI Payment Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-rebuild-gray border-gray-700 sticky top-20 lg:top-24">
              <CardHeader className="pb-4">
                <CardTitle className="text-white flex items-center text-lg sm:text-xl">
                  <QrCode className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-rebuild-yellow" />
                  UPI Payment Gateway
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                {/* QR Code Section */}
                <div className="text-center">
                  <motion.div 
                    className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 inline-block mb-4 shadow-xl"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    {qrCodeUrl ? (
                      <motion.img 
                        src={qrCodeUrl} 
                        alt="UPI QR Code" 
                        className="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 mx-auto"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                      />
                    ) : (
                      <div className="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                          <QrCode className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
                        </motion.div>
                      </div>
                    )}
                  </motion.div>
                  <div className="space-y-2">
                    <p className="text-white font-medium text-sm sm:text-base">
                      Scan with any UPI app
                    </p>
                    <p className="text-gray-400 text-xs sm:text-sm">
                      PhonePe, Google Pay, Paytm, BHIM, etc.
                    </p>
                  </div>
                </div>

                {/* UPI ID Section */}
                <div className="bg-rebuild-black rounded-xl p-3 sm:p-4 border border-gray-600">
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-3">
                    Or pay using UPI ID
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 relative">
                      <Input
                        value={UPI_ID}
                        readOnly
                        className="bg-rebuild-gray border-gray-500 text-white font-mono text-center pr-12 text-sm sm:text-base"
                      />
                      <motion.div 
                        className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2"
                        whileTap={{ scale: 0.9 }}
                      >
                        <Button
                          onClick={handleCopyUPI}
                          variant="ghost"
                          size="sm"
                          className="p-1 h-auto text-rebuild-yellow hover:bg-rebuild-yellow hover:text-rebuild-black"
                        >
                          {copied ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                            >
                              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                            </motion.div>
                          ) : (
                            <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                          )}
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                  {copied && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-green-400 text-xs mt-2"
                    >
                      UPI ID copied to clipboard!
                    </motion.p>
                  )}
                </div>

                {/* Payment Details */}
                <div className="bg-gradient-to-r from-rebuild-yellow/10 to-yellow-400/10 rounded-xl p-3 sm:p-4 border border-rebuild-yellow/20">
                  <h3 className="text-rebuild-yellow font-semibold mb-3 flex items-center text-sm sm:text-base">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Payment Details
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-300">Payee Name:</span>
                      <span className="text-white font-medium text-right max-w-[60%] break-words">{PAYEE_NAME}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300 text-xs sm:text-sm">Amount:</span>
                      <span className="text-rebuild-yellow font-bold text-base sm:text-lg">{formatCurrency(getPrice())}</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-300">Plan:</span>
                      <span className="text-white text-right max-w-[60%] break-words">{membership?.name}</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-300">Duration:</span>
                      <span className="text-white">{getDurationDisplayName(duration)}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Pay Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={() => window.open(upiIntentUrl, '_blank')}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg shadow-lg"
                  >
                    <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Pay with UPI App
                  </Button>
                </motion.div>

                {/* Security Badge */}
                <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-gray-400">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Secure Payment</span>
                  </div>
                  <span className="hidden sm:inline">•</span>
                  <span>256-bit SSL Encrypted</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Screenshot Upload & Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4 sm:space-y-6"
          >
            {/* Upload Screenshot Section */}
            <Card className="bg-rebuild-gray border-gray-700">
              <CardHeader className="pb-4">
                <CardTitle className="text-white flex items-center text-lg sm:text-xl">
                  <Upload className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-rebuild-yellow" />
                  Upload Payment Proof
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <p className="text-gray-300 text-xs sm:text-sm">
                    After completing the payment, upload a screenshot of your transaction success page.
                  </p>
                  
                  <motion.div 
                    className={cn(
                      "border-2 border-dashed rounded-xl p-4 sm:p-6 text-center transition-all duration-300",
                      screenshotPreview 
                        ? "border-green-500 bg-green-500/5" 
                        : "border-gray-600 hover:border-rebuild-yellow/50 bg-gray-800/50"
                    )}
                    whileHover={{ scale: 1.01 }}
                  >
                    {screenshotPreview ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <img 
                          src={screenshotPreview} 
                          alt="Payment Screenshot" 
                          className="max-w-full max-h-32 sm:max-h-48 mx-auto rounded-lg mb-3 shadow-lg"
                        />
                        <div className="flex items-center justify-center space-x-2 text-green-400">
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span className="font-medium text-xs sm:text-sm">Screenshot uploaded successfully!</span>
                        </div>
                        <p className="text-gray-400 text-xs mt-2">
                          Click below to upload a different image
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <Upload className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-300 mb-2 font-medium text-sm sm:text-base">
                          Drop your screenshot here or click to browse
                        </p>
                        <p className="text-gray-500 text-xs sm:text-sm">
                          JPG, PNG up to 5MB • Payment success screenshot required
                        </p>
                      </motion.div>
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="mt-4 cursor-pointer text-xs sm:text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:sm:text-sm file:font-medium file:bg-rebuild-yellow file:text-rebuild-black hover:file:bg-yellow-400"
                    />
                  </motion.div>

                  {/* Submit Button */}
                  <motion.div
                    whileHover={{ scale: screenshot ? 1.02 : 1 }}
                    whileTap={{ scale: screenshot ? 0.98 : 1 }}
                  >
                    <Button
                      onClick={handleSubmitPayment}
                      disabled={!screenshot || uploading}
                      className={cn(
                        "w-full py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300",
                        screenshot 
                          ? "bg-rebuild-yellow text-rebuild-black hover:bg-yellow-400 shadow-lg hover:shadow-xl" 
                          : "bg-gray-600 text-gray-400 cursor-not-allowed"
                      )}
                    >
                      {uploading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="flex items-center"
                        >
                          <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-rebuild-black border-t-transparent rounded-full mr-2" />
                          Processing Payment...
                        </motion.div>
                      ) : (
                        <>
                          Submit Payment Proof
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </motion.div>

                  {!screenshot && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-center space-x-2 text-amber-400 bg-amber-400/10 rounded-lg p-3"
                    >
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">Screenshot upload required to proceed</span>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card className="bg-rebuild-gray border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <User className="w-5 h-5 mr-2 text-rebuild-yellow" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Name:
                    </span>
                    <span className="text-white font-medium">{fullName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      Email:
                    </span>
                    <span className="text-white text-sm">{email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      Phone:
                    </span>
                    <span className="text-white">{phone}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      Gender:
                    </span>
                    <span className="text-white capitalize">{gender}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card className="bg-gradient-to-br from-rebuild-gray to-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-rebuild-yellow" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {membership && (
                  <>
                    <div className="bg-rebuild-black rounded-xl p-4 border border-gray-600">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-white text-lg">{membership.name}</h3>
                          <p className="text-gray-400 text-sm capitalize mb-2">{membership.type} Membership</p>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-rebuild-yellow" />
                            <span className="text-rebuild-yellow font-medium">{getDurationDisplayName(duration)}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-400 text-sm">Total Amount</p>
                          <p className="text-rebuild-yellow font-bold text-2xl">{formatCurrency(getPrice())}</p>
                        </div>
                      </div>
                    </div>

                    {/* Price Breakdown */}
                    <div className="space-y-2 bg-rebuild-black rounded-lg p-4">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Membership Fee:</span>
                        <span className="text-white">{formatCurrency(getPrice())}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Processing Fee:</span>
                        <span className="text-green-400">Free</span>
                      </div>
                      <div className="border-t border-gray-600 pt-2 mt-2">
                        <div className="flex justify-between">
                          <span className="text-white font-bold">Total Payable:</span>
                          <span className="text-rebuild-yellow font-bold text-xl">{formatCurrency(getPrice())}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Payment Instructions */}
            <Card className="bg-blue-500/10 border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-blue-400 flex items-center text-sm">
                  <Clock className="w-4 h-4 mr-2" />
                  Payment Process
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-3 text-sm">
                  {[
                    { step: 1, text: "Scan QR code or use UPI ID to pay", completed: true },
                    { step: 2, text: "Complete payment in your UPI app", completed: false },
                    { step: 3, text: "Take screenshot of success message", completed: false },
                    { step: 4, text: "Upload screenshot and submit", completed: false }
                  ].map((item, index) => (
                    <motion.div 
                      key={index}
                      className="flex items-center space-x-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                        item.completed 
                          ? "bg-green-500 text-white" 
                          : "border-2 border-blue-400 text-blue-400"
                      )}>
                        {item.completed ? "✓" : item.step}
                      </div>
                      <span className={cn(
                        item.completed ? "text-green-400" : "text-blue-300"
                      )}>
                        {item.text}
                      </span>
                    </motion.div>
                  ))}
                </div>
                <div className="bg-blue-500/10 rounded-lg p-3 mt-4">
                  <p className="text-blue-400 font-medium text-sm">
                    💡 Your membership will be activated within 24 hours after payment verification.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PaymentUPI;

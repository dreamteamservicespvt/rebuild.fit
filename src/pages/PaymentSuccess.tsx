import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CheckCircle, Download, Home, CreditCard, User, Calendar, 
  FileText, ArrowRight, Clock, Mail, Phone 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { paymentsService, type Payment } from '@/lib/firebaseServices';
import LoadingScreen from '@/components/LoadingScreen';
import PaymentHeader from '@/components/PaymentHeader';
import { toast } from '@/lib/toast';
import { 
  generatePaymentReceipt, 
  formatCurrency, 
  getDurationDisplayName,
  type PaymentReceiptData 
} from '@/lib/upiPaymentUtils';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get('paymentId');

  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloadingPDF, setDownloadingPDF] = useState(false);

  useEffect(() => {
    document.title = "Payment Successful | REBUILD.fit";
    
    if (!paymentId) {
      toast.error("Invalid Request", "Payment ID not found");
      navigate('/membership');
      return;
    }

    // Fetch payment details
    const fetchPayment = async () => {
      try {
        const paymentData = await paymentsService.getById(paymentId);
        if (!paymentData) {
          toast.error("Payment Not Found", "The payment record could not be found");
          navigate('/membership');
          return;
        }
        setPayment(paymentData);
      } catch (error) {
        toast.error("Error", "Failed to load payment details");
        navigate('/membership');
      } finally {
        setLoading(false);
      }
    };

    fetchPayment();
  }, [paymentId, navigate]);

  const handleDownloadReceipt = async () => {
    if (!payment) return;

    setDownloadingPDF(true);
    try {
      const receiptData: PaymentReceiptData = {
        paymentId: payment.id!,
        fullName: payment.fullName,
        email: payment.email,
        phone: payment.phone,
        membershipName: payment.membershipName,
        membershipType: payment.membershipType,
        duration: getDurationDisplayName(payment.duration),
        originalPrice: payment.originalPrice,
        finalAmount: payment.finalAmount,
        couponCode: payment.couponCode,
        discountAmount: payment.discountAmount,
        paymentDate: payment.paymentDate.toDate(),
        transactionNote: payment.transactionNote
      };

      const pdfBlob = await generatePaymentReceipt(receiptData);
      
      // Create download link
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Rebuild_Gym_Receipt_${payment.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Downloaded", "Receipt downloaded successfully");
    } catch (error) {
      toast.error("Download Failed", "Failed to generate receipt PDF");
    } finally {
      setDownloadingPDF(false);
    }
  };

  const getStatusInfo = () => {
    if (!payment) return { color: 'gray', text: 'Unknown', description: '' };

    switch (payment.status) {
      case 'pending':
        return {
          color: 'yellow',
          text: 'Under Verification',
          description: 'Your payment is being verified by our team. You will receive confirmation within 24 hours.'
        };
      case 'verified':
        return {
          color: 'green',
          text: 'Verified & Active',
          description: 'Your payment has been verified and your membership is now active!'
        };
      case 'rejected':
        return {
          color: 'red',
          text: 'Payment Failed',
          description: 'Your payment could not be verified. Please contact support for assistance.'
        };
      default:
        return { color: 'gray', text: 'Unknown', description: '' };
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  const statusInfo = getStatusInfo();

  return (
    <div className="min-h-screen bg-rebuild-black text-white">
      {/* Payment Header */}
      <PaymentHeader 
        currentStep={3} 
        showBackToHome={true}
      />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 pt-12">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 bg-green-500 rounded-full mx-auto mb-6 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bebas font-bold mb-4">
            PAYMENT SUBMITTED
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Thank you for choosing Rebuild.Fit! Your payment has been received and is being processed.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Status */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-rebuild-gray border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-rebuild-yellow" />
                  Payment Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {payment && (
                  <>
                    {/* Status Badge */}
                    <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium
                      ${statusInfo.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : ''}
                      ${statusInfo.color === 'green' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : ''}
                      ${statusInfo.color === 'red' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : ''}
                    `}>
                      <div className={`w-2 h-2 rounded-full mr-2
                        ${statusInfo.color === 'yellow' ? 'bg-yellow-400' : ''}
                        ${statusInfo.color === 'green' ? 'bg-green-400' : ''}
                        ${statusInfo.color === 'red' ? 'bg-red-400' : ''}
                      `}></div>
                      {statusInfo.text}
                    </div>

                    <p className="text-gray-300 text-sm">
                      {statusInfo.description}
                    </p>

                    {/* Payment Details */}
                    <div className="bg-rebuild-black rounded-lg p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Payment ID:</span>
                        <span className="text-white font-mono text-sm">{payment.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Amount Paid:</span>
                        <span className="text-rebuild-yellow font-bold">{formatCurrency(payment.finalAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Payment Date:</span>
                        <span className="text-white">{payment.paymentDate.toDate().toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">UPI ID:</span>
                        <span className="text-white font-mono text-sm">{payment.upiId}</span>
                      </div>
                    </div>

                    {/* Download Receipt */}
                    <Button
                      onClick={handleDownloadReceipt}
                      disabled={downloadingPDF}
                      className="w-full bg-rebuild-yellow text-rebuild-black hover:bg-yellow-400 font-bold"
                    >
                      {downloadingPDF ? (
                        <>Generating PDF...</>
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          Download Receipt
                        </>
                      )}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Membership & Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-6"
          >
            {/* Membership Details */}
            <Card className="bg-rebuild-gray border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-rebuild-yellow" />
                  Membership Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {payment && (
                  <>
                    <div className="bg-rebuild-black rounded-lg p-4">
                      <h3 className="font-bold text-white mb-2">{payment.membershipName}</h3>
                      <p className="text-gray-400 text-sm mb-2 capitalize">{payment.membershipType} Plan</p>
                      <p className="text-rebuild-yellow font-medium">{getDurationDisplayName(payment.duration)}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-white">{payment.fullName}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-white text-sm">{payment.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-white">{payment.phone}</span>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card className="bg-blue-500/10 border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-blue-400 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  What's Next?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-blue-300 text-sm space-y-2">
                  <p>• We'll verify your payment within 24 hours</p>
                  <p>• You'll receive a confirmation email once verified</p>
                  <p>• Visit our gym with your membership confirmation</p>
                  <p>• Bring a valid ID for membership activation</p>
                </div>
                
                <div className="mt-4 p-3 bg-blue-500/10 rounded-lg">
                  <p className="text-blue-400 font-medium text-sm">
                    Need help? Contact us at support@rebuild.fit or call +91-9876543210
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 mt-8 justify-center"
        >
          <Button
            onClick={() => navigate('/membership')}
            variant="outline"
            className="text-rebuild-yellow border-rebuild-yellow hover:bg-rebuild-yellow hover:text-rebuild-black"
          >
            View Other Plans
          </Button>
          
          <Link to="/gyms">
            <Button className="w-full sm:w-auto bg-rebuild-yellow text-rebuild-black hover:bg-yellow-400 font-bold">
              Visit Our Gym
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentSuccess;

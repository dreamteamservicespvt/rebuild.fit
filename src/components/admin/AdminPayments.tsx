import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Eye, Download, Search, Filter, CheckCircle, XCircle, Clock, 
  CreditCard, User, Phone, Mail, Calendar, DollarSign, MessageSquare,
  Settings
} from 'lucide-react';
import { paymentsService, type Payment } from '@/lib/firebaseServices';
import { toast } from '@/lib/toast';
import { AdminTable, TableHeader, TableBody, TableHead, TableCell, TableRow, EmptyState, LoadingState } from './AdminTable';
import AdminPaymentCard from './AdminPaymentCard';
import ResponsiveImage from '@/components/ResponsiveImage';
import { 
  generatePaymentReceipt, 
  formatCurrency, 
  getDurationDisplayName,
  type PaymentReceiptData 
} from '@/lib/upiPaymentUtils';
import { motion } from 'framer-motion';
import { Timestamp } from 'firebase/firestore';

const AdminPayments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [messageTemplate, setMessageTemplate] = useState('paymentConfirmation');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Payment message templates
  const messageTemplates = {
    paymentConfirmation: "Thank you for your payment of ₹{amount} for {plan}! Your membership is now active until {endDate}. Welcome to Rebuild Fitness!",
    paymentReminder: "Hi! Just a reminder that your Rebuild Fitness membership expires on {endDate}. To continue enjoying our facilities, please renew your plan soon.",
    specialOffer: "As a valued member, we're offering you a special 10% discount on your next renewal if completed before {endDate}. Your current {plan} plan is ₹{amount}.",
    welcomeMessage: "Welcome to Rebuild Fitness! Your {plan} membership is now active. We're excited to have you join our fitness family."
  };
  
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await paymentsService.getAll();
        setPayments(data);
        setFilteredPayments(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching payments:', error);
        toast.error('Error', 'Failed to fetch payments');
        setLoading(false);
      }
    };
    
    fetchPayments();
  }, []);
  
  useEffect(() => {
    let result = [...payments];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(payment => payment.status === statusFilter);
    }
    
    // Apply search filter
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      result = result.filter(payment => 
        payment.fullName?.toLowerCase().includes(searchTermLower) ||
        payment.email?.toLowerCase().includes(searchTermLower) ||
        payment.phone?.includes(searchTerm) ||
        payment.upiId?.toLowerCase().includes(searchTermLower)
      );
    }
    
    setFilteredPayments(result);
    setCurrentPage(1);  // Reset to first page when filters change
  }, [searchTerm, statusFilter, payments]);
  
  const handleViewDetails = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsDetailsModalOpen(true);
  };
  
  const handleOpenMessageModal = (payment: Payment) => {
    setSelectedPayment(payment);
    
    // Set default template based on payment status
    if (payment.status === 'verified') {
      setMessageTemplate('paymentConfirmation');
    } else if (payment.status === 'pending') {
      setMessageTemplate('paymentReminder');
    } else {
      setMessageTemplate('welcomeMessage');
    }
    
    setIsMessageModalOpen(true);
    updateMessageFromTemplate();
  };
  
  const updateMessageFromTemplate = () => {
    if (!selectedPayment || !messageTemplate) return;
    
    let template = messageTemplates[messageTemplate as keyof typeof messageTemplates];
    
    // Replace placeholders with actual values
    const message = template
      .replace('{amount}', formatCurrency(selectedPayment.finalAmount || 0))
      .replace('{plan}', selectedPayment.membershipName || 'membership')
      .replace('{endDate}', selectedPayment.verificationDate ? new Date(selectedPayment.verificationDate.toDate()).toLocaleDateString() : 'your end date');
    
    setMessageText(message);
  };
  
  useEffect(() => {
    updateMessageFromTemplate();
  }, [messageTemplate, selectedPayment]);
  
  const handleSendMessage = async () => {
    if (!selectedPayment || !messageText) return;
    
    try {
      // Here you would integrate with WhatsApp API or other messaging service
      // For now we'll just show a success message
      toast.success('Message sent', `Message sent to ${selectedPayment.fullName}`);
      
      // Close the modal
      setIsMessageModalOpen(false);
      setMessageText('');
    } catch (error) {
      toast.error('Error', 'Failed to send message');
    }
  };
  
  const handleDownloadReceipt = (payment: Payment) => {
    if (!payment) return;
    
    const receiptData: PaymentReceiptData = {
      paymentId: payment.id || 'N/A',
      fullName: payment.fullName || 'Customer',
      email: payment.email || 'Not provided',
      phone: payment.phone || 'Not provided',
      membershipName: payment.membershipName || 'Membership',
      membershipType: payment.membershipType || 'Standard',
      duration: getDurationDisplayName(payment.duration || 'monthly'),
      originalPrice: payment.originalPrice || 0,
      finalAmount: payment.finalAmount || 0,
      couponCode: payment.couponCode,
      discountAmount: payment.discountAmount,
      paymentDate: payment.paymentDate ? payment.paymentDate.toDate() : new Date(),
      transactionNote: payment.transactionNote || 'N/A'
    };
    
    generatePaymentReceipt(receiptData);
  };
  
  // Pagination calculation
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPayments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle className="w-3 h-3 mr-1" /> Verified</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-500 hover:bg-red-600"><XCircle className="w-3 h-3 mr-1" /> Failed</Badge>;
      default:
        return <Badge className="bg-gray-500 hover:bg-gray-600"><Clock className="w-3 h-3 mr-1" /> Unknown</Badge>;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Payment Management</h1>
          <p className="text-gray-400">View and manage payment transactions</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search payments..."
              className="pl-8 bg-rebuild-darkgray border-gray-700 text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value)}
          >
            <SelectTrigger className="w-full sm:w-[180px] bg-rebuild-darkgray border-gray-700 text-white">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-rebuild-darkgray border-gray-700 text-white">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Card className="bg-rebuild-darkgray border-gray-700">
        <CardContent className="p-0">
          {/* Mobile Grid View */}
          <div className="block md:hidden">
            {loading ? (
              <div className="p-6">
                <LoadingState />
              </div>
            ) : filteredPayments.length === 0 ? (
              <div className="p-6">
                <EmptyState title="No payments found" description="No payment records match your search criteria." />
              </div>
            ) : (
              <div className="payment-card-grid p-4 grid grid-cols-1 gap-4">
                {currentItems.map((payment, index) => (
                  <AdminPaymentCard
                    key={payment.id || index}
                    payment={payment}
                    onViewDetails={handleViewDetails}
                    onDownloadReceipt={handleDownloadReceipt}
                    onSendMessage={handleOpenMessageModal}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block">
            <AdminTable>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <LoadingState />
                    </TableCell>
                  </TableRow>
                ) : filteredPayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <EmptyState title="No payments found" description="No payment records match your search criteria." />
                    </TableCell>
                  </TableRow>
                ) : (
                  currentItems.map((payment, index) => (
                    <TableRow key={payment.id || index} className="border-gray-700">
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span className="text-white">{payment.fullName}</span>
                          <span className="text-xs text-gray-400">{payment.phone}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-white">{payment.membershipName}</span>
                          <span className="text-xs text-gray-400">
                            {getDurationDisplayName(payment.duration || 'monthly')}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-white font-medium">{formatCurrency(payment.finalAmount || 0)}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-white">
                            {payment.paymentDate ? new Date(payment.paymentDate.toDate()).toLocaleDateString() : 'N/A'}
                          </span>
                          <span className="text-xs text-gray-400">
                            {payment.paymentDate ? new Date(payment.paymentDate.toDate()).toLocaleTimeString() : ''}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {renderStatusBadge(payment.status || 'unknown')}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-2 border-gray-700"
                            onClick={() => handleViewDetails(payment)}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-2 border-gray-700"
                            onClick={() => handleOpenMessageModal(payment)}
                          >
                            <MessageSquare className="h-4 w-4" />
                            <span className="sr-only">Message</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-2 border-gray-700"
                            onClick={() => handleDownloadReceipt(payment)}
                          >
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </AdminTable>
          </div>
        </CardContent>
      </Card>
      
      {/* Pagination controls */}
      {!loading && filteredPayments.length > 0 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-400">
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredPayments.length)} of {filteredPayments.length} payments
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              className="border-gray-700"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="border-gray-700"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
      
      {/* Payment Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="bg-rebuild-darkgray border-gray-700 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Payment Details</DialogTitle>
          </DialogHeader>
          
          {selectedPayment && (
            <div className="space-y-6">
              {/* Status Badge */}
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-400">
                  UPI ID: {selectedPayment.upiId || 'N/A'}
                </div>
                {renderStatusBadge(selectedPayment.status || 'unknown')}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Information */}
                <Card className="bg-rebuild-black border-gray-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md font-medium flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Customer Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Name:</span>
                      <span>{selectedPayment.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Email:</span>
                      <span>{selectedPayment.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Phone:</span>
                      <span>{selectedPayment.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Gender:</span>
                      <span>{selectedPayment.gender}</span>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Payment Information */}
                <Card className="bg-rebuild-black border-gray-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md font-medium flex items-center">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Payment Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Original Price:</span>
                      <span>{formatCurrency(selectedPayment.originalPrice || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Final Amount:</span>
                      <span>{formatCurrency(selectedPayment.finalAmount || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Payment Date:</span>
                      <span>
                        {selectedPayment.paymentDate 
                          ? new Date(selectedPayment.paymentDate.toDate()).toLocaleDateString() 
                          : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Payee Name:</span>
                      <span>{selectedPayment.payeeName || 'UPI'}</span>
                    </div>
                    {selectedPayment.couponCode && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Coupon Code:</span>
                        <span>{selectedPayment.couponCode}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Membership Details */}
                <Card className="bg-rebuild-black border-gray-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md font-medium flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Membership Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Membership:</span>
                      <span>{selectedPayment.membershipName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Type:</span>
                      <span>{selectedPayment.membershipType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Duration:</span>
                      <span>{getDurationDisplayName(selectedPayment.duration || 'monthly')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Verification Date:</span>
                      <span>
                        {selectedPayment.verificationDate 
                          ? new Date(selectedPayment.verificationDate.toDate()).toLocaleDateString() 
                          : 'Not verified yet'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Actions */}
                <Card className="bg-rebuild-black border-gray-700">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md font-medium flex items-center">
                      <Settings className="h-4 w-4 mr-2" />
                      Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button 
                        onClick={() => handleDownloadReceipt(selectedPayment)}
                        className="w-full bg-rebuild-yellow text-rebuild-black hover:bg-yellow-500"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Receipt
                      </Button>
                      <Button 
                        onClick={() => {
                          setIsDetailsModalOpen(false);
                          handleOpenMessageModal(selectedPayment);
                        }}
                        variant="outline"
                        className="w-full border-gray-600"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Send Message
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Payment Transaction Note */}
              {selectedPayment.transactionNote && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Transaction Note</h3>
                  <p className="text-gray-300">{selectedPayment.transactionNote}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Message Modal */}
      <Dialog open={isMessageModalOpen} onOpenChange={setIsMessageModalOpen}>
        <DialogContent className="bg-rebuild-darkgray border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Send Message</DialogTitle>
          </DialogHeader>
          
          {selectedPayment && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">To:</span>
                <div className="flex items-center bg-rebuild-black px-2 py-1 rounded-md">
                  <User className="h-4 w-4 mr-1 text-gray-400" />
                  <span>{selectedPayment.fullName}</span>
                  <span className="mx-2 text-gray-500">|</span>
                  <Phone className="h-4 w-4 mr-1 text-gray-400" />
                  <span>{selectedPayment.phone}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Message Template</label>
                <Select
                  value={messageTemplate}
                  onValueChange={setMessageTemplate}
                >
                  <SelectTrigger className="bg-rebuild-black border-gray-700 text-white">
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent className="bg-rebuild-black border-gray-700 text-white">
                    <SelectItem value="paymentConfirmation">Payment Confirmation</SelectItem>
                    <SelectItem value="paymentReminder">Payment Reminder</SelectItem>
                    <SelectItem value="specialOffer">Special Offer</SelectItem>
                    <SelectItem value="welcomeMessage">Welcome Message</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Message</label>
                <div className="relative">
                  <textarea
                    className="w-full h-32 p-3 bg-rebuild-black border border-gray-700 rounded-md text-white focus:border-rebuild-yellow focus:ring-1 focus:ring-rebuild-yellow"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Edit the message as needed before sending. Available variables: {'{amount}'}, {'{plan}'}, {'{endDate}'}
                </p>
              </div>
              
              <div className="flex justify-end space-x-3 pt-2">
                <Button variant="outline" onClick={() => setIsMessageModalOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSendMessage}
                  className="bg-rebuild-yellow text-rebuild-black hover:bg-yellow-500"
                  disabled={!messageText}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPayments;

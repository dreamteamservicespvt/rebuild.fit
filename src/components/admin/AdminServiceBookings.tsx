import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Eye, CheckCircle, XCircle, Clock, Phone, Mail, User, Calendar, CreditCard, MessageSquare, Search, Grid3X3, Table2 } from 'lucide-react';
import { serviceBookingsService, type ServiceBooking } from '@/lib/firebaseServices';
import { toast } from '@/lib/toast';
import AdminLayout from './AdminLayout';
import { AdminTable, TableHeader as AdminTableHeader, TableBody as AdminTableBody, TableHead as AdminTableHead, TableCell as AdminTableCell, TableRow as AdminTableRow, EmptyState, LoadingState } from './AdminTable';
import AdminModal from './AdminModal';
import AdminServiceBookingCard from './AdminServiceBookingCard';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const AdminServiceBookings = () => {
  const [bookings, setBookings] = useState<ServiceBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<ServiceBooking | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  
  useEffect(() => {
    const unsubscribe = serviceBookingsService.onSnapshot((bookingsList) => {
      // Sort by creation date (newest first)
      const sortedBookings = bookingsList.sort((a, b) => {
        const aTime = a.createdAt?.toMillis() || 0;
        const bTime = b.createdAt?.toMillis() || 0;
        return bTime - aTime;
      });
      setBookings(sortedBookings);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleStatusUpdate = async (bookingId: string, newStatus: ServiceBooking['status']) => {
    setUpdating(true);
    try {
      await serviceBookingsService.update(bookingId, { status: newStatus });
      toast.success('Status Updated', `Booking status has been updated to ${newStatus}`);
    } catch (error) {
      toast.error('Error', 'Failed to update booking status');
    } finally {
      setUpdating(false);
    }
  };

  const handleViewDetails = (booking: ServiceBooking) => {
    setSelectedBooking(booking);
    setViewModalOpen(true);
  };

  const getStatusColor = (status: ServiceBooking['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-400/30';
      case 'confirmed':
        return 'bg-blue-500/10 text-blue-400 border-blue-400/30';
      case 'active':
        return 'bg-green-500/10 text-green-400 border-green-400/30';
      case 'completed':
        return 'bg-gray-500/10 text-gray-400 border-gray-400/30';
      case 'cancelled':
        return 'bg-red-500/10 text-red-400 border-red-400/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-400/30';
    }
  };

  const getStatusIcon = (status: ServiceBooking['status']) => {
    switch (status) {
      case 'pending':
        return <Clock size={14} />;
      case 'confirmed':
        return <CheckCircle size={14} />;
      case 'active':
        return <CheckCircle size={14} />;
      case 'completed':
        return <CheckCircle size={14} />;
      case 'cancelled':
        return <XCircle size={14} />;
      default:
        return <Clock size={14} />;
    }
  };

  const filteredBookings = bookings.filter(booking => {
    // Filter by status
    const statusMatch = filterStatus === 'all' || booking.status === filterStatus;
    
    // Filter by search query
    const searchMatch = searchQuery === '' || 
      booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customerPhone.includes(searchQuery) ||
      booking.addOnServices.some(service => 
        service.serviceName.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      (booking.membershipName && booking.membershipName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return statusMatch && searchMatch;
  });

  const renderViewDetailsModal = () => (
    <AdminModal
      isOpen={viewModalOpen}
      onClose={() => setViewModalOpen(false)}
      title="Service Booking Details"
      className="max-w-4xl"
    >
      {selectedBooking && (
        <div className="space-y-6">
          {/* Customer Information */}
          <div className="bg-rebuild-darkgray/50 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
              <User size={18} className="mr-2 text-rebuild-yellow" />
              Customer Information
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400">Full Name</label>
                <p className="text-white font-medium">{selectedBooking.customerName}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Email</label>
                <p className="text-white font-medium flex items-center">
                  <Mail size={14} className="mr-2 text-gray-400" />
                  {selectedBooking.customerEmail}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Phone</label>
                <p className="text-white font-medium flex items-center">
                  <Phone size={14} className="mr-2 text-gray-400" />
                  {selectedBooking.customerPhone}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Preferred Start Date</label>
                <p className="text-white font-medium flex items-center">
                  <Calendar size={14} className="mr-2 text-gray-400" />
                  {selectedBooking.preferredStartDate || 'Not specified'}
                </p>
              </div>
            </div>
          </div>

          {/* Membership Information */}
          {selectedBooking.membershipName && (
            <div className="bg-rebuild-darkgray/50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                <CreditCard size={18} className="mr-2 text-rebuild-yellow" />
                Base Membership
              </h4>
              <p className="text-white font-medium">{selectedBooking.membershipName}</p>
            </div>
          )}

          {/* Selected Services */}
          <div className="bg-rebuild-darkgray/50 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-white mb-4">Selected Add-on Services</h4>
            
            <div className="space-y-3">
              {selectedBooking.addOnServices.map((service, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-rebuild-black/30 rounded-lg">
                  <div>
                    <h5 className="text-white font-medium">{service.serviceName}</h5>
                    <p className="text-sm text-gray-400 capitalize">
                      {service.pricingType.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </p>
                  </div>
                  <div className="text-rebuild-yellow font-bold">
                    ₹{service.price}
                  </div>
                </div>
              ))}
              
              <div className="flex justify-between items-center pt-3 mt-3 border-t border-gray-700">
                <span className="text-lg font-bold text-white">Total Amount:</span>
                <span className="text-xl font-bold text-rebuild-yellow">
                  {selectedBooking.totalAmount}
                </span>
              </div>
            </div>
          </div>

          {/* Special Requests */}
          {selectedBooking.specialRequests && (
            <div className="bg-rebuild-darkgray/50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                <MessageSquare size={18} className="mr-2 text-rebuild-yellow" />
                Special Requests
              </h4>
              <p className="text-gray-300 leading-relaxed">{selectedBooking.specialRequests}</p>
            </div>
          )}

          {/* Status Management */}
          <div className="bg-rebuild-darkgray/50 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-white mb-4">Booking Status</h4>
            
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Select
                  value={selectedBooking.status}
                  onValueChange={(newStatus) => handleStatusUpdate(selectedBooking.id!, newStatus as ServiceBooking['status'])}
                  disabled={updating}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Badge className={cn('flex items-center gap-1', getStatusColor(selectedBooking.status))}>
                {getStatusIcon(selectedBooking.status)}
                {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
              </Badge>
            </div>
          </div>

          {/* Booking Details */}
          <div className="bg-rebuild-darkgray/50 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-white mb-4">Booking Details</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="text-gray-400">Booking ID</label>
                <p className="text-white font-mono">{selectedBooking.id}</p>
              </div>
              <div>
                <label className="text-gray-400">Created At</label>
                <p className="text-white">
                  {selectedBooking.createdAt?.toDate().toLocaleString() || 'Unknown'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminModal>
  );

  if (loading) {
    return <LoadingState message="Loading service bookings..." />;
  }

  return (
    <AdminLayout 
      title="Service Bookings"
      description="Manage customer add-on service bookings and requests"
      isLoading={loading}
    >
      {/* Filter Controls */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          {/* Search Input */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by name, email, phone, or service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-rebuild-darkgray/50 border-gray-600 text-white placeholder-gray-400 h-8 xs:h-10 text-sm xs:text-base booking-search-input"
              />
            </div>
          </div>
          
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-300 whitespace-nowrap">Filter by Status:</label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px] h-8 xs:h-10 text-sm xs:text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Bookings</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* View Mode Toggle - Hidden on mobile, shown on desktop when data exists */}
          {filteredBookings.length > 0 && (
            <div className="hidden sm:flex items-center gap-1 booking-view-mode-buttons">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={cn(
                  'h-7 w-7 p-0 booking-view-mode-button',
                  viewMode === 'grid' 
                    ? 'bg-rebuild-yellow text-rebuild-black' 
                    : 'border-gray-600 text-white hover:bg-gray-800'
                )}
              >
                <Grid3X3 size={14} />
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('table')}
                className={cn(
                  'h-7 w-7 p-0 booking-view-mode-button',
                  viewMode === 'table' 
                    ? 'bg-rebuild-yellow text-rebuild-black' 
                    : 'border-gray-600 text-white hover:bg-gray-800'
                )}
              >
                <Table2 size={14} />
              </Button>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Showing {filteredBookings.length} of {bookings.length} bookings
          </div>
          
          {(searchQuery || filterStatus !== 'all') && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setFilterStatus('all');
              }}
              className="text-gray-400 hover:text-white"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Bookings Display */}
      {filteredBookings.length === 0 ? (
        <motion.div 
          className="text-center py-12 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-rebuild-yellow/10 mb-4">
            <CreditCard size={32} className="text-rebuild-yellow" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            {filterStatus === 'all' ? 'No Service Bookings' : `No ${filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)} Bookings`}
          </h3>
          <p className="text-gray-400 max-w-md mx-auto">
            {filterStatus === 'all' 
              ? "No customers have booked add-on services yet. Bookings will appear here once customers start adding services to their memberships."
              : `No bookings with status "${filterStatus}" found. Try selecting a different filter.`
            }
          </p>
        </motion.div>
      ) : (
        <>
          {/* Grid View - Always shown on mobile, toggleable on desktop */}
          <div className={cn(
            "block booking-grid-container",
            "sm:block", // Always show on mobile and small screens
            viewMode === 'grid' ? "sm:block" : "sm:hidden" // Toggle on larger screens
          )}>
            <div className={cn(
              "grid gap-3 xs:gap-6 booking-card-grid",
              "grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            )}>
              {filteredBookings.map((booking) => (
                <AdminServiceBookingCard
                  key={booking.id}
                  booking={booking}
                  onView={handleViewDetails}
                  onStatusUpdate={handleStatusUpdate}
                  disabled={updating}
                />
              ))}
            </div>
          </div>

          {/* Table View - Hidden on mobile, toggleable on desktop */}
          <div className={cn(
            "hidden booking-table-container",
            viewMode === 'table' ? "sm:block" : "sm:hidden"
          )}>
            <AdminTable>
              <AdminTableHeader>
                <AdminTableRow>
                  <AdminTableHead className="w-[25%] xs:w-auto">Customer</AdminTableHead>
                  <AdminTableHead className="hidden xs:table-cell">Services</AdminTableHead>
                  <AdminTableHead className="hidden sm:table-cell">Total Amount</AdminTableHead>
                  <AdminTableHead className="w-[20%] xs:w-auto">Status</AdminTableHead>
                  <AdminTableHead className="hidden md:table-cell">Date</AdminTableHead>
                  <AdminTableHead className="w-[20%] xs:w-auto">Actions</AdminTableHead>
                </AdminTableRow>
              </AdminTableHeader>
              <AdminTableBody>
                {filteredBookings.map((booking) => (
                  <AdminTableRow key={booking.id}>
                    <AdminTableCell className="booking-table-cell">
                      <div>
                        <div className="font-medium text-white text-xs xs:text-sm">{booking.customerName}</div>
                        <div className="text-xs text-gray-400 hidden xs:block">{booking.customerEmail}</div>
                        <div className="text-xs text-gray-400 hidden xs:block">{booking.customerPhone}</div>
                      </div>
                    </AdminTableCell>
                    
                    <AdminTableCell className="hidden xs:table-cell booking-table-cell">
                      <div className="space-y-1">
                        {booking.addOnServices.slice(0, 2).map((service, index) => (
                          <div key={index} className="text-xs xs:text-sm">
                            <span className="text-white">{service.serviceName}</span>
                            <span className="text-gray-400 ml-2 hidden sm:inline">({service.pricingType})</span>
                          </div>
                        ))}
                        {booking.addOnServices.length > 2 && (
                          <div className="text-xs text-gray-400">
                            +{booking.addOnServices.length - 2} more
                          </div>
                        )}
                      </div>
                    </AdminTableCell>
                    
                    <AdminTableCell className="hidden sm:table-cell booking-table-cell">
                      <span className="font-medium text-rebuild-yellow text-xs xs:text-sm">
                        {booking.totalAmount}
                      </span>
                    </AdminTableCell>
                    
                    <AdminTableCell className="booking-table-cell">
                      <Badge className={cn('flex items-center gap-1 w-fit text-xs booking-status-badge', getStatusColor(booking.status))}>
                        {getStatusIcon(booking.status)}
                        <span className="hidden xs:inline">{booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span>
                      </Badge>
                    </AdminTableCell>
                    
                    <AdminTableCell className="hidden md:table-cell booking-table-cell">
                      <div className="text-xs xs:text-sm">
                        {booking.createdAt?.toDate().toLocaleDateString() || 'Unknown'}
                      </div>
                    </AdminTableCell>
                    
                    <AdminTableCell className="booking-table-cell">
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleViewDetails(booking)}
                          className="hover:bg-rebuild-yellow/10 hover:text-rebuild-yellow border-gray-600 h-7 xs:h-8 w-7 xs:w-8 p-0 booking-action-button"
                        >
                          <Eye size={12} />
                        </Button>
                      </div>
                    </AdminTableCell>
                  </AdminTableRow>
                ))}
              </AdminTableBody>
            </AdminTable>
          </div>
        </>
      )}

      {renderViewDetailsModal()}
    </AdminLayout>
  );
};

export default AdminServiceBookings;

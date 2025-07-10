import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Search, Eye, Trash, CheckCircle, XCircle } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from '@/components/ui/use-toast';
import AdminContactCard from './AdminContactCard';
import { type ContactRequest } from '@/lib/firebaseServices';

const INITIAL_CONTACTS: ContactRequest[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    phone: '+91 98765 43210',
    message: 'I am interested in the Premium membership. Could you please provide more details?',
    status: 'new'
  },
  {
    id: '2',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    phone: '+91 87654 32109',
    message: 'I would like to know if you offer personal training for women in the women-only gym.',
    status: 'read'
  }
];

const AdminContacts = () => {
  const [contacts, setContacts] = useState<ContactRequest[]>(INITIAL_CONTACTS);
  const [filteredContacts, setFilteredContacts] = useState<ContactRequest[]>(INITIAL_CONTACTS);
  const [selectedContact, setSelectedContact] = useState<ContactRequest | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { toast } = useToast();

  // Filter contacts when search term changes
  React.useEffect(() => {
    const filtered = contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.includes(searchTerm) ||
      contact.message.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredContacts(filtered);
  }, [searchTerm, contacts]);

  const handleViewContact = (contact: ContactRequest) => {
    // Mark as read
    if (contact.status === 'new') {
      setContacts(contacts.map(c => 
        c.id === contact.id ? { ...c, status: 'read' } : c
      ));
    }
    
    setSelectedContact(contact);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setContacts(contacts.filter(contact => contact.id !== id));
    toast({
      title: 'Contact request deleted',
      description: 'Contact request has been deleted successfully',
    });
  };

  const handleMarkAsRead = (id: string) => {
    setContacts(contacts.map(contact => 
      contact.id === id ? { ...contact, status: 'read' } : contact
    ));
    
    toast({
      title: 'Marked as read',
      description: 'Contact request has been marked as read',
    });
  };

  const handleMarkAsResponded = (id: string) => {
    setContacts(contacts.map(contact => 
      contact.id === id ? { ...contact, status: 'responded' } : contact
    ));
    
    toast({
      title: 'Marked as responded',
      description: 'Contact request has been marked as responded',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Contact Requests</h2>
          <div className="flex gap-2 text-sm text-gray-400">
            <span>{filteredContacts.filter(c => c.status === 'new').length} unread messages</span>
            <span>•</span>
            <span>{filteredContacts.length} total requests</span>
          </div>
        </div>
        
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search contacts..."
            className="pl-8 bg-rebuild-darkgray border-gray-700 text-white w-full md:w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Mobile Grid View */}
      <div className="block md:hidden">
        {filteredContacts.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>No contact requests found.</p>
          </div>
        ) : (
          <div className="contact-card-grid grid grid-cols-1 gap-4">
            {filteredContacts.map((contact) => (
              <AdminContactCard
                key={contact.id}
                contact={contact}
                onViewDetails={handleViewContact}
                onDelete={handleDelete}
                onMarkAsRead={handleMarkAsRead}
                onMarkAsResponded={handleMarkAsResponded}
              />
            ))}
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-rebuild-darkgray border border-gray-700 rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-400">
                  No contact requests found.
                </TableCell>
              </TableRow>
            ) : (
              filteredContacts.map((contact) => (
                <TableRow key={contact.id} className={contact.status === 'new' ? 'bg-blue-500/5' : ''}>
                  <TableCell>
                    {contact.status === 'new' ? (
                      <XCircle className="h-4 w-4 text-yellow-500" />
                    ) : contact.status === 'read' ? (
                      <Eye className="h-4 w-4 text-blue-500" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </TableCell>
                  <TableCell className="font-medium text-white">{contact.name}</TableCell>
                  <TableCell className="text-gray-400">{contact.email}</TableCell>
                  <TableCell className="text-gray-400">{contact.phone}</TableCell>
                  <TableCell className="text-gray-400">{contact.createdAt ? new Date(contact.createdAt.toDate()).toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewContact(contact)}
                        className="h-8 px-2 border-gray-700"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {contact.status === 'new' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMarkAsRead(contact.id!)}
                          className="h-8 px-2 border-gray-700"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      {contact.status !== 'responded' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMarkAsResponded(contact.id!)}
                          className="h-8 px-2 border-gray-700 text-green-400"
                        >
                          Respond
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(contact.id!)}
                        className="h-8 px-2 border-gray-700 text-red-400 hover:text-red-300"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedContact && (
          <DialogContent className="max-w-lg bg-rebuild-darkgray border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle>Message from {selectedContact.name}</DialogTitle>
              <DialogDescription className="text-gray-400 text-sm pt-2">
                Received on {selectedContact.createdAt ? new Date(selectedContact.createdAt.toDate()).toLocaleDateString() : 'N/A'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-1">Email</h4>
                  <p>{selectedContact.email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-1">Phone</h4>
                  <p>{selectedContact.phone}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-1">Message</h4>
                <p className="bg-rebuild-black p-4 rounded-md">{selectedContact.message}</p>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => handleDelete(selectedContact.id)} className="flex items-center gap-2 border-gray-700">
                <Trash size={16} /> Delete
              </Button>
              <Button onClick={() => setIsDialogOpen(false)} className="bg-rebuild-yellow text-rebuild-black hover:bg-yellow-500">Close</Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default AdminContacts;

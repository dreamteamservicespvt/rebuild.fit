
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Trash, CheckCircle, XCircle } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from '@/components/ui/use-toast';

interface ContactRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  date: string;
  isRead: boolean;
}

const INITIAL_CONTACTS: ContactRequest[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    phone: '+91 98765 43210',
    message: 'I am interested in the Premium membership. Could you please provide more details?',
    date: '2023-10-22',
    isRead: false
  },
  {
    id: '2',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    phone: '+91 87654 32109',
    message: 'I would like to know if you offer personal training for women in the women-only gym.',
    date: '2023-10-20',
    isRead: true
  }
];

const AdminContacts = () => {
  const [contacts, setContacts] = useState<ContactRequest[]>(INITIAL_CONTACTS);
  const [selectedContact, setSelectedContact] = useState<ContactRequest | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { toast } = useToast();

  const handleViewContact = (contact: ContactRequest) => {
    // Mark as read
    if (!contact.isRead) {
      setContacts(contacts.map(c => 
        c.id === contact.id ? { ...c, isRead: true } : c
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

  const handleMarkAsRead = (id: string, isRead: boolean) => {
    setContacts(contacts.map(contact => 
      contact.id === id ? { ...contact, isRead } : contact
    ));
    
    toast({
      title: isRead ? 'Marked as read' : 'Marked as unread',
      description: `Contact request has been marked as ${isRead ? 'read' : 'unread'}`,
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Contact Requests</h2>
        <div className="flex gap-2">
          <span className="text-sm text-gray-400">
            {contacts.filter(c => !c.isRead).length} unread messages
          </span>
        </div>
      </div>

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
          {contacts.map(contact => (
            <TableRow key={contact.id} className={!contact.isRead ? "bg-rebuild-darkgray/50" : ""}>
              <TableCell>
                <div className={`w-2 h-2 rounded-full ${!contact.isRead ? 'bg-rebuild-yellow' : 'bg-gray-500'}`} />
              </TableCell>
              <TableCell className="font-medium">{contact.name}</TableCell>
              <TableCell>{contact.email}</TableCell>
              <TableCell>{contact.phone}</TableCell>
              <TableCell>{new Date(contact.date).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleViewContact(contact)}>
                    <Eye size={16} />
                  </Button>
                  {contact.isRead ? (
                    <Button variant="ghost" size="sm" onClick={() => handleMarkAsRead(contact.id, false)}>
                      <XCircle size={16} />
                    </Button>
                  ) : (
                    <Button variant="ghost" size="sm" onClick={() => handleMarkAsRead(contact.id, true)}>
                      <CheckCircle size={16} />
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(contact.id)}>
                    <Trash size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {contacts.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                No contact requests found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedContact && (
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Message from {selectedContact.name}</DialogTitle>
              <DialogDescription className="text-gray-400 text-sm pt-2">
                Received on {new Date(selectedContact.date).toLocaleDateString()}
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
                <p className="bg-rebuild-darkgray p-4 rounded-md">{selectedContact.message}</p>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => handleDelete(selectedContact.id)} className="flex items-center gap-2">
                <Trash size={16} /> Delete
              </Button>
              <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default AdminContacts;

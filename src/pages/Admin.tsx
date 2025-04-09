
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminGyms from '@/components/admin/AdminGyms';
import AdminTransformations from '@/components/admin/AdminTransformations';
import AdminTrainers from '@/components/admin/AdminTrainers';
import AdminMembership from '@/components/admin/AdminMembership';
import AdminBlog from '@/components/admin/AdminBlog';
import AdminContacts from '@/components/admin/AdminContacts';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Admin = () => {
  const navigate = useNavigate();

  return (
    <div className="container py-8 mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button 
          variant="outline" 
          className="flex items-center gap-2" 
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={16} />
          Back to Website
        </Button>
      </div>
      
      <Tabs defaultValue="gyms" className="w-full">
        <TabsList className="grid grid-cols-6 mb-8">
          <TabsTrigger value="gyms">Gyms</TabsTrigger>
          <TabsTrigger value="transformations">Transformations</TabsTrigger>
          <TabsTrigger value="trainers">Trainers</TabsTrigger>
          <TabsTrigger value="membership">Membership</TabsTrigger>
          <TabsTrigger value="blog">Blog</TabsTrigger>
          <TabsTrigger value="contacts">Contact Requests</TabsTrigger>
        </TabsList>
        
        <TabsContent value="gyms">
          <AdminGyms />
        </TabsContent>
        
        <TabsContent value="transformations">
          <AdminTransformations />
        </TabsContent>
        
        <TabsContent value="trainers">
          <AdminTrainers />
        </TabsContent>
        
        <TabsContent value="membership">
          <AdminMembership />
        </TabsContent>
        
        <TabsContent value="blog">
          <AdminBlog />
        </TabsContent>

        <TabsContent value="contacts">
          <AdminContacts />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;

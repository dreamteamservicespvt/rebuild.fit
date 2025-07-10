import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Plus, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from '@/lib/toast';
import { initializeMembershipData, populateMemberships, populateAddOnServices } from '@/scripts/initMembershipData';

const DataInitializer = () => {
  const [loading, setLoading] = useState(false);
  const [individualLoading, setIndividualLoading] = useState<string | null>(null);

  const handleFullInitialization = async () => {
    setLoading(true);
    try {
      await initializeMembershipData();
      toast.success('Success!', 'All membership data has been initialized successfully');
    } catch (error) {
      toast.error('Error', 'Failed to initialize membership data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleMembershipsOnly = async () => {
    setIndividualLoading('memberships');
    try {
      await populateMemberships();
      toast.success('Success!', 'Membership plans have been created successfully');
    } catch (error) {
      toast.error('Error', 'Failed to create membership plans');
      console.error(error);
    } finally {
      setIndividualLoading(null);
    }
  };

  const handleAddOnServicesOnly = async () => {
    setIndividualLoading('services');
    try {
      await populateAddOnServices();
      toast.success('Success!', 'Add-on services have been created successfully');
    } catch (error) {
      toast.error('Error', 'Failed to create add-on services');
      console.error(error);
    } finally {
      setIndividualLoading(null);
    }
  };

  return (
    <Card className="bg-rebuild-darkgray border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Database size={20} className="text-rebuild-yellow" />
          Data Initialization
        </CardTitle>
        <CardDescription className="text-gray-400">
          Initialize your membership plans and add-on services with sample data that matches your design
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Button 
            onClick={handleFullInitialization}
            disabled={loading || individualLoading !== null}
            className="w-full bg-rebuild-yellow text-rebuild-black hover:bg-yellow-400 font-semibold"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Initializing All Data...
              </>
            ) : (
              <>
                <CheckCircle size={16} className="mr-2" />
                Initialize All Data
              </>
            )}
          </Button>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button 
              onClick={handleMembershipsOnly}
              disabled={loading || individualLoading !== null}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              {individualLoading === 'memberships' ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus size={16} className="mr-2" />
                  Memberships Only
                </>
              )}
            </Button>
            
            <Button 
              onClick={handleAddOnServicesOnly}
              disabled={loading || individualLoading !== null}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              {individualLoading === 'services' ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus size={16} className="mr-2" />
                  Add-ons Only
                </>
              )}
            </Button>
          </div>
        </div>
        
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <AlertCircle size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-300">
              <p className="font-medium mb-1">Note:</p>
              <ul className="text-xs space-y-1 text-blue-300/80">
                <li>• This will create sample membership plans and add-on services</li>
                <li>• Data matches the design shown in your membership page</li>
                <li>• Existing data will not be affected if same items exist</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataInitializer;

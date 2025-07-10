import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, Loader2, TestTube } from 'lucide-react';
import { membershipsService, addOnServicesService, serviceBookingsService } from '@/lib/firebaseServices';
import { toast } from '@/lib/toast';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  details?: any;
}

const SystemTester = () => {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [running, setRunning] = useState(false);

  const updateTest = (name: string, status: TestResult['status'], message: string, details?: any) => {
    setTests(prev => {
      const existing = prev.find(t => t.name === name);
      if (existing) {
        existing.status = status;
        existing.message = message;
        existing.details = details;
        return [...prev];
      }
      return [...prev, { name, status, message, details }];
    });
  };

  const runTests = async () => {
    setRunning(true);
    setTests([]);

    // Test 1: Firebase Connection
    updateTest('Firebase Connection', 'pending', 'Testing Firebase connection...');
    try {
      const memberships = await membershipsService.getAll();
      updateTest('Firebase Connection', 'success', `Connected successfully. Found ${memberships.length} membership plans.`);
    } catch (error) {
      updateTest('Firebase Connection', 'error', 'Failed to connect to Firebase', error);
    }

    // Test 2: Membership Service
    updateTest('Membership Service', 'pending', 'Testing membership service...');
    try {
      const memberships = await membershipsService.getAll();
      const hasValidData = memberships.length > 0 && memberships[0].name && memberships[0].price;
      if (hasValidData) {
        updateTest('Membership Service', 'success', `Found ${memberships.length} valid membership plans`);
      } else {
        updateTest('Membership Service', 'error', 'No valid membership data found. Run data initialization.');
      }
    } catch (error) {
      updateTest('Membership Service', 'error', 'Membership service error', error);
    }

    // Test 3: Add-on Services
    updateTest('Add-on Services', 'pending', 'Testing add-on services...');
    try {
      const services = await addOnServicesService.getAll();
      const activeServices = services.filter(s => s.isActive);
      if (activeServices.length > 0) {
        updateTest('Add-on Services', 'success', `Found ${activeServices.length} active add-on services`);
      } else {
        updateTest('Add-on Services', 'error', 'No active add-on services found. Run data initialization.');
      }
    } catch (error) {
      updateTest('Add-on Services', 'error', 'Add-on services error', error);
    }

    // Test 4: Service Bookings
    updateTest('Service Bookings', 'pending', 'Testing service bookings...');
    try {
      const bookings = await serviceBookingsService.getAll();
      updateTest('Service Bookings', 'success', `Service bookings accessible. Found ${bookings.length} bookings.`);
    } catch (error) {
      updateTest('Service Bookings', 'error', 'Service bookings error', error);
    }

    // Test 5: Real-time Updates
    updateTest('Real-time Updates', 'pending', 'Testing real-time updates...');
    try {
      let updateReceived = false;
      const unsubscribe = membershipsService.onSnapshot((data) => {
        if (!updateReceived) {
          updateReceived = true;
          updateTest('Real-time Updates', 'success', 'Real-time updates working correctly');
          unsubscribe();
        }
      });
      
      // Clean up after 3 seconds if no update received
      setTimeout(() => {
        if (!updateReceived) {
          updateTest('Real-time Updates', 'error', 'No real-time updates received');
          unsubscribe();
        }
      }, 3000);
    } catch (error) {
      updateTest('Real-time Updates', 'error', 'Real-time updates error', error);
    }

    setRunning(false);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pending':
        return <Loader2 size={16} className="animate-spin text-yellow-400" />;
      case 'success':
        return <CheckCircle size={16} className="text-green-400" />;
      case 'error':
        return <XCircle size={16} className="text-red-400" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-400 border-yellow-400">Pending</Badge>;
      case 'success':
        return <Badge variant="outline" className="text-green-400 border-green-400">Success</Badge>;
      case 'error':
        return <Badge variant="outline" className="text-red-400 border-red-400">Error</Badge>;
    }
  };

  return (
    <Card className="bg-rebuild-darkgray border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <TestTube size={20} className="text-rebuild-yellow" />
          System Tester
        </CardTitle>
        <CardDescription className="text-gray-400">
          Test all membership system components to ensure everything is working correctly
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={runTests}
          disabled={running}
          className="w-full bg-rebuild-yellow text-rebuild-black hover:bg-yellow-400 font-semibold"
        >
          {running ? (
            <>
              <Loader2 size={16} className="mr-2 animate-spin" />
              Running Tests...
            </>
          ) : (
            <>
              <TestTube size={16} className="mr-2" />
              Run System Tests
            </>
          )}
        </Button>

        {tests.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-300">Test Results:</h4>
            {tests.map((test) => (
              <div key={test.name} className="bg-rebuild-black/50 rounded-lg p-3 border border-gray-700/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(test.status)}
                    <span className="text-white font-medium text-sm">{test.name}</span>
                  </div>
                  {getStatusBadge(test.status)}
                </div>
                <p className="text-xs text-gray-400">{test.message}</p>
                {test.details && (
                  <details className="mt-2">
                    <summary className="text-xs text-gray-500 cursor-pointer">Details</summary>
                    <pre className="text-xs text-gray-500 mt-1 whitespace-pre-wrap">
                      {JSON.stringify(test.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <AlertCircle size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-300">
              <p className="font-medium mb-1">Testing Guidelines:</p>
              <ul className="text-xs space-y-1 text-blue-300/80">
                <li>• Make sure you're connected to the internet</li>
                <li>• Ensure Firebase is properly configured</li>
                <li>• Initialize sample data if tests fail</li>
                <li>• Check browser console for detailed error messages</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemTester;

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast, toastMessages } from '@/lib/toast';

const ToastDemo = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Toast Notification Demo</CardTitle>
            <CardDescription>
              Test the new enhanced toast notification system with auto-close functionality
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Button 
                onClick={() => toast.success('Success!', 'This is a success message that will auto-close in 2 seconds')}
                variant="default"
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Success Toast
              </Button>
              
              <Button 
                onClick={() => toast.error('Error!', 'This is an error message with auto-close')}
                variant="destructive"
              >
                Error Toast
              </Button>
              
              <Button 
                onClick={() => toast.warning('Warning!', 'This is a warning message')}
                variant="outline"
                className="border-amber-300 text-amber-700 hover:bg-amber-50"
              >
                Warning Toast
              </Button>
              
              <Button 
                onClick={() => toast.info('Information', 'This is an informational message')}
                variant="outline"
                className="border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                Info Toast
              </Button>
              
              <Button 
                onClick={() => toast.default('Default', 'This is a default toast message')}
                variant="outline"
              >
                Default Toast
              </Button>
              
              <Button 
                onClick={() => {
                  toast.success(toastMessages.success.saved);
                  setTimeout(() => toast.error(toastMessages.error.network), 500);
                  setTimeout(() => toast.warning('Multiple toasts', 'Testing multiple toasts'), 1000);
                }}
                variant="secondary"
              >
                Multiple Toasts
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Toast Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>✅ Auto-close after 2 seconds</li>
              <li>✅ Beautiful icons for each toast type</li>
              <li>✅ Smooth animations and transitions</li>
              <li>✅ Modern glass-morphism design</li>
              <li>✅ Multiple toast variants (success, error, warning, info)</li>
              <li>✅ Responsive design</li>
              <li>✅ Stack multiple toasts gracefully</li>
              <li>✅ Click to dismiss manually</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ToastDemo;

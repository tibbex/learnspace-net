import React from 'react';
import { useAuth } from '@/components/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SettingsPage: React.FC = () => {
  const { logout } = useAuth();
  
  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>
      
      <div className="max-w-md mx-auto">
        <Card className="shadow-sm border-gray-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <p className="text-sm font-medium leading-none">Logout</p>
              <p className="text-sm text-muted-foreground">
                Sign out of your account
              </p>
              <Button variant="destructive" onClick={logout}>
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;

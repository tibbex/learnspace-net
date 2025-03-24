import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthContext';
import { toast } from 'sonner';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  LogOut,
  Mail,
  Moon,
  Eye,
  CheckSquare,
  Smartphone,
  Monitor
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SettingsPage = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!auth.isAuthenticated) {
      toast.error('Please log in to access this page');
      navigate('/login');
    }
  }, [auth.isAuthenticated, navigate]);
  
  if (!auth.isAuthenticated) {
    return null;
  }
  
  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('You have been logged out successfully.');
  };
  
  return (
    <div className="page-container pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences and settings
        </p>
      </div>
      
      <Tabs defaultValue="account" className="max-w-3xl mx-auto">
        <TabsList className="bg-transparent border p-1 mb-6 w-full grid sm:grid-cols-4 grid-cols-2 gap-1">
          <TabsTrigger 
            value="account" 
            className="rounded-md data-[state=active]:bg-eduBlue data-[state=active]:text-white"
          >
            <User className="h-4 w-4 mr-2" />
            Account
          </TabsTrigger>
          <TabsTrigger 
            value="notifications" 
            className="rounded-md data-[state=active]:bg-eduBlue data-[state=active]:text-white"
          >
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger 
            value="privacy" 
            className="rounded-md data-[state=active]:bg-eduBlue data-[state=active]:text-white"
          >
            <Shield className="h-4 w-4 mr-2" />
            Privacy
          </TabsTrigger>
          <TabsTrigger 
            value="appearance" 
            className="rounded-md data-[state=active]:bg-eduBlue data-[state=active]:text-white"
          >
            <Eye className="h-4 w-4 mr-2" />
            Appearance
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="account" className="mt-0">
          <Card className="shadow-sm border-gray-100 mb-6">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Manage your personal information and account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium mb-1 block">Full Name</label>
                  <input 
                    type="text" 
                    className="w-full rounded-md border border-gray-200 p-2"
                    value={auth.userData?.name || ''}
                    readOnly
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Account Type</label>
                  <input 
                    type="text" 
                    className="w-full rounded-md border border-gray-200 p-2"
                    value={auth.userData?.role?.charAt(0).toUpperCase() + auth.userData?.role?.slice(1) || ''}
                    readOnly
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Phone Number</label>
                  <input 
                    type="text" 
                    className="w-full rounded-md border border-gray-200 p-2"
                    value={auth.userData?.phone || ''}
                    readOnly
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Location</label>
                  <input 
                    type="text" 
                    className="w-full rounded-md border border-gray-200 p-2"
                    value={auth.userData?.location || ''}
                    readOnly
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full rounded-md border border-gray-200 p-2"
                    value="user@example.com"
                    readOnly
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Password</label>
                  <input 
                    type="password" 
                    className="w-full rounded-md border border-gray-200 p-2"
                    value="••••••••"
                    readOnly
                  />
                </div>
              </div>
              
              <Separator />
              
              <div>
                <label className="text-sm font-medium mb-1 block">Login Preferences</label>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-2">
                    <CheckSquare className="h-4 w-4 text-eduBlue" />
                    <span className="text-sm">Remember me on this device</span>
                  </div>
                  <Switch checked={auth.rememberMe} />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <Button variant="outline">Edit Profile</Button>
              <Button 
                className="bg-eduBlue hover:bg-eduBlue/90">
                Save Changes
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="shadow-sm border-gray-100">
            <CardHeader>
              <CardTitle className="text-red-500">Danger Zone</CardTitle>
              <CardDescription>
                Actions here can't be undone
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h4 className="font-medium">Delete Your Account</h4>
                    <p className="text-sm text-gray-500">
                      Once deleted, all your data will be permanently removed
                    </p>
                  </div>
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Log Out</h4>
                    <p className="text-sm text-gray-500">
                      Log out from your current session
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Log Out
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-0">
          <Card className="shadow-sm border-gray-100">
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Customize how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-3">Notification Channels</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Smartphone className="h-4 w-4 text-eduBlue" />
                      <span className="text-sm">Push Notifications</span>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-eduPurple" />
                      <span className="text-sm">Email Notifications</span>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Monitor className="h-4 w-4 text-eduTeal" />
                      <span className="text-sm">In-App Notifications</span>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-3">Notification Types</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Messages</p>
                      <p className="text-xs text-gray-500">Get notified when you receive a message</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Posts</p>
                      <p className="text-xs text-gray-500">Get notified about new posts from your connections</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Comments & Likes</p>
                      <p className="text-xs text-gray-500">Get notified when someone comments or likes your post</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Connection Requests</p>
                      <p className="text-xs text-gray-500">Get notified when someone wants to connect with you</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Educational Updates</p>
                      <p className="text-xs text-gray-500">Get notified about assignments, exams, and resources</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t pt-4">
              <Button className="bg-eduBlue hover:bg-eduBlue/90">
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="privacy" className="mt-0">
          <Card className="shadow-sm border-gray-100">
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Control who can see your information and content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-3">Profile Visibility</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Who can see my profile</p>
                      <p className="text-xs text-gray-500">Control who can view your profile information</p>
                    </div>
                    <select className="rounded-md border border-gray-200 p-1 text-sm">
                      <option>Everyone</option>
                      <option>Connections Only</option>
                      <option>Only Me</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Who can see my posts</p>
                      <p className="text-xs text-gray-500">Control who can view your shared content</p>
                    </div>
                    <select className="rounded-md border border-gray-200 p-1 text-sm">
                      <option>Everyone</option>
                      <option>Connections Only</option>
                      <option>Only Me</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Who can send me messages</p>
                      <p className="text-xs text-gray-500">Control who can message you directly</p>
                    </div>
                    <select className="rounded-md border border-gray-200 p-1 text-sm">
                      <option>Everyone</option>
                      <option>Connections Only</option>
                      <option>Nobody</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-3">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Show phone number</p>
                      <p className="text-xs text-gray-500">Allow others to see your phone number</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Show email address</p>
                      <p className="text-xs text-gray-500">Allow others to see your email address</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Show location</p>
                      <p className="text-xs text-gray-500">Allow others to see your location</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-3">Activity Settings</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Online status</p>
                      <p className="text-xs text-gray-500">Show when you're active on EduHub</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Read receipts</p>
                      <p className="text-xs text-gray-500">Let others know when you've read their messages</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Activity history</p>
                      <p className="text-xs text-gray-500">Allow others to see your recent activity</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t pt-4">
              <Button className="bg-eduBlue hover:bg-eduBlue/90">
                Save Privacy Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="mt-0">
          <Card className="shadow-sm border-gray-100">
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize how EduHub looks and feels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-3">Theme</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="border border-eduBlue rounded-lg p-3 text-center cursor-pointer">
                    <div className="h-20 bg-white rounded-md mb-2 flex items-center justify-center">
                      <Sun className="h-6 w-6 text-yellow-500" />
                    </div>
                    <p className="text-sm font-medium">Light</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-3 text-center cursor-pointer">
                    <div className="h-20 bg-gray-900 rounded-md mb-2 flex items-center justify-center">
                      <Moon className="h-6 w-6 text-gray-300" />
                    </div>
                    <p className="text-sm font-medium">Dark</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-3 text-center cursor-pointer">
                    <div className="h-20 bg-gradient-to-b from-white to-gray-900 rounded-md mb-2 flex items-center justify-center">
                      <Computer className="h-6 w-6 text-gray-500" />
                    </div>
                    <p className="text-sm font-medium">System</p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-3">Color Accent</h3>
                <div className="grid grid-cols-4 gap-3">
                  <div className="border border-eduBlue rounded-lg p-3 text-center cursor-pointer">
                    <div className="h-10 bg-eduBlue rounded-md mb-2"></div>
                    <p className="text-xs font-medium">Blue</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-3 text-center cursor-pointer">
                    <div className="h-10 bg-eduPurple rounded-md mb-2"></div>
                    <p className="text-xs font-medium">Purple</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-3 text-center cursor-pointer">
                    <div className="h-10 bg-eduTeal rounded-md mb-2"></div>
                    <p className="text-xs font-medium">Teal</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-3 text-center cursor-pointer">
                    <div className="h-10 bg-eduGreen rounded-md mb-2"></div>
                    <p className="text-xs font-medium">Green</p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-3">Display Settings</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Reduce animations</p>
                      <p className="text-xs text-gray-500">Minimize motion effects throughout the app</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Compact mode</p>
                      <p className="text-xs text-gray-500">Display more content with less spacing</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Font size</p>
                      <p className="text-xs text-gray-500">Adjust the text size throughout the app</p>
                    </div>
                    <select className="rounded-md border border-gray-200 p-1 text-sm">
                      <option>Small</option>
                      <option selected>Medium</option>
                      <option>Large</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t pt-4">
              <Button className="bg-eduBlue hover:bg-eduBlue/90">
                Save Appearance Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const Sun = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
  </svg>
);

const Computer = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="14" height="8" x="5" y="2" rx="2" />
    <rect width="20" height="8" x="2" y="14" rx="2" />
    <path d="M6 18h2" />
    <path d="M12 18h6" />
  </svg>
);

export default SettingsPage;

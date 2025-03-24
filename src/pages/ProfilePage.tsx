
import React from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  School, 
  Clock, 
  BookOpen, 
  Edit,
  Settings,
  Calendar,
  Users,
  FileText,
  Award,
  BookMarked,
  Video,
  MessageSquare,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/components/AuthContext';
import DemoNotification from '@/components/DemoNotification';

const ProfilePage: React.FC = () => {
  const { auth } = useAuth();
  const userRole = auth.userData?.role || 'student';
  
  // Display name based on role
  const getUserRoleDisplayName = () => {
    switch(userRole) {
      case 'student': return 'Student';
      case 'teacher': return 'Teacher';
      case 'school': return 'School';
      default: return '';
    }
  };
  
  return (
    <div className="page-container pb-20">
      <DemoNotification />
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Profile info */}
        <div className="w-full lg:w-1/3 space-y-6">
          <Card className="shadow-sm border-gray-100 overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-eduBlue to-eduPurple" />
            <CardContent className="pt-0 relative">
              <div className="flex justify-end -mt-4">
                <Button variant="outline" size="sm" className="bg-white">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit Profile
                </Button>
              </div>
              <div className="-mt-16 mb-4 flex flex-col items-center">
                <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                  <AvatarImage src="" />
                  <AvatarFallback className={`
                    ${userRole === 'teacher' ? 'bg-eduPurple' : 
                      userRole === 'student' ? 'bg-eduBlue' : 'bg-eduTeal'} 
                    text-white text-4xl
                  `}>
                    {auth.userData?.name.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <h1 className="text-2xl font-bold mt-3">{auth.userData?.name}</h1>
                <Badge className="mt-1">{getUserRoleDisplayName()}</Badge>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-3">
                {userRole === 'student' && (
                  <>
                    <div className="flex items-center text-gray-600">
                      <School className="h-4 w-4 mr-2" />
                      <span className="text-sm">
                        {(auth.userData as any)?.school || 'School Name'}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span className="text-sm">
                        {(auth.userData as any)?.age || '16'} years old
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <BookOpen className="h-4 w-4 mr-2" />
                      <span className="text-sm">
                        Grade {(auth.userData as any)?.grade || '10th'}
                      </span>
                    </div>
                  </>
                )}
                
                {userRole === 'teacher' && (
                  <>
                    <div className="flex items-center text-gray-600">
                      <School className="h-4 w-4 mr-2" />
                      <span className="text-sm">
                        {(auth.userData as any)?.teachingSchool || 'School Name'}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <BookOpen className="h-4 w-4 mr-2" />
                      <span className="text-sm">
                        Teaches Grades {(auth.userData as any)?.teachingGrades?.join(', ') || '9, 10, 11'}
                      </span>
                    </div>
                  </>
                )}
                
                {userRole === 'school' && (
                  <>
                    <div className="flex items-center text-gray-600">
                      <User className="h-4 w-4 mr-2" />
                      <span className="text-sm">
                        CEO/Principal: {(auth.userData as any)?.ceoName || 'Principal Name'}
                      </span>
                    </div>
                  </>
                )}
                
                <div className="flex items-center text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  <span className="text-sm">{auth.userData?.phone || 'Phone Number'}</span>
                </div>
                
                <div className="flex items-start text-gray-600">
                  <MapPin className="h-4 w-4 mr-2 mt-0.5" />
                  <span className="text-sm">{auth.userData?.location || 'Location'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm border-gray-100">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Stats</CardTitle>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-8 rounded-full bg-eduBlue/10 flex items-center justify-center mb-1">
                      <FileText className="h-4 w-4 text-eduBlue" />
                    </div>
                    <p className="text-xl font-semibold">42</p>
                    <p className="text-xs text-gray-500">Resources</p>
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-8 rounded-full bg-eduPurple/10 flex items-center justify-center mb-1">
                      <Video className="h-4 w-4 text-eduPurple" />
                    </div>
                    <p className="text-xl font-semibold">17</p>
                    <p className="text-xs text-gray-500">Videos</p>
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-8 rounded-full bg-eduGreen/10 flex items-center justify-center mb-1">
                      <Users className="h-4 w-4 text-eduGreen" />
                    </div>
                    <p className="text-xl font-semibold">108</p>
                    <p className="text-xs text-gray-500">Connections</p>
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-8 rounded-full bg-eduTeal/10 flex items-center justify-center mb-1">
                      <MessageSquare className="h-4 w-4 text-eduTeal" />
                    </div>
                    <p className="text-xl font-semibold">53</p>
                    <p className="text-xs text-gray-500">Discussions</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {userRole === 'student' && (
            <Card className="shadow-sm border-gray-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">My Courses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-lg bg-eduBlue/10 flex items-center justify-center mr-3">
                      <BookMarked className="h-4 w-4 text-eduBlue" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Advanced Biology</p>
                      <p className="text-xs text-gray-500">Mrs. Johnson</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-lg bg-eduPurple/10 flex items-center justify-center mr-3">
                      <BookMarked className="h-4 w-4 text-eduPurple" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Algebra II</p>
                      <p className="text-xs text-gray-500">Mr. Peterson</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-lg bg-eduTeal/10 flex items-center justify-center mr-3">
                      <BookMarked className="h-4 w-4 text-eduTeal" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">World History</p>
                      <p className="text-xs text-gray-500">Ms. Williams</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" className="w-full">View All Courses</Button>
              </CardFooter>
            </Card>
          )}
          
          {userRole === 'teacher' && (
            <Card className="shadow-sm border-gray-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">My Classes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-lg bg-eduBlue/10 flex items-center justify-center mr-3">
                      <Users className="h-4 w-4 text-eduBlue" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Biology 101</p>
                      <p className="text-xs text-gray-500">28 students • Grade 10</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-lg bg-eduPurple/10 flex items-center justify-center mr-3">
                      <Users className="h-4 w-4 text-eduPurple" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Advanced Biology</p>
                      <p className="text-xs text-gray-500">18 students • Grade 11</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" className="w-full">View All Classes</Button>
              </CardFooter>
            </Card>
          )}
          
          {userRole === 'school' && (
            <Card className="shadow-sm border-gray-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">School Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  <span className="text-sm">1,245 Students</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <User className="h-4 w-4 mr-2" />
                  <span className="text-sm">87 Teachers</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <BookOpen className="h-4 w-4 mr-2" />
                  <span className="text-sm">42 Courses</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Award className="h-4 w-4 mr-2" />
                  <span className="text-sm">Established 1985</span>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" className="w-full">Edit School Details</Button>
              </CardFooter>
            </Card>
          )}
        </div>
        
        {/* Activity and content */}
        <div className="w-full lg:w-2/3">
          <Tabs defaultValue="posts">
            <TabsList className="bg-transparent border p-1 mb-6">
              <TabsTrigger 
                value="posts" 
                className="rounded-md data-[state=active]:bg-eduBlue data-[state=active]:text-white"
              >
                Posts
              </TabsTrigger>
              <TabsTrigger 
                value="resources" 
                className="rounded-md data-[state=active]:bg-eduBlue data-[state=active]:text-white"
              >
                Resources
              </TabsTrigger>
              <TabsTrigger 
                value="connections" 
                className="rounded-md data-[state=active]:bg-eduBlue data-[state=active]:text-white"
              >
                Connections
              </TabsTrigger>
              {userRole === 'student' && (
                <TabsTrigger 
                  value="progress" 
                  className="rounded-md data-[state=active]:bg-eduBlue data-[state=active]:text-white"
                >
                  Progress
                </TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="posts" className="mt-0">
              <Card className="shadow-sm border-gray-100 mb-6">
                <CardHeader className="pb-0">
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mt-4">
                    <div className="flex">
                      <div className="flex-shrink-0 mr-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-eduBlue text-white">
                            {auth.userData?.name.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg w-full">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-sm">You shared a document</div>
                            <p className="text-gray-500 text-xs">Yesterday at 3:45 PM</p>
                          </div>
                        </div>
                        <p className="text-sm mt-2">
                          Just uploaded my study notes for the upcoming biology exam. Hope everyone finds it helpful!
                        </p>
                        <div className="mt-3 p-2 bg-white rounded border border-gray-200 flex items-center">
                          <div className="h-8 w-8 rounded bg-eduBlue/10 flex items-center justify-center mr-2">
                            <FileText className="h-4 w-4 text-eduBlue" />
                          </div>
                          <div>
                            <p className="text-xs font-medium">Biology_Exam_Notes.pdf</p>
                            <p className="text-xs text-gray-500">2.3 MB • PDF Document</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0 mr-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-eduBlue text-white">
                            {auth.userData?.name.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg w-full">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-sm">You commented on a post</div>
                            <p className="text-gray-500 text-xs">3 days ago</p>
                          </div>
                        </div>
                        <p className="text-sm mt-2">
                          This video was extremely helpful for understanding the concept. Thanks for sharing!
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="outline" className="w-full">View All Activity</Button>
                </CardFooter>
              </Card>
              
              <Card className="shadow-sm border-gray-100">
                <CardHeader className="pb-0">
                  <CardTitle className="text-lg">Your Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium mb-2">No posts yet</h3>
                    <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                      Share your knowledge, questions, and resources with others by creating your first post.
                    </p>
                    <Button variant="default" className="bg-eduBlue hover:bg-eduBlue/90">
                      Create Your First Post
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="resources" className="mt-0">
              <Card className="shadow-sm border-gray-100">
                <CardHeader className="pb-0">
                  <CardTitle className="text-lg">Your Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium mb-2">No resources shared yet</h3>
                    <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                      Share educational resources like documents, worksheets, and books with your peers.
                    </p>
                    <Button variant="default" className="bg-eduBlue hover:bg-eduBlue/90">
                      Upload a Resource
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="connections" className="mt-0">
              <Card className="shadow-sm border-gray-100">
                <CardHeader className="pb-0">
                  <CardTitle className="text-lg">Your Connections</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarFallback className="bg-eduPurple text-white">J</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">Ms. Johnson</p>
                        <p className="text-xs text-gray-500">Biology Teacher</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarFallback className="bg-eduBlue text-white">A</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">Alex Chen</p>
                        <p className="text-xs text-gray-500">Student • Grade 10</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarFallback className="bg-eduBlue text-white">S</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">Sarah Miller</p>
                        <p className="text-xs text-gray-500">Student • Grade 10</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarFallback className="bg-eduTeal text-white">W</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">Westlake High</p>
                        <p className="text-xs text-gray-500">School</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="outline" className="w-full">View All Connections</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {userRole === 'student' && (
              <TabsContent value="progress" className="mt-0">
                <Card className="shadow-sm border-gray-100 mb-6">
                  <CardHeader className="pb-0">
                    <CardTitle className="text-lg">Course Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 mt-4">
                      <div className="p-4 border border-gray-100 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium">Biology 101</h3>
                          <Badge>85% Complete</Badge>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-eduBlue h-2.5 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-500">
                          <div>Next: Chapter 8 - Cellular Respiration</div>
                          <div className="text-right">Due: May 15</div>
                        </div>
                      </div>
                      
                      <div className="p-4 border border-gray-100 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium">Algebra II</h3>
                          <Badge>62% Complete</Badge>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-eduPurple h-2.5 rounded-full" style={{ width: '62%' }}></div>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-500">
                          <div>Next: Unit 5 - Quadratic Equations</div>
                          <div className="text-right">Due: May 18</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-sm border-gray-100">
                  <CardHeader className="pb-0">
                    <CardTitle className="text-lg">Upcoming Assignments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mt-4">
                      <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-lg bg-eduBlue/10 flex items-center justify-center mr-3">
                            <FileText className="h-4 w-4 text-eduBlue" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">Biology Lab Report</p>
                            <p className="text-xs text-gray-500">Due: May 15</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="ml-auto mr-2">High Priority</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-lg bg-eduPurple/10 flex items-center justify-center mr-3">
                            <FileText className="h-4 w-4 text-eduPurple" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">History Essay</p>
                            <p className="text-xs text-gray-500">Due: May 20</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="ml-auto mr-2">Medium Priority</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-lg bg-eduTeal/10 flex items-center justify-center mr-3">
                            <FileText className="h-4 w-4 text-eduTeal" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">Math Problem Set</p>
                            <p className="text-xs text-gray-500">Due: May 22</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="ml-auto mr-2">Medium Priority</Badge>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="outline" className="w-full">View All Assignments</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

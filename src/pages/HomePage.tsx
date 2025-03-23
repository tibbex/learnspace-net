
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ThumbsUp, 
  MessageCircle, 
  Share2, 
  BookOpen, 
  Video, 
  FileText,
  MoreHorizontal,
  RefreshCw,
  Users,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/components/AuthContext';
import DemoNotification from '@/components/DemoNotification';

// Sample data for the posts
const posts = [
  {
    id: 1,
    author: {
      name: 'Mrs. Johnson',
      role: 'teacher',
      avatar: '',
      initial: 'J',
    },
    time: '2 hours ago',
    content: 'Just uploaded new study materials for the upcoming biology test. Make sure to review chapters 5-7!',
    likes: 24,
    comments: 8,
    shares: 3,
    type: 'text',
    subject: 'Biology'
  },
  {
    id: 2,
    author: {
      name: 'Science Club',
      role: 'student',
      avatar: '',
      initial: 'S',
    },
    time: '5 hours ago',
    content: 'Check out our latest chemistry experiment video. We explored the fascinating world of polymers!',
    media: {
      type: 'video',
      thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    },
    likes: 45,
    comments: 12,
    shares: 7,
    type: 'video',
    subject: 'Chemistry'
  },
  {
    id: 3,
    author: {
      name: 'Westlake High',
      role: 'school',
      avatar: '',
      initial: 'W',
    },
    time: '1 day ago',
    content: 'Attention all students! We\'ve just uploaded the new course catalog for the upcoming semester. Please review and register for your courses by Friday.',
    media: {
      type: 'document',
      title: 'Spring Semester Course Catalog.pdf',
    },
    likes: 83,
    comments: 32,
    shares: 19,
    type: 'document',
    subject: 'Announcement'
  },
  {
    id: 4,
    author: {
      name: 'Math Study Group',
      role: 'student',
      avatar: '',
      initial: 'M',
    },
    time: '2 days ago',
    content: 'We created this helpful cheat sheet for calculus. Hope it helps everyone with their finals!',
    media: {
      type: 'document',
      title: 'Calculus_Cheat_Sheet.pdf',
    },
    likes: 122,
    comments: 17,
    shares: 38,
    type: 'document',
    subject: 'Mathematics'
  }
];

// Sample data for suggested connections
const suggestedConnections = [
  {
    id: 1,
    name: 'Physics Club',
    role: 'student',
    initial: 'P',
    mutual: 5
  },
  {
    id: 2,
    name: 'Ms. Williams',
    role: 'teacher',
    initial: 'W',
    mutual: 3
  },
  {
    id: 3,
    name: 'Riverdale Academy',
    role: 'school',
    initial: 'R',
    mutual: 12
  }
];

// Sample recommended resources
const recommendedResources = [
  {
    id: 1,
    title: 'Advanced Literature Study Guide',
    type: 'document',
    icon: FileText,
    color: 'text-eduBlue',
    bgColor: 'bg-eduBlue/10'
  },
  {
    id: 2,
    title: 'World History Video Series',
    type: 'video',
    icon: Video,
    color: 'text-eduPurple',
    bgColor: 'bg-eduPurple/10'
  },
  {
    id: 3,
    title: 'Algebra Fundamentals Workbook',
    type: 'book',
    icon: BookOpen,
    color: 'text-eduGreen',
    bgColor: 'bg-eduGreen/10'
  }
];

// Post Item component
const PostItem: React.FC<{post: typeof posts[0]}> = ({ post }) => {
  return (
    <Card className="mb-6 overflow-hidden shadow-sm border-gray-100 animate-fadeIn">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={post.author.avatar} />
            <AvatarFallback className={`
              ${post.author.role === 'teacher' ? 'bg-eduPurple' : 
                post.author.role === 'student' ? 'bg-eduBlue' : 'bg-eduTeal'} 
              text-white
            `}>
              {post.author.initial}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-medium">{post.author.name}</CardTitle>
              <Badge variant="outline" className="text-xs capitalize">
                {post.author.role}
              </Badge>
            </div>
            <CardDescription className="text-xs">{post.time}</CardDescription>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Save post</DropdownMenuItem>
            <DropdownMenuItem>Hide post</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Report</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="mb-4">
          <p className="text-sm">{post.content}</p>
        </div>
        
        {post.media && (
          <div className="mt-3 rounded-lg overflow-hidden">
            {post.media.type === 'video' && (
              <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={post.media.thumbnail} 
                  alt="Video thumbnail" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-14 w-14 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                    <Video className="h-6 w-6 text-eduPurple" />
                  </div>
                </div>
              </div>
            )}
            
            {post.media.type === 'document' && (
              <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="h-10 w-10 rounded-lg bg-eduBlue/10 flex items-center justify-center mr-3">
                  <FileText className="h-5 w-5 text-eduBlue" />
                </div>
                <div>
                  <p className="text-sm font-medium">{post.media.title}</p>
                  <p className="text-xs text-gray-500">Click to view document</p>
                </div>
              </div>
            )}
          </div>
        )}
        
        <div className="flex items-center space-x-2 mt-3">
          <Badge variant="secondary" className="text-xs font-normal rounded-full">
            {post.subject}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="pt-0 border-t">
        <div className="flex items-center justify-between w-full">
          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-eduBlue hover:bg-eduBlue/5">
            <ThumbsUp className="h-4 w-4 mr-1" />
            <span className="text-xs">{post.likes}</span>
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-eduPurple hover:bg-eduPurple/5">
            <MessageCircle className="h-4 w-4 mr-1" />
            <span className="text-xs">{post.comments}</span>
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-eduTeal hover:bg-eduTeal/5">
            <Share2 className="h-4 w-4 mr-1" />
            <span className="text-xs">{post.shares}</span>
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-eduOrange hover:bg-eduOrange/5">
            <RefreshCw className="h-4 w-4 mr-1" />
            <span className="text-xs">Repost</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

const HomePage: React.FC = () => {
  const { auth } = useAuth();
  const userRole = auth.userData?.role || 'student';
  
  return (
    <div className="page-container pb-20">
      <DemoNotification />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left sidebar */}
        <div className="hidden lg:block lg:col-span-3">
          <div className="space-y-6 sticky top-20">
            <Card className="shadow-sm border-gray-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Welcome</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-20 w-20 mb-3">
                    <AvatarImage src="" />
                    <AvatarFallback className={`
                      ${userRole === 'teacher' ? 'bg-eduPurple' : 
                        userRole === 'student' ? 'bg-eduBlue' : 'bg-eduTeal'} 
                      text-white text-xl
                    `}>
                      {auth.userData?.name.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-medium text-lg">{auth.userData?.name}</h3>
                  <p className="text-muted-foreground text-sm capitalize">{userRole}</p>
                  
                  <div className="grid grid-cols-3 gap-2 w-full mt-4">
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <p className="text-lg font-semibold text-eduBlue">12</p>
                      <p className="text-xs text-gray-600">Courses</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <p className="text-lg font-semibold text-eduPurple">47</p>
                      <p className="text-xs text-gray-600">Connections</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <p className="text-lg font-semibold text-eduTeal">8</p>
                      <p className="text-xs text-gray-600">Groups</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm border-gray-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Recommended Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recommendedResources.map(resource => (
                  <Link 
                    key={resource.id} 
                    to="/resources"
                    className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className={`h-8 w-8 rounded-lg ${resource.bgColor} flex items-center justify-center mr-3`}>
                      <resource.icon className={`h-4 w-4 ${resource.color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{resource.title}</p>
                      <p className="text-xs text-gray-500 capitalize">{resource.type}</p>
                    </div>
                  </Link>
                ))}
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="ghost" className="text-eduBlue hover:text-eduBlue hover:bg-eduBlue/5 w-full">
                  View All Resources
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
        
        {/* Main content */}
        <div className="lg:col-span-6">
          <Tabs defaultValue="all">
            <div className="flex items-center justify-between mb-4">
              <TabsList className="bg-transparent border p-1">
                <TabsTrigger 
                  value="all" 
                  className="rounded-md data-[state=active]:bg-eduBlue data-[state=active]:text-white"
                >
                  All Posts
                </TabsTrigger>
                <TabsTrigger 
                  value="following" 
                  className="rounded-md data-[state=active]:bg-eduBlue data-[state=active]:text-white"
                >
                  Following
                </TabsTrigger>
                <TabsTrigger 
                  value="trending" 
                  className="rounded-md data-[state=active]:bg-eduBlue data-[state=active]:text-white"
                >
                  Trending
                </TabsTrigger>
              </TabsList>
              
              <Button asChild className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg">
                <Link to="/create-post">
                  Create Post
                </Link>
              </Button>
            </div>
            
            <TabsContent value="all" className="mt-0">
              {posts.map(post => (
                <PostItem key={post.id} post={post} />
              ))}
            </TabsContent>
            
            <TabsContent value="following" className="mt-0">
              <Card className="border-gray-100 shadow-sm">
                <CardContent className="p-8 text-center">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium mb-2">No posts from connections yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Connect with more students, teachers, and schools to see their posts here.
                  </p>
                  <Button asChild>
                    <Link to="/explore">
                      Find People to Connect With
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="trending" className="mt-0">
              <Card className="border-gray-100 shadow-sm mb-6">
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-eduOrange" />
                    <CardTitle className="text-base">Trending in Education</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {posts.slice(0, 2).map((post, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">{post.subject}</h4>
                          <p className="text-xs text-gray-500">{post.likes + post.comments * 2} engagements</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {posts.slice(1, 3).map(post => (
                <PostItem key={post.id} post={post} />
              ))}
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Right sidebar */}
        <div className="hidden lg:block lg:col-span-3">
          <div className="space-y-6 sticky top-20">
            <Card className="shadow-sm border-gray-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Suggested Connections</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {suggestedConnections.map(connection => (
                  <div key={connection.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback className={`
                          ${connection.role === 'teacher' ? 'bg-eduPurple' : 
                            connection.role === 'student' ? 'bg-eduBlue' : 'bg-eduTeal'} 
                          text-white
                        `}>
                          {connection.initial}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{connection.name}</p>
                        <p className="text-xs text-gray-500">
                          {connection.mutual} mutual connections
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="h-8 rounded-lg">
                      Connect
                    </Button>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="ghost" className="text-eduBlue hover:text-eduBlue hover:bg-eduBlue/5 w-full">
                  View All Suggestions
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="shadow-sm border-gray-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-eduPurple hover:bg-eduPurple/90">Science</Badge>
                    <p className="text-xs text-gray-500">May 15</p>
                  </div>
                  <h4 className="text-sm font-medium mb-1">Science Fair Registration</h4>
                  <p className="text-xs text-gray-600">Register for the annual science fair by this Friday.</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-eduGreen hover:bg-eduGreen/90">Math</Badge>
                    <p className="text-xs text-gray-500">May 18</p>
                  </div>
                  <h4 className="text-sm font-medium mb-1">Math Olympiad Workshop</h4>
                  <p className="text-xs text-gray-600">Prepare for the upcoming mathematics competition.</p>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="ghost" className="text-eduBlue hover:text-eduBlue hover:bg-eduBlue/5 w-full">
                  View Calendar
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

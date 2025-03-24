import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  TrendingUp,
  Loader,
  Image,
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
import { useAuth } from '@/components/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Post, PostFile } from '@/types/auth';

const parsePostFiles = (filesJson: any): PostFile[] => {
  if (!filesJson) return [];
  try {
    if (typeof filesJson === 'string') {
      return JSON.parse(filesJson);
    } else if (Array.isArray(filesJson)) {
      return filesJson;
    }
    return [];
  } catch (error) {
    console.error('Error parsing files JSON:', error);
    return [];
  }
};

const PostItem: React.FC<{post: Post}> = ({ post }) => {
  const [showFullContent, setShowFullContent] = useState(false);
  const [profile, setProfile] = useState<{name: string, role: string} | null>(null);
  
  useEffect(() => {
    const fetchProfile = async () => {
      if (post.profile) {
        setProfile(post.profile);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('name, role')
          .eq('id', post.user_id)
          .single();
          
        if (error) {
          console.error('Error fetching profile:', error);
          return;
        }
        
        if (data) {
          setProfile({
            name: data.name,
            role: data.role
          });
        }
      } catch (error) {
        console.error('Error in fetchProfile:', error);
      }
    };
    
    fetchProfile();
  }, [post]);
  
  if (!profile) {
    return (
      <Card className="mb-6 overflow-hidden shadow-sm border-gray-100 animate-fadeIn">
        <CardContent className="flex items-center justify-center py-10">
          <Loader className="h-6 w-6 animate-spin text-gray-400" />
        </CardContent>
      </Card>
    );
  }
  
  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffDay > 0) {
      return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
    } else if (diffHour > 0) {
      return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
    } else if (diffMin > 0) {
      return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    } else {
      return 'just now';
    }
  };
  
  const contentPreview = post.content.length > 300 && !showFullContent
    ? post.content.substring(0, 300) + '...'
    : post.content;
    
  const userInitial = profile.name.charAt(0) || 'U';
  
  const hashtagRegex = /#\w+/g;
  const hashtags = post.content.match(hashtagRegex) || [];
  
  const media = post.files && post.files.length > 0 ? post.files[0] : null;
  
  return (
    <Card className="mb-6 overflow-hidden shadow-sm border-gray-100 animate-fadeIn">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback className={`
              ${profile?.role === 'teacher' ? 'bg-eduPurple' : 
                profile?.role === 'student' ? 'bg-eduBlue' : 'bg-eduTeal'} 
              text-white
            `}>
              {userInitial}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-medium">{profile?.name}</CardTitle>
              <Badge variant="outline" className="text-xs capitalize">
                {profile?.role}
              </Badge>
            </div>
            <CardDescription className="text-xs">{timeAgo(post.created_at)}</CardDescription>
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
          <p className="text-sm whitespace-pre-wrap">{contentPreview}</p>
          {post.content.length > 300 && (
            <Button 
              variant="link" 
              size="sm" 
              className="p-0 h-auto text-eduBlue"
              onClick={() => setShowFullContent(!showFullContent)}
            >
              {showFullContent ? 'Show less' : 'Read more'}
            </Button>
          )}
        </div>
        
        {media && (
          <div className="mt-3 rounded-lg overflow-hidden">
            {media.type === 'image' && (
              <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={media.url} 
                  alt={media.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            {media.type === 'video' && (
              <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={media.url} 
                  alt={media.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-14 w-14 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                    <Video className="h-6 w-6 text-eduPurple" />
                  </div>
                </div>
              </div>
            )}
            
            {(media.type === 'document' || media.type === 'audio') && (
              <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="h-10 w-10 rounded-lg bg-eduBlue/10 flex items-center justify-center mr-3">
                  {media.type === 'document' ? (
                    <FileText className="h-5 w-5 text-eduBlue" />
                  ) : (
                    <BookOpen className="h-5 w-5 text-eduTeal" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">{media.name}</p>
                  <p className="text-xs text-gray-500">{media.size} • Click to view</p>
                </div>
              </div>
            )}
          </div>
        )}
        
        {hashtags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {hashtags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs font-normal rounded-full">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0 border-t">
        <div className="flex items-center justify-between w-full">
          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-eduBlue hover:bg-eduBlue/5">
            <ThumbsUp className="h-4 w-4 mr-1" />
            <span className="text-xs">{post.likes || 0}</span>
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-eduPurple hover:bg-eduPurple/5">
            <MessageCircle className="h-4 w-4 mr-1" />
            <span className="text-xs">{post.comments || 0}</span>
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-eduTeal hover:bg-eduTeal/5">
            <Share2 className="h-4 w-4 mr-1" />
            <span className="text-xs">{post.shares || 0}</span>
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
  const navigate = useNavigate();
  const userRole = auth.userData?.role || 'student';
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  
  const suggestedConnections: any[] = [];
  
  const recommendedResources: any[] = [];
  
  useEffect(() => {
    if (!auth.isAuthenticated) {
      toast.error('Please log in to access this page');
      navigate('/login');
    }
  }, [auth.isAuthenticated, navigate]);
  
  useEffect(() => {
    if (!auth.isAuthenticated) return;
    
    const fetchPosts = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('posts')
          .select(`
            *,
            profiles:user_id (
              name,
              role
            )
          `)
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('Error fetching posts:', error);
          toast.error('Failed to load posts. Please try again.');
          return;
        }
        
        if (data) {
          const transformedPosts: Post[] = data.map(post => ({
            id: post.id,
            content: post.content,
            created_at: post.created_at,
            user_id: post.user_id,
            files: parsePostFiles(post.files),
            profile: post.profiles ? {
              name: post.profiles.name,
              role: post.profiles.role
            } : undefined,
            likes: 0,
            comments: 0,
            shares: 0
          }));
          
          setPosts(transformedPosts);
        }
      } catch (error) {
        console.error('Error in fetchPosts:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
    
    const postsSubscription = supabase
      .channel('public:posts')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public',
        table: 'posts'
      }, (payload) => {
        setPosts(current => [payload.new as Post, ...current]);
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(postsSubscription);
    };
  }, [auth.isAuthenticated]);
  
  if (!auth.isAuthenticated) {
    return null;
  }
  
  return (
    <div className="page-container pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
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
        
        <div className="lg:col-span-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
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
              {loading ? (
                <Card className="border-gray-100 shadow-sm">
                  <CardContent className="p-12 text-center">
                    <Loader className="h-8 w-8 mx-auto mb-4 animate-spin text-gray-400" />
                    <p className="text-muted-foreground">Loading posts...</p>
                  </CardContent>
                </Card>
              ) : posts.length > 0 ? (
                posts.map(post => (
                  <PostItem key={post.id} post={post} />
                ))
              ) : (
                <Card className="border-gray-100 shadow-sm">
                  <CardContent className="p-12 text-center">
                    <h3 className="text-lg font-medium mb-2">No posts yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Be the first to create a post in the community.
                    </p>
                    <Button asChild>
                      <Link to="/create-post">
                        Create Your First Post
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
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
              {posts.length > 0 ? (
                <>
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
                              <h4 className="text-sm font-medium">
                                {post.content.substring(0, 30)}...
                              </h4>
                              <p className="text-xs text-gray-500">
                                {post.comments || 0} engagements
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {posts.slice(0, 2).map(post => (
                    <PostItem key={post.id} post={post} />
                  ))}
                </>
              ) : (
                <Card className="border-gray-100 shadow-sm">
                  <CardContent className="p-8 text-center">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium mb-2">No trending posts yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Check back soon to see what's trending in the community.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
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


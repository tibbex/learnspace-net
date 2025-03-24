
import React from 'react';
import { Video, Play, Clock, BookmarkPlus, ThumbsUp, MessageCircle, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import DemoNotification from '@/components/DemoNotification';

// Sample data for videos
const videos = [
  {
    id: 1,
    title: 'Introduction to Cellular Biology',
    thumbnail: 'https://images.unsplash.com/photo-1579165466741-7f35e4755182?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    duration: '18:24',
    author: {
      name: 'Dr. Roberts',
      role: 'teacher',
      avatar: '',
      initial: 'R',
    },
    views: 1245,
    likes: 87,
    category: 'Biology',
    level: 'High School'
  },
  {
    id: 2,
    title: 'Understanding Algebraic Expressions',
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    duration: '12:05',
    author: {
      name: 'Ms. Johnson',
      role: 'teacher',
      avatar: '',
      initial: 'J',
    },
    views: 3652,
    likes: 234,
    category: 'Mathematics',
    level: 'Middle School'
  },
  {
    id: 3,
    title: 'The French Revolution: Causes and Effects',
    thumbnail: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    duration: '22:17',
    author: {
      name: 'History Department',
      role: 'school',
      avatar: '',
      initial: 'H',
    },
    views: 2187,
    likes: 156,
    category: 'History',
    level: 'High School'
  },
  {
    id: 4,
    title: 'Chemical Reactions Lab Demonstration',
    thumbnail: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    duration: '15:33',
    author: {
      name: 'Science Club',
      role: 'student',
      avatar: '',
      initial: 'S',
    },
    views: 876,
    likes: 54,
    category: 'Chemistry',
    level: 'High School'
  },
  {
    id: 5,
    title: 'Creative Writing Techniques',
    thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    duration: '19:42',
    author: {
      name: 'Mrs. Peterson',
      role: 'teacher',
      avatar: '',
      initial: 'P',
    },
    views: 1354,
    likes: 98,
    category: 'Literature',
    level: 'All Levels'
  },
  {
    id: 6,
    title: 'Introduction to Coding with Python',
    thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    duration: '31:08',
    author: {
      name: 'Tech Club',
      role: 'student',
      avatar: '',
      initial: 'T',
    },
    views: 4215,
    likes: 321,
    category: 'Computer Science',
    level: 'Beginner'
  }
];

// Video card component
const VideoCard: React.FC<{video: typeof videos[0]}> = ({ video }) => {
  return (
    <Card className="overflow-hidden border-gray-100 shadow-sm hover:shadow-md transition-shadow animate-fadeIn">
      <div className="relative aspect-video bg-gray-100">
        <img 
          src={video.thumbnail} 
          alt={video.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded-md">
          {video.duration}
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/40">
          <Button variant="default" size="sm" className="rounded-full h-12 w-12 p-0 bg-white/90 hover:bg-white text-eduPurple">
            <Play className="h-6 w-6" />
          </Button>
        </div>
      </div>
      <CardHeader className="pb-2 pt-3">
        <div className="flex space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={video.author.avatar} />
            <AvatarFallback className={`
              ${video.author.role === 'teacher' ? 'bg-eduPurple' : 
                video.author.role === 'student' ? 'bg-eduBlue' : 'bg-eduTeal'} 
              text-white
            `}>
              {video.author.initial}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-sm font-medium line-clamp-2">{video.title}</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">{video.author.name}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="py-0">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{video.views.toLocaleString()} views</span>
          <Badge variant="outline" className="text-[10px]">{video.category}</Badge>
        </div>
      </CardContent>
      <CardFooter className="justify-between py-2">
        <Button variant="ghost" size="sm" className="text-xs px-2">
          <ThumbsUp className="h-3 w-3 mr-1" /> {video.likes}
        </Button>
        <Button variant="ghost" size="sm" className="text-xs px-2">
          <BookmarkPlus className="h-3 w-3 mr-1" /> Save
        </Button>
        <Button variant="ghost" size="sm" className="text-xs px-2">
          <Share2 className="h-3 w-3 mr-1" /> Share
        </Button>
      </CardFooter>
    </Card>
  );
};

const VideosPage: React.FC = () => {
  return (
    <div className="page-container pb-20">
      <DemoNotification />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Educational Videos</h1>
        <p className="text-muted-foreground">
          Discover video lessons, tutorials, and educational content
        </p>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <Tabs defaultValue="all" className="w-full">
          <div className="flex justify-between items-center">
            <TabsList className="bg-transparent border p-1">
              <TabsTrigger 
                value="all" 
                className="rounded-md data-[state=active]:bg-eduBlue data-[state=active]:text-white"
              >
                All Videos
              </TabsTrigger>
              <TabsTrigger 
                value="saved" 
                className="rounded-md data-[state=active]:bg-eduBlue data-[state=active]:text-white"
              >
                Saved
              </TabsTrigger>
              <TabsTrigger 
                value="history" 
                className="rounded-md data-[state=active]:bg-eduBlue data-[state=active]:text-white"
              >
                History
              </TabsTrigger>
            </TabsList>
            
            <div className="relative w-64">
              <Input 
                placeholder="Search videos..." 
                className="pl-10 rounded-lg border-gray-200" 
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Video className="h-4 w-4" />
              </div>
            </div>
          </div>
          
          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map(video => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="saved" className="mt-6">
            <div className="text-center py-12">
              <BookmarkPlus className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">No saved videos yet</h3>
              <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                Save videos to watch later or reference for your studies.
                Click the Save button on any video to add it to your collection.
              </p>
              <Button variant="outline">Browse Popular Videos</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="mt-6">
            <div className="text-center py-12">
              <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">Your watch history is empty</h3>
              <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                Videos you watch will appear here, making it easy to pick up where you left off.
              </p>
              <Button variant="outline">Discover Videos</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Featured Collections</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-eduBlue/90 to-eduPurple/90 text-white border-0 overflow-hidden">
            <CardContent className="p-6">
              <Video className="h-8 w-8 mb-3" />
              <h3 className="text-lg font-medium mb-1">Exam Preparation</h3>
              <p className="text-sm opacity-90 mb-4">
                24 videos to help you prepare for your upcoming exams
              </p>
              <Button variant="default" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-white/30">
                View Collection
              </Button>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-eduGreen/90 to-eduTeal/90 text-white border-0 overflow-hidden">
            <CardContent className="p-6">
              <Video className="h-8 w-8 mb-3" />
              <h3 className="text-lg font-medium mb-1">Science Experiments</h3>
              <p className="text-sm opacity-90 mb-4">
                18 videos showcasing practical science experiments
              </p>
              <Button variant="default" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-white/30">
                View Collection
              </Button>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-eduOrange/90 to-eduPink/90 text-white border-0 overflow-hidden">
            <CardContent className="p-6">
              <Video className="h-8 w-8 mb-3" />
              <h3 className="text-lg font-medium mb-1">Career Guidance</h3>
              <p className="text-sm opacity-90 mb-4">
                12 videos on career planning and university applications
              </p>
              <Button variant="default" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-white/30">
                View Collection
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VideosPage;

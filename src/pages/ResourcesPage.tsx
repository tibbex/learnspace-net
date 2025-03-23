
import React, { useState } from 'react';
import { 
  Book, 
  FileText, 
  Download, 
  Search, 
  BookOpen, 
  Filter, 
  ArrowUpDown,
  Star,
  Clock,
  Bookmark,
  Tag
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import DemoNotification from '@/components/DemoNotification';

// Sample data for resources
const resources = [
  {
    id: 1,
    title: 'AP Biology Study Guide',
    type: 'document',
    subject: 'Biology',
    grade: 'High School',
    uploadDate: '2023-05-01',
    author: {
      name: 'Dr. Roberts',
      role: 'teacher',
      avatar: '',
      initial: 'R',
    },
    downloads: 1245,
    rating: 4.8,
    tags: ['study guide', 'AP exam', 'genetics']
  },
  {
    id: 2,
    title: 'Algebra II Complete Workbook',
    type: 'book',
    subject: 'Mathematics',
    grade: 'High School',
    uploadDate: '2023-04-15',
    author: {
      name: 'Math Department',
      role: 'school',
      avatar: '',
      initial: 'M',
    },
    downloads: 876,
    rating: 4.6,
    tags: ['workbook', 'practice problems', 'quadratics']
  },
  {
    id: 3,
    title: 'World History Timeline Worksheet',
    type: 'document',
    subject: 'History',
    grade: 'Middle School',
    uploadDate: '2023-05-10',
    author: {
      name: 'Ms. Johnson',
      role: 'teacher',
      avatar: '',
      initial: 'J',
    },
    downloads: 542,
    rating: 4.2,
    tags: ['worksheet', 'timeline', 'world wars']
  },
  {
    id: 4,
    title: 'Chemistry Lab Report Template',
    type: 'document',
    subject: 'Chemistry',
    grade: 'High School',
    uploadDate: '2023-05-05',
    author: {
      name: 'Science Department',
      role: 'school',
      avatar: '',
      initial: 'S',
    },
    downloads: 987,
    rating: 4.5,
    tags: ['lab report', 'template', 'experiment']
  },
  {
    id: 5,
    title: 'Literature Analysis Framework',
    type: 'document',
    subject: 'Literature',
    grade: 'All Grades',
    uploadDate: '2023-04-28',
    author: {
      name: 'Book Club',
      role: 'student',
      avatar: '',
      initial: 'B',
    },
    downloads: 324,
    rating: 4.3,
    tags: ['analysis', 'framework', 'essay writing']
  },
  {
    id: 6,
    title: 'Python Programming Fundamentals',
    type: 'book',
    subject: 'Computer Science',
    grade: 'High School',
    uploadDate: '2023-05-12',
    author: {
      name: 'Tech Club',
      role: 'student',
      avatar: '',
      initial: 'T',
    },
    downloads: 1532,
    rating: 4.9,
    tags: ['programming', 'python', 'beginners']
  }
];

// Subject categories
const subjects = [
  { id: 'math', name: 'Mathematics' },
  { id: 'science', name: 'Science' },
  { id: 'literature', name: 'Literature' },
  { id: 'history', name: 'History' },
  { id: 'cs', name: 'Computer Science' },
  { id: 'language', name: 'Languages' },
  { id: 'art', name: 'Arts & Music' },
];

// Grade levels
const grades = [
  { id: 'elem', name: 'Elementary School' },
  { id: 'middle', name: 'Middle School' },
  { id: 'high', name: 'High School' },
  { id: 'all', name: 'All Grades' },
];

// Resource card component
const ResourceCard: React.FC<{resource: typeof resources[0]}> = ({ resource }) => {
  return (
    <Card className="overflow-hidden border-gray-100 shadow-sm hover:shadow-md transition-shadow animate-fadeIn">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex space-x-2 items-start">
            <div className={`
              h-9 w-9 rounded-lg flex items-center justify-center
              ${resource.type === 'document' ? 'bg-eduBlue/10' : 'bg-eduPurple/10'}
            `}>
              {resource.type === 'document' ? (
                <FileText className="h-5 w-5 text-eduBlue" />
              ) : (
                <BookOpen className="h-5 w-5 text-eduPurple" />
              )}
            </div>
            <div>
              <CardTitle className="text-base line-clamp-1">{resource.title}</CardTitle>
              <div className="flex items-center mt-1">
                <Badge 
                  variant="secondary" 
                  className="font-normal mr-2 text-xs"
                >
                  {resource.subject}
                </Badge>
                <CardDescription className="text-xs">
                  {resource.grade}
                </CardDescription>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-0.5">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{resource.rating}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center space-x-2 mb-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={resource.author.avatar} />
            <AvatarFallback className={`
              ${resource.author.role === 'teacher' ? 'bg-eduPurple' : 
                resource.author.role === 'student' ? 'bg-eduBlue' : 'bg-eduTeal'} 
              text-white text-xs
            `}>
              {resource.author.initial}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">
            {resource.author.name}
          </span>
        </div>
        <div className="flex flex-wrap gap-1 mb-2">
          {resource.tags.map((tag, index) => (
            <span 
              key={index} 
              className="text-xs px-2 py-0.5 bg-gray-100 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <div className="flex items-center text-xs text-muted-foreground">
          <Download className="h-3 w-3 mr-1" />
          {resource.downloads} downloads
        </div>
        <Button variant="outline" size="sm" className="text-xs h-8">
          <Download className="h-3 w-3 mr-1" />
          Download
        </Button>
      </CardFooter>
    </Card>
  );
};

const ResourcesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  return (
    <div className="page-container pb-20">
      <DemoNotification />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Books & Worksheets</h1>
        <p className="text-muted-foreground">
          Access educational resources, worksheets, and books for your studies
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left sidebar for categories on larger screens */}
        <div className="hidden md:block w-56 space-y-6">
          <Card className="shadow-sm border-gray-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Subjects</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-1">
                {subjects.map(subject => (
                  <div 
                    key={subject.id} 
                    className="flex items-center justify-between py-1 px-2 rounded-md cursor-pointer hover:bg-gray-50"
                  >
                    <span className="text-sm">{subject.name}</span>
                    <span className="text-xs text-gray-500">42</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm border-gray-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Grade Levels</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-1">
                {grades.map(grade => (
                  <div 
                    key={grade.id} 
                    className="flex items-center justify-between py-1 px-2 rounded-md cursor-pointer hover:bg-gray-50"
                  >
                    <span className="text-sm">{grade.name}</span>
                    <span className="text-xs text-gray-500">24</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm border-gray-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Resource Type</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-1">
                <div className="flex items-center justify-between py-1 px-2 rounded-md cursor-pointer hover:bg-gray-50 bg-eduBlue/5">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-eduBlue" />
                    <span className="text-sm">Documents</span>
                  </div>
                  <span className="text-xs text-gray-500">87</span>
                </div>
                <div className="flex items-center justify-between py-1 px-2 rounded-md cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-2 text-eduPurple" />
                    <span className="text-sm">Books</span>
                  </div>
                  <span className="text-xs text-gray-500">32</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main content */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="relative w-full sm:w-64">
              <Input 
                placeholder="Search resources..." 
                className="pl-10 rounded-lg border-gray-200" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search className="h-4 w-4" />
              </div>
            </div>
            
            <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-start">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-9">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                    {activeFilters.length > 0 && (
                      <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                        {activeFilters.length}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[200px]">
                  <DropdownMenuLabel>Subject</DropdownMenuLabel>
                  {subjects.slice(0, 4).map(subject => (
                    <DropdownMenuCheckboxItem
                      key={subject.id}
                      checked={activeFilters.includes(subject.id)}
                      onCheckedChange={() => {
                        if (activeFilters.includes(subject.id)) {
                          setActiveFilters(activeFilters.filter(id => id !== subject.id));
                        } else {
                          setActiveFilters([...activeFilters, subject.id]);
                        }
                      }}
                    >
                      {subject.name}
                    </DropdownMenuCheckboxItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Grade Level</DropdownMenuLabel>
                  {grades.map(grade => (
                    <DropdownMenuCheckboxItem
                      key={grade.id}
                      checked={activeFilters.includes(grade.id)}
                      onCheckedChange={() => {
                        if (activeFilters.includes(grade.id)) {
                          setActiveFilters(activeFilters.filter(id => id !== grade.id));
                        } else {
                          setActiveFilters([...activeFilters, grade.id]);
                        }
                      }}
                    >
                      {grade.name}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-9">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    Sort
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                    <DropdownMenuRadioItem value="newest">
                      <Clock className="h-4 w-4 mr-2" /> Newest
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="popular">
                      <Download className="h-4 w-4 mr-2" /> Most Downloaded
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="rating">
                      <Star className="h-4 w-4 mr-2" /> Highest Rated
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <Tabs defaultValue="all">
            <TabsList className="bg-transparent border p-1 mb-6">
              <TabsTrigger 
                value="all" 
                className="rounded-md data-[state=active]:bg-eduBlue data-[state=active]:text-white"
              >
                All Resources
              </TabsTrigger>
              <TabsTrigger 
                value="documents" 
                className="rounded-md data-[state=active]:bg-eduBlue data-[state=active]:text-white"
              >
                Documents
              </TabsTrigger>
              <TabsTrigger 
                value="books" 
                className="rounded-md data-[state=active]:bg-eduBlue data-[state=active]:text-white"
              >
                Books
              </TabsTrigger>
              <TabsTrigger 
                value="saved" 
                className="rounded-md data-[state=active]:bg-eduBlue data-[state=active]:text-white"
              >
                Saved
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map(resource => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="documents" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources
                  .filter(resource => resource.type === 'document')
                  .map(resource => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
              </div>
            </TabsContent>
            
            <TabsContent value="books" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources
                  .filter(resource => resource.type === 'book')
                  .map(resource => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
              </div>
            </TabsContent>
            
            <TabsContent value="saved" className="mt-0">
              <div className="text-center py-12">
                <Bookmark className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">No saved resources yet</h3>
                <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                  Save documents and books to access them quickly when you need them for your studies.
                </p>
                <Button variant="outline">Browse Popular Resources</Button>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Popular Tags</h2>
            <div className="flex flex-wrap gap-2">
              {['study guide', 'worksheets', 'practice problems', 'exam prep', 'lab report', 'essay writing', 'literature', 'calculus', 'chemistry', 'history', 'programming', 'language arts'].map(tag => (
                <Badge key={tag} variant="secondary" className="py-1 cursor-pointer hover:bg-gray-200">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;

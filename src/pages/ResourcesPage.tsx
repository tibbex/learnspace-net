import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthContext';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';

const ResourcesPage: React.FC = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredResources, setFilteredResources] = useState<any[]>([]);

  if (!auth.isAuthenticated) {
    toast.error('Please log in to access this page');
    navigate('/login');
    return null;
  }

  const resources = [
    {
      id: 1,
      title: 'Advanced Literature Study Guide',
      type: 'document',
      description: 'A comprehensive guide for advanced literature studies.',
      url: '#',
      tags: ['literature', 'study guide', 'advanced'],
    },
    {
      id: 2,
      title: 'World History Video Series',
      type: 'video',
      description: 'An engaging video series covering world history topics.',
      url: '#',
      tags: ['history', 'video', 'world'],
    },
    {
      id: 3,
      title: 'Algebra Fundamentals Workbook',
      type: 'book',
      description: 'A workbook for mastering algebra fundamentals.',
      url: '#',
      tags: ['algebra', 'workbook', 'math'],
    },
    {
      id: 4,
      title: 'AP Chemistry Practice Exams',
      type: 'exam',
      description: 'Practice exams for AP Chemistry with detailed solutions.',
      url: '#',
      tags: ['chemistry', 'exam', 'AP'],
    },
    {
      id: 5,
      title: 'Coding Basics Tutorial',
      type: 'tutorial',
      description: 'A beginner-friendly tutorial for coding basics.',
      url: '#',
      tags: ['coding', 'tutorial', 'programming'],
    },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = resources.filter((resource) =>
      resource.title.toLowerCase().includes(query.toLowerCase()) ||
      resource.description.toLowerCase().includes(query.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
    setFilteredResources(filtered);
  };

  const displayedResources = searchQuery ? filteredResources : resources;

  return (
    <div className="page-container">
      <div className="container mx-auto py-10">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Resources</h1>
          <div className="w-1/3">
            <Input
              type="search"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="rounded-full shadow-sm"
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList className="bg-transparent border-b">
            <TabsTrigger value="all" className="data-[state=active]:bg-gray-100">All</TabsTrigger>
            <TabsTrigger value="documents" className="data-[state=active]:bg-gray-100">Documents</TabsTrigger>
            <TabsTrigger value="videos" className="data-[state=active]:bg-gray-100">Videos</TabsTrigger>
            <TabsTrigger value="books" className="data-[state=active]:bg-gray-100">Books</TabsTrigger>
            <TabsTrigger value="exams" className="data-[state=active]:bg-gray-100">Exams</TabsTrigger>
            <TabsTrigger value="tutorials" className="data-[state=active]:bg-gray-100">Tutorials</TabsTrigger>
          </TabsList>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedResources.map((resource) => (
              <Card key={resource.id} className="shadow-md hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <CardTitle>{resource.title}</CardTitle>
                  <CardDescription>{resource.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">Type: {resource.type}</p>
                  <div className="mt-2">
                    {resource.tags.map((tag, index) => (
                      <Button key={index} variant="secondary" size="sm" className="mr-2 mb-2">
                        {tag}
                      </Button>
                    ))}
                  </div>
                </CardContent>
                <CardContent className="border-t">
                  <Button asChild>
                    <Link to={resource.url} className="w-full">
                      View Resource
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default ResourcesPage;

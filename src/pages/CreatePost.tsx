
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Image, 
  Video, 
  Paperclip, 
  Users, 
  Globe, 
  Lock, 
  X, 
  ChevronDown,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/AuthContext';
import { toast } from 'sonner';
import DemoNotification from '@/components/DemoNotification';
import { supabase } from '@/integrations/supabase/client';

type AttachmentType = 'document' | 'image' | 'video' | 'audio';

interface Attachment {
  id: number;
  type: AttachmentType;
  name: string;
  size: string;
  preview?: string;
  file?: File;
}

const CreatePost: React.FC = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [privacy, setPrivacy] = useState<'public' | 'connections' | 'private'>('public');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const userInitial = auth.userData?.name.charAt(0) || 'U';
  const userRole = auth.userData?.role || 'student';
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };
  
  const getPrivacyIcon = () => {
    switch(privacy) {
      case 'public': return <Globe className="h-4 w-4 mr-2" />;
      case 'connections': return <Users className="h-4 w-4 mr-2" />;
      case 'private': return <Lock className="h-4 w-4 mr-2" />;
    }
  };
  
  const getPrivacyLabel = () => {
    switch(privacy) {
      case 'public': return 'Everyone';
      case 'connections': return 'Connections Only';
      case 'private': return 'Only Me';
    }
  };
  
  const addAttachment = (type: AttachmentType) => {
    // In a real implementation, we'd use a file input
    // For now, we simulate file selection
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = type === 'document' ? '.pdf,.doc,.docx,.txt' : 
                      type === 'image' ? '.jpg,.jpeg,.png,.gif' : 
                      type === 'video' ? '.mp4,.mov,.avi' : '.mp3,.wav';
    
    fileInput.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        const file = files[0];
        const newAttachment: Attachment = {
          id: Date.now(),
          type,
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          file,
          preview: type === 'image' ? URL.createObjectURL(file) : undefined
        };
        
        setAttachments([...attachments, newAttachment]);
      }
    };
    
    fileInput.click();
  };
  
  const removeAttachment = (id: number) => {
    const attachmentToRemove = attachments.find(a => a.id === id);
    if (attachmentToRemove?.preview) {
      URL.revokeObjectURL(attachmentToRemove.preview);
    }
    setAttachments(attachments.filter(attachment => attachment.id !== id));
  };
  
  const handleSubmit = async () => {
    if (!content.trim() && attachments.length === 0) {
      toast.error('Please add some content or attachments to your post.');
      return;
    }
    
    if (!auth.isAuthenticated) {
      toast.error('You must be logged in to create a post.');
      navigate('/login');
      return;
    }
    
    if (auth.isDemo) {
      toast.info('Demo users cannot create real posts. Please sign up to post.');
      navigate('/login');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // First, handle any file uploads
      const filesData = [];
      
      for (const attachment of attachments) {
        if (attachment.file) {
          const fileName = `${Date.now()}-${attachment.name}`;
          const filePath = `posts/${fileName}`;
          
          const { error: uploadError } = await supabase.storage
            .from('posts')
            .upload(filePath, attachment.file);
            
          if (uploadError) {
            console.error('Error uploading file:', uploadError);
            toast.error(`Error uploading ${attachment.name}`);
            setIsSubmitting(false);
            return;
          }
          
          // Get public URL for the file
          const { data: publicUrlData } = supabase.storage
            .from('posts')
            .getPublicUrl(filePath);
            
          filesData.push({
            type: attachment.type,
            name: attachment.name,
            size: attachment.size,
            url: publicUrlData.publicUrl,
          });
        }
      }
      
      // Create the post in Supabase
      const { error: postError } = await supabase
        .from('posts')
        .insert({
          content,
          files: filesData,
          user_id: auth.userData?.id, // This should be the actual user ID from Supabase
          // We would ideally store privacy settings as well
        });
        
      if (postError) {
        console.error('Error creating post:', postError);
        toast.error('Error creating your post. Please try again.');
        setIsSubmitting(false);
        return;
      }
      
      toast.success('Your post has been published!');
      navigate('/home');
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const renderAttachmentIcon = (type: AttachmentType) => {
    switch(type) {
      case 'document': return <FileText className="h-4 w-4 text-eduBlue" />;
      case 'image': return <Image className="h-4 w-4 text-eduGreen" />;
      case 'video': return <Video className="h-4 w-4 text-eduPurple" />;
      case 'audio': return <BookOpen className="h-4 w-4 text-eduTeal" />;
    }
  };
  
  // Prevent UI glitches with stable UI elements
  return (
    <div className="page-container pb-20">
      <DemoNotification />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create a Post</h1>
        <p className="text-muted-foreground">
          Share knowledge, resources, or start a discussion
        </p>
      </div>
      
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-sm border-gray-100">
          <CardHeader className="pb-2">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src="" />
                <AvatarFallback className={`
                  ${userRole === 'teacher' ? 'bg-eduPurple' : 
                    userRole === 'student' ? 'bg-eduBlue' : 'bg-eduTeal'} 
                  text-white
                `}>
                  {userInitial}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-base">{auth.userData?.name}</CardTitle>
                <div className="flex items-center mt-0.5">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                        {getPrivacyIcon()}
                        {getPrivacyLabel()}
                        <ChevronDown className="h-3 w-3 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem onClick={() => setPrivacy('public')}>
                        <Globe className="h-4 w-4 mr-2" />
                        <span>Everyone</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setPrivacy('connections')}>
                        <Users className="h-4 w-4 mr-2" />
                        <span>Connections Only</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setPrivacy('private')}>
                        <Lock className="h-4 w-4 mr-2" />
                        <span>Only Me</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea 
              placeholder="What would you like to share?" 
              className="min-h-32 border-0 focus-visible:ring-0 p-0 text-base resize-none"
              value={content}
              onChange={handleContentChange}
            />
            
            {attachments.length > 0 && (
              <div className="mt-4 space-y-2">
                {attachments.map(attachment => (
                  <div key={attachment.id} className="relative">
                    {attachment.type === 'image' && attachment.preview ? (
                      <div className="relative rounded-lg overflow-hidden">
                        <img 
                          src={attachment.preview} 
                          alt={attachment.name} 
                          className="w-full h-48 object-cover"
                        />
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full"
                          onClick={() => removeAttachment(attachment.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center mr-3">
                          {renderAttachmentIcon(attachment.type)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium truncate">{attachment.name}</p>
                          <p className="text-xs text-gray-500">{attachment.size}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-gray-500 hover:text-red-500"
                          onClick={() => removeAttachment(attachment.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <div className="flex space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9">
                    <Paperclip className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => addAttachment('document')}>
                    <FileText className="h-4 w-4 mr-2 text-eduBlue" />
                    <span>Document</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => addAttachment('image')}>
                    <Image className="h-4 w-4 mr-2 text-eduGreen" />
                    <span>Image</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => addAttachment('video')}>
                    <Video className="h-4 w-4 mr-2 text-eduPurple" />
                    <span>Video</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => addAttachment('audio')}>
                    <BookOpen className="h-4 w-4 mr-2 text-eduTeal" />
                    <span>Book/Audio</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="h-9"
                onClick={() => {
                  const dummyTags = ['#education', '#learning', '#collaboration'];
                  const randomTag = dummyTags[Math.floor(Math.random() * dummyTags.length)];
                  setContent(prev => prev + ' ' + randomTag);
                }}
              >
                <span className="text-eduBlue mr-1">#</span>
                Tags
              </Button>
            </div>
            
            <Button 
              className="bg-eduBlue hover:bg-eduBlue/90"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Publishing...' : 'Publish Post'}
            </Button>
          </CardFooter>
        </Card>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="font-medium mb-2">Posting Guidelines</h3>
          <ul className="text-sm text-gray-600 space-y-1 pl-5 list-disc">
            <li>Keep content relevant to educational purposes</li>
            <li>Be respectful and considerate to others</li>
            <li>Cite sources for any referenced materials</li>
            <li>Avoid sharing personal or sensitive information</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;

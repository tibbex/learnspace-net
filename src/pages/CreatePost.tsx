import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/components/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { FileType, PostFile } from '@/types/post';

const CreatePost = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [content, setContent] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  // Handle post creation
  const handleCreatePost = async () => {
    if (!auth.isAuthenticated || !auth.userData) {
      toast.error('You must be logged in to create a post');
      navigate('/login');
      return;
    }

    if (!content.trim()) {
      toast.error('Please add some content to your post');
      return;
    }

    try {
      setUploading(true);
      
      // Upload files if any
      const uploadedFiles: PostFile[] = [];
      
      if (files.length > 0) {
        for (const file of files) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
          const filePath = `${auth.userData.id}/${fileName}`;
          
          const { error: uploadError } = await supabase.storage
            .from('posts')
            .upload(filePath, file);
            
          if (uploadError) {
            console.error('Error uploading file:', uploadError);
            toast.error(`Error uploading ${file.name}`);
            continue;
          }
          
          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('posts')
            .getPublicUrl(filePath);
            
          // Determine file type
          let type: FileType = 'document';
          if (file.type.startsWith('image/')) type = 'image';
          else if (file.type.startsWith('video/')) type = 'video';
          else if (file.type.startsWith('audio/')) type = 'audio';
          
          // Format file size
          const sizeInKB = file.size / 1024;
          const sizeString = sizeInKB > 1024 
            ? `${(sizeInKB / 1024).toFixed(2)} MB`
            : `${sizeInKB.toFixed(2)} KB`;
            
          uploadedFiles.push({
            type,
            name: file.name,
            size: sizeString,
            url: publicUrl
          });
        }
      }
      
      // Create the post with the uploaded files
      const { error } = await supabase.from('posts').insert({
        user_id: auth.userData.id,
        content,
        files: uploadedFiles,
      });
      
      if (error) {
        console.error('Error creating post:', error);
        toast.error('Failed to create post');
        return;
      }
      
      toast.success('Post created successfully!');
      navigate('/home');
      
    } catch (error) {
      console.error('Error in handleCreatePost:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };
  
  return (
    <div className="container mx-auto py-8">
      <Card className="w-full max-w-2xl mx-auto shadow-md rounded-lg">
        <CardHeader className="py-4">
          <CardTitle className="text-2xl font-bold text-center">Create a New Post</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full rounded-md border-gray-200 shadow-sm focus:border-eduBlue focus:ring-eduBlue"
          />
          
          <div>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              id="fileInput"
              className="hidden"
            />
            <label htmlFor="fileInput">
              <Button variant="secondary" asChild>
                <span>
                  Upload Files
                </span>
              </Button>
            </label>
            
            {files.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-500">Selected Files:</p>
                <ul>
                  {files.map((file, index) => (
                    <li key={index} className="text-sm text-gray-700">{file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between items-center py-4">
          <Button variant="ghost" onClick={() => navigate('/home')}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreatePost} 
            disabled={uploading}
          >
            {uploading ? 'Creating...' : 'Post'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CreatePost;

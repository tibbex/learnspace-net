
export type FileType = 'document' | 'image' | 'video' | 'audio';

export interface PostFile {
  type: FileType;
  name: string;
  size: string;
  url: string;
}

export interface Post {
  id: string;
  user_id: string;
  content: string;
  files: PostFile[];
  created_at: string;
  updated_at: string;
  user?: {
    name: string;
    role: string;
  };
}

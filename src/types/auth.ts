
export type UserRole = 'student' | 'teacher' | 'school';

export interface BaseUserData {
  name: string;
  phone: string;
  location: string;
}

export interface StudentData extends BaseUserData {
  role: 'student';
  school: string;
  age: number;
  grade: string;
}

export interface TeacherData extends BaseUserData {
  role: 'teacher';
  teachingSchool: string;
  teachingGrades: string[];
}

export interface SchoolData extends BaseUserData {
  role: 'school';
  ceoName: string;
}

export type UserData = StudentData | TeacherData | SchoolData;

export interface AuthState {
  isAuthenticated: boolean;
  userData: UserData | null;
  rememberMe: boolean;
}

// Post-related types
export interface PostFile {
  type: 'document' | 'image' | 'video' | 'audio';
  name: string;
  size: string;
  url: string;
}

export interface Post {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  files: PostFile[];
  profile?: {
    name: string;
    role: string;
  };
  likes?: number;
  comments?: number;
  shares?: number;
}


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
  isDemo: boolean;
  demoStartTime: number | null;
  rememberMe: boolean;
}

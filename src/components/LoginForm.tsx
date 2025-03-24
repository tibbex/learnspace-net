
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from './AuthContext';
import { UserRole, StudentData, TeacherData, SchoolData } from '@/types/auth';
import { ArrowRightCircle } from 'lucide-react';

const baseSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number.' }),
  location: z.string().min(2, { message: 'Please enter your location.' }),
  rememberMe: z.boolean().default(false),
});

const studentSchema = baseSchema.extend({
  school: z.string().min(2, { message: 'Please enter your school name.' }),
  age: z.coerce.number().min(5, { message: 'Age must be at least 5.' }).max(25, { message: 'Age must be at most 25.' }),
  grade: z.string().min(1, { message: 'Please enter your grade.' }),
});

const teacherSchema = baseSchema.extend({
  teachingSchool: z.string().min(2, { message: 'Please enter your teaching school.' }),
  teachingGrades: z.string().min(1, { message: 'Please enter grades you teach.' }),
});

const schoolSchema = baseSchema.extend({
  ceoName: z.string().min(2, { message: 'Please enter the CEO\'s name.' }),
});

type LoginFormProps = {
  mode: 'login' | 'signup';
};

const LoginForm: React.FC<LoginFormProps> = ({ mode }) => {
  const [userRole, setUserRole] = useState<UserRole>('student');
  const { login } = useAuth();
  const navigate = useNavigate();
  
  // Use different schemas based on the selected role
  const formSchema = 
    userRole === 'student' ? studentSchema :
    userRole === 'teacher' ? teacherSchema :
    schoolSchema;
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phone: '',
      location: '',
      rememberMe: false,
      ...(userRole === 'student' && { 
        school: '',
        age: undefined,
        grade: '',
      }),
      ...(userRole === 'teacher' && {
        teachingSchool: '',
        teachingGrades: '',
      }),
      ...(userRole === 'school' && {
        ceoName: '',
      }),
    },
  });

  // Handle form submission
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (userRole === 'student') {
      const studentData: StudentData = {
        role: 'student',
        name: data.name,
        phone: data.phone,
        location: data.location,
        school: (data as any).school,
        age: (data as any).age,
        grade: (data as any).grade,
      };
      login(studentData, data.rememberMe);
    } else if (userRole === 'teacher') {
      const teacherData: TeacherData = {
        role: 'teacher',
        name: data.name,
        phone: data.phone,
        location: data.location,
        teachingSchool: (data as any).teachingSchool,
        teachingGrades: (data as any).teachingGrades.split(',').map((grade: string) => grade.trim()),
      };
      login(teacherData, data.rememberMe);
    } else {
      const schoolData: SchoolData = {
        role: 'school',
        name: data.name,
        phone: data.phone,
        location: data.location,
        ceoName: (data as any).ceoName,
      };
      login(schoolData, data.rememberMe);
    }
    navigate('/home');
  };

  // Ensure form updates when role changes
  const handleRoleChange = (newRole: UserRole) => {
    setUserRole(newRole);
    form.reset({
      name: form.getValues('name'),
      phone: form.getValues('phone'),
      location: form.getValues('location'),
      rememberMe: form.getValues('rememberMe'),
    });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="glass-panel shadow-xl border-0 overflow-hidden animate-fadeIn">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-2xl font-bold text-center gradient-text">
            {mode === 'login' ? 'Welcome Back to EduHub' : 'Join EduHub Today'}
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            {mode === 'login' 
              ? 'Sign in to continue your learning journey'
              : 'Create an account to get started'}
          </CardDescription>
        </CardHeader>
        <Tabs defaultValue="student" className="w-full" value={userRole} onValueChange={(value) => handleRoleChange(value as UserRole)}>
          <TabsList className="grid grid-cols-3 w-[90%] mx-auto mb-4">
            <TabsTrigger value="student" className="rounded-lg">Student</TabsTrigger>
            <TabsTrigger value="teacher" className="rounded-lg">Teacher</TabsTrigger>
            <TabsTrigger value="school" className="rounded-lg">School</TabsTrigger>
          </TabsList>
          
          <CardContent className="pt-0">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} className="rounded-lg" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your phone number" {...field} className="rounded-lg" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your city/location" {...field} className="rounded-lg" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <TabsContent value="student" className="mt-0 p-0">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="school"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>School</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your school name" {...field} className="rounded-lg" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Enter your age" {...field} className="rounded-lg" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="grade"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Grade/Year</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your grade/year" {...field} className="rounded-lg" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="teacher" className="mt-0 p-0">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="teachingSchool"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Teaching School</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your teaching school" {...field} className="rounded-lg" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="teachingGrades"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Teaching Grades</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter grades (e.g., 9,10,11)" {...field} className="rounded-lg" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="school" className="mt-0 p-0">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="ceoName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CEO/Principal Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter CEO/Principal's name" {...field} className="rounded-lg" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
                
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange} 
                          id="rememberMe" 
                          className="data-[state=checked]:bg-eduBlue" 
                        />
                      </FormControl>
                      <FormLabel htmlFor="rememberMe" className="text-sm font-medium leading-none cursor-pointer">
                        Remember me
                      </FormLabel>
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full primary-button mt-6"
                >
                  {mode === 'login' ? 'Sign In' : 'Sign Up'}
                  <ArrowRightCircle className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </Form>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                {mode === 'login' 
                  ? "Don't have an account? " 
                  : "Already have an account? "}
                <a 
                  href={mode === 'login' ? '/signup' : '/login'} 
                  className="text-eduBlue hover:underline font-medium"
                >
                  {mode === 'login' ? 'Sign Up' : 'Sign In'}
                </a>
              </p>
            </div>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default LoginForm;


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
import { UserRole } from '@/types/auth';
import { ArrowRightCircle, Clock, Eye, EyeOff } from 'lucide-react';

const passwordSchema = z.string().min(6, { message: 'Password must be at least 6 characters.' });

const baseSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number.' }),
  location: z.string().min(2, { message: 'Please enter your location.' }),
  password: passwordSchema,
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
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, startDemo, signup } = useAuth();
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
      password: '',
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
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      if (userRole === 'student') {
        const studentData = {
          role: userRole,
          name: data.name,
          phone: data.phone,
          location: data.location,
          school: (data as any).school,
          age: (data as any).age,
          grade: (data as any).grade,
        };
        
        if (mode === 'signup') {
          await signup(studentData, data.password, data.rememberMe);
        } else {
          await login(studentData, data.rememberMe, data.password);
        }
      } else if (userRole === 'teacher') {
        const teacherData = {
          role: userRole,
          name: data.name,
          phone: data.phone,
          location: data.location,
          teachingSchool: (data as any).teachingSchool,
          teachingGrades: (data as any).teachingGrades.split(',').map((grade: string) => grade.trim()),
        };
        
        if (mode === 'signup') {
          await signup(teacherData, data.password, data.rememberMe);
        } else {
          await login(teacherData, data.rememberMe, data.password);
        }
      } else if (userRole === 'school') {
        const schoolData = {
          role: userRole,
          name: data.name,
          phone: data.phone,
          location: data.location,
          ceoName: (data as any).ceoName,
        };
        
        if (mode === 'signup') {
          await signup(schoolData, data.password, data.rememberMe);
        } else {
          await login(schoolData, data.rememberMe, data.password);
        }
      }
      
      navigate('/home');
    } catch (error) {
      console.error('Authentication error:', error);
      // Error is already shown by the auth context
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoMode = () => {
    startDemo();
    navigate('/home');
  };

  // Ensure form updates when role changes
  const handleRoleChange = (newRole: UserRole) => {
    setUserRole(newRole);
    form.reset({
      name: form.getValues('name'),
      phone: form.getValues('phone'),
      location: form.getValues('location'),
      password: form.getValues('password'),
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
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Enter your password" 
                            {...field} 
                            className="rounded-lg pr-10" 
                          />
                        </FormControl>
                        <button 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
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
                  disabled={isLoading}
                >
                  {isLoading 
                    ? 'Processing...' 
                    : mode === 'login' 
                      ? 'Sign In' 
                      : 'Sign Up'
                  }
                  {!isLoading && <ArrowRightCircle className="ml-2 h-5 w-5" />}
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
        
        <CardFooter className="flex flex-col">
          <div className="relative w-full pt-2 pb-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-2 text-xs text-muted-foreground">OR</span>
            </div>
          </div>
          
          <Button
            variant="outline"
            onClick={handleDemoMode}
            className="w-full flex items-center justify-center space-x-2 border-eduTeal text-eduTeal hover:bg-eduTeal/10"
          >
            <Clock className="h-4 w-4" />
            <span>Try Demo Mode (10 minutes)</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginForm;

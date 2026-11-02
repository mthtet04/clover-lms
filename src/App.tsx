import  { useState, useEffect } from 'react';
import { BookOpen, LogOut } from 'lucide-react';
import { AuthScreen } from './components/AuthScreen';
import { InstructorDashboard } from './components/InstructorDashboard';
import { StudentDashboard } from './components/StudentDashboard';
import { authService } from './services/authService';
import { courseService } from './services/courseService';
import { assignmentService } from './services/assignmentService';
import type { User, Course, Assignment, Lecture, Enrollment, Submission } from './types';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
useEffect(() => {
    if (!currentUser) return;

    const loadBackendData = async () => {
      setIsLoading(true);
      try {
        // 1. Fetch available courses first
        const fetchedCourses = await courseService.getCourses();
        setCourses(fetchedCourses);

        // 2. Fetch nested data based on available courses
        const lecturePromises = fetchedCourses.map(c => courseService.getLectures(c.course_id));
        const assignmentPromises = fetchedCourses.map(c => assignmentService.getAssignmentsByCourse(c.course_id));

        const allLectures = (await Promise.all(lecturePromises)).flat();
        const allAssignments = (await Promise.all(assignmentPromises)).flat();

        setLectures(allLectures);
        setAssignments(allAssignments);
        
        // 3. Initialize local state arrays for features not yet in backend
        setEnrollments([]);
        setSubmissions([]);
      } catch (err: any) {
        console.error('Failed to load application data:', err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadBackendData();
  }, [currentUser]);
  const handleLogin = async (username: string, password: string, mode: string) => {
    try {
      const user = await authService.login(username, password, mode);
      setCurrentUser(user);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const handleSignup = async (userData: { username: string; password?: string; name: string }) => {
    try {
      const user = await authService.register(userData);
      setCurrentUser(user);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleEnroll = async (courseId: string) => {
    if (!currentUser) return;
    try {
      const newEnrollment = await courseService.enrollCourse(currentUser.id, courseId);
      setEnrollments(prev => [...prev, newEnrollment]);
    } catch (err: any) {
      alert(`Enrollment failed: ${err.message}`);
    }
  };

  const handleAddAssignment = async (data: Omit<Assignment, 'assignment_id'>) => {
    try {
      const created = await assignmentService.createAssignment(data);
      setAssignments(prev => [...prev, created]);
    } catch (err: any) {
      alert(`Could not create assignment: ${err.message}`);
    }
  };

  const handleSubmitAssignment = async (data: Omit<Submission, 'submission_id' | 'submitted_date' | 'status' | 'marks' | 'feedback'>) => {
    try {
      const submission = await assignmentService.submitAssignment(data);
      setSubmissions(prev => [...prev, submission]);
    } catch (err: any) {
      alert(`Submission failed: ${err.message}`);
    }
  };

  const handleGradeSubmission = async (submissionId: string, marks: number, feedback: string) => {
    try {
      const existing = submissions.find(s => s.submission_id === submissionId);
      if (!existing) return;
      
      const updated = await assignmentService.gradeSubmission(submissionId, marks, feedback);
      setSubmissions(prev => prev.map(s => s.submission_id === submissionId ? { ...existing, ...updated } : s));
    } catch (err: any) {
      alert(`Grading update failed: ${err.message}`);
    }
  };

  if (!currentUser) {
    return <AuthScreen onLogin={handleLogin} onSignup={handleSignup} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-green-100 selection:text-green-900">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-green-600 p-2 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-700 to-emerald-600 tracking-tight">
              CloverLMS
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm font-medium text-gray-500 hidden sm:block">
              Role: <span className="text-green-600 font-bold">{currentUser.type === 'Uni' ? 'University' : currentUser.role === 'instructor' ? 'Instructor' : 'Outside'}</span>
            </div>
            
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold border border-green-200 shadow-sm" title={currentUser.name}>
              {currentUser.name.charAt(0)}
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome, {currentUser.name.split(' ')[0]}!</h1>
          <p className="text-gray-500 mt-2 text-lg">Here is your {currentUser.role.replace('_', ' ')} dashboard.</p>
        </div>

        {currentUser.role === 'instructor' ? (
          <InstructorDashboard 
            user={currentUser}
            courses={courses}
            assignments={assignments}
            submissions={submissions}
            lectures={lectures}
            onAddAssignment={handleAddAssignment}
            onGrade={handleGradeSubmission}
          />
        ) : (
          <StudentDashboard 
            user={currentUser} 
            courses={courses} 
            enrollments={enrollments}
            assignments={assignments}
            submissions={submissions}
            lectures={lectures}
            onEnroll={handleEnroll}
            onSubmit={handleSubmitAssignment}
          />
        )}
      </main>
    </div>
  );
}
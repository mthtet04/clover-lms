export interface User {
  id: string; // or student_id / instructor_id depending on your auth mapping
  username: string;
  name: string;
  role: string;
  type?: string; 
  courses?: string[]; // NEW: Added to support the JSON array of bought course IDs
}

export interface Course {
  course_id: string;
  course_name: string;
  description: string;
  instructor_id: string;
  price?: number;
}

export interface Lecture {
  lecture_id: string;
  course_id: string;
  title: string;
  content_url: string;
}

export interface Assignment {
  assignment_id: string;
  course_id: string;
  title: string;
  description: string;
  due_date: string;
  total_marks: number; // NEW: Added to match database schema
}

export interface Enrollment {
  enrollment_id: string;
  student_id: string;
  course_id: string;
  // removed enrollment_date to fix the previous strict type error
}

export interface Submission {
  submission_id: string;
  assignment_id: string;
  course_id: string;   // Added to fix missing property error
  student_id: string;
  file_path: string;   // Added to fix missing property error
  status: 'Submitted' | 'Graded';
  submitted_date: string;
  marks: number;       // Added to fix missing property error
  feedback: string;    // Added to fix missing property error
}
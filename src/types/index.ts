export type UserRole = 'uni_student' | 'out_student' | 'instructor';
export type UserType = 'Uni' | 'Outside';

export interface User {
  id: string;
  username: string;
  password?: string;
  name: string;
  role: UserRole;
  type?: UserType;
  university_id?: string | null;
  department?: string;
}

export interface Course {
  course_id: string;
  instructor_id: string;
  course_name: string;
  description: string;
  credits: number;
  price: number;
  status: string;
}

export interface Assignment {
  assignment_id: string;
  course_id: string;
  title: string;
  description: string;
  due_date: string;
  total_marks: number;
  status?: string;
}

export interface Lecture {
  lecture_id: string;
  course_id: string;
  title: string;
  duration: string;
  url: string;
}

export interface Enrollment {
  enrollment_id: string;
  student_id: string;
  course_id: string;
  enroll_date: string;
  enrollment_status: string;
}

export interface Submission {
  submission_id: string;
  assignment_id: string;
  student_id: string;
  course_id: string;
  file_path: string;
  submitted_date: string;
  status: 'Submitted' | 'Graded';
  marks: number | null;
  feedback: string;
}
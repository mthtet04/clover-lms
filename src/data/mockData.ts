import type { User, Course, Assignment, Lecture } from '../types';

export const INITIAL_USERS: User[] = [
  { id: 'u1', username: 'uni_alice',  name: 'Alice (Uni Student)', role: 'uni_student', type: 'Uni',  },
  { id: 'u2', username: 'out_bob',  name: 'Bob (Outside Student)', role: 'out_student', type: 'Outside',  },
  { id: 'i1', username: 'prof_smith',  name: 'Prof. Smith', role: 'instructor',  }
];

export const INITIAL_COURSES: Course[] = [
  { course_id: 'c1', instructor_id: 'i1', course_name: 'Intro to React', description: 'Learn the basics of React and Hooks.', price: 150,  },
  { course_id: 'c2', instructor_id: 'i1', course_name: 'Database Design', description: 'Master ERDs and SQL.', price: 200,  }
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  { assignment_id: 'a1', course_id: 'c1', title: 'React Hooks Project', description: 'Build a custom hook to manage local storage.', due_date: '2026-11-15', total_marks: 100 },
  { assignment_id: 'a2', course_id: 'c2', title: 'Design an ERD', description: 'Create an ERD for an online LMS.', due_date: '2026-11-20', total_marks: 50 }
];

export const INITIAL_LECTURES: Lecture[] = [
  { lecture_id: 'l1', course_id: 'c1', title: '1. Introduction to React',  content_url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { lecture_id: 'l2', course_id: 'c1', title: '2. State and Props',  content_url: 'https://www.w3schools.com/html/mov_bbb.mp4' }
];
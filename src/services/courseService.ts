import { apiFetch } from './api';
import type { Course, Enrollment, Lecture } from '../types';

export const courseService = {
  getCourses: async (): Promise<Course[]> => {
    return apiFetch<Course[]>('/courses');
  },

  getLectures: async (courseId: string): Promise<Lecture[]> => {
    return apiFetch<Lecture[]>(`/courses/${courseId}/lectures`);
  },

  getEnrollments: async (): Promise<Enrollment[]> => {
    return [];
  },

  enrollCourse: async (studentId: string, courseId: string): Promise<Enrollment> => {
    return {
      enrollment_id: 'e_' + Date.now(),
      student_id: studentId,
      course_id: courseId
    } as Enrollment; 
  },
};
import { apiFetch } from './api';
import type { Assignment, Submission } from '../types';

export const assignmentService = {
  getAssignmentsByCourse: async (courseId: string): Promise<Assignment[]> => {
    return apiFetch<Assignment[]>(`/courses/${courseId}/assignments`);
  },

  createAssignment: async (assignmentData: Omit<Assignment, 'assignment_id'>): Promise<Assignment> => {
    return { assignment_id: 'a_' + Date.now(), ...assignmentData } as Assignment;
  },

  getSubmissions: async (): Promise<Submission[]> => {
    return [];
  },

  submitAssignment: async (submissionData: Omit<Submission, 'submission_id' | 'submitted_date' | 'status' | 'marks' | 'feedback'>): Promise<Submission> => {
    return {
      submission_id: 's_' + Date.now(),
      submitted_date: new Date().toISOString(),
      status: 'Submitted',
      marks: 0,
      feedback: '',
      ...submissionData
    } as Submission;
  },

  gradeSubmission: async (submissionId: string, marks: number, feedback: string): Promise<Submission> => {
    return {
      submission_id: submissionId,
      assignment_id: '', 
      course_id: '',
      student_id: '',
      file_path: '',
      status: 'Graded',
      submitted_date: new Date().toISOString(),
      marks,
      feedback
    } as Submission;
  },
};
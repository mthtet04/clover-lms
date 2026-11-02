import { apiFetch } from './api';
import type { User } from '../types';

export const authService = {
  login: async (username: string, password: string, role: string): Promise<User> => {
    const response = await apiFetch<{ user: any }>('/login', {
      method: 'POST',
      body: JSON.stringify({ username, password, role }),
    });

    const rawUser = response.user;

    // Map database primary keys to generic `id` to prevent undefined query parameters
    const user: User = {
      ...rawUser,
      id: rawUser.id || rawUser.student_id || rawUser.instructor_id || rawUser.user_id,
    };

    // Enforce portal role compatibility check
    if (role === 'uni_student' && user.role !== 'uni_student') {
      throw new Error('Access denied. Use the Uni Student portal.');
    }
    if (role === 'instructor' && user.role !== 'instructor') {
      throw new Error('Access denied. Use the Instructor portal.');
    }
    if (role === 'out_login' && user.role !== 'out_student') {
      throw new Error('Access denied. Use the Outside Student portal.');
    }

    return user;
  },

  register: async (userData: { username: string; password?: string; name: string }): Promise<User> => {
    const response = await apiFetch<{ user: any }>('/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    const rawUser = response.user;
    
    return {
      ...rawUser,
      id: rawUser.id || rawUser.student_id || rawUser.instructor_id || rawUser.user_id,
    };
  },
};
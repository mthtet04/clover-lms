import React, { useState } from 'react';
import { BookOpen, User, Lock, LogIn, UserPlus } from 'lucide-react';

interface AuthScreenProps {
  onLogin: (u: string, p: string, mode: string) => Promise<{ success: boolean; error?: string }>;
  onSignup: (data: { username: string; password: string; name: string }) => Promise<{ success: boolean; error?: string }>;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, onSignup }) => {
  const [authMode, setAuthMode] = useState<'uni_student' | 'instructor' | 'out_login' | 'out_signup'>('uni_student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      if (authMode === 'out_signup') {
        const response = await onSignup({ username, password, name });
        if (!response.success) setError(response.error || 'Signup failed.');
      } else {
        const response = await onLogin(username, password, authMode);
        if (!response.success) setError(response.error || 'Login failed.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-green-600 p-3 rounded-2xl shadow-lg">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-green-700 to-emerald-600">
          CloverLMS Portal
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Online Learning Management System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-gray-100">
          
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8">
            <button
              onClick={() => { setAuthMode('uni_student'); setError(''); }}
              className={`flex-1 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors ${authMode === 'uni_student' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Uni Student
            </button>
            <button
              onClick={() => { setAuthMode('instructor'); setError(''); }}
              className={`flex-1 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors ${authMode === 'instructor' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Instructor
            </button>
            <button
              onClick={() => { setAuthMode('out_login'); setError(''); }}
              className={`flex-1 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors ${(authMode === 'out_login' || authMode === 'out_signup') ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Outside Student
            </button>
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-6 text-center">
            {authMode === 'uni_student' ? 'University Student Login' : 
             authMode === 'instructor' ? 'Instructor Login' : 
             authMode === 'out_login' ? 'Outside Student Login' : 
             'Create Outside Account'}
          </h3>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {authMode === 'out_signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 w-full border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-green-500 focus:border-green-500 border outline-none"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 w-full border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-green-500 focus:border-green-500 border outline-none"
                  placeholder="Enter username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 w-full border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-green-500 focus:border-green-500 border outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-70"
            >
              {authMode === 'out_signup' ? (
                <><UserPlus className="w-5 h-5 mr-2"/> Sign Up</>
              ) : (
                <><LogIn className="w-5 h-5 mr-2"/> Sign In</>
              )}
            </button>
          </form>

          {(authMode === 'out_login' || authMode === 'out_signup') && (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    {authMode === 'out_login' ? 'New outside student?' : 'Already have an account?'}
                  </span>
                </div>
              </div>
              <div className="mt-6">
                <button
                  onClick={() => {
                    setAuthMode(authMode === 'out_login' ? 'out_signup' : 'out_login');
                    setError('');
                  }}
                  className="w-full flex justify-center py-2 px-4 border border-green-300 rounded-lg shadow-sm text-sm font-medium text-green-700 bg-white hover:bg-green-50 transition-colors"
                >
                  {authMode === 'out_login' ? 'Create a Personal Account' : 'Sign in to Personal Account'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
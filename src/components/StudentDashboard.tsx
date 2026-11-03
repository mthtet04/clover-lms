import React, { useState } from 'react';
import { Book, PlayCircle, FileText, CheckCircle } from 'lucide-react';
import type { User, Course, Enrollment, Lecture, Assignment, Submission } from '../types';

interface StudentDashboardProps {
  user: User;
  courses: Course[];
  enrollments: Enrollment[];
  lectures: Lecture[];
  assignments: Assignment[];
  submissions: Submission[];
  onEnroll: (courseId: string) => void;
  onSubmit: (data: Omit<Submission, 'submission_id' | 'submitted_date' | 'status' | 'marks' | 'feedback'>) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  user,
  courses,
  enrollments,
  lectures,
  assignments,
  submissions,
  onEnroll,
  onSubmit
}) => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const renderCourseContent = (course: Course) => {
    const courseLectures = lectures.filter(l => l.course_id === course.course_id);
    const courseAssignments = assignments.filter(a => a.course_id === course.course_id);

    return (
      <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <button 
          onClick={() => setSelectedCourse(null)}
          className="text-green-600 font-medium mb-4 hover:underline"
        >
          &larr; Back to Courses
        </button>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{course.course_name} - Materials</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold flex items-center mb-4 text-gray-700">
              <PlayCircle className="w-5 h-5 mr-2 text-green-600" /> Lectures
            </h3>
            {courseLectures.length === 0 ? <p className="text-gray-500 text-sm">No lectures posted yet.</p> : (
              <ul className="space-y-3">
                {courseLectures.map(lecture => (
                  <li key={lecture.lecture_id} className="p-3 bg-gray-50 rounded border border-gray-100 flex justify-between items-center">
                    <span className="font-medium text-gray-800">{lecture.title}</span>
                    <a href={lecture.content_url} target="_blank" rel="noreferrer" className="text-sm text-green-600 hover:underline">Watch</a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold flex items-center mb-4 text-gray-700">
              <FileText className="w-5 h-5 mr-2 text-blue-600" /> Assignments
            </h3>
            {courseAssignments.length === 0 ? <p className="text-gray-500 text-sm">No assignments posted yet.</p> : (
              <ul className="space-y-3">
                {courseAssignments.map(assignment => {
                  const submission = submissions.find(s => s.assignment_id === assignment.assignment_id);
                  return (
                    <li key={assignment.assignment_id} className="p-4 bg-gray-50 rounded border border-gray-100">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-medium text-gray-800 block">{assignment.title}</span>
                          <span className="text-xs text-gray-500">Due: {new Date(assignment.due_date).toLocaleDateString()} | Marks: {assignment.total_marks}</span>
                        </div>
                        {submission ? (
                          <span className="inline-flex items-center text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded">
                            <CheckCircle className="w-3 h-3 mr-1" /> {submission.status}
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-xs font-semibold text-yellow-700 bg-yellow-100 px-2 py-1 rounded">
                            Pending
                          </span>
                        )}
                      </div>
                      {!submission && (
                        <button 
                          onClick={() => onSubmit({ assignment_id: assignment.assignment_id, course_id: course.course_id, student_id: user.id, file_path: 'mock_submission.pdf' })}
                          className="mt-2 text-sm bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700"
                        >
                          Submit Mock File
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (selectedCourse) {
    return renderCourseContent(selectedCourse);
  }
  return (
    <div>
      <div className="mb-6 flex items-center space-x-2">
        <Book className="w-6 h-6 text-gray-600" />
        <h2 className="text-xl font-semibold text-gray-800">Available Courses</h2>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500">No courses available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => {
            const isEnrolled = enrollments.some(e => e.course_id === course.course_id);
            
            return (
              <div key={course.course_id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{course.course_name}</h3>
                <p className="text-sm text-gray-600 mb-4 flex-grow line-clamp-3">{course.description}</p>
                
                {isEnrolled ? (
                  <button 
                    onClick={() => setSelectedCourse(course)}
                    className="w-full bg-gray-900 text-white py-2 rounded font-medium hover:bg-gray-800 transition-colors"
                  >
                    View Materials
                  </button>
                ) : (
                  <button 
                    onClick={() => onEnroll(course.course_id)}
                    className="w-full bg-green-600 text-white py-2 rounded font-medium hover:bg-green-700 transition-colors"
                  >
                    Enroll Now
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
import React, { useState } from 'react';
import { Plus, Video, PlayCircle, FileText, CheckCircle, X, BookOpen } from 'lucide-react';
import type { User, Course, Assignment, Submission, Lecture } from '../types';

interface InstructorProps {
  user: User;
  courses: Course[];
  assignments: Assignment[];
  submissions: Submission[];
  lectures: Lecture[];
  onAddAssignment: (data: Omit<Assignment, 'assignment_id'>) => void;
  onGrade: (submissionId: string, marks: number, feedback: string) => void;
}

export const InstructorDashboard: React.FC<InstructorProps> = ({ user, courses, assignments, submissions, lectures, onAddAssignment, onGrade }) => {
  const myCourses = courses.filter(c => c.instructor_id === user.id);
  const [selectedCourse, setSelectedCourse] = useState<string | undefined>(myCourses[0]?.course_id);
  const [showAddModal, setShowAddModal] = useState(false);

  const courseAssignments = assignments.filter(a => a.course_id === selectedCourse);
  const courseLectures = lectures.filter(l => l.course_id === selectedCourse);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 self-start">
        <h3 className="font-bold text-gray-800 mb-4 px-2 uppercase text-xs tracking-wider">My Courses</h3>
        <div className="space-y-2">
          {myCourses.map(course => (
            <button
              key={course.course_id}
              onClick={() => setSelectedCourse(course.course_id)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                selectedCourse === course.course_id 
                  ? 'bg-green-50 text-green-700 font-semibold shadow-sm border border-green-100' 
                  : 'text-gray-600 hover:bg-gray-50 border border-transparent'
              }`}
            >
              {course.course_name}
            </button>
          ))}
        </div>
      </div>

      <div className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[600px]">
        {selectedCourse ? (
          <div>
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800">Course Management</h2>
              <button 
                onClick={() => setShowAddModal(true)}
                className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-sm text-sm font-medium"
              >
                <Plus className="w-4 h-4 mr-2" /> New Assignment
              </button>
            </div>

            <div className="mb-10">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <Video className="w-5 h-5 mr-2 text-green-500" /> Uploaded Lectures
              </h3>
              {courseLectures.length === 0 ? (
                <div className="text-sm text-gray-500 italic bg-gray-50 p-4 rounded-lg border border-dashed border-gray-200">No lectures uploaded yet.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {courseLectures.map(lecture => (
                    <div key={lecture.lecture_id} className="border border-gray-200 rounded-xl p-4 flex items-center bg-white hover:border-green-300 transition-colors shadow-sm">
                      <div className="bg-green-50 p-2 rounded-full mr-4">
                        <PlayCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-800 text-sm">{lecture.title}</div>
                        {/* <div className="text-xs text-gray-500 mt-0.5">Duration: {lecture.duration}</div> */}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-green-500" /> Assignments & Submissions
              </h3>

              {courseAssignments.length === 0 ? (
                <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  No assignments created yet. Click "New Assignment" to start.
                </div>
              ) : (
                <div className="space-y-6">
                  {courseAssignments.map(assignment => {
                    const assignmentSubmissions = submissions.filter(s => s.assignment_id === assignment.assignment_id);
                    return (
                      <div key={assignment.assignment_id} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="bg-gray-50 px-5 py-4 border-b border-gray-200 flex justify-between items-center">
                          <div>
                            <h4 className="font-bold text-gray-900">{assignment.title}</h4>
                            <p className="text-sm text-gray-500 mt-1">Due: {assignment.due_date} | Total Marks: {assignment.total_marks}</p>
                          </div>
                          <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                            {assignmentSubmissions.length} Submissions
                          </span>
                        </div>
                        
                        <div className="p-0">
                          {assignmentSubmissions.length === 0 ? (
                            <div className="p-5 text-sm text-gray-500 text-center italic">No submissions yet.</div>
                          ) : (
                            <ul className="divide-y divide-gray-100">
                              {assignmentSubmissions.map(sub => (
                                <li key={sub.submission_id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                                  <div>
                                    <div className="font-medium text-gray-900 flex items-center">
                                      Student ID: {sub.student_id}
                                      {sub.status === 'Graded' && <CheckCircle className="w-4 h-4 ml-2 text-green-500"/>}
                                    </div>
                                    <div className="text-sm text-gray-500 mt-1">Submitted: {sub.submitted_date}</div>
                                    <div className="text-sm text-green-600 mt-1 flex items-center">
                                      <FileText className="w-3 h-3 mr-1"/> {sub.file_path}
                                    </div>
                                  </div>
                                  
                                  {sub.status === 'Graded' ? (
                                    <div className="text-right bg-green-50 p-3 rounded-lg border border-green-100">
                                      <div className="font-bold text-green-700">{sub.marks} / {assignment.total_marks}</div>
                                      <div className="text-xs text-green-600 mt-1 max-w-[200px] truncate" title={sub.feedback}>"{sub.feedback}"</div>
                                    </div>
                                  ) : (
                                    <GradeForm 
                                      submission={sub} 
                                      maxMarks={assignment.total_marks} 
                                      onGrade={onGrade} 
                                    />
                                  )}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400 flex-col">
            <BookOpen className="w-16 h-16 mb-4 text-gray-300" />
            <p>Select a course from the sidebar to manage it.</p>
          </div>
        )}
      </div>

      {showAddModal && selectedCourse && (
        <AddAssignmentModal 
          courseId={selectedCourse} 
          onClose={() => setShowAddModal(false)}
          onAdd={onAddAssignment}
        />
      )}
    </div>
  );
};

const GradeForm: React.FC<{ submission: Submission; maxMarks: number; onGrade: (id: string, marks: number, feedback: string) => void }> = ({ submission, maxMarks, onGrade }) => {
  const [marks, setMarks] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(marks && feedback) {
      onGrade(submission.submission_id, Number(marks), feedback);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 items-end sm:items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
      <div>
        <input 
          type="number" 
          placeholder={`Marks (/${maxMarks})`}
          className="w-28 text-sm border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
          value={marks}
          max={maxMarks}
          min="0"
          onChange={e => setMarks(e.target.value)}
          required
        />
      </div>
      <div className="flex-grow w-full sm:w-auto">
        <input 
          type="text" 
          placeholder="Feedback..."
          className="w-full text-sm border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
          value={feedback}
          onChange={e => setFeedback(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors w-full sm:w-auto whitespace-nowrap shadow-sm">
        Submit Grade
      </button>
    </form>
  );
};

const AddAssignmentModal: React.FC<{ courseId: string; onClose: () => void; onAdd: (data: Omit<Assignment, 'assignment_id'>) => void }> = ({ courseId, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [marks, setMarks] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      course_id: courseId,
      title,
      description,
      due_date: dueDate,
      total_marks: parseInt(marks, 10),
      // status: 'Active'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Create Assignment</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-green-500 focus:border-green-500 border" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea required value={description} onChange={e => setDescription(e.target.value)} className="w-full border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-green-500 focus:border-green-500 border" rows={3}></textarea>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input type="date" required value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-green-500 focus:border-green-500 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Marks</label>
              <input type="number" required value={marks} onChange={e => setMarks(e.target.value)} className="w-full border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-green-500 focus:border-green-500 border" />
            </div>
          </div>
          <div className="pt-4 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium">Cancel</button>
            <button type="submit" className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors shadow-sm font-medium">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
};
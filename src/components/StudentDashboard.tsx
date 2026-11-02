import React, { useState } from 'react';
import { BookOpen, Briefcase, Lock, DollarSign, GraduationCap, Video, PlayCircle, FileText, CheckCircle, Upload, CreditCard } from 'lucide-react';
import type { User, Course, Assignment, Submission, Lecture, Enrollment } from '../types';

interface StudentProps {
  user: User;
  courses: Course[];
  enrollments: Enrollment[];
  assignments: Assignment[];
  submissions: Submission[];
  lectures: Lecture[];
  onEnroll: (courseId: string) => void;
  onSubmit: (data: Omit<Submission, 'submission_id' | 'submitted_date' | 'status' | 'marks' | 'feedback'>) => void;
}

export const StudentDashboard: React.FC<StudentProps> = ({ user, courses, enrollments, assignments, submissions, lectures, onEnroll, onSubmit }) => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'my_courses'>('catalog');
  const [paymentCourse, setPaymentCourse] = useState<Course | null>(null);

  const myEnrolledCourseIds = enrollments.filter(e => e.student_id === user.id).map(e => e.course_id);
  const myCourses = courses.filter(c => myEnrolledCourseIds.includes(c.course_id));
  const availableCourses = courses.filter(c => !myEnrolledCourseIds.includes(c.course_id));

  const handleEnrollClick = (course: Course) => {
    if (user.type === 'Uni') {
      onEnroll(course.course_id);
      setActiveTab('my_courses');
    } else {
      setPaymentCourse(course);
    }
  };

  const handlePaymentSuccess = (courseId: string) => {
    onEnroll(courseId);
    setPaymentCourse(null);
    setActiveTab('my_courses');
  };

  return (
    <div>
      <div className="flex space-x-1 bg-gray-200/50 p-1 rounded-xl w-max mb-8">
        <button 
          onClick={() => setActiveTab('catalog')} 
          className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'catalog' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
        >
          Course Catalog
        </button>
        <button 
          onClick={() => setActiveTab('my_courses')} 
          className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'my_courses' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
        >
          My Learning ({myCourses.length})
        </button>
      </div>

      {activeTab === 'catalog' && (
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-green-600" /> Available Courses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableCourses.length === 0 ? (
              <div className="col-span-full py-12 text-center text-gray-500 bg-white border border-gray-200 rounded-2xl border-dashed">
                No new courses available to enroll.
              </div>
            ) : (
              availableCourses.map(course => (
                <div key={course.course_id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
                    <h3 className="px-6 pt-6 text-xl font-bold leading-tight">{course.course_name}</h3>
                  <div className="p-6">
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                    <div className="flex justify-between items-center text-sm mb-6">
                      <span className="flex items-center text-gray-500 bg-gray-50 px-2 py-1 rounded"><Briefcase className="w-4 h-4 mr-1"/> {course.credits} Credits</span>
                      <span className="flex items-center font-bold text-gray-900 bg-green-50 text-green-700 px-2 py-1 rounded">
                        {user.type === 'Uni' ? 'Free (Uni)' : <><DollarSign className="w-4 h-4"/>{course.price}</>}
                      </span>
                    </div>
                    <button 
                      onClick={() => handleEnrollClick(course)}
                      className="w-full bg-green-600 text-white font-medium py-2.5 rounded-xl hover:bg-green-700 transition-colors shadow-sm flex justify-center items-center"
                    >
                      {user.type === 'Uni' ? 'Enroll Now' : <><Lock className="w-4 h-4 mr-2"/> Pay & Enroll</>}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'my_courses' && (
        <div className="space-y-8">
          {myCourses.length === 0 ? (
            <div className="text-center py-20 bg-white border border-dashed rounded-2xl text-gray-500">
              <GraduationCap className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">You haven't enrolled in any courses yet.</p>
              <button onClick={() => setActiveTab('catalog')} className="mt-4 text-green-600 font-medium hover:underline">Browse Catalog</button>
            </div>
          ) : (
            myCourses.map(course => (
              <StudentCourseDetail 
                key={course.course_id} 
                user={user} 
                course={course} 
                assignments={assignments.filter(a => a.course_id === course.course_id)}
                submissions={submissions}
                lectures={lectures.filter(l => l.course_id === course.course_id)}
                onSubmit={onSubmit}
              />
            ))
          )}
        </div>
      )}

      {paymentCourse && (
        <PaymentModal 
          course={paymentCourse} 
          onClose={() => setPaymentCourse(null)} 
          onSuccess={() => handlePaymentSuccess(paymentCourse.course_id)} 
        />
      )}
    </div>
  );
};

const StudentCourseDetail: React.FC<{ user: User; course: Course; assignments: Assignment[]; submissions: Submission[]; lectures: Lecture[]; onSubmit: (data: Omit<Submission, 'submission_id' | 'submitted_date' | 'status' | 'marks' | 'feedback'>) => void }> = ({ user, course, assignments, submissions, lectures, onSubmit }) => {
  const [activeDetailTab, setActiveDetailTab] = useState<'lectures' | 'assignments'>('lectures');
  const [activeLecture, setActiveLecture] = useState<Lecture | null>(lectures[0] || null);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-gray-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-end justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4 pointer-events-none">
          <BookOpen className="w-64 h-64" />
        </div>
        <div className="relative z-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold">{course.course_name}</h2>
          <p className="text-gray-300 mt-2 max-w-2xl">{course.description}</p>
        </div>
        <div className="mt-4 sm:mt-0 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm relative z-10 border border-white/20">
          <span className="text-sm font-medium text-gray-200">Instructor ID: {course.instructor_id}</span>
        </div>
      </div>

      <div className="border-b border-gray-200 px-6 flex space-x-8 bg-gray-50 overflow-x-auto">
         <button 
            onClick={() => setActiveDetailTab('lectures')} 
            className={`py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeDetailTab === 'lectures' ? 'border-green-600 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
         >
            <div className="flex items-center"><Video className="w-4 h-4 mr-2"/> Course Lectures</div>
         </button>
         <button 
            onClick={() => setActiveDetailTab('assignments')} 
            className={`py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeDetailTab === 'assignments' ? 'border-green-600 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
         >
            <div className="flex items-center"><FileText className="w-4 h-4 mr-2"/> Assignments</div>
         </button>
      </div>

      <div className="p-6 sm:p-8">
        {activeDetailTab === 'lectures' && (
          <div>
            {lectures.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-xl text-gray-500 border border-dashed border-gray-200">
                <Video className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                <p>No lectures posted for this course yet.</p>
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-grow bg-black rounded-xl overflow-hidden shadow-lg border border-gray-200">
                  {activeLecture ? (
                    <video controls className="w-full aspect-video outline-none" key={activeLecture.lecture_id} poster="https://via.placeholder.com/800x450/111827/16A34A?text=CloverLMS+Lecture+Ready">
                      <source src={activeLecture.url} type="video/mp4" />
                    </video>
                  ) : (
                    <div className="w-full aspect-video flex items-center justify-center text-gray-500 bg-gray-900">Select a lecture to watch</div>
                  )}
                  <div className="p-5 bg-gray-900 text-white border-t border-gray-800">
                    <h3 className="font-bold text-lg">{activeLecture?.title || 'No Lecture Selected'}</h3>
                    <p className="text-gray-400 text-sm mt-1">Duration: {activeLecture?.duration || '--:--'}</p>
                  </div>
                </div>
                <div className="lg:w-1/3 flex-shrink-0">
                  <h4 className="font-bold text-gray-800 mb-4 uppercase text-xs tracking-wider border-b pb-2">Curriculum</h4>
                  <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                    {lectures.map(lecture => (
                      <button 
                        key={lecture.lecture_id}
                        onClick={() => setActiveLecture(lecture)}
                        className={`w-full text-left p-3 rounded-xl border transition-all flex items-start ${
                          activeLecture?.lecture_id === lecture.lecture_id 
                            ? 'bg-green-50 border-green-200 shadow-sm ring-1 ring-green-500 ring-opacity-50' 
                            : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                        }`}
                      >
                        <PlayCircle className={`w-6 h-6 mr-3 mt-0.5 flex-shrink-0 transition-colors ${
                          activeLecture?.lecture_id === lecture.lecture_id ? 'text-green-600' : 'text-gray-400'
                        }`} />
                        <div>
                          <div className={`text-sm font-bold ${
                            activeLecture?.lecture_id === lecture.lecture_id ? 'text-green-900' : 'text-gray-700'
                          }`}>{lecture.title}</div>
                          <div className="text-xs text-gray-500 mt-1 flex items-center">
                            <Video className="w-3 h-3 mr-1"/> {lecture.duration}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeDetailTab === 'assignments' && (
          <div>
            {assignments.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-xl text-gray-500 border border-dashed border-gray-200">
                <FileText className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                <p>No assignments posted for this course yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {assignments.map(assignment => {
                  const mySubmission = submissions.find(s => s.assignment_id === assignment.assignment_id && s.student_id === user.id);
                  return (
                    <div key={assignment.assignment_id} className="border border-gray-200 bg-white rounded-2xl p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-1 h-full bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-lg text-gray-900">{assignment.title}</h3>
                        <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded font-medium whitespace-nowrap ml-2">
                          {assignment.total_marks} Marks
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-6">{assignment.description}</p>
                      
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-500">Due Date:</span>
                          <span className="font-medium text-gray-900">{assignment.due_date}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Status:</span>
                          <span className={`font-medium flex items-center ${mySubmission ? 'text-green-600' : 'text-amber-600'}`}>
                            {mySubmission ? (
                              <><CheckCircle className="w-4 h-4 mr-1" /> Submitted</>
                            ) : 'Pending'}
                          </span>
                        </div>
                      </div>

                      {mySubmission ? (
                        <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                          <div className="text-sm text-green-800 font-medium mb-1">File: {mySubmission.file_path}</div>
                          {mySubmission.status === 'Graded' ? (
                            <div className="mt-3 pt-3 border-t border-green-200">
                              <div className="flex justify-between font-bold text-green-900 mb-1">
                                <span>Grade:</span>
                                <span>{mySubmission.marks} / {assignment.total_marks}</span>
                              </div>
                              <div className="text-sm text-green-700 italic">"{mySubmission.feedback}"</div>
                            </div>
                          ) : (
                            <div className="text-sm text-green-600 mt-2 italic">Awaiting grade from instructor.</div>
                          )}
                        </div>
                      ) : (
                        <SubmitAssignmentBtn assignment={assignment} user={user} onSubmit={onSubmit} />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const SubmitAssignmentBtn: React.FC<{ assignment: Assignment; user: User; onSubmit: (data: Omit<Submission, 'submission_id' | 'submitted_date' | 'status' | 'marks' | 'feedback'>) => void }> = ({ assignment, user, onSubmit }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button 
        onClick={() => setShowModal(true)}
        className="w-full bg-white border-2 border-green-600 text-green-700 font-bold py-2.5 rounded-xl hover:bg-green-50 transition-colors flex justify-center items-center"
      >
        <Upload className="w-4 h-4 mr-2" /> Upload Work
      </button>

      {showModal && (
        <SubmitModal 
          assignment={assignment} 
          user={user} 
          onClose={() => setShowModal(false)} 
          onSubmit={onSubmit} 
        />
      )}
    </>
  );
};

const SubmitModal: React.FC<{ assignment: Assignment; user: User; onClose: () => void; onSubmit: (data: Omit<Submission, 'submission_id' | 'submitted_date' | 'status' | 'marks' | 'feedback'>) => void }> = ({ assignment, user, onClose, onSubmit }) => {
  const [fileName, setFileName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      assignment_id: assignment.assignment_id,
      student_id: user.id,
      course_id: assignment.course_id,
      file_path: fileName || 'assignment_submission.pdf'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl">
        <h3 className="text-xl font-bold mb-2">Submit Assignment</h3>
        <p className="text-gray-500 text-sm mb-6">Upload your work for "{assignment.title}"</p>
        
        <form onSubmit={handleSubmit}>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors mb-6 group cursor-pointer relative">
            <Upload className="w-8 h-8 mx-auto text-gray-400 group-hover:text-green-500 mb-3 transition-colors" />
            <div className="text-sm text-gray-600 font-medium">Click to browse or drag file here</div>
            <div className="text-xs text-gray-400 mt-1">PDF, DOCX, ZIP (Max 10MB)</div>
            <input 
              type="file" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={(e) => setFileName(e.target.files?.[0]?.name || '')}
              required
            />
          </div>
          
          {fileName && (
            <div className="mb-6 p-3 bg-green-50 text-green-700 text-sm rounded-lg flex items-center border border-green-100">
              <FileText className="w-4 h-4 mr-2" /> {fileName}
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium">Cancel</button>
            <button type="submit" className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm">Submit Work</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const PaymentModal: React.FC<{ course: Course; onClose: () => void; onSuccess: () => void }> = ({ course, onClose, onSuccess }) => {
  const [processing, setProcessing] = useState(false);

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      onSuccess();
    }, 1500); 
  };

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
        <div className="bg-gray-900 p-6 text-white text-center">
          <CreditCard className="w-12 h-12 mx-auto text-green-400 mb-3" />
          <h3 className="text-2xl font-bold">Secure Checkout</h3>
          <p className="text-gray-400 text-sm mt-1">Outside Student Enrollment</p>
        </div>
        
        <div className="p-6">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="font-bold text-gray-900">{course.course_name}</div>
                <div className="text-sm text-gray-500">Course ID: {course.course_id}</div>
              </div>
              <div className="font-bold text-lg text-gray-900">${course.price}</div>
            </div>
            <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between items-center font-bold text-lg">
              <span>Total Due</span>
              <span className="text-green-600">${course.price}</span>
            </div>
          </div>

          <button 
            onClick={handlePay} 
            disabled={processing}
            className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition-all flex justify-center items-center shadow-md disabled:opacity-70"
          >
            {processing ? (
              <span className="flex items-center"><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div> Processing...</span>
            ) : (
              `Pay $${course.price} & Enroll`
            )}
          </button>
          
          <button 
            onClick={onClose} 
            disabled={processing}
            className="w-full mt-3 text-gray-500 font-medium py-2 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
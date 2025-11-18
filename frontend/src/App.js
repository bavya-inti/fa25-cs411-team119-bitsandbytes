import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

const API_BASE_URL = 'http://localhost:3001/api';

function App() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/courses`);
      setCourses(response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Failed to fetch courses. Please try again.';
      setError(errorMessage);
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>CS Degree Planner</h1>
      </header>

      <main className="App-main">
        <div className="container">
          {/* Course List */}
          <div className="table-container">
            <div className="table-header">
              <h3>Courses ({courses.length} courses)</h3>
            </div>
            {loading ? (
              <div className="loading-message">Loading courses...</div>
            ) : error ? (
              <div className="no-data-message">{error}</div>
            ) : courses.length === 0 ? (
              <div className="no-data-message">No courses found.</div>
            ) : (
              <table className="courses-table">
                <thead>
                  <tr>
                    <th>Course Code</th>
                    <th>Course Name</th>
                    <th>Credit Hours</th>
                    <th>GPA</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course, index) => (
                    <tr 
                      key={course.course_code || index}
                      className="course-row"
                      onClick={() => navigate(`/course/${course.course_code}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td className="course-code">{course.course_code}</td>
                      <td className="course-name">{course.course_name}</td>
                      <td className="course-credits">
                        {course.credit_hours !== null && course.credit_hours !== undefined 
                          ? course.credit_hours 
                          : 'N/A'}
                      </td>
                      <td className="course-gpa">
                        {course.avg_gpa !== null && course.avg_gpa !== undefined 
                          ? (typeof course.avg_gpa === 'number' ? course.avg_gpa.toFixed(2) : parseFloat(course.avg_gpa).toFixed(2))
                          : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

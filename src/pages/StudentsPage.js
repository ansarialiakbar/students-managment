import React, { useState, useEffect } from "react";
import { db } from "../firebase-config";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import AddStudentModal from "../components/AddStudentModal";
import { FaEye, FaEdit, FaTrash, FaBars } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "../styles/StudentsPage.css";
import Sidebar from "../components/Sidebar"; // Import Sidebar component

const StudentsPage = ({ onLogout }) => {
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [viewStudent, setViewStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Track sidebar state
  const navigate = useNavigate(); // For navigating to login after logout

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const studentCollection = collection(db, "students");
      const snapshot = await getDocs(studentCollection);
      setStudents(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this student?");
    if (confirm) {
      try {
        await deleteDoc(doc(db, "students", id));
        fetchStudents(); // Refresh students list after deletion
      } catch (error) {
        console.error("Error deleting student:", error);
      }
    }
  };

  const handleEdit = (student) => {
    setEditStudent(student);
    setShowModal(true);
  };

  const handleView = (student) => {
    setViewStudent(student);
  };

  // Toggle Sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Handle logout and navigate to login page
  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Remove token
    onLogout(); // Call the parent logout handler
    navigate("/login"); // Navigate to the login page
  };

  return (
    <div className="students-page">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} onLogout={handleLogout} /> {/* Pass toggleSidebar to Sidebar */}

      {/* Hamburger Icon for Sidebar */}
      <button className="hamburger-icon" onClick={toggleSidebar}>
        <FaBars />
      </button>

      <button className="add-student-btn" onClick={() => setShowModal(true)}>
        Add Student
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="students-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Class</th>
              <th>Section</th>
              <th>Roll Number</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.class}</td>
                <td>{student.section}</td>
                <td>{student.rollNumber}</td>
                <td>
                  <div className="action-icons">
                    <FaEye onClick={() => handleView(student)} />
                    <FaEdit onClick={() => handleEdit(student)} />
                    <FaTrash onClick={() => handleDelete(student.id)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && (
        <AddStudentModal
          onClose={() => setShowModal(false)}
          onSave={fetchStudents}
          studentData={editStudent}
        />
      )}

      {viewStudent && (
        <div className="view-student-modal">
          <div>
            {/* Modal Header */}
            <div className="view-student-modal-header">
              <h2>Student Details</h2>
              <button onClick={() => setViewStudent(null)}>Close</button>
            </div>

            {/* Modal Content */}
            <div className="view-student-modal-content">
              <p>
                <strong>ID:</strong> {viewStudent.id}
              </p>
              <p>
                <strong>Name:</strong> {viewStudent.name}
              </p>
              <p>
                <strong>Class:</strong> {viewStudent.class}
              </p>
              <p>
                <strong>Section:</strong> {viewStudent.section}
              </p>
              <p>
                <strong>Roll Number:</strong> {viewStudent.rollNumber}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsPage;

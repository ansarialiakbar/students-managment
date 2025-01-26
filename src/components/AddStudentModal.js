import React, { useState, useEffect } from "react";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase-config";

const AddStudentModal = ({ onClose, onSave, studentData }) => {
  const [formData, setFormData] = useState({
    name: "",
    class: "",
    section: "",
    rollNumber: "",
  });

  useEffect(() => {
    if (studentData) {
      setFormData(studentData); // Pre-fill data for editing
    }
  }, [studentData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (studentData) {
        // Update existing student
        await updateDoc(doc(db, "students", studentData.id), formData);
      } else {
        // Add new student
        const studentCollection = collection(db, "students");
        await addDoc(studentCollection, formData);
      }
      onSave(); // Refresh the list
      onClose(); // Close modal
    } catch (error) {
      console.error("Error saving student:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{studentData ? "Edit Student" : "Add Student"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="class"
            placeholder="Class"
            value={formData.class}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="section"
            placeholder="Section"
            value={formData.section}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="rollNumber"
            placeholder="Roll Number"
            value={formData.rollNumber}
            onChange={handleChange}
            required
          />
          <button type="submit">Save</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddStudentModal;

import React, { useState, useEffect } from "react";
// import client from "../../../api/client";

import StudentForm from "../../components/student/StudentForm";
import client from "../../api/client";
// import TeacherForm from "../../../components/teacher/TeacherForm";
// import "./ProfilePage.css"; // Import the CSS file for styling

const StudentHome = () => {
  const [teacher, setTeacher] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false); // State to manage the TeacherForm

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const teacherId = localStorage.getItem("id");
        const teacherResponse = await client.get(`/api/student/${teacherId}`);
        const teacherData = teacherResponse.data;
        setTeacher(teacherData);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchTeacherData();
  }, []);

  // Function to handle the opening of the TeacherForm in edit mode
  const handleEditProfile = () => {
    setIsFormOpen(true);
  };

  return (
    <div className="profile-page-container">
      <div className="profile-card">
        {teacher ? (
          <>
            <h1 className="profile-name">{teacher.name}</h1>
            <div className="profile-info">
              <p>Ngày sinh: {teacher.dob}</p>
              <p>Giới tính: {teacher.gender}</p>
              <p>Số điện thoại: {teacher.phone}</p>
              <p>Email: {teacher.email}</p>
              <p>Địa chỉ: {teacher.address}</p>
              {/* Edit button */}
            </div>
          </>
        ) : (
          <p className="loading">Loading...</p>
        )}
      </div>

      {isFormOpen && (
        <StudentForm
          handleClose={() => setIsFormOpen(false)}
          isEditMode={true} // Set isEditMode to true for editing
          initialData={teacher}
          fetchData={() => {
            // Optional: You can refresh teacher data after updating
            const fetchTeacherData = async () => {
              try {
                const teacherId = localStorage.getItem("id");
                const teacherResponse = await client.get(
                  `/api/student/${teacherId}`
                );
                const teacherData = teacherResponse.data;
                setTeacher(teacherData);
              } catch (error) {
                console.error("Error:", error);
              }
            };

            fetchTeacherData();
          }}
        />
      )}
    </div>
  );
};

export default StudentHome;

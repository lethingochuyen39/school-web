import React, { useState, useEffect } from "react";
import client from "../../../api/client";

const Profile = () => {
	const [teacher, setTeacher] = useState(null);

	useEffect(() => {
		const fetchTeacherData = async () => {
			try {
				const teacherId = localStorage.getItem("id");
				const teacherResponse = await client.get(`/api/teachers/${teacherId}`);
				const teacherData = teacherResponse.data;
				setTeacher(teacherData);
			} catch (error) {
				console.error("Error:", error);
			}
		};

		fetchTeacherData();
	}, []);

	return (
		<div>
			{teacher ? (
				<div>
					<h1>{teacher.name}</h1>
					<p>Email: {teacher.email}</p>
					{/* Display other teacher information as needed */}
				</div>
			) : (
				<p>Loading...</p>
			)}
		</div>
	);
};

export default Profile;
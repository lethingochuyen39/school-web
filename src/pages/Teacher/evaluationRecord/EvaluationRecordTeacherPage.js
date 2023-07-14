import React, { useState, useEffect, useCallback } from "react";
import GridWrapper from "../../../components/common/GridWrapper/GridWrapper";
import client from "../../../api/client";
import { Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import FolderIcon from "@mui/icons-material/Folder";
const EvaluationRecordTeacherPage = () => {
	const [loading, setLoading] = useState(true);
	const [selectedClass, setSelectedClass] = useState(null);
	const [classEvaluationRecords, setClassEvaluationRecords] = useState([]);
	const colors = [
		"rgba(76, 175, 80, 0.15)",
		"rgba(255, 87, 34, 0.15)",
		"rgba(3, 169, 244, 0.15)",
		"rgba(156, 39, 176, 0.15)",
		"rgba(255, 193, 7, 0.15)",
		"rgba(233, 30, 99, 0.15)",
	];
	const numClasses = classEvaluationRecords.length;
	const navigate = useNavigate();

	const fetchDataStudents = useCallback(async (classId) => {
		try {
			const response = await client.get(
				`/api/student/classes/${classId}/students`
			);
			const students = response.data;
			setClassEvaluationRecords((prevClassEvaluationRecords) => {
				const updatedClassEvaluationRecords = prevClassEvaluationRecords.map((classItem) => {
					if (classItem.id === classId) {
						return {
							...classItem,
							numStudents: students.length,
						};
					}
					return classItem;
				});
				return updatedClassEvaluationRecords;
			});
		} catch (error) {
			console.error(error);
		}
	}, []);

	const [teacherId, setTeacherId] = useState("");

	useEffect(() => {
		const storedId = localStorage.getItem("id");
		setTeacherId(storedId);
	}, [localStorage.getItem("id")]);

	useEffect(() => {
		const fetchClassData = async () => {
			try {
				const response = await client.get(`/api/teachers/${teacherId}/classes`);
				const classData = response.data;
				setClassEvaluationRecords(classData);
				classData.forEach((classItem) => {
					fetchDataStudents(classItem.id);
				});
				setLoading(false);
			} catch (error) {
				console.error(error);
				setLoading(false);
			}
		};

		if (teacherId) {
			fetchClassData();
		}
	}, [teacherId, fetchDataStudents]);

	const handleClassClick = (classId) => {
		setSelectedClass(classId);
		navigate(`/teacher/class-evaluationRecords/${classId}`);
	};

	return (
		<GridWrapper>
			<Typography variant="h6" sx={{ marginBottom: "10px" }}>
				Tổng số lớp: {numClasses}
			</Typography>
			<Paper
				elevation={3}
				sx={{
					padding: "20px",
					display: "flex",
					flexWrap: "wrap",
					justifyContent: "space-around",
				}}
			>
				{classEvaluationRecords.map((classItem, index) => (
					<Paper
						key={classItem.id}
						elevation={3}
						sx={{
							cursor: "pointer",
							marginBottom: "10px",
							padding: "10px",
							width: "calc(33% - 10px)",
							boxSizing: "border-box",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							flexDirection: "column",
							backgroundColor: colors[index % colors.length],
							color: "#616161",
						}}
						onClick={() => handleClassClick(classItem.id)}
					>
						<FolderIcon fontSize="large" />
						<Typography variant="h6">{classItem.name}</Typography>
						<Typography variant="subtitle1">
							Số học sinh: {classItem.numStudents || 0}
						</Typography>
					</Paper>
				))}
			</Paper>
		</GridWrapper>
	);
};

export default EvaluationRecordTeacherPage;

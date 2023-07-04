import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	Alert,
	Button,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Typography,
	Switch,
} from "@mui/material";
import client from "../../api/client";
import GridWrapper from "../../components/common/GridWrapper/GridWrapper";
import BasicCard from "../../components/common/BasicCard/BasicCard";

const UpdateSchedulePage = () => {
	const { scheduleId } = useParams();
	const [schedule, setSchedule] = useState(null);
	const [subjects, setSubjects] = useState([]);
	const [teachers, setTeachers] = useState([]);
	const [selectedSubject, setSelectedSubject] = useState("");
	const [selectedTeacher, setSelectedTeacher] = useState("");

	const [isLoading, setIsLoading] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [status, setStatus] = useState("");

	const navigate = useNavigate();

	useEffect(() => {
		const fetchSchedule = async () => {
			try {
				setIsLoading(true);
				const response = await client.get(`/api/schedules/${scheduleId}`);
				const { subjectId, teacherId, ...rest } = response.data;
				setSchedule(rest);
				setSelectedSubject(rest.subjectId || "");
				setSelectedTeacher(rest.teacherId || "");
				setStatus(rest.status || "");
				setIsLoading(false);
			} catch (error) {
				console.error(error);
			}
		};

		const fetchSubjectsAndTeachers = async () => {
			try {
				const [subjectsResponse, teachersResponse] = await Promise.all([
					client.get("/api/subjects"),
					client.get("/api/teachers"),
				]);
				setSubjects(subjectsResponse.data);
				setTeachers(teachersResponse.data);
			} catch (error) {
				console.error(error);
			}
		};

		fetchSchedule();
		fetchSubjectsAndTeachers();
	}, [scheduleId]);

	const handleSubjectChange = (event) => {
		setSelectedSubject(event.target.value);
	};

	const handleTeacherChange = (event) => {
		setSelectedTeacher(event.target.value);
	};

	const handleSwitchChange = (event) => {
		setStatus(event.target.checked ? "Active" : "InActive");
	};

	const handleSubmit = () => {
		const updatedSchedule = {
			...schedule,
			subjectId: selectedSubject,
			teacherId: selectedTeacher,
			status: status,
		};

		client
			.put(`/api/schedules/${scheduleId}`, updatedSchedule)
			.then(() => {
				setSuccessMessage("Thời khóa biểu đã được cập nhật thành công!");
				setErrorMessage("");
			})
			.catch((error) => {
				console.error("Lỗi khi cập nhật thời khóa biểu:", error.response.data);
				setErrorMessage(error.response.data);
				setSuccessMessage("");
			});
	};

	const handleCloseModal = () => {
		navigate(-1);
	};

	const getHeader = () => (
		<>
			{/* Thông báo thành công */}
			{successMessage && (
				<Alert severity="success" onClose={() => setSuccessMessage("")}>
					{successMessage}
				</Alert>
			)}
			{/* Thông báo lỗi */}
			{errorMessage && (
				<Alert severity="error" onClose={() => setErrorMessage("")}>
					{errorMessage}
				</Alert>
			)}
		</>
	);

	const getContent = () => (
		<form>
			<Typography
				variant="h4"
				sx={{
					mb: 2,
					fontWeight: "bold",
					textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)",
					color: "#FF4500",
					textAlign: "center",
				}}
			>
				Cập nhật thời khóa biểu
			</Typography>
			<FormControl fullWidth margin="normal">
				<InputLabel id="subject-label">Chọn môn học</InputLabel>
				<Select
					labelId="subject-label"
					id="subject-select"
					name="subjectId"
					value={selectedSubject || ""}
					onChange={handleSubjectChange}
					label="Chọn môn học"
				>
					{subjects.map((subject) => (
						<MenuItem key={subject.id} value={subject.id}>
							{subject.name}
						</MenuItem>
					))}
				</Select>
			</FormControl>

			<FormControl fullWidth margin="normal">
				<InputLabel id="teacher-label">Chọn giáo viên</InputLabel>
				<Select
					labelId="teacher-label"
					id="teacher-select"
					name="teacherId"
					value={selectedTeacher || ""}
					onChange={handleTeacherChange}
					label="Chọn giáo viên"
				>
					{teachers.map((teacher) => (
						<MenuItem key={teacher.id} value={teacher.id}>
							{teacher.name}
						</MenuItem>
					))}
				</Select>
			</FormControl>

			<FormControl fullWidth margin="normal">
				<Typography id="status-label">
					Trạng thái{" "}
					<Switch
						checked={status === "Active"}
						onChange={handleSwitchChange}
						color="primary"
					/>
				</Typography>
			</FormControl>

			<Button
				variant="contained"
				onClick={handleSubmit}
				disabled={isLoading}
				sx={{
					fontSize: "1.1rem",
					width: "100px",
					marginTop: "10px",
					marginBottom: "20px",
				}}
			>
				Cập nhật
			</Button>
			<Button
				onClick={handleCloseModal}
				color="error"
				sx={{
					fontSize: "1.1rem",
					width: "100px",
					marginTop: "10px",
					marginBottom: "20px",
				}}
			>
				Quay lại
			</Button>
		</form>
	);

	return (
		<GridWrapper>
			<BasicCard header={getHeader()} content={getContent()} />
		</GridWrapper>
	);
};

export default UpdateSchedulePage;

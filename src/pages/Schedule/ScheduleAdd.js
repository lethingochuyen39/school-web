import React, { useState, useEffect } from "react";
import { Alert, Button, Divider, Typography } from "@mui/material";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import client from "../../api/client";
import { Box } from "@mui/system";
import { useParams, useNavigate } from "react-router-dom";
import ScheduleView from "./ScheduleView";
import GridWrapper from "../../components/common/GridWrapper/GridWrapper";
import BasicCard from "../../components/common/BasicCard/BasicCard";

const ScheduleTable = () => {
	const [subjects, setSubjects] = useState([]);
	const [selectedSubject, setSelectedSubject] = useState("");
	const [teachers, setTeachers] = useState([]);
	const [selectedTeacher, setSelectedTeacher] = useState("");
	const [lessons, setLessons] = useState([]);
	const [daysOfWeek, setDaysOfWeek] = useState([]);
	const [selectedLesson, setSelectedLesson] = useState("");
	const [selectedDayOfWeek, setSelectedDayOfWeek] = useState("");
	const { classId } = useParams();
	const [refreshSchedule, setRefreshSchedule] = useState(false);
	const [isLoadingData, setIsLoadingData] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [teacherSubjects, setTeacherSubjects] = useState([]);

	const fetchData = async () => {
		try {
			setIsLoadingData(true);
			const lessonsResponse = await client.get("/api/lessons");
			setLessons(lessonsResponse.data);
			setSelectedLesson(lessonsResponse.data[0]?.id || "");

			const daysOfWeekResponse = await client.get("/api/dayofweek");
			setDaysOfWeek(daysOfWeekResponse.data);
			setSelectedDayOfWeek(daysOfWeekResponse.data[0]?.id || "");

			const subjectsResponse = await client.get("/api/subjects");
			setSubjects(subjectsResponse.data);
			setSelectedSubject(subjectsResponse.data[0]?.id || "");

			const teachersResponse = await client.get("/api/teachers");
			const activeTeachers = teachersResponse.data.filter(
				(teacher) => teacher.isActive
			);
			setTeachers(activeTeachers);
			setSelectedTeacher(activeTeachers[0]?.id || "");

			setIsLoadingData(true);
		} catch (error) {
			console.error(error);
		}
	};

	const handleLessonChange = (event) => {
		setSelectedLesson(event.target.value);
	};

	const handleDayOfWeekChange = (event) => {
		setSelectedDayOfWeek(event.target.value);
	};

	const handleSubjectChange = (event) => {
		setSelectedSubject(event.target.value);
	};

	const handleTeacherChange = (event) => {
		const teacherId = event.target.value;
		setSelectedTeacher(teacherId);
		fetchTeacherSubjects(teacherId);
	};

	const navigate = useNavigate();
	const handleCloseModal = () => {
		navigate(-1);
	};

	const handleSubmit = () => {
		const scheduleData = {
			dayOfWeekId: selectedDayOfWeek,
			lessonId: selectedLesson,
			teacherId: selectedTeacher,
			classId: classId,
			subjectId: selectedSubject,
		};

		client
			.post("/api/schedules", scheduleData)
			.then((response) => {
				setRefreshSchedule(true);
				setErrorMessage("");
			})
			.catch((error) => {
				console.error("Lỗi khi thêm lịch học:", error.response.data);
				setErrorMessage(error.response.data);
				setSuccessMessage("");
			});
	};

	useEffect(() => {
		fetchData();
	}, [classId]);

	useEffect(() => {
		if (selectedTeacher) {
			fetchTeacherSubjects(selectedTeacher);
		}
		if (refreshSchedule) {
			setSuccessMessage("Lịch học đã được thêm thành công!");
			setRefreshSchedule(false);
		}
	}, [refreshSchedule, selectedTeacher]);

	const fetchTeacherSubjects = async (teacherId) => {
		try {
			const response = await client.get(`/api/teachers/${teacherId}/subjects`);
			setTeacherSubjects(response.data);

			if (response.data.length > 0) {
				setSelectedSubject(response.data[0].id);
			}
		} catch (error) {
			console.error(error);
		}
	};

	const getHeader = () => (
		<>
			<Box mt={2}>
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
				{/* ... */}
			</Box>
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				padding="5px"
				flexWrap="wrap"
			>
				<Box width="calc(50% - 10px)" marginRight="10px">
					<FormControl fullWidth margin="normal">
						<InputLabel id="lesson-label">Chọn tiết học</InputLabel>
						<Select
							labelId="lesson-label"
							id="lesson-select"
							name="lessonId"
							value={selectedLesson}
							onChange={handleLessonChange}
							label="Chọn tiết học"
							sx={{ height: "40px" }}
						>
							{lessons.map((lesson) => (
								<MenuItem key={lesson.id} value={lesson.id}>
									{lesson.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Box>
				<Box width="calc(50% - 10px)" marginLeft="10px">
					<FormControl fullWidth margin="normal">
						<InputLabel id="dayOfWeek-label">Chọn ngày trong tuần</InputLabel>
						<Select
							labelId="dayOfWeek-label"
							id="dayOfWeek-select"
							name="dayOfWeekId"
							value={selectedDayOfWeek}
							onChange={handleDayOfWeekChange}
							label="Chọn ngày trong tuần"
							sx={{ height: "40px" }}
						>
							{daysOfWeek.map((day) => (
								<MenuItem key={day.id} value={day.id}>
									{day.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Box>
				<Box width="calc(50% - 10px)" marginRight="10px">
					<FormControl fullWidth margin="normal">
						<InputLabel id="teacher-label">Chọn giáo viên</InputLabel>
						<Select
							labelId="teacher-label"
							id="teacher-select"
							name="teacherId"
							value={selectedTeacher}
							onChange={handleTeacherChange}
							label="Chọn giáo viên"
							sx={{ height: "40px" }}
						>
							{teachers.map((teacher) => (
								<MenuItem key={teacher.id} value={teacher.id}>
									{teacher.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Box>
				<Box width="calc(50% - 10px)" marginLeft="10px">
					<FormControl fullWidth margin="normal">
						<InputLabel id="subject-label">Chọn môn học</InputLabel>
						<Select
							labelId="subject-label"
							id="subject-select"
							name="subjectId"
							value={selectedSubject}
							onChange={handleSubjectChange}
							label="Chọn môn học"
							sx={{ height: "40px" }}
						>
							{teacherSubjects.map((subject) => (
								<MenuItem key={subject.id} value={subject.id}>
									{subject.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Box>
			</Box>
			<Button
				variant="contained"
				onClick={handleSubmit}
				sx={{
					fontSize: "1.1rem",
					width: "100px",
					marginLeft: "10px",
					marginTop: "10px",
					marginBottom: "20px",
				}}
			>
				Thêm
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
		</>
	);

	const getContent = () => (
		<>
			<Divider sx={{ margin: " auto", width: "80%" }} />
			<Box mt={2}>
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
					Danh sách Thời khóa biểu
				</Typography>

				<ScheduleView
					classId={classId}
					refresh={refreshSchedule}
					setRefresh={setRefreshSchedule}
				/>
			</Box>
		</>
	);
	return (
		<GridWrapper>
			<BasicCard header={getHeader()} content={getContent()} />
		</GridWrapper>
	);
};

export default ScheduleTable;

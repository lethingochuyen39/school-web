import React, { useEffect, useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Box,
	Typography,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
} from "@mui/material";
import client from "../../../api/client";
import GridWrapper from "../../../components/common/GridWrapper/GridWrapper";

const ScheduleTeacherPage = () => {
	const [scheduleData, setScheduleData] = useState([]);
	const [dayOfWeekData, setDayOfWeekData] = useState([]);
	const [selectedClass, setSelectedClass] = useState("");
	const [filteredClassesData, setFilteredClassesData] = useState([]);
	const [teacher, setTeacher] = useState(null);
	useEffect(() => {
		const fetchScheduleData = async () => {
			try {
				const teacherId = localStorage.getItem("id");

				const [teacherRepose, tietResponse, dayOfWeekResponse, tkbResponse] =
					await Promise.all([
						client.get(`/api/teachers/${teacherId}`),
						client.get("/api/lessons"),
						client.get("/api/dayofweek"),
						client.get(`/api/schedules/teachers/${teacherId}`),
					]);

				setTeacher(teacherRepose.data);
				const tietData = tietResponse.data;
				const fetchedDayOfWeekData = dayOfWeekResponse.data;
				const tkbData = tkbResponse.data;

				const filteredClasses = [];
				const displayedClasses = new Set();

				tkbData.forEach((tkbItem) => {
					if (!displayedClasses.has(tkbItem.classes.id)) {
						filteredClasses.push(tkbItem.classes);
						displayedClasses.add(tkbItem.classes.id);
					}
				});

				const scheduleRows = tietData.map((t) => {
					const scheduleRow = {
						tietId: t.id,
						tietName: t.name,
						startTime: t.startTime,
						endTime: t.endTime,
					};

					fetchedDayOfWeekData.forEach((d) => {
						const findMon = tkbData.find(
							(m) =>
								m.lesson.id === t.id &&
								m.dayOfWeek.id === d.id &&
								m.status === "Active"
						);

						if (findMon) {
							scheduleRow[d.id] = {
								subjectId: findMon.subject.id,
								subjectName: findMon.subject.name,
								classId: findMon.classes.id,
								className: findMon.classes.name,
								teacherId: findMon.teacher.id,
								teacherName: findMon.teacher.name,
								startTime: findMon.startTime,
								endTime: findMon.endTime,
							};
						} else {
							scheduleRow[d.id] = {
								subjectId: "",
								subjectName: "",
								teacherId: "",
								teacherName: "",
								startTime: "",
								endTime: "",
								classId: "",
								className: "",
							};
						}
					});

					return scheduleRow;
				});

				setScheduleData(scheduleRows);
				setDayOfWeekData(fetchedDayOfWeekData);
				setFilteredClassesData(filteredClasses);
			} catch (error) {
				console.error("Lôi:", error);
			}
		};

		fetchScheduleData();
	}, []);

	const handleClassChange = (event) => {
		setSelectedClass(event.target.value);
	};

	return (
		<>
			{teacher && !teacher.isActive ? (
				<div style={{ fontWeight: "bold", color: "#1565c0" }}>
					Tài khoản cá nhân bạn đang bị khóa. Vui lòng liên hệ nhà trường để
					biết thêm thông tin.
				</div>
			) : (
				<GridWrapper>
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
							Lịch phân công giảng dạy
						</Typography>
					</Box>
					<Box mb={2} sx={{ display: "flex", justifyContent: "flex-end" }}>
						<FormControl sx={{ minWidth: 200 }}>
							<InputLabel id="class-select-label">Thời gian áp dụng</InputLabel>
							<Select
								labelId="class-select-label"
								id="class-select"
								value={selectedClass}
								onChange={handleClassChange}
								label="Thời gian áp dụng"
								defaultValue="1"
							>
								<MenuItem value="" disabled>
									Ngày áp dụng
								</MenuItem>
								{filteredClassesData.map((classItem) => (
									<MenuItem key={classItem.id} value={classItem.id}>
										LH{classItem.id}_{classItem.name}
										{/* (năm: {classItem.academicYear.name})  */}| Ngày áp dụng:
										{classItem.academicYear.startDate} đến{" "}
										{classItem.academicYear.endDate}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Box>

					<TableContainer component={Paper}>
						<Table sx={{ minWidth: 650 }} aria-label="simple table">
							<TableHead>
								<TableRow>
									<TableCell
										sx={{
											fontWeight: "bold",
											backgroundColor: "#0097a7",
											color: "#FFFFFF",
											textAlign: "center",
											border: "1px solid black",
										}}
									>
										Tiết
									</TableCell>
									{dayOfWeekData.map((d) => (
										<TableCell
											key={d.id}
											align="center"
											sx={{
												fontWeight: "bold",
												color: "#FFFFFF",
												backgroundColor: "#0097a7",
												textAlign: "center",
												border: "1px solid black",
											}}
										>
											{d.name}
										</TableCell>
									))}
								</TableRow>
							</TableHead>
							<TableBody>
								{scheduleData.map((row, i) => (
									<TableRow
										key={i}
										sx={{
											"&:nth-of-type(odd)": {
												backgroundColor: "#e3f2fd",
											},
										}}
									>
										<TableCell
											sx={{
												fontWeight: "bold",
												width: "100px",
												textAlign: "center",
												whiteSpace: "nowrap",
												border: "1px solid black",
											}}
										>
											{row.tietName}
											<br />( {row.startTime} - {row.endTime})
										</TableCell>
										{dayOfWeekData.map((d) => (
											<TableCell
												key={d.id}
												align="center"
												sx={{
													border: "1px solid black",
												}}
											>
												{selectedClass ? (
													row[d.id].classId === selectedClass ? (
														<>
															{row[d.id].subjectName} - {row[d.id].className}
														</>
													) : (
														"-"
													)
												) : (
													<>
														{row[d.id].subjectName} - {row[d.id].className}
													</>
												)}
											</TableCell>
										))}
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</GridWrapper>
			)}
		</>
	);
};

export default ScheduleTeacherPage;

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
	TextField,
	Button,
} from "@mui/material";
import client from "../../../api/client";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
const StudentScheduleView = () => {
	const [scheduleData, setScheduleData] = useState([]);
	const [dayOfWeekData, setDayOfWeekData] = useState([]);
	const [filteredClassesData, setFilteredClassesData] = useState([]);
	const fetchStudentClass = async (studentId) => {
		try {
			const response = await client.get(`/api/student/${studentId}/class`);
			return response.data;
		} catch (error) {
			console.error("Lỗi khi lấy thông tin lớp học:", error);
			return null;
		}
	};

	useEffect(() => {
		const fetchScheduleData = async () => {
			try {
				const studentId = localStorage.getItem("id");
				const studentClass = await fetchStudentClass(studentId);
				setFilteredClassesData([studentClass]);

				const [tietResponse, dayOfWeekResponse, tkbResponse] =
					await Promise.all([
						client.get("/api/lessons"),
						client.get("/api/dayofweek"),
						client.get(`/api/schedules/class/${studentClass.id}`),
					]);

				const tietData = tietResponse.data;
				const fetchedDayOfWeekData = dayOfWeekResponse.data;
				const tkbData = tkbResponse.data;

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
			} catch (error) {
				console.error("Lôi:", error);
			}
		};

		fetchScheduleData();
	}, []);
	const handleExportExcel = () => {
		// Tạo danh sách dữ liệu từ bảng thời khóa biểu
		const data = scheduleData.map((row) => {
			const rowData = [
				row.tietName,
				...dayOfWeekData.map((d) => {
					const subjectName = row[d.id]?.subjectName || "-";
					const teacherName = row[d.id]?.teacherName || "-";
					return `${subjectName} - ${teacherName}`;
				}),
			];
			return rowData;
		});

		// Tạo workbook mới
		const workbook = XLSX.utils.book_new();

		// Tạo worksheet từ dữ liệu
		const worksheet = XLSX.utils.aoa_to_sheet(data);

		// Thêm worksheet vào workbook
		XLSX.utils.book_append_sheet(workbook, worksheet, "Thời khóa biểu");

		// Xuất file Excel
		const excelBuffer = XLSX.write(workbook, {
			bookType: "xlsx",
			type: "array",
		});
		const excelData = new Blob([excelBuffer], {
			type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		});
		saveAs(excelData, "ThoiKhoaBieu.xlsx");
	};

	return (
		<>
			<Box>
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
					Thời Khóa Biểu {filteredClassesData[0]?.name}
				</Typography>
			</Box>

			<Box mb={2} sx={{ display: "flex", justifyContent: "flex-end" }}>
				<TextField
					id="outlined-read-only-input"
					label="Thời gian áp dụng"
					defaultValue="Thời gian áp dụng"
					sx={{ minWidth: 330, paddingRight: 2 }}
					InputProps={{
						readOnly: true,
						value: `Áp dụng TKB từ ${filteredClassesData[0]?.academicYear.startDate} đến ${filteredClassesData[0]?.academicYear.endDate}`,
					}}
				/>
				<Button
					variant="contained"
					sx={{
						fontWeight: "bold",
						color: "white",
						backgroundImage: "linear-gradient(to right, #8bc34a, #4caf50)",
					}}
					onClick={handleExportExcel}
				>
					Export Excel
				</Button>
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
										{row[d.id].subjectName ? (
											<>
												{row[d.id].subjectName} - {row[d.id].teacherName}
											</>
										) : (
											"-"
										)}
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
};

export default StudentScheduleView;

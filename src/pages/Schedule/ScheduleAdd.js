import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Grid, Button } from "@mui/material";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import client from "../../api/client";
import { Box } from "@mui/system";

const ScheduleTable = () => {
	const daysOfWeek = [
		"Thứ hai",
		"Thứ ba",
		"Thứ tư",
		"Thứ năm",
		"Thứ sáu",
		"Thứ bảy",
		"Chủ nhật",
	];
	const lessons = Array.from({ length: 10 }, (_, index) => index + 1);
	const [subjects, setSubjects] = useState([]);
	const [selectedSubject, setSelectedSubject] = useState("");
	const [teachers, setTeachers] = useState([]);
	const [selectedTeachers, setSelectedTeachers] = useState("");
	const [changedRows, setChangedRows] = useState([]);
	const [rows, setRows] = useState(getInitialRows());
	const [selectedClass, setSelectedClasses] = useState("");
	const [classes, setClasses] = useState([]);

	function getInitialRows() {
		return lessons.map((lesson) => {
			const rowData = {
				id: lesson,
				lesson: `Tiết ${lesson}`,
				subject: "",
				teacher: "",
			};
			daysOfWeek.forEach((_, index) => {
				rowData[`daysofweek${index}`] = "";
			});
			return rowData;
		});
	}

	const fetchClasses = async () => {
		try {
			const response = await client.get("/api/classes");
			const classes = response.data;
			setClasses(classes);
			setSelectedClasses(classes[0].id);
		} catch (error) {
			console.error(error);
		}
	};

	const handleClassesChange = (event) => {
		setSelectedClasses(event.target.value);
	};

	const fetchSubjects = async () => {
		try {
			const response = await client.get("/api/subjects");
			const subjects = response.data;
			setSubjects(subjects);
			setSelectedSubject(subjects[0]?.id || "");
		} catch (error) {
			console.error(error);
		}
	};

	const handleSubjectChange = (event, params) => {
		const { field, value } = params;
		const updatedRows = rows.map((row) => {
			if (row.id === params.id) {
				return { ...row, [field]: value };
			}
			return row;
		});
		setRows(updatedRows);

		// Lưu thông tin chi tiết của ô thay đổi vào mảng changedRows
		const changedRow = {
			id: params.id,
			daysofweek: daysOfWeek[params.id],
			lesson: `Tiết ${params.id + 1}`,
			subject: rows.find((row) => row.id === params.id)[params.field],
			teacher: rows.find((row) => row.id === params.id)[`teacher${params.id}`],
		};

		// Kiểm tra xem đã có thay đổi trong mảng changedRows chưa
		const existingRow = changedRows.find((row) => row.id === params.id);
		if (existingRow) {
			// Nếu đã có thay đổi, cập nhật thông tin của ô vào mảng changedRows
			const updatedRows = changedRows.map((row) =>
				row.id === params.id ? changedRow : row
			);
			setChangedRows(updatedRows);
		} else {
			// Nếu chưa có thay đổi, thêm thông tin của ô vào mảng changedRows
			setChangedRows([...changedRows, changedRow]);
		}

		console.log("selectedSubject", selectedSubject);
	};

	const fetchTeachers = async () => {
		try {
			const response = await client.get("/api/teachers");
			const teachers = response.data;
			setTeachers(teachers);
			setSelectedTeachers(teachers[0]?.id || "");
		} catch (error) {
			console.error(error);
		}
	};

	const handleTeacherChange = (event, params) => {
		const { field, value } = params;
		const updatedRows = rows.map((row) => {
			if (row.id === params.id) {
				return { ...row, [field]: value };
			}
			return row;
		});
		setRows(updatedRows);
		setSelectedTeachers(value);

		// Lưu thông tin chi tiết của ô thay đổi vào mảng changedRows
		const changedRow = {
			id: params.id,
			daysofweek: daysOfWeek[params.id],
			lesson: `Tiết ${params.id + 1}`,
			subject: rows.find((row) => row.id === params.id)[`subject${params.id}`],
			teacher: rows.find((row) => row.id === params.id)[params.field],
		};

		// Kiểm tra xem đã có thay đổi trong mảng changedRows chưa
		const existingRow = changedRows.find((row) => row.id === params.id);
		if (existingRow) {
			// Nếu đã có thay đổi, cập nhật thông tin của ô vào mảng changedRows
			const updatedRows = changedRows.map((row) =>
				row.id === params.id ? changedRow : row
			);
			setChangedRows(updatedRows);
		} else {
			// Nếu chưa có thay đổi, thêm thông tin của ô vào mảng changedRows
			setChangedRows([...changedRows, changedRow]);
		}

		console.log("selectedTeachers", selectedTeachers);
	};

	useEffect(() => {
		fetchSubjects();
		fetchTeachers();
		fetchClasses();
	}, []);

	const columns = [
		{ field: "lesson", headerName: "Tiết", width: 70 },
		...daysOfWeek.map((daysofweek, index) => ({
			field: `daysofweek${index}`,
			headerName: daysofweek,
			width: 150,
			renderCell: (params) => (
				<Grid container direction="column" spacing={1}>
					<Grid item>
						<FormControl fullWidth>
							<InputLabel id={`subject-label-${params.id}`}>
								Chọn môn học
							</InputLabel>
							<Select
								labelId={`subject-label-${params.id}`}
								id={`subject-select-${params.id}`}
								name={`subjectId-${params.id}`}
								value={rows.find((row) => row.id === params.id)["subject"]}
								onChange={(event) => handleSubjectChange(event, params)}
								label="Chọn môn học"
								sx={{ height: "40px" }}
							>
								{subjects.map((subject) => (
									<MenuItem key={subject.id} value={subject.id}>
										{subject.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
					<Grid item>
						<FormControl fullWidth>
							<InputLabel id={`teacher-label-${params.id}`}>
								Chọn giáo viên
							</InputLabel>
							<Select
								labelId={`teacher-label-${params.id}`}
								id={`teacher-select-${params.id}`}
								name={`teacherId-${params.id}`}
								value={rows.find((row) => row.id === params.id)["teacher"]}
								onChange={(event) => handleTeacherChange(event, params)}
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
					</Grid>
				</Grid>
			),
		})),
	];
	const handleSubmit = async () => {
		try {
			const scheduleDetails = rows.map((row) => ({
				lesson: row.id,
				dayOfWeek: daysOfWeek[row.id - 1],
				subject: {
					id: row.subject,
					name:
						subjects.find((subject) => subject.id === row.subject)?.name || "",
				},
				teacher: {
					id: row.teacher,
					name:
						teachers.find((teacher) => teacher.id === row.teacher)?.name || "",
				},
			}));

			const scheduleDto = {
				classesId: selectedClass,
				scheduleDetails: scheduleDetails,
			};

			await client.post("/api/schedules", scheduleDto);

			alert("Lưu thành công");
		} catch (error) {
			console.error(error);
			alert("Lưu thất bại");
		}

		try {
			await client.post("/api/schedule", {});

			alert("Lưu thành công");
		} catch (error) {
			console.error(error);
			alert("Lưu thất bại");
		}
	};

	return (
		<div style={{ height: 500, width: "100%" }}>
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				padding="5px"
				flexWrap="wrap"
			>
				<Box width="calc(50% - 10px)" marginRight="10px">
					<FormControl fullWidth margin="normal">
						<InputLabel id="subject-label">Chọn lớp học</InputLabel>
						<Select
							labelId="subject-label"
							id="subject-select"
							name="subjectId"
							value={selectedClass}
							onChange={handleClassesChange}
							label="Chọn lớp học"
							sx={{ height: "40px" }}
						>
							{classes.map((classes) => (
								<MenuItem key={classes.id} value={classes.id}>
									{classes.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Box>
			</Box>
			<Button variant="contained" onClick={handleSubmit} sx={{ mb: 2 }}>
				Lưu thay đổi
			</Button>
			<DataGrid
				rows={rows}
				columns={columns}
				disableSelectionOnClick
				hideFooter
				rowHeight={120}
			/>
		</div>
	);
};

export default ScheduleTable;

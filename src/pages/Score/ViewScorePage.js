import React, { useState, useEffect } from "react";
import client from "../../api/client";
import Box from "@mui/material/Box";
import GridWrapper from "../../components/common/GridWrapper/GridWrapper";
import BasicCard from "../../components/common/BasicCard/BasicCard";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import {
	Button,
	IconButton,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Grid,
} from "@mui/material";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
const ViewScorePage = () => {
	const [selectedStudent, setSelectedStudent] = useState("");
	const { classId } = useParams();
	const [subjects, setSubjects] = useState([]);
	const [scoreTypes, setScoreTypes] = useState([]);
	const [semester, setSemester] = useState(1);
	const [scoreData, setScoreData] = useState([]);
	const averageScores = {};
	const [filteredStudents, setFilteredStudents] = useState([]);

	const navigate = useNavigate();

	const handlesemesterChange = (event) => {
		setSemester(event.target.value);
	};

	const handleGoBack = () => {
		navigate(-1);
	};

	useEffect(() => {
		if (classId) {
			const fetchStudents = async () => {
				try {
					const response = await client.get(`/api/student/${classId}/students`);
					const filteredStudents = response.data;
					setFilteredStudents(filteredStudents);
					console.log(filteredStudents);
				} catch (error) {
					console.error("Lỗi khi lấy danh sách học sinh:", error);
				}
			};

			fetchStudents();
		}
	}, [classId]);

	useEffect(() => {
		const fetchScoreData = async () => {
			try {
				const scoreTypeResponse = await client.get("/api/score-types");
				const subjectResponse = await client.get("/api/subjects");

				const scoreResponse = await client.get(
					`/api/scores/semester?classId=${classId}&semester=${semester}&studentId=${selectedStudent}`
				);
				const fetchedSubjects = subjectResponse.data.filter(
					(subject) => !subject.name.startsWith("SHDC")
				);

				const fetchedScoreData = scoreResponse.data;
				console.log(fetchedScoreData);
				const fetchedScoreTypes = scoreTypeResponse.data;

				const scoreRows = fetchedSubjects.map((subject) => {
					const scoreRow = {
						subjectId: subject.id,
						subjectName: subject.name,
					};
					fetchedScoreTypes.forEach((scoreType) => {
						const findScore = fetchedScoreData.find(
							(score) =>
								score.subject.id === subject.id &&
								score.scoreType.id === scoreType.id
						);

						if (findScore) {
							scoreRow[scoreType.id] = findScore.score;
						} else {
							scoreRow[scoreType.id] = "-";
						}
					});

					return scoreRow;
				});

				fetchedSubjects.forEach((subject) => {
					let sum = 0;
					let totalCoefficient = 0;
					let numScoreTypes = 0;

					fetchedScoreTypes.forEach((scoreType) => {
						const findScore = fetchedScoreData.find(
							(score) =>
								score.subject.id === subject.id &&
								score.scoreType.id === scoreType.id
						);

						if (findScore) {
							sum += findScore.score * scoreType.coefficient;
							totalCoefficient += scoreType.coefficient;
							numScoreTypes++;
						}
					});

					const average =
						totalCoefficient > 0 && numScoreTypes >= 6
							? (sum / totalCoefficient).toFixed(2)
							: null;
					averageScores[subject.id] = average;
				});

				setScoreData(
					scoreRows.map((scoreRow) => ({
						...scoreRow,
						average: averageScores[scoreRow.subjectId],
					}))
				);

				setScoreTypes(fetchedScoreTypes);
				setSubjects(fetchedSubjects);
			} catch (error) {
				console.error("Lỗi:", error);
			}
		};

		fetchScoreData();
	}, [classId, semester, selectedStudent]);

	const handleStudentChange = (event) => {
		setSelectedStudent(event.target.value);
		console.log(selectedStudent);
	};

	const handleExportExcel = () => {
		const studentName = filteredStudents.find(
			(student) => student.id === selectedStudent
		)?.name;
		const semesterName = semester === 1 ? "Học kỳ 1" : "Học kỳ 2";

		const data = [
			[semesterName, studentName],
			["Môn học", ...scoreTypes.map((scoreType) => scoreType.name), "ĐTB"],
			...scoreData.map((row) => [
				row.subjectName,
				...scoreTypes.map((scoreType) => row[scoreType.id]),
				row.average !== null ? row.average : "-",
			]),
		];

		// Tạo workbook mới
		const workbook = XLSX.utils.book_new();

		// Tạo worksheet từ dữ liệu
		const worksheet = XLSX.utils.aoa_to_sheet(data);

		// Thêm worksheet vào workbook
		XLSX.utils.book_append_sheet(workbook, worksheet, "Bảng điểm");

		// Xuất file Excel
		const excelBuffer = XLSX.write(workbook, {
			bookType: "xlsx",
			type: "array",
		});
		const excelData = new Blob([excelBuffer], {
			type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		});
		saveAs(excelData, "BangDiem.xlsx");
	};

	const getHeader = () => (
		<>
			<IconButton onClick={handleGoBack}>
				<ArrowBackIcon />
			</IconButton>
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				fontSize="2rem"
				fontWeight="bold"
				sx={{
					fontWeight: "bold",
					textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)",
					color: "#FF4500",
					textAlign: "center",
				}}
			>
				Xem điểm lớp
			</Box>
			<Grid container justifyContent="center" spacing={2}>
				<Grid item xs={12} md={4}>
					<FormControl fullWidth margin="normal" size="small">
						<InputLabel id="semester-label">Học kỳ</InputLabel>
						<Select
							labelId="semester-label"
							id="semester-select"
							name="semester"
							value={semester}
							onChange={handlesemesterChange}
							label="Học kỳ"
							required
							defaultValue={1}
						>
							<MenuItem value={1}>Học kỳ 1</MenuItem>
							<MenuItem value={2}>Học kỳ 2</MenuItem>
						</Select>
					</FormControl>
				</Grid>
				<Grid item xs={12} md={4}>
					<FormControl fullWidth size="small" margin="normal">
						<InputLabel id="student-label">Học sinh</InputLabel>
						<Select
							labelId="student-label"
							id="student-select"
							name="studentId"
							value={selectedStudent}
							onChange={handleStudentChange}
							label="Học sinh"
							required
						>
							{filteredStudents.map((student) => (
								<MenuItem key={student.id} value={student.id}>
									HS{student.id}_{student.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Grid>
			</Grid>
		</>
	);

	const getContent = () => (
		<>
			<Box
				display="flex"
				justifyContent="flex-end"
				alignItems="center"
				padding="5px"
			>
				<Button
					variant="contained"
					color="primary"
					onClick={handleExportExcel}
					style={{
						backgroundImage: "linear-gradient(to right, #8bc34a, #4caf50)",
						fontSize: "1.1rem",
						boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
					}}
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
								Môn học
							</TableCell>
							{scoreTypes.map((scoreType) => (
								<TableCell
									key={scoreType.id}
									align="center"
									sx={{
										fontWeight: "bold",
										color: "#FFFFFF",
										backgroundColor: "#0097a7",
										textAlign: "center",
										border: "1px solid black",
									}}
								>
									{scoreType.name}
								</TableCell>
							))}
							<TableCell
								align="center"
								sx={{
									fontWeight: "bold",
									color: "#FFFFFF",
									backgroundColor: "#0097a7",
									textAlign: "center",
									border: "1px solid black",
								}}
							>
								ĐTB
							</TableCell>
						</TableRow>
					</TableHead>

					<TableBody>
						{scoreData.map((row, i) => (
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
									{row.subjectName}
								</TableCell>
								{scoreTypes.map((scoreType) => (
									<TableCell
										key={scoreType.id}
										align="center"
										sx={{
											border: "1px solid black",
										}}
									>
										{row[scoreType.id]}
									</TableCell>
								))}

								<TableCell
									align="center"
									sx={{
										fontWeight: "bold",
										border: "1px solid black",
									}}
								>
									{row.average !== null ? row.average : "-"}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);

	return (
		<GridWrapper>
			{!selectedStudent && (
				<>
					<BasicCard header={getHeader()} />
					<Box
						display="flex"
						justifyContent="center"
						alignItems="center"
						height="200px"
						fontSize="1.2rem"
						color="#b71c1c"
					>
						Vui lòng chọn học sinh để tra cứu
					</Box>
				</>
			)}
			{selectedStudent && (
				<BasicCard header={getHeader()} content={getContent()} />
			)}
		</GridWrapper>
	);
};

export default ViewScorePage;

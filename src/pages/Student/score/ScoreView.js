import React, { useEffect, useState } from "react";
import {
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
	Typography,
} from "@mui/material";
import client from "../../../api/client";

const ScoreView = ({ refresh, setRefresh }) => {
	const [scoreData, setScoreData] = useState([]);
	const [scoreTypes, setScoreTypes] = useState([]);
	const [subjects, setSubjects] = useState([]);
	const [semester, setSemester] = useState(1);
	const [classes, setClasses] = useState([]);
	const [selectedClass, setSelectedClass] = useState("");
	const averageScores = {};

	const handleSemesterChange = (event) => {
		setSemester(event.target.value);
	};

	const handleChange = (event) => {
		setSelectedClass(event.target.value);
	};

	useEffect(() => {
		if (classes.length > 0) {
			setSelectedClass(classes[0].id);
		}
	}, [classes]);

	useEffect(() => {
		const fetchScoreData = async () => {
			try {
				const studentId = localStorage.getItem("id");
				const responseClasses = await client.get(
					`/api/student/${studentId}/classes`
				);
				setClasses(responseClasses.data);
				const scoreTypeResponse = await client.get("/api/score-types");
				const subjectResponse = await client.get("/api/subjects");

				const scoreResponse = await client.get(
					`/api/scores/semester?classId=${selectedClass}&semester=${semester}&studentId=${studentId}`
				);
				const fetchedSubjects = subjectResponse.data.filter(
					(subject) => !subject.name.startsWith("SHDC")
				);

				const fetchedScoreData = scoreResponse.data;
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
	}, [, selectedClass, semester, refresh]);

	useEffect(() => {
		if (refresh) {
			setRefresh(false);
		}
	}, [refresh, setRefresh]);

	return (
		<>
			<Grid container justifyContent="center" spacing={2} sx={{ mb: 2, mt: 2 }}>
				<Grid item xs={12} md={6}>
					<FormControl fullWidth size="small">
						<InputLabel id="semester-label">Học kỳ</InputLabel>
						<Select
							labelId="semester-label"
							id="semester-select"
							name="semester"
							value={semester}
							onChange={handleSemesterChange}
							label="Học kỳ"
							required
						>
							<MenuItem value={1}>Học kỳ 1</MenuItem>
							<MenuItem value={2}>Học kỳ 2</MenuItem>
						</Select>
					</FormControl>
				</Grid>

				<Grid item xs={12} md={6}>
					<FormControl fullWidth size="small">
						<InputLabel id="class-label">Lớp học</InputLabel>
						<Select
							labelId="class-label"
							id="class-select"
							name="classId"
							size="small"
							value={selectedClass}
							onChange={handleChange}
							label="Lớp học"
							required
						>
							{classes.map((classItem) => (
								<MenuItem key={classItem.id} value={classItem.id}>
									LH{classItem.id}_{classItem.name}_năm học:{" "}
									{classItem.academicYear.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Grid>
			</Grid>

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
			<Typography
				style={{
					color: "red",
					fontWeight: "bold",
					fontStyle: "italic",
					marginTop: "10px",
				}}
			>
				Vị trí "-" là thông tin chưa được công bố. Chi tiết liên hệ nhà trường
			</Typography>
		</>
	);
};

export default ScoreView;

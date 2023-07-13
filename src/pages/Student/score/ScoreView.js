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
} from "@mui/material";
import client from "../../../api/client";

const ScoreView = ({ classId, refresh, setRefresh }) => {
	const [scoreData, setScoreData] = useState([]);
	const [scoreTypes, setScoreTypes] = useState([]);
	const [subjects, setSubjects] = useState([]);
	const [semester, setSemester] = useState(1);
	const [classes, setClasses] = useState([]);
	const [selectedClass, setSelectedClass] = useState("");

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
					`/api/student/${studentId}/Allclass`
				);
				setClasses(responseClasses.data);
				const scoreTypeResponse = await client.get("/api/score-types");
				const subjectResponse = await client.get("/api/subjects");

				const scoreResponse = await client.get(
					`/api/scores/semester?classId=${selectedClass}&semester=${semester}&studentId=${studentId}`
				);

				const fetchedScoreData = scoreResponse.data;
				const fetchedScoreTypes = scoreTypeResponse.data;
				const fetchedSubjects = subjectResponse.data;

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

				setScoreData(scoreRows);
				setScoreTypes(fetchedScoreTypes);
				setSubjects(fetchedSubjects);
			} catch (error) {
				console.error("Lỗi:", error);
			}
		};

		fetchScoreData();
	}, [classId, selectedClass, semester, refresh]);

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
						<InputLabel id="semester-label">Chọn Học kì</InputLabel>
						<Select
							labelId="semester-label"
							id="semester-select"
							name="semester"
							value={semester}
							onChange={handleSemesterChange}
							label="Chọn Học kì"
							required
						>
							<MenuItem value={1}>Học kì 1</MenuItem>
							<MenuItem value={2}>Học kì 2</MenuItem>
						</Select>
					</FormControl>
				</Grid>

				<Grid item xs={12} md={6}>
					<FormControl fullWidth size="small">
						<InputLabel id="class-label">Chọn Lớp học</InputLabel>
						<Select
							labelId="class-label"
							id="class-select"
							name="classId"
							size="small"
							value={selectedClass}
							onChange={handleChange}
							label="Chọn Lớp học"
							required
						>
							{classes.map((classItem) => (
								<MenuItem key={classItem.id} value={classItem.id}>
									{classItem.name}- năm học: {classItem.academicYear.name}
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
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
};

export default ScoreView;

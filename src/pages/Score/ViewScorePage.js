import React, { useState, useEffect } from "react";
import DataTable from "../../components/common/DataTable/DataTable";
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
} from "@mui/material";

const ViewScorePage = () => {
	const [students, setStudents] = useState([]);
	const { classId } = useParams();
	const [subjects, setSubjects] = useState([]);
	const [scoreTypes, setScoreTypes] = useState([]);
	const [semester, setSemester] = useState(1);
	const [scoreData, setScoreData] = useState([]);
	const averageScores = {};

	const navigate = useNavigate();

	const handlesemesterChange = (event) => {
		setSemester(event.target.value);
	};

	const handleGoBack = () => {
		navigate(-1);
	};

	useEffect(() => {
		const fetchScoreData = async () => {
			try {
				const studentId = 1;

				const scoreTypeResponse = await client.get("/api/score-types");
				const subjectResponse = await client.get("/api/subjects");

				const scoreResponse = await client.get(
					`/api/scores/semester?classId=${classId}&semester=${semester}&studentId=${studentId}`
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
	}, [classId, semester]);

	const getHeader = () => (
		<>
			<IconButton onClick={handleGoBack}>
				<ArrowBackIcon />
			</IconButton>

			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				padding="5px"
				flexWrap="wrap"
			>
				<FormControl fullWidth margin="normal" size="small">
					<InputLabel id="semester-label">Chọn Học kỳ</InputLabel>
					<Select
						labelId="semester-label"
						id="semester-select"
						name="semester"
						value={semester}
						onChange={handlesemesterChange}
						label="Chọn Học kỳ"
						required
						defaultValue={1}
					>
						<MenuItem value={1}>Học kỳ 1</MenuItem>
						<MenuItem value={2}>Học kỳ 2</MenuItem>
					</Select>
				</FormControl>
			</Box>
		</>
	);

	const getContent = () => (
		<>
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

			<Box
				display="flex"
				justifyContent="flex-end"
				alignItems="center"
				padding="5px"
			>
				<Button
					variant="contained"
					color="primary"
					// onClick={handleExportExcel}
					style={{
						backgroundImage: "linear-gradient(to right, #8bc34a, #4caf50)",
						fontSize: "1.2rem",
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
			<BasicCard header={getHeader()} content={getContent()} />
		</GridWrapper>
	);
};

export default ViewScorePage;

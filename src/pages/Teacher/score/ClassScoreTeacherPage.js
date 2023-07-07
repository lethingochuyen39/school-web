import React, { useState, useEffect } from "react";
import DataTable from "../../../components/common/DataTable/DataTable";
import client from "../../../api/client";
import Box from "@mui/material/Box";
import GridWrapper from "../../../components/common/GridWrapper/GridWrapper";
import BasicCard from "../../../components/common/BasicCard/BasicCard";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
	Button,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Alert,
	AlertTitle,
	Stack,
	IconButton,
} from "@mui/material";

const ClassScoreTeacherPage = () => {
	const [students, setStudents] = useState([]);
	const [loading, setLoading] = useState(true);
	const { classId } = useParams();
	const [selectedSubject, setSelectedSubject] = useState("");
	const [selectedScoreType, setSelectedScoreType] = useState("");
	const [subjects, setSubjects] = useState([]);
	const [scoreTypes, setScoreTypes] = useState([]);
	const [errors, setErrors] = useState({});
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		const fetchStudents = async () => {
			try {
				const response = await client.get(
					`/api/student/classes/${classId}/students`
				);
				const updatedStudents = response.data.map((student) => ({
					...student,
					score: "",
				}));
				setStudents(updatedStudents);
				setLoading(false);
			} catch (error) {
				console.error(error);
				setLoading(false);
			}
		};

		fetchStudents();
	}, [classId]);

	const fetchSubjects = async () => {
		try {
			const response = await client.get("/api/subjects");
			const subjects = response.data;
			setSubjects(subjects);
			setSelectedSubject(subjects[0].id);
		} catch (error) {
			console.error(error);
		}
	};

	const fetchScoreTypes = async () => {
		try {
			const response = await client.get("/api/score-types");
			const scoreTypes = response.data;
			setScoreTypes(scoreTypes);
			setSelectedScoreType(scoreTypes[0].id);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchSubjects();
		fetchScoreTypes();
	}, []);

	const handleScoreInput = (id, newScore) => {
		const cleanedScore = newScore.trim();

		const isValid = /^\d*\.?\d*$/.test(cleanedScore);

		if (!isValid) {
			const newError = { message: "Điểm phải là một số dương" };
			setErrors((prevErrors) => ({
				...prevErrors,
				[id]: newError,
			}));
		} else {
			const parsedScore = parseFloat(cleanedScore);
			if (parsedScore < 0 || parsedScore > 10) {
				const newError = { message: "Điểm phải là số từ 0 đến 10" };
				setErrors((prevErrors) => ({
					...prevErrors,
					[id]: newError,
				}));
			} else {
				setErrors((prevErrors) => {
					const updatedErrors = { ...prevErrors };
					delete updatedErrors[id];
					return updatedErrors;
				});
			}
		}

		setStudents((prevStudents) => {
			return prevStudents.map((student) => {
				if (student.id === id) {
					return {
						...student,
						score: cleanedScore || "",
					};
				}
				return student;
			});
		});
	};

	const renderErrorMessage = (id) => {
		const errorObj = errors[id];
		if (errorObj) {
			return (
				<Alert severity="error">
					<AlertTitle>Error</AlertTitle>
					{errorObj.message}
				</Alert>
			);
		}
		return null;
	};

	const handleSubjectChange = (event) => {
		setSelectedSubject(event.target.value);
	};

	const handleScoreTypeChange = (event) => {
		setSelectedScoreType(event.target.value);
	};

	const handleSaveScores = async () => {
		if (Object.keys(errors).length > 0) {
			setErrorMessage("Vui lòng kiểm tra lại điểm nhập vào");
			return;
		}
		for (const row of students) {
			if (row.score !== "") {
				const scoreToAdd = {
					studentId: row.id,
					subjectId: selectedSubject,
					scoreTypeId: selectedScoreType,
					score: row.score,
				};

				try {
					await client.post("/api/scores", scoreToAdd);
					setErrors({});
					setSuccessMessage("Thao tác thành công");
					setErrorMessage("");
				} catch (error) {
					if (error.response && error.response.data) {
						setErrorMessage(error.response.data);
					} else {
						setErrorMessage("Có lỗi xảy ra");
					}
					setSuccessMessage("");
					setErrors({ [row.id]: { message: "Lỗi khi lưu điểm" } });
				}
			}
		}
	};

	const handleGoBack = () => {
		navigate(-1);
	};

	const columns = [
		{ field: "id", headerName: "ID", width: 100, disableActions: true },
		{ field: "name", headerName: "Học sinh", width: 150, disableActions: true },
		{
			field: "score",
			headerName: "Điểm",
			width: 500,
			renderCell: (params) => (
				<>
					<input
						type="text"
						name="score"
						value={params.row.score}
						onChange={(e) => handleScoreInput(params.id, e.target.value)}
					/>
					{renderErrorMessage(params.id)}
				</>
			),
			disableActions: true,
		},
	];

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
				<Box width="calc(50% - 10px)" marginRight="10px">
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
							{subjects.map((subject) => (
								<MenuItem key={subject.id} value={subject.id}>
									{subject.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Box>
				<Box width="calc(50% - 10px)" marginLeft="10px">
					<FormControl fullWidth margin="normal">
						<InputLabel id="scoreType-label">Chọn Loại điểm</InputLabel>
						<Select
							labelId="scoreType-label"
							id="scoreType-select"
							name="scoreTypeId"
							value={selectedScoreType}
							onChange={handleScoreTypeChange}
							label="Chọn loại điểm"
							displayEmpty
							fullWidth
							sx={{ height: "40px" }}
						>
							{scoreTypes.map((scoreType) => (
								<MenuItem key={scoreType.id} value={scoreType.id}>
									{scoreType.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Box>
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
				Nhập điểm lớp
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
					onClick={handleSaveScores}
					style={{
						background: "linear-gradient(45deg, #304ffe, #42a5f5)",
						fontSize: "1.2rem",
						boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
					}}
				>
					Lưu Điểm
				</Button>
			</Box>
			<Stack sx={{ width: "100%" }} spacing={2}>
				{errorMessage && (
					<Alert severity="error">
						<AlertTitle>Error</AlertTitle>
						{errorMessage}
					</Alert>
				)}
				{successMessage && (
					<Alert severity="success">
						<AlertTitle>Success</AlertTitle>
						{successMessage}
					</Alert>
				)}
			</Stack>
			<DataTable
				initialRows={students}
				columns={columns}
				loading={loading}
				hiddenActions={["view", "edit", "delete"]}
			/>
		</>
	);

	return (
		<GridWrapper>
			<BasicCard header={getHeader()} content={getContent()} />
		</GridWrapper>
	);
};

export default ClassScoreTeacherPage;

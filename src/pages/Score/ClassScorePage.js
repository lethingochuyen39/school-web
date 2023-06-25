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
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Alert,
	AlertTitle,
	Stack,
	IconButton,
} from "@mui/material";
const ClassScorePage = () => {
	const [students, setStudents] = useState([]);
	const [loading, setLoading] = useState(true);
	const { classId } = useParams();
	const [score, setScore] = useState("");
	const [selectedSubject, setSelectedSubject] = useState("");
	const [selectedScoreType, setSelectedScoreType] = useState("");
	const [subjects, setSubjects] = useState([]);
	const [scoreTypes, setScoreTypes] = useState([]);
	const [hasError, setHasError] = useState(false);
	const [isAddedSuccessfully, setIsAddedSuccessfully] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchStudents = async () => {
			try {
				const response = await client.get(`/api/classes/${classId}/students`);
				const updatedStudents = response.data.map((student) => ({
					...student,
					score: "", // Thêm thuộc tính score với giá trị ban đầu là chuỗi rỗng
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
		// Tìm học sinh có id tương ứng trong state students
		const updatedStudents = students.map((student) => {
			if (student.id === id) {
				return {
					...student,
					score: newScore, // Cập nhật giá trị score cho học sinh
				};
			}
			return student;
		});

		setStudents(updatedStudents); // Cập nhật state students mới
	};
	const handleSubjectChange = (event) => {
		setSelectedSubject(event.target.value);
	};

	const handleScoreTypeChange = (event) => {
		setSelectedScoreType(event.target.value);
	};

	const handleSaveScores = async () => {
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
					setHasError(false);
					setIsAddedSuccessfully(true);
				} catch (error) {
					console.error("Lỗi khi lưu điểm:", error);
					setHasError(true);
					setIsAddedSuccessfully(false);
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
			width: 250,
			renderCell: (params) => (
				<input
					type="text"
					value={params.row.score}
					onChange={(e) => handleScoreInput(params.id, e.target.value)}
				/>
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
				padding="20px"
				paddingTop="5px"
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
			>
				Nhập điểm lớp
			</Box>

			<Box
				display="flex"
				justifyContent="flex-end"
				alignItems="center"
				padding="20px"
				paddingTop="5px"
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
				{hasError ? (
					<Alert severity="error">
						<AlertTitle>Error</AlertTitle>
						Đã có lỗi xảy ra khi thêm bảng điểm —{" "}
						<strong>vui lòng thử lại sau!</strong>
					</Alert>
				) : isAddedSuccessfully ? (
					<Alert severity="success">
						<AlertTitle>Success</AlertTitle>
						Cập nhật danh sách điểm thành công!
					</Alert>
				) : null}
			</Stack>
			<DataTable
				initialRows={students}
				columns={columns}
				loading={loading}
				handleEdit={handleScoreInput}
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

export default ClassScorePage;

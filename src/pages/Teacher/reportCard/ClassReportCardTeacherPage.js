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

const ClassReportCardTeacherPage = () => {
	const [students, setStudents] = useState([]);
	const [loading, setLoading] = useState(true);
	const { classId } = useParams();
	const [selectedAcademicYear, setSelectedAcademicYear] = useState("");
	const [academicYears, setAcademicYears] = useState([]);
	const [errors, setErrors] = useState({});
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		const fetchInitialData = async () => {
			try {
				const [studentsResponse, academicYearsResponse] =
					await Promise.all([
						client.get(`/api/student/classes/${classId}/students`),
						client.get(`/api/academic-years/all`),
					]);

				const updatedStudents = studentsResponse.data.map((student) => ({
					...student,
					averageScore: "",
				}));

				const academicYears = academicYearsResponse.data;

				setStudents(updatedStudents);
				setAcademicYears(academicYears);
				setSelectedAcademicYear(academicYears[0].id);
				setLoading(false);
			} catch (error) {
				console.error(error);
				setLoading(false);
			}
		};

		fetchInitialData();
	}, [classId]);

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
						averageScore: cleanedScore || "",
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

	const handleScoreTypeChange = (event) => {
		setSelectedAcademicYear(event.target.value);
	};

	const handleSaveAvarageScores = async () => {
		if (Object.keys(errors).length > 0) {
			setErrorMessage("Vui lòng kiểm tra lại điểm nhập vào");
			return;
		}
		for (const row of students) {
			if (row.averageScore !== "") {
				const reportCardToAdd = {
					studentId: row.id,
                    averageScore: row.averageScore,
					academicYearId: selectedAcademicYear,
				};

				try {
					await client.post("/api/report_cards/create", reportCardToAdd);
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
			field: "averageScore",
			headerName: "Điểm Trung Bình",
			width: 500,
			renderCell: (params) => (
				<>
					<input
						type="text"
						name="averageScore"
						value={params.row.averageScore}
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
				<Box width="calc(20% - 100px)" marginLeft="500px">
					<FormControl fullWidth margin="normal">
						<InputLabel id="academicYear-label">Chọn Năm Học</InputLabel>
						<Select
							labelId="academicYear-label"
							id="academicYear-select"
							name="academicYearId"
							value={selectedAcademicYear}
							onChange={handleScoreTypeChange}
							label="Chọn loại điểm"
							displayEmpty
							fullWidth
							sx={{ height: "40px" }}
						>
							{academicYears.map((academicYear) => (
								<MenuItem key={academicYear.id} value={academicYear.id}>
									{academicYear.name}
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
				Nhập điểm trung bình năm học
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
					onClick={handleSaveAvarageScores}
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

export default ClassReportCardTeacherPage;

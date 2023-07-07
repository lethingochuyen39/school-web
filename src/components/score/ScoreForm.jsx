import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import validate from "validate.js";
import client from "../../api/client";
import {
	Alert,
	FormControl,
	FormHelperText,
	InputLabel,
	MenuItem,
	Select,
	Typography,
} from "@mui/material";

const schema = {
	studentId: {
		presence: {
			allowEmpty: false,
			message: "^Vui lòng chọn học sinh",
		},
	},
	subjectId: {
		presence: {
			allowEmpty: false,
			message: "^Vui lòng chọn môn học",
		},
	},
	scoreTypeId: {
		presence: {
			allowEmpty: false,
			message: "^Vui lòng chọn loại điểm",
		},
	},
	score: {
		presence: {
			allowEmpty: false,
			message: "^Vui lòng nhập điểm",
		},
		numericality: {
			greaterThanOrEqualTo: 0,
			lessThanOrEqualTo: 10,
			message: "^Điểm phải nằm trong khoảng từ 0 đến 10",
		},
	},
};

const ScoreForm = ({
	handleClose,
	isEditMode,
	initialData,
	students,
	subjects,
	scoreTypes,
	fetchData,
}) => {
	const [score, setScore] = useState({
		id: isEditMode ? initialData.id : "",
		studentId: isEditMode ? initialData.student.id : "",
		subjectId: isEditMode ? initialData.subject.id : "",
		scoreTypeId: isEditMode ? initialData.scoreType.id : "",
		score: isEditMode ? initialData.score : "",
	});

	const [showModal, setShowModal] = useState(true);
	const [error, setError] = useState(null);
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	useEffect(() => {
		if (isEditMode && initialData) {
			setScore({
				id: initialData.id,
				studentId: initialData.student.id,
				subjectId: initialData.subject.id,
				scoreTypeId: initialData.scoreType.id,
				score: initialData.score,
			});
		}
	}, [isEditMode, initialData, students, subjects, scoreTypes]);

	const handleSubmit = async (event) => {
		event.preventDefault();

		try {
			const errors = validate(score, schema);
			if (errors) {
				setError(errors);
				return;
			}

			if (isEditMode) {
				const updatedScore = {
					score: score.score,
				};
				await client.put(`/api/scores/${score.id}`, updatedScore);
				await fetchData();
			} else {
				await client.post("/api/scores", score);
				await fetchData();
			}
			setSuccessMessage("Thao tác thành công");
			setErrorMessage("");
		} catch (error) {
			setErrorMessage(error.response.data);
			setSuccessMessage("");
		}
	};

	const handleCloseModal = () => {
		setShowModal(false);
		handleClose();
	};

	const hasError = (field) => {
		return error && error[field] ? true : false;
	};

	const getErrorMessage = (field) => {
		return hasError(field) ? error[field][0] : "";
	};

	const handleChange = (event) => {
		const { name, value } = event.target;
		setScore((prevScore) => ({
			...prevScore,
			[name]: value,
		}));

		const errors = validate({ ...score, [name]: value }, schema);
		setError((prevError) => ({
			...prevError,
			[name]: errors ? errors[name] : null,
		}));
	};

	return (
		<Modal open={showModal} onClose={handleCloseModal}>
			<Box
				sx={{
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					width: 500,
					maxHeight: "90%",
					bgcolor: "background.paper",
					border: "2px solid #000",
					boxShadow: 24,
					p: 4,
				}}
			>
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
					{isEditMode ? "Cập nhật điểm" : "Thêm mới điểm"}
				</Typography>
				{successMessage && (
					<Alert severity="success" onClose={() => setSuccessMessage("")}>
						{successMessage}
					</Alert>
				)}
				{errorMessage && (
					<Alert severity="error" onClose={() => setErrorMessage("")}>
						{errorMessage}
					</Alert>
				)}
				<form onSubmit={handleSubmit}>
					{isEditMode ? (
						<TextField
							type="number"
							name="score"
							label="Điểm"
							value={score.score}
							onChange={handleChange}
							fullWidth
							margin="normal"
							variant="outlined"
							required
							error={hasError("score")}
							helperText={getErrorMessage("score")}
						/>
					) : (
						<>
							<FormControl
								fullWidth
								margin="normal"
								error={hasError("studentId")}
							>
								<InputLabel id="student-label">Học sinh</InputLabel>
								<Select
									labelId="student-label"
									id="student-select"
									name="studentId"
									value={score.studentId}
									onChange={handleChange}
									label="Học sinh"
									required
								>
									{students.map((student) => (
										<MenuItem key={student.id} value={student.id}>
											{student.name}
										</MenuItem>
									))}
								</Select>
								{hasError("studentId") && (
									<FormHelperText>
										{getErrorMessage("studentId")}
									</FormHelperText>
								)}
							</FormControl>

							<FormControl
								fullWidth
								margin="normal"
								error={hasError("subjectId")}
							>
								<InputLabel id="subject-label">Môn học</InputLabel>
								<Select
									labelId="subject-label"
									id="subject-select"
									name="subjectId"
									value={score.subjectId}
									onChange={handleChange}
									label="Môn học"
								>
									{subjects.map((subject) => (
										<MenuItem key={subject.id} value={subject.id}>
											{subject.name}
										</MenuItem>
									))}
								</Select>
								{hasError("subjectId") && (
									<FormHelperText>
										{getErrorMessage("subjectId")}
									</FormHelperText>
								)}
							</FormControl>

							<FormControl
								fullWidth
								margin="normal"
								error={hasError("scoreTypeId")}
							>
								<InputLabel id="scoreType-label">Loại điểm</InputLabel>
								<Select
									labelId="scoreType-label"
									id="scoreType-select"
									name="scoreTypeId"
									value={score.scoreTypeId}
									onChange={handleChange}
									label="Loại điểm"
								>
									{scoreTypes.map((scoreType) => (
										<MenuItem key={scoreType.id} value={scoreType.id}>
											{scoreType.name}
										</MenuItem>
									))}
								</Select>
								{hasError("scoreTypeId") && (
									<FormHelperText>
										{getErrorMessage("scoreTypeId")}
									</FormHelperText>
								)}
							</FormControl>

							<TextField
								type="number"
								name="score"
								label="Điểm"
								value={score.score}
								onChange={handleChange}
								fullWidth
								margin="normal"
								variant="outlined"
								required
								error={hasError("score")}
								helperText={getErrorMessage("score")}
							/>
						</>
					)}
					<Button type="submit" variant="contained" onClick={handleSubmit}>
						{isEditMode ? "Cập nhật" : "Thêm"}
					</Button>
					<Button onClick={handleCloseModal} color="error">
						Hủy
					</Button>
				</form>
			</Box>
		</Modal>
	);
};

export default ScoreForm;

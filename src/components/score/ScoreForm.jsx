import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import validate from "validate.js";
import {
	FormControl,
	FormHelperText,
	InputLabel,
	MenuItem,
	Select,
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
	handleAddScore,
	handleUpdateScore,
	handleClose,
	isEditMode,
	initialData,
	students,
	subjects,
	scoreTypes,
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
				await handleUpdateScore(score.id, updatedScore);
			} else {
				await handleAddScore(score);
			}

			handleClose();
		} catch (error) {
			setError(error);
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
					bgcolor: "background.paper",
					border: "2px solid #000",
					boxShadow: 24,
					p: 4,
				}}
			>
				<h2>{isEditMode ? "Cập nhật điểm" : "Thêm điểm"}</h2>

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
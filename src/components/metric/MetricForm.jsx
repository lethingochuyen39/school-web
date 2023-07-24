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
import client from "../../api/client";
const schema = {
	description: {
		presence: {
			allowEmpty: false,
			message: "^Miêu tả không được bỏ trống",
		},
		length: {
			minimum: 1,
			maximum: 255,
			message: "^Miêu tả phải có từ 1 đến 255 ký tự",
		},
	},
	name: {
		presence: {
			allowEmpty: false,
			message: "^Tên thống kê không được bỏ trống",
		},
		length: {
			minimum: 1,
			maximum: 255,
			message: "^Tên thống kê phải có từ 1 đến 255 ký tự",
		},
	},
	value: {
		presence: {
			allowEmpty: false,
			message: "^Vui lòng nhập giá trị",
		},
		numericality: {
			greaterThanOrEqualTo: 0,
			message: "^Giá trị phải là số dương",
		},
	},
	academicYearId: {
		presence: {
			allowEmpty: false,
			message: "^Vui lòng chọn năm học",
		},
	},
};

const MetricForm = ({
	handleAddMetric,
	handleUpdateMetric,
	handleClose,
	isEditMode,
	initialData,
	academicYears,
}) => {
	const [metric, setMetric] = useState({
		id: isEditMode ? initialData.id : "",
		name: isEditMode ? initialData.name : "",
		description: isEditMode ? initialData.description : "",
		value: isEditMode ? initialData.value : "",
		academicYearId: isEditMode ? initialData.academicYear.id : "",
	});
	const [showModal, setShowModal] = useState(true);
	const [error, setError] = useState(null);
	const [academicYearId, setAcademicYearId] = useState(0);
	const [students, setStudents] = useState([]);

	useEffect(() => {
		if (isEditMode && initialData) {
			setMetric({
				id: initialData.id,
				name: initialData.name,
				description: initialData.description,
				value: initialData.value,
				academicYearId: academicYearId,
			});
		}
	}, [isEditMode, initialData, academicYears]);

	const handleChange = (event) => {
		const { name, value } = event.target;
		const updatedValue = name === "value" ? parseInt(value, 10) : value;
		setMetric((prevMetric) => ({
			...prevMetric,
			[name]: updatedValue,
		}));
	};

	const handleAcademicYearChange = (event) => {
		const { value } = event.target;
		setAcademicYearId(value);
		setMetric((prevMetric) => ({
			...prevMetric,
			academicYearId: value,
		}));
	};

	useEffect(() => {
		client
			.get("/api/student/allStudent")
			.then((response) => {
				setStudents(response.data);
			})
			.catch((error) => {
				console.error(error);
			});
	}, []);

	useEffect(() => {
		// Lọc danh sách học sinh theo năm học đã chọn
		const filteredStudents = students.filter((student) =>
			student.className.some((cls) => cls.academicYear.id === academicYearId)
		);

		// Cập nhật giá trị của metric.value bằng số lượng học sinh tương ứng
		setMetric((prevMetric) => ({
			...prevMetric,
			value: filteredStudents.length,
		}));
	}, [academicYearId, students]);

	const handleSubmit = async (event) => {
		event.preventDefault();

		try {
			const errors = validate(metric, schema);
			if (errors) {
				setError(errors);
				return;
			}

			if (isEditMode) {
				const updatedMetric = {
					name: metric.name,
					description: metric.description,
				};
				await handleUpdateMetric(metric.id, updatedMetric);
			} else {
				await handleAddMetric({
					...metric,
				});
			}
			handleClose();
		} catch (error) {
			console.log(error);
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
	return (
		<Modal open={showModal} onClose={handleCloseModal}>
			<Box
				sx={{
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					width: 400,
					bgcolor: "background.paper",
					border: "2px solid #000",
					boxShadow: 24,
					p: 4,
				}}
			>
				<h2>{isEditMode ? "Cập nhật thống kê" : "Thêm mới thống kê"}</h2>

				<form onSubmit={handleSubmit}>
					{isEditMode ? (
						<>
							<TextField
								name="name"
								label="Tên thống kê"
								value={metric.name}
								onChange={handleChange}
								fullWidth
								margin="normal"
								variant="outlined"
								required
								error={hasError("name")}
								helperText={getErrorMessage("name")}
							/>
							<TextField
								name="description"
								label="Miêu tả"
								value={metric.description}
								onChange={handleChange}
								fullWidth
								margin="normal"
								variant="outlined"
								error={hasError("description")}
								helperText={getErrorMessage("description")}
							/>
						</>
					) : (
						<>
							<TextField
								name="name"
								label="Tên thống kê"
								value={metric.name}
								onChange={handleChange}
								fullWidth
								margin="normal"
								variant="outlined"
								required
								error={hasError("name")}
								helperText={getErrorMessage("name")}
							/>
							<TextField
								name="description"
								label="Miêu tả"
								value={metric.description}
								onChange={handleChange}
								fullWidth
								margin="normal"
								variant="outlined"
								error={hasError("description")}
								helperText={getErrorMessage("description")}
							/>
							<FormControl
								fullWidth
								margin="normal"
								error={hasError("academicYearId")}
							>
								<InputLabel id="academicYear-label">Năm học</InputLabel>
								<Select
									labelId="academicYear-label"
									id="academicYear-select"
									name="academicYearId"
									value={academicYearId}
									onChange={handleAcademicYearChange}
									label="Năm học"
								>
									{academicYears.map((academicYear) => (
										<MenuItem key={academicYear.id} value={academicYear.id}>
											{academicYear.name}
										</MenuItem>
									))}
								</Select>
								{hasError("academicYearId") && (
									<FormHelperText>
										{getErrorMessage("academicYearId")}
									</FormHelperText>
								)}
							</FormControl>
							<TextField
								name="value"
								label="Giá trị"
								value={metric.value}
								onChange={handleChange}
								fullWidth
								margin="normal"
								variant="outlined"
								disabled
								error={hasError("value")}
								helperText={getErrorMessage("value")}
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

export default MetricForm;

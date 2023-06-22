import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import client from "../../api/client";
import validate from "validate.js";

const schema = {
	endDate: {
		presence: {
			allowEmpty: false,
			message: "^Ngày kết thúc không được bỏ trống",
		},
	},
	startDate: {
		presence: {
			allowEmpty: false,
			message: "^Ngày bắt đầu không được bỏ trống",
		},
	},
	name: {
		presence: {
			allowEmpty: false,
			message: "^Tên năm học không được bỏ trống",
		},
		length: {
			minimum: 1,
			maximum: 255,
			message: "^Tên năm học phải có từ 1 đến 255 ký tự",
		},
	},
};
const AddForm = ({
	handleAddAcademicYear,
	handleUpdateAcademicYear,
	handleRefreshData,
	handleClose,
	isEditMode,
	initialData,
}) => {
	const [academicYear, setAcademicYear] = useState({
		id: isEditMode ? initialData.id : "",
		name: isEditMode ? initialData.name : "",
		startDate: isEditMode ? initialData.startDate : "",
		endDate: isEditMode ? initialData.endDate : "",
	});
	const [showModal, setShowModal] = useState(true);
	const [error, setError] = useState(null);
	useEffect(() => {
		if (isEditMode && initialData) {
			setAcademicYear(initialData);
		}
	}, [isEditMode, initialData]);
	const handleChange = (event) => {
		setAcademicYear((prev) => ({
			...prev,
			[event.target.name]: event.target.value,
		}));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		try {
			const errors = validate(academicYear, schema);
			if (errors) {
				setError(errors);
			}
			if (isEditMode) {
				await client.put(
					`/api/academic-years/${academicYear.id}`,
					academicYear
				);
				handleUpdateAcademicYear(academicYear);
			} else {
				const response = await client.post("/api/academic-years", academicYear);
				const addedAcademicYear = response.data;
				handleAddAcademicYear(addedAcademicYear);
				await handleRefreshData();
			}
			setAcademicYear({
				id: "",
				name: "",
				startDate: "",
				endDate: "",
			});
			setShowModal(false);
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
				<h2>{isEditMode ? "Cập nhật năm học" : "Thêm mới năm học"}</h2>

				<form onSubmit={handleSubmit}>
					<TextField
						name="name"
						label="Tên năm học"
						value={academicYear.name}
						onChange={handleChange}
						fullWidth
						margin="normal"
						variant="outlined"
						focused
						required
						error={hasError("name")}
						helperText={getErrorMessage("name")}
					/>
					<TextField
						name="startDate"
						label="Ngày bắt đầu"
						type="date"
						value={academicYear.startDate}
						onChange={handleChange}
						fullWidth
						margin="normal"
						variant="outlined"
						focused
						error={hasError("startDate")}
						helperText={getErrorMessage("startDate")}
					/>
					<TextField
						name="endDate"
						label="Ngày kết thúc"
						type="date"
						value={academicYear.endDate}
						onChange={handleChange}
						fullWidth
						margin="normal"
						variant="outlined"
						focused
						error={hasError("endDate")}
						helperText={getErrorMessage("endDate")}
					/>
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

export default AddForm;

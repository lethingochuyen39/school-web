import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import validate from "validate.js";
import { Alert, Typography } from "@mui/material";
import client from "../../api/client";
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
const AddForm = ({ handleClose, isEditMode, initialData, fetchData }) => {
	const [academicYear, setAcademicYear] = useState({
		id: isEditMode ? initialData.id : "",
		name: isEditMode ? initialData.name : "",
		startDate: isEditMode ? initialData.startDate : "",
		endDate: isEditMode ? initialData.endDate : "",
	});
	const [showModal, setShowModal] = useState(true);
	const [error, setError] = useState(null);
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	useEffect(() => {
		if (isEditMode && initialData) {
			setAcademicYear(initialData);
		}
	}, [isEditMode, initialData]);

	const handleChange = (event) => {
		const { name, value } = event.target;
		setAcademicYear((prev) => ({
			...prev,
			[name]: value,
		}));

		const errors = validate({ ...academicYear, [name]: value }, schema);
		setError((prevError) => ({
			...prevError,
			[name]: errors ? errors[name] : null,
		}));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		try {
			const errors = validate(academicYear, schema);
			if (errors) {
				setError(errors);
				return;
			}
			if (isEditMode) {
				await client.put(
					`/api/academic-years/${academicYear.id}`,
					academicYear
				);
			} else {
				await client.post("/api/academic-years", academicYear);
			}
			await fetchData();

			console.log("Data from API:", academicYear);
			setSuccessMessage("Thao tác thành công");
			setErrorMessage("");
		} catch (error) {
			console.log(error);
			if (error.response && error.response.data) {
				setErrorMessage(error.response.data);
			} else {
				setErrorMessage("Có lỗi xảy ra");
			}
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
					maxWidth: "90%",
					maxHeight: "80%",
					overflow: "auto",
				}}
			>
				<Typography
					id="modal-title"
					variant="h4"
					sx={{
						mb: 2,
						fontWeight: "bold",
						textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)",
						color: "#FF4500",
						textAlign: "center",
					}}
				>
					{isEditMode ? "Cập nhật năm học" : "Thêm mới năm học"}
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
						disabled={isEditMode}
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
						disabled={isEditMode}
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
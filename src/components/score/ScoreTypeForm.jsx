import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import validate from "validate.js";
import { Alert, Typography } from "@mui/material";
import client from "../../api/client";
const schema = {
	name: {
		presence: {
			allowEmpty: false,
			message: "^Vui lòng nhập tên loại điểm.",
		},
		length: {
			minimum: 1,
			maximum: 255,
			message: "^Tên loại điểm phải có từ 1 đến 255 ký tự.",
		},
	},
	coefficient: {
		presence: {
			allowEmpty: false,
			message: "^Vui lòng nhập hệ số.",
		},
		numericality: {
			greaterThanOrEqualTo: 1,
			message: "^Loại điểm phải lớn hơn 0",
		},
	},
};
const ScoreTypeForm = ({ handleClose, isEditMode, initialData, fetchData }) => {
	const [scoreType, setScoreType] = useState({
		id: isEditMode ? initialData.id : "",
		name: isEditMode ? initialData.name : "",
		coefficient: isEditMode ? initialData.coefficient : "",
	});
	const [showModal, setShowModal] = useState(true);
	const [error, setError] = useState(null);
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	useEffect(() => {
		if (isEditMode && initialData) {
			setScoreType(initialData);
		}
	}, [isEditMode, initialData]);

	const handleChange = (event) => {
		const { name, value } = event.target;
		setScoreType((prev) => ({
			...prev,
			[name]: value,
		}));

		const errors = validate({ ...scoreType, [name]: value }, schema);
		setError((prevError) => ({
			...prevError,
			[name]: errors ? errors[name] : null,
		}));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		try {
			const errors = validate(scoreType, schema);
			if (errors) {
				setError(errors);
				return;
			}

			if (isEditMode) {
				await client.put(`/api/score-types/${scoreType.id}`, scoreType);
			} else {
				await client.post("/api/score-types", scoreType);
			}
			await fetchData();
			setSuccessMessage("Thao tác thành công");
			setErrorMessage("");
		} catch (error) {
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
					maxHeight: "90%",
					overflow: "auto",
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
					{isEditMode ? "Cập nhật loại điểm" : "Thêm mới loại điểm"}
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
						label="Tên loại điểm"
						value={scoreType.name}
						onChange={handleChange}
						fullWidth
						margin="normal"
						variant="outlined"
						required
						error={hasError("name")}
						helperText={getErrorMessage("name")}
					/>

					<TextField
						type="number"
						name="coefficient"
						label="Hệ số"
						value={scoreType.coefficient}
						onChange={handleChange}
						fullWidth
						margin="normal"
						variant="outlined"
						required
						error={hasError("coefficient")}
						helperText={getErrorMessage("coefficient")}
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

export default ScoreTypeForm;

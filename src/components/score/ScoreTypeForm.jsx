import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import client from "../../api/client";
import validate from "validate.js";

const schema = {
	name: {
		presence: {
			allowEmpty: false,
			message: "^Tên loại điểm không được bỏ trống",
		},
		length: {
			minimum: 1,
			maximum: 255,
			message: "^Tên loại điểm phải có từ 1 đến 255 ký tự",
		},
	},
};
const ScoreTypeForm = ({
	handleAddScoreType,
	handleUpdateScoreType,
	handleRefreshData,
	handleClose,
	isEditMode,
	initialData,
}) => {
	const [scoreType, setScoreType] = useState({
		id: isEditMode ? initialData.id : "",
		name: isEditMode ? initialData.name : "",
	});
	const [showModal, setShowModal] = useState(true);
	const [error, setError] = useState(null);
	useEffect(() => {
		if (isEditMode && initialData) {
			setScoreType(initialData);
		}
	}, [isEditMode, initialData]);
	const handleChange = (event) => {
		setScoreType((prev) => ({
			...prev,
			[event.target.name]: event.target.value,
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
				handleUpdateScoreType(scoreType);
				await handleRefreshData();
			} else {
				const response = await client.post("/api/score-types", scoreType);
				const addedScoreType = response.data;
				handleAddScoreType(addedScoreType);
				await handleRefreshData();
			}
			setScoreType({
				id: "",
				name: "",
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
				<h2>{isEditMode ? "Cập nhật loại điểm" : "Thêm mới loại điểm"}</h2>

				<form onSubmit={handleSubmit}>
					<TextField
						name="name"
						label="Tên loại điểm"
						value={scoreType.name}
						onChange={handleChange}
						fullWidth
						margin="normal"
						variant="outlined"
						focused
						required
						error={hasError("name")}
						helperText={getErrorMessage("name")}
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

import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

import Box from "@mui/material/Box";
import validate from "validate.js";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import Grid from "@mui/material/Grid";
import { FormHelperText, Typography } from "@mui/material";

const schema = {
	title: {
		presence: {
			allowEmpty: false,
			message: "^Vui lòng nhập tiêu đề",
		},
		length: {
			minimum: 1,
			maximum: 255,
			message: "^Kích thước từ 1 đến 255 ký tự",
		},
	},
	file: {
		presence: {
			allowEmpty: false,
			message: "^Vui lòng chọn một file",
		},
	},
};
const DocumentForm = ({
	handleAddDocument,
	handleUpdateDocument,
	handleClose,
	isEditMode,
	initialData,
	uploadedById,
}) => {
	const [document, setDocument] = useState({
		id: initialData ? initialData.id : "",
		title: initialData ? initialData.title : "",
		description: initialData ? initialData.description : "",
		file: null,
		// file: initialData ? { name: initialData.fileName } : null,
	});
	const [showModal, setShowModal] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (isEditMode && initialData) {
			setDocument({
				...initialData,
			});
		}
	}, [isEditMode, initialData]);

	const handleSubmit = async (event) => {
		event.preventDefault();
		console.log(uploadedById);
		const formData = new FormData();
		formData.append("file", document.file);
		formData.append("uploadedById", uploadedById);

		const { title, description } = document;
		formData.append("title", title);
		formData.append("description", description);

		try {
			if (isEditMode && document.id) {
				if (!document.file) {
					formData.delete("file");
				}
				await handleUpdateDocument(formData);
			} else {
				const errors = validate(document, schema);
				if (errors) {
					setError(errors);
					return;
				}
				await handleAddDocument(formData);
			}
			handleClose();
		} catch (error) {
			if (error.response) {
				if (error.response.status === 400 || error.response.status === 500) {
					const errorMessage =
						error.response.data && error.response.data.message
							? error.response.data.message
							: "Đã xảy ra lỗi không xác định. Vui lòng thử lại sau.";
					setError(errorMessage);
				}
			} else {
				setError("Đã xảy ra lỗi không xác định. Vui lòng thử lại sau.");
			}
		}
	};

	const handleCloseModal = () => {
		setShowModal(false);
		handleClose();
	};

	const handleChange = (event) => {
		const { name, value } = event.target;
		setDocument((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleFileChange = (event) => {
		const file = event.target.files[0];
		setDocument((prev) => ({
			...prev,
			file: file,
		}));
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
					{isEditMode ? "Cập nhật tài liệu" : "Thêm tài liệu"}
				</Typography>

				<form onSubmit={handleSubmit}>
					<TextField
						type="text"
						name="title"
						label="Tiêu đề"
						value={document.title}
						onChange={handleChange}
						fullWidth
						margin="normal"
						variant="outlined"
						required
						sx={{ mb: 2 }}
						error={hasError("title")}
						helperText={getErrorMessage("title")}
					/>

					<TextField
						type="text"
						name="description"
						label="Mô tả"
						value={document.description}
						onChange={handleChange}
						fullWidth
						margin="normal"
						variant="outlined"
						sx={{ mb: 2 }}
					/>

					<Grid container spacing={2}>
						<Grid item xs={4}>
							<label
								htmlFor="file-upload"
								style={{ display: "flex", alignItems: "center" }}
							>
								<Button
									variant="outlined"
									component="span"
									startIcon={<CloudUploadIcon />}
									sx={{
										backgroundColor: "#ffc400",
										color: "black",
										marginBottom: "8px",
										"&:hover": {
											color: "black",
										},
									}}
								>
									Chọn file
								</Button>
								<input
									type="file"
									id="file-upload"
									name="file"
									accept=".pdf,.doc,.docx,excel.exe"
									style={{ display: "none" }}
									onChange={handleFileChange}
								/>
							</label>
						</Grid>
						<Grid item xs={4}>
							{document.file && (
								<Typography
									variant="body1"
									sx={{
										width: "100%",
										padding: "8px",
										backgroundColor: "#eee",
										color: "#555",
										border: "none",
										borderRadius: "4px",
										overflow: "hidden",
										textOverflow: "ellipsis",
										whiteSpace: "nowrap",
									}}
								>
									{document.file.name}
								</Typography>
							)}
							{error && !document.file && !isEditMode && (
								<FormHelperText error>{getErrorMessage("file")}</FormHelperText>
							)}
						</Grid>
						<Grid item xs={4}>
							{/* Thêm mã JSX để hiển thị lỗi */}
						</Grid>
					</Grid>

					{/* {error && <p style={{ color: "red" }}>{error}</p>} */}

					<Button
						type="submit"
						variant="contained"
						onClick={handleSubmit}
						sx={{ mt: 2 }}
					>
						{isEditMode ? "Cập nhật" : "Thêm"}
					</Button>
					<Button onClick={handleCloseModal} color="error" sx={{ mt: 2 }}>
						Hủy
					</Button>
				</form>
			</Box>
		</Modal>
	);
};

export default DocumentForm;

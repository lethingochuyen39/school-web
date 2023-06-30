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
	content: {
		presence: {
			allowEmpty: false,
			message: "^Vui lòng nhập nội dung",
		},
	},
};
const NewsForm = ({
	handleAddNews,
	handleUpdateNews,
	handleClose,
	isEditMode,
	initialData,
}) => {
	const [news, setNews] = useState({
		id: initialData ? initialData.id : "",
		title: initialData ? initialData.title : "",
		content: initialData ? initialData.content : "",
		isActive: initialData ? initialData.isActive : true,
		image: null,
	});
	const [showModal, setShowModal] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (isEditMode && initialData) {
			setNews({
				...initialData,
			});
		}
	}, [isEditMode, initialData]);

	const handleSubmit = async (event) => {
		event.preventDefault();

		const formData = new FormData();
		formData.append("image", news.image);

		const { title, content, isActive } = news;
		formData.append("title", title);
		formData.append("content", content);
		formData.append("isActive", isActive);

		try {
			if (isEditMode && news.id) {
				if (!news.image) {
					formData.delete("image");
				}
				await handleUpdateNews(formData);
			} else {
				const errors = validate(news, schema);
				if (errors) {
					setError(errors);
					return;
				}
				await handleAddNews(formData);
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
				setError("Đã xảy ra lỗi không xác định.");
			}
		}
	};

	const handleCloseModal = () => {
		setShowModal(false);
		handleClose();
	};

	const handleChange = ({ target: { name, value } }) => {
		setNews((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleImageChange = (event) => {
		const image = event.target.files[0];
		setNews((prev) => ({
			...prev,
			image: image,
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
				<Typography variant="h3" sx={{ mb: 2 }}>
					{isEditMode ? "Cập nhật tin tức" : "Thêm tin tức"}
				</Typography>

				<form onSubmit={handleSubmit}>
					<TextField
						type="text"
						name="title"
						label="Tiêu đề"
						value={news.title}
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
						name="content"
						label="Nội dung"
						value={news.content}
						onChange={handleChange}
						fullWidth
						margin="normal"
						variant="outlined"
						sx={{ mb: 2 }}
					/>

					<Grid container spacing={2}>
						<Grid item xs={4}>
							<label
								htmlFor="image-upload"
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
									Chọn ảnh
								</Button>
								<input
									type="file"
									id="image-upload"
									name="image"
									accept=".jpg,.png,.jfif,."
									style={{ display: "none" }}
									onChange={handleImageChange}
								/>
							</label>
						</Grid>
						<Grid item xs={4}>
							{news.image && (
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
									{news.image.name}
								</Typography>
							)}
						</Grid>
						<Grid item xs={4}></Grid>
					</Grid>

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

export default NewsForm;

import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import validate from "validate.js";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Grid from "@mui/material/Grid";
import { Alert, Switch, Typography } from "@mui/material";
import client from "../../api/client";
import { format } from "date-fns";
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
	handleClose,
	isEditMode,
	initialData,
	fetchData,
	imageUrls,
}) => {
	const [news, setNews] = useState({
		id: initialData ? initialData.id : "",
		title: initialData ? initialData.title : "",
		content: initialData ? initialData.content : "",
		isActive: initialData ? initialData.isActive : true,
		image: null,
		imageURL: initialData ? initialData.imagePath : null,
	});
	const [showModal, setShowModal] = useState(true);
	const [error, setError] = useState(null);
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	useEffect(() => {
		if (isEditMode && initialData) {
			setNews((prev) => ({
				...prev,
				isActive: initialData.isActive,
			}));
		}
	}, [isEditMode, initialData]);

	const handleSubmit = async (event) => {
		event.preventDefault();

		const formData = new FormData();
		formData.append("image", news.image);
		formData.append("title", news.title);
		formData.append("content", news.content);
		formData.append("isActive", news.isActive);

		const formattedUpdatedAt = format(
			new Date(),
			"yyyy-MM-dd'T'HH:mm:ss.SSSSSS"
		);
		formData.append("updatedAt", formattedUpdatedAt);

		try {
			if (isEditMode && news.id) {
				if (!news.image) {
					formData.delete("image");
				}
				if (!formData) {
					formData = { isActive: news.isActive };
				}
				await client.put(`/api/news/edit/${news.id}`, formData, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
				});
			} else {
				const errors = validate(news, schema);
				if (errors) {
					setError(errors);
					return;
				}
				await client.post("/api/news", news, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
				});
			}
			await fetchData();
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

	const handleChange = (event) => {
		const { name, value } = event.target;
		setNews((prev) => ({
			...prev,
			[name]: value,
		}));

		const errors = validate({ ...news, [name]: value }, schema);
		setError((prevError) => ({
			...prevError,
			[name]: errors ? errors[name] : null,
		}));
	};

	const handleImageChange = (event) => {
		const image = event.target.files[0];
		setNews((prev) => ({
			...prev,
			image: image,
		}));
	};

	const handleSwitchChange = (event) => {
		const { checked } = event.target;
		setNews((prev) => ({
			...prev,
			isActive: checked,
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
					width: 500,
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
					variant="h4"
					sx={{
						mb: 2,
						fontWeight: "bold",
						textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)",
						color: "#FF4500",
						textAlign: "center",
					}}
				>
					{isEditMode ? "Cập nhật tin tức" : "Thêm tin tức"}
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
						multiline
						error={hasError("content")}
						helperText={getErrorMessage("content")}
					/>

					<Grid container spacing={2}>
						<Grid
							item
							xs={12}
							sx={{ display: "flex", justifyContent: "center" }}
						>
							{news.imageURL && (
								<img
									src={imageUrls[news.id]}
									alt="Hình ảnh"
									style={{ width: "60%", height: "auto" }}
								/>
							)}
						</Grid>
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
										backgroundColor: "#9e9e9e",
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

						<Grid item xs={8} paddingRight={2}>
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
					</Grid>
					<Grid
						item
						xs={12}
						sx={{ display: "flex", justifyContent: "flex-end" }}
					>
						<Typography
							variant="body1"
							sx={{
								display: "flex",
								alignItems: "center",
								marginRight: "8px",
							}}
						>
							Trạng thái
						</Typography>
						<Switch
							checked={news.isActive}
							onChange={handleSwitchChange}
							color="primary"
						/>
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

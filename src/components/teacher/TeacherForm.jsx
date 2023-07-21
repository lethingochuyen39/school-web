import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import validate from "validate.js";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Grid from "@mui/material/Grid";
import {
	Alert,
	FormControl,
	FormControlLabel,
	FormLabel,
	Radio,
	RadioGroup,
	Switch,
	Typography,
} from "@mui/material";
import client from "../../api/client";
import { format } from "date-fns";
const schema = {
	name: {
		presence: {
			allowEmpty: false,
			message: "^Tên không được bỏ trống",
		},
	},
	dob: {
		presence: {
			allowEmpty: false,
			message: "^Ngày sinh không được bỏ trống",
		},
	},
	gender: {
		presence: {
			allowEmpty: false,
			message: "^Giới tính được bỏ trống",
		},
	},
	address: {
		presence: {
			allowEmpty: false,
			message: "^Địa chỉ không được bỏ trống",
		},
	},
	email: {
		presence: {
			allowEmpty: false,
			message: "^Email không được bỏ trống",
		},
	},
	phone: {
		presence: {
			allowEmpty: false,
			message: "^SĐT không được bỏ trống",
		},
	},
};

const TeacherForm = ({ handleClose, isEditMode, initialData, fetchData }) => {
	const defaultIsActive = isEditMode ? initialData.isActive : false;
	const [teacher, setTeacher] = useState({
		id: isEditMode ? initialData.id : "",
		name: isEditMode ? initialData.name : "",
		dob: isEditMode ? initialData.dob : "",
		gender: isEditMode ? initialData.gender : "",
		address: isEditMode ? initialData.address : "",
		email: isEditMode ? initialData.email : "",
		phone: isEditMode ? initialData.phone : "",
		status: isEditMode ? initialData.status : "",
		isActive: defaultIsActive,
	});
	const [showModal, setShowModal] = useState(true);
	const [error, setError] = useState(null);
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	useEffect(() => {
		if (isEditMode && initialData) {
			setTeacher((prev) => ({
				...prev,
				isActive: initialData.isActive,
			}));
		}
	}, [isEditMode, initialData]);

	const handleSubmit = async (event) => {
		event.preventDefault();

		const formData = new FormData();
		formData.append("name", teacher.name);
		formData.append("dob", teacher.dob);
		formData.append("gender", teacher.gender);
		formData.append("address", teacher.address);
		formData.append("email", teacher.email);
		formData.append("phone", teacher.phone);
		formData.append("isActive", teacher.isActive);

		try {
			if (isEditMode && teacher.id) {
				if (!formData) {
					formData = { isActive: teacher.isActive };
				}
				await client.put(`/api/teachers/update/${teacher.id}`, formData);
				fetchData();
			} else {
				const errors = validate(teacher, schema);
				if (errors) {
					setError(errors);
					return;
				}
				await client.post("/api/teachers/create", teacher);
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
		fetchData();
	};

	const handleChange = (event) => {
		const { name, value } = event.target;

		// Kiểm tra nếu trường "isActive" chưa được xác định, đặt giá trị mặc định là false.
		const isActiveValue =
			name === "isActive" ? event.currentTarget.checked : teacher.isActive;

		setTeacher((prev) => ({
			...prev,
			[name]: value,
			isActive: isActiveValue, // Đảm bảo giá trị của "isActive" được xác định trước khi sử dụng.
		}));

		const errors = validate({ ...teacher, [name]: value }, schema);
		setError((prevError) => ({
			...prevError,
			[name]: errors ? errors[name] : null,
		}));
	};

	const handleSwitchChange = (event) => {
		const { checked } = event.currentTarget;
		setTeacher((prev) => ({
			...prev,
			isActive: checked, // Đảm bảo giá trị của "isActive" được xác định trước khi sử dụng.
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
					{isEditMode ? "Cập nhật" : "Thêm mới"}
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
						name="name"
						label="Tên giáo viên"
						value={teacher.name}
						onChange={handleChange}
						fullWidth
						margin="normal"
						variant="outlined"
						focused
						required
						sx={{ mb: 2 }}
						error={hasError("name")}
						helperText={getErrorMessage("name")}
					/>

					<TextField
						name="dob"
						label="Ngày sinh"
						type="date"
						value={teacher.dob}
						onChange={handleChange}
						fullWidth
						margin="normal"
						variant="outlined"
						focused
						required
						sx={{ mb: 2 }}
						error={hasError("dob")}
						helperText={getErrorMessage("dob")}
					/>

					<FormControl
						component="fieldset"
						margin="normal"
						required
						error={hasError("gender")}
					>
						<FormLabel component="legend">Giới tính</FormLabel>
						<RadioGroup
							name="gender"
							value={teacher.gender}
							onChange={handleChange}
							row
						>
							<FormControlLabel
								value="male"
								control={<Radio color="primary" />}
								label="Nam"
							/>
							<FormControlLabel
								value="female"
								control={<Radio color="primary" />}
								label="Nữ"
							/>
						</RadioGroup>
						{hasError("gender") && (
							<span style={{ color: "red" }}>{getErrorMessage("gender")}</span>
						)}
					</FormControl>
					<TextField
						name="address"
						label="Địa chỉ"
						value={teacher.address}
						onChange={handleChange}
						fullWidth
						margin="normal"
						variant="outlined"
						focused
						required
						error={hasError("address")}
						helperText={getErrorMessage("address")}
					/>
					<TextField
						name="email"
						label="Email"
						value={teacher.email}
						onChange={handleChange}
						fullWidth
						margin="normal"
						variant="outlined"
						focused
						required
						error={hasError("email")}
						helperText={getErrorMessage("email")}
					/>
					<TextField
						name="phone"
						label="Số điện thoại"
						value={teacher.phone}
						onChange={handleChange}
						fullWidth
						margin="normal"
						variant="outlined"
						focused
						required
						error={hasError("phone")}
						helperText={getErrorMessage("phone")}
					/>

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
							checked={teacher.isActive}
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

export default TeacherForm;

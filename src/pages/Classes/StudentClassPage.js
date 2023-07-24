import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
	Button,
	Checkbox,
	Dialog,
	DialogContent,
	DialogTitle,
	FormControl,
	IconButton,
	InputLabel,
	MenuItem,
	Modal,
	Select,
	Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import client from "../../api/client";
import BasicCard from "../../components/common/BasicCard/BasicCard";
import DataTable from "../../components/common/DataTable/DataTable";
import GridWrapper from "../../components/common/GridWrapper/GridWrapper";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function StudentClassPage() {
	const { classId } = useParams();
	const [students, setStudents] = useState([]);
	const [selectStudents, setSelectStudents] = useState([]);
	const [selectedTeacher, setSelectedTeacher] = useState("");
	const navigate = useNavigate();
	const [isViewModalOpen, setIsViewModalOpen] = useState(false);
	const [selectedTeacherDetails, setSelectedTeacherDetails] = useState(null);
	const [selectedStudents, setSelectedStudents] = useState([]);

	const fetchStudentData = async () => {
		try {
			const response = await client.get(`/api/student/${classId}/students`);
			const teachersResponse = await client.get("/api/student/all");
			const activeTeachers = teachersResponse.data.filter(
				(teacher) => teacher.status === "active"
			);
			setSelectStudents(activeTeachers);
			setSelectedTeacher(activeTeachers[0]?.id || "");
			setStudents(response.data);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchStudentData();
	}, [classId]);

	const handleStudentChange = (event) => {
		const selectedIds = event.target.value;
		setSelectedStudents(selectedIds);
	};

	const handleSubmit = () => {
		if (selectedStudents.length === 0) {
			toast.warning("Vui lòng chọn ít nhất một học sinh để thêm vào môn học.");
			return;
		}

		const existingStudent = selectedStudents.filter((studentId) =>
			students.find((teacher) => teacher.id === studentId)
		);

		if (existingStudent.length > 0) {
			toast.warning("Một số học sinh đã tồn tại trong lớp học.");
			return;
		}

		Promise.all(
			selectedStudents.map((studentId) =>
				client.post(`/api/classes/${classId}/students/${studentId}`)
			)
		)
			.then(() => {
				fetchStudentData();
				toast.success("Thêm học sinh vào lớp học thành công");
			})
			.catch((error) => {
				console.error("Lỗi khi thêm:", error.response.data);
			});
	};

	const handleView = (studentId) => {
		const selectedTeacher = students.find(
			(teacher) => teacher.id === studentId
		);
		setSelectedTeacherDetails(selectedTeacher);
		setIsViewModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsViewModalOpen(false);
	};

	const handleDelete = async (studentId) => {
		const data = {
			studentId: studentId,
			classId: classId,
		};
		try {
			await client.delete(
				`/api/subjects/${data.subjectId}/teachers/${data.studentId}`
			);
			fetchStudentData();
		} catch (error) {
			console.error(error);
		}
	};

	const handleRowCheckboxClick = (event, studentId) => {
		if (event.target.checked) {
			setSelectedStudents((prevSelected) => [...prevSelected, studentId]);
		} else {
			setSelectedStudents((prevSelected) =>
				prevSelected.filter((id) => id !== studentId)
			);
		}
	};

	const handleAllCheckboxClick = (event) => {
		if (event.target.checked) {
			const allTeacherIds = selectStudents.map((teacher) => teacher.id);
			setSelectedStudents(allTeacherIds);
		} else {
			setSelectedStudents([]);
		}
	};

	const handleSubmitBatchDeletion = () => {
		if (selectedStudents.length === 0) {
			toast.warning("Vui lòng chọn ít nhất một giáo viên để xóa.");
			return;
		}

		Promise.all(
			selectedStudents.map((studentId) =>
				client.delete(`/api/subjects/${classId}/teachers/${studentId}`)
			)
		)
			.then(() => {
				fetchStudentData();
				toast.success("Xóa giáo viên khỏi môn học thành công");
			})
			.catch((error) => {
				console.error("Lỗi khi xóa:", error.response.data);
			});
	};

	const handleGoBack = () => {
		navigate(-1);
	};

	const getHeader = () => (
		<>
			<IconButton onClick={handleGoBack}>
				<ArrowBackIcon />
			</IconButton>

			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				padding="5px"
				flexWrap="wrap"
			>
				<FormControl fullWidth margin="normal" size="small">
					<InputLabel id="teacher-label">Chọn Học sinh</InputLabel>
					<Select
						labelId="teacher-label"
						id="teacher-select"
						name="studentId"
						value={selectedStudents}
						onChange={handleStudentChange}
						label="Chọn Học sinh"
						sx={{ height: "40px" }}
						multiple // Enable multiple selection
					>
						{selectStudents.map((teacher) => (
							<MenuItem key={teacher.id} value={teacher.id}>
								{teacher.name}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</Box>
		</>
	);

	const columns = [
		{
			field: "id",
			headerName: "ID",
			width: 100,
			disableActions: true,
			renderCell: (params) => (
				<Checkbox
					checked={selectedStudents.includes(params.row.id)}
					onClick={(e) => handleRowCheckboxClick(e, params.row.id)}
				/>
			),
		},
		{
			field: "name",
			headerName: "Giáo viên",
			width: 150,
			disableActions: true,
		},
	];

	const getContent = () => (
		<>
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				fontSize="2rem"
				fontWeight="bold"
				sx={{
					fontWeight: "bold",
					textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)",
					color: "#FF4500",
					textAlign: "center",
				}}
			>
				Thêm học sinh
			</Box>

			<Box
				display="flex"
				justifyContent="flex-end"
				alignItems="center"
				padding="5px"
				gap={1}
			>
				<Button
					variant="contained"
					color="primary"
					onClick={handleSubmit}
					sx={{
						background: "linear-gradient(45deg, #304ffe, #42a5f5)",
						fontSize: "1.2rem",
						boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
						"&:hover": {
							background: "#1e40af",
						},
					}}
				>
					Thêm
				</Button>
				<Button
					variant="contained"
					color="primary"
					onClick={handleSubmitBatchDeletion}
					disabled={students.length === 0} // Disable button if no teachers to delete
					sx={{
						background: "linear-gradient(45deg, #304ffe, #42a5f5)",
						fontSize: "1.2rem",
						boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
						"&:hover": {
							background: "#1e40af",
						},
					}}
				>
					Xóa
				</Button>
			</Box>

			<DataTable
				initialRows={students}
				columns={columns}
				handleDelete={handleDelete}
				handleView={handleView}
				hiddenActions={["edit"]}
			/>

			{/* View Teacher Modal */}
			<Dialog open={isViewModalOpen} onClose={handleCloseModal}>
				<DialogTitle>{selectedTeacherDetails?.name}</DialogTitle>
				<DialogContent>
					{selectedTeacherDetails && (
						<>
							<Box
								sx={{
									position: "fixed",
									top: "50%",
									left: "50%",
									transform: "translate(-50%, -50%)",
									width: 500,
									bgcolor: "background.paper",
									borderRadius: 4,
									p: 2,
									maxWidth: "90%",
									maxHeight: "90%",
									overflow: "auto",
								}}
							>
								<>
									<Typography
										variant="h4"
										id="modal-title"
										sx={{
											mb: 2,
											fontWeight: "bold",
											textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)",
											color: "#FF4500",
											textAlign: "center",
										}}
									>
										Thông tin giáo viên
									</Typography>
									<Typography
										variant="body1"
										sx={{ overflowWrap: "break-word" }}
									>
										<b>Tên:</b> {selectedTeacherDetails.name}
									</Typography>
									<Typography
										variant="body1"
										sx={{ overflowWrap: "break-word" }}
									>
										<b>Ngày sinh:</b> {selectedTeacherDetails.dob}
									</Typography>
									<Typography
										variant="body1"
										sx={{ overflowWrap: "break-word" }}
									>
										<b>Giới tính:</b> {selectedTeacherDetails.gender}
									</Typography>
									<Typography
										variant="body1"
										sx={{ overflowWrap: "break-word" }}
									>
										<b>Địa chỉ:</b> {selectedTeacherDetails.address}
									</Typography>
									<Typography
										variant="body1"
										sx={{ overflowWrap: "break-word" }}
									>
										<b>Email:</b> {selectedTeacherDetails.email}
									</Typography>
									<Typography
										variant="body1"
										sx={{ overflowWrap: "break-word" }}
									>
										<b>Số điện thoại:</b> {selectedTeacherDetails.phone}
									</Typography>
								</>

								<Button
									variant="contained"
									onClick={handleCloseModal}
									sx={{ mt: 2 }}
								>
									Đóng
								</Button>
							</Box>
						</>
					)}
				</DialogContent>
			</Dialog>
		</>
	);
	return (
		<GridWrapper>
			<ToastContainer />
			<BasicCard header={getHeader()} content={getContent()} />
		</GridWrapper>
	);
}

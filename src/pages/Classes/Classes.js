import React, { useState, useEffect, useCallback } from "react";
import BasicCard from "../../components/common/BasicCard/BasicCard";
import SearchIcon from "@mui/icons-material/Search";
import Input from "@mui/material/Input";
import CommonButton from "../../components/common/CommonButton/CommonButton";
import Box from "@mui/material/Box";
import GridWrapper from "../../components/common/GridWrapper/GridWrapper";
import DataTable from "../../components/common/DataTable/DataTable";
import client from "../../api/client";
import { Button, Modal } from "@mui/material";
import ClassesForm from "../../components/classes/ClassesForm";
import { useNavigate } from "react-router-dom";

const Classes = () => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [classes, setClasses] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);
	const [selectedClasses, setSelectedClasses] = useState(null);
	const [error, setError] = useState("");
	const [searchTerm, setSearchTerm] = useState("");
	const [teachers, setTeachers] = useState([]);
	const [academicYears, setAcademicYears] = useState([]);
	const navigate = useNavigate();
	const handleOpenForm = async () => {
		if (classes) {
			setIsEditMode(true);
			setSelectedClasses(classes);
		} else {
			setIsEditMode(false);
			setSelectedClasses(null);
		}

		try {
			const responseTeacher = await client.get("/api/teachers");
			const responseAcademicYear = await client.get("/api/academic-years");
			setTeachers(responseTeacher.data);
			setAcademicYears(responseAcademicYear.data);
		} catch (error) {
			console.error(error);
			if (error.response) {
				setError(error.response.data);
			}
		}
		setIsFormOpen(true);
	};

	const handleCloseForm = () => {
		setIsFormOpen(false);
		setClasses(null);
	};

	const fetchData = useCallback(async () => {
		try {
			let url = "/api/classes";
			if (searchTerm) {
				url += `?name=${searchTerm}`;
			}
			const response = await client.get(url);
			setData(response.data);
			setLoading(false);
		} catch (error) {
			console.error(error);
			setLoading(false);
		}
	}, [searchTerm]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const handleAddClasses = async (newClasses) => {
		console.log(newClasses);
		try {
			await client.post("/api/classes/create", newClasses);

			await fetchData();
		} catch (error) {
			console.error(error);
			if (error.response) {
				setError(error.response.data);
			} else {
				setError("Đã xảy ra lỗi khi cập nhật.");
			}
		}
	};

	const handleSearchChange = (event) => {
		setSearchTerm(event.target.value);
	};

	const handleView = async (classId) => {
		navigate(`/admin/student-classes/${classId}`);
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setClasses(null);
	};

	const handleEdit = (id) => {
		const selectedClasses = data.find((classes) => classes.id === id);
		if (selectedClasses) {
			setIsEditMode(true);
			setSelectedClasses(selectedClasses);
			setIsFormOpen(true);
		}
	};
	const handleUpdateClasses = async (id, updatedClasses) => {
		try {
			await client.put(`/api/classes/update/${id}`, updatedClasses);

			await fetchData();
		} catch (error) {
			console.error(error);
			if (error.response) {
				setError(error.response.data);
			} else {
				setError("Đã xảy ra lỗi khi cập nhật.");
			}
		}
	};
	const handleDelete = async (id) => {
		try {
			await client.delete(`/api/classes/delete/${id}`);
			fetchData();
		} catch (error) {
			console.error(error);
		}
	};

	const getHeader = () => (
		<Box
			display="flex"
			flexDirection={{ xs: "column", sm: "row" }}
			justifyContent="space-between"
			alignItems="center"
			paddingLeft="20px"
			paddingBottom="20px"
			paddingTop="10px"
			paddingRight="10px"
			flexWrap="wrap"
		>
			<Box
				display="flex"
				alignItems="center"
				marginTop={{ xs: "10px", sm: 0 }}
				marginRight={{ xs: "10px" }}
			>
				<CommonButton
					variant="contained"
					sx={{
						color: "white",
						backgroundImage: "linear-gradient(to right, #8bc34a, #4caf50)",
					}}
					onClick={handleOpenForm}
					size="large"
				>
					Thêm mới
				</CommonButton>
			</Box>
			<Box
				minWidth={{ xs: "100%", sm: 0, md: "500px" }}
				marginRight={{ xs: 0, sm: "10px" }}
				marginBottom={{ xs: "10px", sm: 0 }}
				backgroundColor="#f5f5f5"
				borderRadius="4px"
				padding="4px"
				display="flex"
				alignItems="center"
			>
				<SearchIcon sx={{ marginRight: "15px" }} />
				<Input
					placeholder="Tìm kiếm theo tên... "
					onChange={handleSearchChange}
					value={searchTerm}
					sx={{
						width: { xs: "100%", sm: "auto", md: "100%" },
						color: "rgba(0, 0, 0, 0.6)",
						fontSize: "1.1rem",
					}}
					disableUnderline
				/>
			</Box>
		</Box>
	);

	const columns = [
		{ field: "id", headerName: "ID", width: 100 },
		{ field: "name", headerName: "Lớp", width: 100 },
		{ field: "description", headerName: "Mô tả", width: 100 },
		{ field: "grade", headerName: "Khối", width: 100 },
		{ field: "limitStudent", headerName: "Giới hạn", width: 100 },
		{
			field: "teacher",
			headerName: "Giáo viên",
			width: 100,
			valueGetter: (params) => params.row.teacher?.name || "",
		},

		{
			field: "academicYear",
			headerName: "Năm học",
			width: 250,
			valueGetter: (params) => params.row.academicYear?.name || "",
		},
	];

	const getContent = () => (
		<DataTable
			initialRows={data}
			columns={columns}
			loading={loading}
			handleView={handleView}
			handleEdit={handleEdit}
			handleDelete={handleDelete}
		/>
	);

	return (
		<GridWrapper>
			{isFormOpen && (
				<ClassesForm
					handleAddClasses={handleAddClasses}
					handleUpdateClasses={handleUpdateClasses}
					handleClose={handleCloseForm}
					isEditMode={isEditMode}
					initialData={selectedClasses}
					error={error}
					teachers={teachers}
					academicYears={academicYears}
				/>
			)}
			{classes && (
				<Modal
					open={isModalOpen}
					onClose={closeModal}
					aria-labelledby="modal-title"
					aria-describedby="modal-description"
				>
					<Box
						sx={{
							position: "fixed",
							top: "50%",
							left: "50%",
							transform: "translate(-50%, -50%)",
							width: 400,
							bgcolor: "background.paper",
							borderRadius: 4,
							p: 2,
						}}
					>
						<h2 id="modal-title">Thông tin lớp học</h2>
						<p id="modal-description">ID: {classes.id}</p>
						<p id="modal-description">Mô tả: {classes.description}</p>
						<p id="modal-description">Khối: {classes.grade}</p>
						<p id="modal-description">Giới hạn: {classes.limitStudent}</p>
						<p id="modal-description">Tên lớp: {classes.name}</p>
						<p>Năm học: {classes.academicYear.name}</p>
						<p>Giáo viên: {classes.teacher.name}</p>

						<Button variant="contained" onClick={closeModal}>
							Đóng
						</Button>
					</Box>
				</Modal>
			)}

			<BasicCard header={getHeader()} content={getContent()} />
		</GridWrapper>
	);
};

export default Classes;

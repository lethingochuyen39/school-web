import React, { useState, useEffect, useCallback } from "react";
import BasicCard from "../../components/common/BasicCard/BasicCard";
import SearchIcon from "@mui/icons-material/Search";
import Input from "@mui/material/Input";
import CommonButton from "../../components/common/CommonButton/CommonButton";
import Box from "@mui/material/Box";
import GridWrapper from "../../components/common/GridWrapper/GridWrapper";
import DataTable from "../../components/common/DataTable/DataTable";
import client from "../../api/client";
import AddForm from "../../components/academicYear/AddForm";
import { Button, Modal } from "@mui/material";
const AcademicYear = () => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [isAddFormOpen, setIsAddFormOpen] = useState(false);
	const [academicYear, setAcademicYear] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);
	const [selectedAcademicYear, setSelectedAcademicYear] = useState(null);
	const [error, setError] = useState("");
	const [searchTerm, setSearchTerm] = useState("");

	const handleOpenAddForm = () => {
		console.log(academicYear);
		if (academicYear) {
			setIsEditMode(true);
			setSelectedAcademicYear(academicYear);
		} else {
			setIsEditMode(false);
			setSelectedAcademicYear(null);
		}
		setIsAddFormOpen(true);
	};

	const handleCloseAddForm = () => {
		setIsAddFormOpen(false);
		setAcademicYear(null);
	};

	const handleAddAcademicYear = async (newAcademicYear) => {
		try {
			await client.post("/api/academic-years", newAcademicYear);
			setIsModalOpen(true);
			await fetchData();
		} catch (error) {
			console.error(error);
			if (error.response) {
				setError(error.response.data.message);
			} else {
				setError("Đã xảy ra lỗi khi cập nhật năm học.");
			}
		}
	};

	// hiển thị thông tin
	const handleView = async (id) => {
		try {
			const response = await client.get(`/api/academic-years/${id}`);
			const data = response.data;
			setAcademicYear(data);
			setIsModalOpen(true);
		} catch (error) {
			console.error(error);
		}
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setAcademicYear(null);
	};

	const handleEdit = (id) => {
		const selectedYear = data.find((year) => year.id === id);
		if (selectedYear) {
			setIsEditMode(true);
			setSelectedAcademicYear(selectedYear);
			setIsAddFormOpen(true);
		}
	};

	const handleUpdateAcademicYear = async (updatedAcademicYear) => {
		try {
			await client.put(
				`/api/academic-years/${updatedAcademicYear.id}`,
				updatedAcademicYear
			);
			fetchData();
			setIsModalOpen(true);
		} catch (error) {
			if (error.response) {
				setError(error.response.data.message);
			} else {
				setError("Đã xảy ra lỗi khi cập nhật năm học.");
			}
		}
	};

	const handleDelete = async (id) => {
		try {
			await client.delete(`/api/academic-years/${id}`);
			fetchData();
		} catch (error) {
			console.error(error);
		}
	};

	const fetchData = useCallback(async () => {
		try {
			let url = "/api/academic-years";
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

	const handleSearchChange = (event) => {
		setSearchTerm(event.target.value);
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
					onClick={handleOpenAddForm}
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
					placeholder="Tìm kiếm theo tên năm học.. "
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
		{ field: "name", headerName: "Tên", width: 150 },
		{ field: "startDate", headerName: "Ngày bắt đầu", width: 150 },
		{ field: "endDate", headerName: "Ngày kết thúc", width: 150 },
	];

	const getContent = () => {
		return (
			<DataTable
				initialRows={data}
				columns={columns}
				loading={loading}
				handleView={handleView}
				handleEdit={handleEdit}
				handleDelete={handleDelete}
			/>
		);
	};

	return (
		<GridWrapper>
			{isAddFormOpen && (
				<AddForm
					handleAddAcademicYear={handleAddAcademicYear}
					handleUpdateAcademicYear={handleUpdateAcademicYear}
					handleClose={handleCloseAddForm}
					isEditMode={isEditMode}
					initialData={selectedAcademicYear}
					error={error}
				/>
			)}

			{academicYear && (
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
						<h2 id="modal-title">Thông tin năm học</h2>
						<p id="modal-description">ID: {academicYear.id}</p>
						<p>Tên năm học: {academicYear.name}</p>
						<p>Ngày bắt đầu: {academicYear.startDate}</p>
						<p>Ngày kết thúc: {academicYear.endDate}</p>
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

export default AcademicYear;

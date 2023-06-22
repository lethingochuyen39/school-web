import React, { useState, useEffect, useCallback } from "react";
import BasicCard from "../../components/common/BasicCard/BasicCard";
import SearchIcon from "@mui/icons-material/Search";
import Input from "@mui/material/Input";
import CommonButton from "../../components/common/CommonButton/CommonButton";
import Box from "@mui/material/Box";
import GridWrapper from "../../components/common/GridWrapper/GridWrapper";
import DataTable from "../../components/common/DataTable/DataTable";
import client from "../../api/client";
import ScoreTypeForm from "../../components/score/ScoreTypeForm";
import { Button, Modal } from "@mui/material";
const ScoreType = () => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [isFormOpen, setisFormOpen] = useState(false);
	const [scoreType, setScoreType] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);
	const [selectedScoreType, setselectedScoreType] = useState(null);
	const [error, setError] = useState("");
	const [searchTerm, setSearchTerm] = useState("");

	const handleOpenForm = () => {
		console.log(scoreType);
		if (scoreType) {
			setIsEditMode(true);
			setselectedScoreType(scoreType);
		} else {
			setIsEditMode(false);
			setselectedScoreType(null);
		}
		setisFormOpen(true);
	};

	const handleCloseForm = () => {
		setisFormOpen(false);
		setScoreType(null);
	};

	const handleAddScoreType = async (newScoreType) => {
		try {
			await client.post("/api/score-types", newScoreType);
			setIsModalOpen(true);
		} catch (error) {
			console.error(error);
			if (error.response) {
				setError(error.response.data.message);
			} else {
				setError("Đã xảy ra lỗi khi cập nhật loại điểm.");
			}
		}
	};

	// hiển thị thông tin
	const handleView = async (id) => {
		try {
			const response = await client.get(`/api/score-types/${id}`);
			const data = response.data;
			setScoreType(data);
			setIsModalOpen(true); // Mở modal để hiển thị thông tin
		} catch (error) {
			console.error(error);
		}
	};

	const closeModal = () => {
		setIsModalOpen(false);
	};

	const handleEdit = (id) => {
		const selectedScoreType = data.find((year) => year.id === id);
		if (selectedScoreType) {
			setIsEditMode(true);
			setselectedScoreType(selectedScoreType);
			setisFormOpen(true);
		}
	};

	const handleUpdateScoreType = async (updatedScoreType) => {
		try {
			await client.put(
				`/api/score-types/${updatedScoreType.id}`,
				updatedScoreType
			);
			fetchData();
			setIsModalOpen(true);
		} catch (error) {
			if (error.response) {
				setError(error.response.data.message);
			} else {
				setError("Đã xảy ra lỗi khi cập nhật loại điểm.");
			}
		}
	};

	const handleDelete = async (id) => {
		try {
			await client.delete(`/api/score-types/${id}`);
			fetchData();
		} catch (error) {
			console.error(error);
		}
	};

	const fetchData = useCallback(async () => {
		try {
			let url = "/api/score-types";
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
					placeholder="Tìm kiếm theo tên loại điểm... "
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
		{ field: "name", headerName: "Tên", width: 250 },
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

	const handleRefreshData = () => {
		fetchData();
	};

	return (
		<GridWrapper>
			{isFormOpen && (
				<ScoreTypeForm
					handleAddScoreType={handleAddScoreType}
					handleUpdateAScoreType={handleUpdateScoreType}
					handleClose={handleCloseForm}
					isEditMode={isEditMode}
					initialData={selectedScoreType}
					error={error}
					handleRefreshData={handleRefreshData}
				/>
			)}

			{scoreType && (
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
						<h2 id="modal-title">Thông tin loại điểm</h2>
						<p id="modal-description">ID: {scoreType.id}</p>
						<p>Tên loại điểm: {scoreType.name}</p>

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

export default ScoreType;

import React, { useState, useEffect, useCallback } from "react";
import BasicCard from "../../components/common/BasicCard/BasicCard";
import SearchIcon from "@mui/icons-material/Search";
import Input from "@mui/material/Input";
import Box from "@mui/material/Box";
import GridWrapper from "../../components/common/GridWrapper/GridWrapper";
import DataTable from "../../components/common/DataTable/DataTable";
import client from "../../api/client";
import { Button, Modal, Typography } from "@mui/material";
const ScoreType = () => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [scoreType, setScoreType] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");

	const handleView = async (id) => {
		try {
			const response = await client.get(`/api/score-types/${id}`);
			const data = response.data;
			setScoreType(data);
			setIsModalOpen(true);
		} catch (error) {
			console.error(error);
		}
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setScoreType(null);
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
			paddingTop="10px"
			paddingRight="10px"
			flexWrap="wrap"
		>
			<Box
				minWidth={{ xs: "100%", sm: "250px", md: "500px" }}
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
						width: { xs: "100%", sm: "100%", md: "100%" },
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
		{ field: "name", headerName: "Tên loại điểm", width: 200 },
		{ field: "description", headerName: "Mô tả", width: 200 },
		{ field: "coefficient", headerName: "Hệ số", width: 100 },
	];

	const getContent = () => {
		return (
			<DataTable
				initialRows={data}
				columns={columns}
				loading={loading}
				handleView={handleView}
				hiddenActions={["delete", "edit"]}
			/>
		);
	};

	return (
		<GridWrapper>
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
							Thông tin loại điểm
						</Typography>
						<Typography variant="body1" sx={{ overflowWrap: "break-word" }}>
							<b>ID:</b> {scoreType.id}
						</Typography>
						<Typography variant="body1" sx={{ overflowWrap: "break-word" }}>
							<b>Tên loại điểm: </b> {scoreType.name}
						</Typography>
						<Typography variant="body1" sx={{ overflowWrap: "break-word" }}>
							<b>Mô tả loại điểm: </b> {scoreType.description}
						</Typography>
						<Typography
							variant="body1"
							sx={{ overflowWrap: "break-word", mb: 2 }}
						>
							<b>Hệ số nhân: </b> {scoreType.coefficient}
						</Typography>

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

import React, { useState, useEffect, useCallback } from "react";

import BasicCard from "../../../components/common/BasicCard/BasicCard";
import SearchIcon from "@mui/icons-material/Search";
import Input from "@mui/material/Input";
import CommonButton from "../../../components/common/CommonButton/CommonButton";
import Box from "@mui/material/Box";
import GridWrapper from "../../../components/common/GridWrapper/GridWrapper";
import DataTable from "../../../components/common/DataTable/DataTable";
import client from "../../../api/client";
import { Button, LinearProgress, Modal } from "@mui/material";
import DocumentForm from "../../../components/document/DocumentForm";
import Typography from "@mui/material/Typography";
import FileDownloader from "../../Document/FileDownloader";

const DocumentTeacherPage = () => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [document, setDocument] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);
	const [selectedDocument, setSelectedDocument] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [teacher, setTeacher] = useState(null);
	useEffect(() => {
		const fetchTeacherData = async () => {
			try {
				const teacherId = localStorage.getItem("id");
				const response = await client.get(`/api/teachers/${teacherId}`);
				setTeacher(response.data);
			} catch (error) {
				console.error(error);
			}
		};

		fetchTeacherData();
	}, []);

	const handleOpenForm = async () => {
		if (document) {
			setIsEditMode(true);
			setSelectedDocument(document);
		} else {
			setIsEditMode(false);
			setSelectedDocument(null);
		}

		setIsFormOpen(true);
	};

	const handleCloseForm = () => {
		setIsFormOpen(false);
		setDocument(null);
	};
	const formatDate = (dateString) => {
		const options = {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		};
		return new Date(dateString).toLocaleString("vi-VN", options);
	};

	const fetchData = useCallback(async () => {
		try {
			let url = "/api/documents";
			if (searchTerm) {
				url += `?title=${searchTerm}`;
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

	const handleView = async (id) => {
		try {
			const response = await client.get(`/api/documents/${id}`);
			const data = response.data;
			setDocument(data);
			setIsModalOpen(true);
		} catch (error) {
			console.error(error);
		}
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setDocument(null);
	};

	const [uploadedById, setUploadedById] = useState("");

	useEffect(() => {
		const storedUserId = localStorage.getItem("userId");
		setUploadedById(storedUserId);
	}, []);

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
					placeholder="Tìm kiếm theo tiêu đề...  "
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
		{ field: "id", headerName: "ID", width: 50 },
		{ field: "fileName", headerName: "Tên file", width: 150 },
		{ field: "title", headerName: "tiêu đề", width: 150 },
		{ field: "description", headerName: "Mô tả", width: 100 },
		{ field: "uploadedAt", headerName: "Ngày thêm", width: 100 },
		{ field: "updatedAt", headerName: "Ngày cập nhật", width: 100 },
		{
			field: "download",
			headerName: "Tải xuống",
			width: 120,
			renderCell: (params) => (
				<FileDownloader
					url={`/api/documents/${params.row.id}/download`}
					fileName={params.row.fileName}
				/>
			),
		},
	];

	const getContent = () => (
		<DataTable
			initialRows={data}
			columns={columns}
			loading={loading}
			handleView={handleView}
			hiddenActions={["delete", "edit"]}
		/>
	);

	return (
		<>
			{teacher === null ? (
				<LinearProgress />
			) : teacher && !teacher.isActive ? (
				<div style={{ fontWeight: "bold", color: "#1565c0" }}>
					Tài khoản cá nhân bạn đang bị khóa. Vui lòng liên hệ nhà trường để
					biết thêm thông tin.
				</div>
			) : (
				<GridWrapper>
					{isFormOpen && (
						<DocumentForm
							handleClose={handleCloseForm}
							isEditMode={isEditMode}
							initialData={selectedDocument}
							fetchData={fetchData}
							uploadedById={uploadedById}
						/>
					)}

					{document && (
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
										Thông tin Tài liệu
									</Typography>
									<Typography
										variant="body1"
										sx={{ overflowWrap: "break-word" }}
									>
										<b>ID:</b> {document.id}
									</Typography>
									<Typography
										variant="body1"
										sx={{ overflowWrap: "break-word" }}
									>
										<b>Tên file:</b> {document.fileName}
									</Typography>
									<Typography
										variant="body1"
										sx={{ overflowWrap: "break-word" }}
									>
										<b>Tiêu đề:</b> {document.title}
									</Typography>
									<Typography
										variant="body1"
										sx={{ overflowWrap: "break-word" }}
									>
										<b>Mô tả:</b> {document.description}
									</Typography>
									<Typography
										variant="body1"
										sx={{ overflowWrap: "break-word" }}
									>
										<b>Tạo bởi UserId:</b> {document.uploadedBy.id} -{" "}
										<b>Email: </b>
										{document.uploadedBy.email}
									</Typography>
									<Typography
										variant="body1"
										sx={{ overflowWrap: "break-word" }}
									>
										<b>Ngày thêm:</b> {formatDate(document.uploadedAt)}
									</Typography>
									<Typography
										variant="body1"
										sx={{ overflowWrap: "break-word" }}
									>
										<b>Ngày cập nhật:</b> {formatDate(document.updatedAt)}
									</Typography>
								</>

								<Button variant="contained" onClick={closeModal} sx={{ mt: 2 }}>
									Đóng
								</Button>
							</Box>
						</Modal>
					)}

					<BasicCard header={getHeader()} content={getContent()} />
				</GridWrapper>
			)}
		</>
	);
};

export default DocumentTeacherPage;

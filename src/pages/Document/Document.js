import React, { useState, useEffect, useContext, useCallback } from "react";

import BasicCard from "../../components/common/BasicCard/BasicCard";
import SearchIcon from "@mui/icons-material/Search";
import Input from "@mui/material/Input";
import CommonButton from "../../components/common/CommonButton/CommonButton";
import Box from "@mui/material/Box";
import GridWrapper from "../../components/common/GridWrapper/GridWrapper";
import DataTable from "../../components/common/DataTable/DataTable";
import client from "../../api/client";
import { Button, Modal } from "@mui/material";
import DocumentForm from "../../components/document/DocumentForm";
import Typography from "@mui/material/Typography";
import FileDownloader from "./FileDownloader";
import AuthContext from "../../api/AuthContext";
const Document = () => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [document, setDocument] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);
	const [selectedDocument, setSelectedDocument] = useState(null);
	const [error, setError] = useState("");
	const [searchTerm, setSearchTerm] = useState("");

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

	const handleAddDocument = async (newDocument) => {
		try {
			await client.post("/api/documents", newDocument, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			await fetchData();
		} catch (error) {
			if (error.response) {
				setError(error.response.data);
			} else {
				setError("Đã xảy ra lỗi khi cập nhật điểm.");
			}
		}
	};

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

	const handleEdit = (id) => {
		const selectedDocument = data.find((item) => item.id === id);
		if (selectedDocument) {
			setSelectedDocument(selectedDocument);
			setDocument(selectedDocument);
			setIsEditMode(true);
			setIsFormOpen(true);
		}
	};

	const handleUpdateDocument = async (formData) => {
		try {
			await client.put(`/api/documents/${document.id}`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			await fetchData();
		} catch (error) {
			console.error(error);
			if (error.response) {
				setError(error.response.data);
			} else {
				setError("Đã xảy ra lỗi khi cập nhật tài liệu.");
			}
		}
	};

	const handleDelete = async (id) => {
		try {
			await client.delete(`/api/documents/${id}`);
			fetchData();
		} catch (error) {
			console.error(error);
		}
	};
	const { userId } = useContext(AuthContext);
	const [uploadedById, setUploadedById] = useState("");

	useEffect(() => {
		// Lấy giá trị userId từ localStorage và lưu vào state uploadedById
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
			paddingBottom="10px"
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
					placeholder="Tìm kiếm theo tiêu đề... "
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
		// { field: "filePath", headerName: "Đường dẫn", width: 100 },
		{
			field: "uploadedBy",
			headerName: "Thêm bởi UserId",
			width: 70,
			valueGetter: (params) => params.row.uploadedBy?.id || "",
		},
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
			handleEdit={handleEdit}
			handleDelete={handleDelete}
			fetchData={fetchData}
		/>
	);

	return (
		<GridWrapper>
			{isFormOpen && (
				<DocumentForm
					handleAddDocument={handleAddDocument}
					handleUpdateDocument={handleUpdateDocument}
					handleClose={handleCloseForm}
					isEditMode={isEditMode}
					initialData={selectedDocument}
					error={error}
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
						}}
					>
						<>
							<Typography variant="h4" id="modal-title" sx={{ mb: 2 }}>
								Thông tin Tài liệu
							</Typography>
							<Typography variant="body1" id="modal-description">
								<b>ID:</b> {document.id}
							</Typography>
							<Typography variant="body1">
								<b>tên file:</b> {document.fileName}
							</Typography>
							<Typography variant="body1">
								<b>Tiêu đề:</b> {document.title}
							</Typography>
							<Typography variant="body1">
								<b>Mô tả:</b> {document.description}
							</Typography>
							<Typography variant="body1" noWrap>
								<b>Đường dẫn:</b> {document.filePath}
							</Typography>
							<Typography variant="body1">
								<b>Tạo bởi UserId:</b> {document.uploadedBy.id}
							</Typography>
							<Typography variant="body1">
								<b>Ngày thêm:</b> {document.uploadedAt}
							</Typography>
							<Typography variant="body1">
								<b>Ngày cập nhật:</b> {document.updatedAt}
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
	);
};

export default Document;

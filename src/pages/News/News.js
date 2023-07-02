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
import NewsForm from "../../components/news/NewsForm";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
const News = () => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [news, setNews] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);
	const [selectedNews, setSelectedNews] = useState(null);
	const [error, setError] = useState("");
	const [searchTerm, setSearchTerm] = useState("");
	const [isActive, setIsActive] = useState(false);

	const handleOpenForm = async () => {
		if (news) {
			setIsEditMode(true);
			setSelectedNews(news);
		} else {
			setIsEditMode(false);
			setSelectedNews(null);
		}

		setIsFormOpen(true);
	};

	const handleCloseForm = () => {
		setIsFormOpen(false);
		setNews(null);
	};

	const fetchData = useCallback(async () => {
		try {
			let url = "/api/news";
			if (searchTerm) {
				url += `?title=${searchTerm}`;
			}
			const response = await client.get(url);
			const fetchedData = response.data;

			// Cập nhật trạng thái "isActive" cho tất cả các tin tức
			const updatedData = fetchedData.map((item) => ({
				...item,
				isActive: item.isActive, // Thay item.isActive bằng giá trị mặc định bạn muốn nếu không lấy từ fetchedData
			}));
			setData(updatedData);
			setLoading(false);

			// Cập nhật giá trị isActive từ dữ liệu lấy được
			if (news) {
				const fetchedNews = fetchedData.find((item) => item.id === news.id);
				if (fetchedNews) {
					setIsActive(fetchedNews.isActive);
				}
			}
		} catch (error) {
			console.error(error);
			setLoading(false);
		}
	}, [searchTerm, news]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const handleAddNews = async (newNews) => {
		try {
			await client.post("/api/news", newNews, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			await fetchData();
		} catch (error) {
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

	const handleView = async (id) => {
		try {
			const response = await client.get(`/api/news/${id}`);
			const data = response.data;
			setNews(data);
			setIsModalOpen(true);
		} catch (error) {
			console.error(error);
		}
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setNews(null);
	};

	const handleEdit = (id) => {
		const selectedNews = data.find((item) => item.id === id);
		if (selectedNews) {
			setSelectedNews(selectedNews);
			setNews(selectedNews);
			setIsEditMode(true);
			setIsFormOpen(true);
		}
	};

	const handleUpdateNews = async (formData) => {
		try {
			if (!formData) {
				formData = { isActive: news.isActive };
			}
			await client.put(`/api/news/edit/${news.id}`, formData, {
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
				setError("Đã xảy ra lỗi khi cập nhật.");
			}
		}
	};

	const handleDelete = async (id) => {
		try {
			await client.delete(`/api/news/${id}`);
			fetchData();
		} catch (error) {
			console.error(error);
		}
	};

	const handleUpdateSwitch = async (event, id) => {
		const { checked } = event.target;
		console.log(id);
		try {
			await client.put(`/api/news/isActive/${id}`);

			setData((prevData) => {
				const updatedData = prevData.map((item) =>
					item.id === id ? { ...item, isActive: checked } : item
				);
				return updatedData;
			});

			setSelectedNews((prevNews) => {
				if (prevNews && prevNews.id === id) {
					return { ...prevNews, isActive: checked };
				}
				return prevNews;
			});
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
		{ field: "imageName", headerName: "Tên file", width: 100 },
		{ field: "title", headerName: "tiêu đề", width: 100 },
		{ field: "content", headerName: "Nội dung", width: 100 },
		// { field: "imagePath", headerName: "Đường dẫn", width: 100 },
		{
			field: "imagePath",
			headerName: "Hình ảnh",
			width: 130,
			renderCell: (params) => (
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						maxWidth: "100%",
						maxHeight: "95%",
					}}
				>
					<img
						src={process.env.PUBLIC_URL + `/${params.value}`}
						alt={params.row.imageName}
						style={{ width: "60%", height: "auto", borderRadius: "6px" }}
					/>
				</div>
			),
		},
		{ field: "createdAt", headerName: "Ngày thêm", width: 100 },
		{ field: "updatedAt", headerName: "Ngày cập nhật", width: 100 },
		{
			field: "isActive",
			headerName: "Trạng thái",
			width: 100,
			renderCell: (params) => (
				<Switch
					checked={params.row.isActive}
					onChange={(event) => handleUpdateSwitch(event, params.row.id)}
					color="primary"
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
				<NewsForm
					handleAddNews={handleAddNews}
					handleUpdateNews={handleUpdateNews}
					handleClose={handleCloseForm}
					isEditMode={isEditMode}
					initialData={selectedNews}
					error={error}
				/>
			)}

			{news && (
				<Modal
					open={isModalOpen}
					onClose={closeModal}
					aria-labelledby="modal-title"
					aria-describedby="modal-content"
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
							<Typography variant="h4" id="modal-title" sx={{ mb: 2 }}>
								Thông tin Tin tức
							</Typography>

							<Box sx={{ display: "flex", justifyContent: "center" }}>
								<img
									src={process.env.PUBLIC_URL + `/${news.imagePath}`}
									alt={news.imageName}
									style={{ width: 200, height: "auto", marginBottom: 16 }}
								/>
							</Box>
							<Typography variant="body1" id="modal-content">
								<b>ID:</b> {news.id}
							</Typography>
							<Typography variant="body1">
								<b>Tên file:</b> {news.imageName}
							</Typography>
							<Typography variant="body1">
								<b>Tiêu đề:</b> {news.title}
							</Typography>
							<Typography variant="body1">
								<b>Nội dung:</b> {news.content}
							</Typography>
							<Typography variant="body1" noWrap>
								<b>Đường dẫn:</b> {news.imagePath}
							</Typography>

							<Typography variant="body1">
								<b>Ngày thêm:</b> {news.createdAt}
							</Typography>
							<Typography variant="body1">
								<b>Ngày cập nhật:</b> {news.updatedAt}
							</Typography>
							<Typography variant="body1">
								<b>Trạng thái:</b>{" "}
								{news.isActive ? "Đang hoạt động" : "Ẩn hoạt động"}
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

export default News;

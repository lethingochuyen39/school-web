import client from "../../api/client";

import React, { useState, useEffect, useCallback } from "react";
import {
	Typography,
	Container,
	Grid,
	Pagination,
	TextField,
	InputAdornment,
	Box,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import NewsCard from "./NewsCard";
import { format } from "date-fns";

const NewsPage = () => {
	const [news, setNews] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [perPage, setPerPage] = useState(9);
	const [totalPages, setTotalPages] = useState(0);
	const [searchTerm, setSearchTerm] = useState("");
	const [noResults, setNoResults] = useState(false);
	const fetchData = useCallback(async () => {
		try {
			let url = "/api/news";
			if (searchTerm) {
				url += `?title=${searchTerm}`;
			}
			const response = await client.get(url);
			const totalNews = response.data.length;

			const activeNews = response.data.filter((news) => news.isActive);
			const totalActiveNews = activeNews.length;
			setTotalPages(Math.ceil(totalActiveNews / perPage));

			activeNews.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

			const startIndex = (currentPage - 1) * perPage;
			const endIndex = startIndex + perPage;
			const newsForCurrentPage = activeNews.slice(startIndex, endIndex);

			const formattedNews = newsForCurrentPage.map((news) => {
				const formattedDateTime = format(
					new Date(news.updatedAt),
					"yy-MM-dd HH:mm"
				);
				return {
					...news,
					formattedDateTime,
				};
			});

			setNews(formattedNews);

			if (newsForCurrentPage.length === 0) {
				setNoResults(true);
			} else {
				setNoResults(false);
			}
		} catch (error) {
			console.error(error);
		}
	}, [searchTerm, news, currentPage, perPage]);

	const handleChangePage = (event, page) => {
		setCurrentPage(page);
	};

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const handleSearchChange = (event) => {
		setSearchTerm(event.target.value);
		setCurrentPage(1);
	};

	return (
		<Container>
			<Box>
				<Typography
					variant="subtitle1"
					sx={{ fontWeight: "600", color: "#1a237e" }}
				>
					Tìm kiếm tin tức
				</Typography>

				<TextField
					type="search"
					placeholder="Tìm kiếm theo tiêu đề..."
					onChange={handleSearchChange}
					value={searchTerm}
					variant="outlined"
					sx={{
						my: "1rem",
						maxWidth: "30rem",
					}}
					fullWidth
					size="small"
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<SearchIcon />
							</InputAdornment>
						),
					}}
				/>
			</Box>
			{noResults ? (
				<Typography
					variant="subtitle1"
					sx={{ textAlign: "center", marginTop: 2, color: "#bf360c" }}
				>
					Không tìm thấy kết quả phù hợp
				</Typography>
			) : (
				<>
					<Typography
						variant="h5"
						sx={{
							mt: 2,
							mb: 2,
							color: "#1a237e",
							fontWeight: "600",
							textAlign: "center",
						}}
					>
						TIN TỨC MỚI NHẤT
					</Typography>
					<Grid container spacing={2}>
						{news.map((news) => (
							<Grid item xs={12} sm={6} md={4} key={news.id}>
								<NewsCard news={news} />
							</Grid>
						))}
					</Grid>
					<Pagination
						count={totalPages}
						page={currentPage}
						onChange={handleChangePage}
						sx={{ mt: 4, justifyContent: "center" }}
					/>
				</>
			)}
		</Container>
	);
};

export default NewsPage;

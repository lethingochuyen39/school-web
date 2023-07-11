import React, { useState, useEffect, useCallback } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import {
	Box,
	Divider,
	Input,
	Pagination,
	Paper,
	Typography,
} from "@mui/material";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import client from "../../../api/client";
import SearchIcon from "@mui/icons-material/Search";
import FileDownloader from "../../Document/FileDownloader";
import { format } from "date-fns";
const defaultTheme = createTheme();

export default function DocumentStudentPage() {
	const [currentPage, setCurrentPage] = useState(1);
	const [perPage, setPerPage] = useState(10);
	const [totalPages, setTotalPages] = useState(0);
	const [documents, setDocument] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [noResults, setNoResults] = useState(false);

	const fetchData = useCallback(async () => {
		try {
			let url = "/api/documents";
			if (searchTerm) {
				url += `?title=${searchTerm}`;
			}
			const response = await client.get(url);
			const isDoc = response.data;
			const totalDocuments = response.data.length;
			setTotalPages(Math.ceil(totalDocuments / perPage));
			isDoc.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
			const startIndex = (currentPage - 1) * perPage;
			const endIndex = startIndex + perPage;
			const documentsForCurrentPage = isDoc.slice(startIndex, endIndex);
			const formattedDocuments = documentsForCurrentPage.map((documents) => {
				const formattedDateTime = format(
					new Date(documents.updatedAt),
					"yy-MM-dd HH:mm"
				);
				return {
					...documents,
					formattedDateTime,
				};
			});
			setDocument(formattedDocuments);

			if (documentsForCurrentPage.length === 0) {
				setNoResults(true);
			} else {
				setNoResults(false);
			}
		} catch (error) {
			console.error(error);
		}
	}, [searchTerm, documents, currentPage, perPage]);

	const handleSearchChange = (event) => {
		setSearchTerm(event.target.value);
		setCurrentPage(1);
	};

	const handleChangePage = (event, page) => {
		setCurrentPage(page);
	};
	useEffect(() => {
		fetchData();
	}, [fetchData]);
	return (
		<ThemeProvider theme={defaultTheme}>
			<CssBaseline />
			<Container maxWidth="lg">
				<main>
					<Grid container spacing={5} paddingTop={2}>
						<Grid
							item
							xs={12}
							md={9}
							sx={{
								py: 3,
							}}
						>
							<Typography
								variant="h6"
								sx={{ fontWeight: "600", color: "#1a237e" }}
								gutterBottom
							>
								THAM KHẢO TÀI LIỆU
							</Typography>
							<Divider />
							{noResults ? (
								<Typography
									variant="subtitle1"
									sx={{ textAlign: "center", marginTop: 2, color: "#bf360c" }}
								>
									Không tìm thấy kết quả phù hợp
								</Typography>
							) : (
								<>
									<Grid container spacing={4} marginTop={0.5}>
										{documents.map((documents) => (
											<Grid item xs={12} md={6} key={documents.id}>
												<CardActionArea component="a">
													<Card
														sx={{
															display: "flex",
															height: 170,
															border: 0.05,
														}}
													>
														<CardContent sx={{ flex: 1 }}>
															<Typography
																variant="subtitle1"
																sx={{
																	fontWeight: 600,
																	lineHeight: "1.2rem",
																	height: "2.5rem",
																	overflow: "hidden",
																}}
															>
																{documents.title}
															</Typography>
															<Typography
																variant="body2"
																color="text.secondary"
																sx={{
																	fontSize: "0.7rem",
																}}
															>
																{documents.formattedDateTime}
															</Typography>
															<Typography
																variant="body1"
																sx={{
																	overflow: "hidden",
																	height: "3.5rem",
																	lineHeight: "1.2rem",
																}}
															>
																{documents.description}
															</Typography>

															<FileDownloader
																url={`/api/documents/${documents.id}/download`}
																fileName={documents.fileName}
															/>
															<a
																href={
																	`${process.env.REACT_APP_BASE_URL}/uploads/documents/` +
																	`${documents.fileName}`
																}
																target="_blank"
																rel="noopener noreferrer"
															>
																Xem file
															</a>
														</CardContent>
														<CardMedia
															component="img"
															src={
																documents.fileName.endsWith(".doc") ||
																documents.fileName.endsWith(".docx")
																	? "/images/icons/word_icon.svg"
																	: documents.fileName.endsWith(".pdf")
																	? "/images/icons/pdf_icon.png"
																	: documents.fileName.endsWith(".xlsx")
																	? "/images/icons/excel.png"
																	: ""
															}
															alt={documents.title}
															sx={{
																width: 70,
																display: { xs: "none", sm: "block" },
															}}
														/>
													</Card>
												</CardActionArea>
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
						</Grid>
						<Grid item xs={12} md={3}>
							<Paper elevation={0} sx={{ p: 2, bgcolor: "grey.200" }}>
								<Typography variant="h6" gutterBottom>
									Xin chào !
								</Typography>
								<Typography>
									Tìm tài liệu một cách nhanh chóng và tiện lợi tại đây.
								</Typography>
							</Paper>
							<Typography
								variant="h6"
								gutterBottom
								sx={{ fontWeight: "600", color: "#1a237e", mt: 3 }}
							>
								Tìm kiếm
							</Typography>
							<Box
								minWidth={{ xs: "100%", sm: 0, md: "100px" }}
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
						</Grid>
					</Grid>
				</main>
			</Container>
		</ThemeProvider>
	);
}

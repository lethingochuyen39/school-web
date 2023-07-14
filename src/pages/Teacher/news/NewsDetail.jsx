import { useParams, useNavigate } from "react-router-dom";
import {
	Box,
	Typography,
	Grid,
	Card,
	CardMedia,
	CardContent,
	Button,
	CardActions,
	Divider,
	Chip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import client from "../../../api/client";
import { useEffect, useState, useRef } from "react";
import EastIcon from "@mui/icons-material/East";
import EventIcon from "@mui/icons-material/Event";
import { format } from "date-fns";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const NewsDetailPage = () => {
	const { id } = useParams();
	const [news, setNews] = useState({});
	const [recentNews, setRecentNews] = useState([]);
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);

	const [imageSrc, setImageSrc] = useState("");

	useEffect(() => {
		const fetchImage = async () => {
			if (!news.imagePath) {
				return;
			}
			try {
				const response = await client.get("/api/images", {
					params: {
						path: news.imagePath,
					},
					responseType: "blob",
				});

				const imageUrl = URL.createObjectURL(response.data);
				setImageSrc(imageUrl);
			} catch (error) {
				console.error("Error fetching image:", error);
			}
		};

		fetchImage();
	}, [news.imagePath]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setIsLoading(true);
				const response = await client.get(`/api/news/${id}`);
				const data = response.data;
				const formattedDateTime = format(
					new Date(data.updatedAt),
					"yy-MM-dd HH:mm"
				);

				data.updatedAt = formattedDateTime;
				setNews(data);
				setIsLoading(false);
			} catch (error) {
				console.error(error);
			}
		};

		fetchData();
	}, [id]);

	useEffect(() => {
		const fetchRecentNews = async () => {
			try {
				const response = await client.get("/api/news");
				const data = response.data;

				const activeNews = response.data.filter((news) => news.isActive);
				activeNews.sort(
					(a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
				);

				const formattedRecentNews = data.slice(0, 6).map(async (news) => {
					try {
						const response = await client.get("/api/images", {
							params: {
								path: news.imagePath,
							},
							responseType: "blob",
						});

						const imageUrl = URL.createObjectURL(response.data);

						const formattedDateTime = format(
							new Date(news.updatedAt),
							"yy-MM-dd HH:mm"
						);

						return {
							...news,
							imageUrl,
							formattedDateTime,
						};
					} catch (error) {
						console.error("Error fetching image:", error);
						return null;
					}
				});

				const recentNewsData = await Promise.all(formattedRecentNews);
				setRecentNews(recentNewsData.filter((news) => news !== null));
			} catch (error) {
				console.error(error);
			}
		};

		fetchRecentNews();
	}, []);
	const handleGoBack = () => {
		navigate(`/teacher/news`);
	};

	const handleClick = (id) => {
		navigate(`/teacher/news-detail/${id}`);
	};

	const sliderSettings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		autoplay: true,
		autoplaySpeed: 2000,
		responsive: [
			{
				breakpoint: 960,
				settings: {
					slidesToShow: 2,
				},
			},
			{
				breakpoint: 600,
				settings: {
					slidesToShow: 1,
				},
			},
		],
	};

	return (
		<>
			<Grid container justifyContent="center" spacing={2} sx={{ mb: 6 }}>
				<Grid item xs={10} md={8}>
					<Box sx={{ position: "relative", mb: 4, mr: 2, mf: 2 }}>
						{news.imagePath ? (
							<img
								alt={news.imageName}
								src={imageSrc}
								style={{
									zIndex: "-1",
									maxHeight: "350px",
									width: "100%",
									minHeight: "200px",
									objectFit: "contain",
								}}
							/>
						) : (
							<Typography
								style={{
									zIndex: "-1",
									maxHeight: "350px",
									width: "100%",
									minHeight: "200px",
									objectFit: "contain",
								}}
							></Typography>
						)}

						<Box
							sx={{
								position: "absolute",
								left: 0,
								right: 0,
								bottom: 0,
								backgroundColor: "rgba(0, 0, 0, 0.5)",
								display: "flex",
								flexDirection: "column",
								justifyContent: "flex-end",
								padding: "1rem",
								color: "#ffff",
							}}
						>
							<Typography
								variant="h5"
								sx={{ marginBottom: "0.5rem", textTransform: "uppercase" }}
							>
								{news.title}
							</Typography>
						</Box>
					</Box>
					<Typography
						variant="overline"
						sx={{
							display: "flex",
							alignItems: "center",
							color: "grey",
						}}
					>
						<EventIcon sx={{ fontSize: "medium", mr: ".5rem" }} />
						{news.updatedAt}
					</Typography>

					<Box>
						<Typography
							variant="body1"
							sx={{
								marginBottom: "2rem",
								overflowWrap: "break-word",
								overflow: "hidden",
								wordBreak: "break-word",
								lineHeight: "2rem",
								textAlign: "justify",
							}}
						>
							{news.content}
						</Typography>
					</Box>

					<Box sx={{ mt: 4 }}>
						<Button
							onClick={handleGoBack}
							startIcon={<ArrowBackIcon />}
							sx={{ textTransform: "none" }}
						>
							Quay lại tin tức
						</Button>
					</Box>
				</Grid>

				<Grid item xs={10} md={3} sx={{ ml: 4 }}>
					<Divider sx={{ mb: 2 }}>
						<Chip
							label="TIN GẦN ĐÂY"
							sx={{ color: "#1a237e", fontSize: "1.5rem", fontWeight: "600" }}
						/>
					</Divider>

					<Slider {...sliderSettings}>
						{recentNews.map((recent) => (
							<Card
								key={recent.id}
								sx={{
									maxWidth: "90%",
									height: 320,
									m: "0 auto",
									mb: 2,
									borderRadius: "20px",
									display: "flex",
									flexDirection: "row",
									border: 0.05,
									margin: 1,
								}}
							>
								<CardMedia
									component="img"
									sx={{ height: 150, maxWidth: "100%" }}
									src={recent.imageUrl}
									title={recent.title}
								/>
								<CardContent
									sx={{
										paddingTop: "0.5rem",
									}}
								>
									<Typography
										variant="overline"
										sx={{
											display: "flex",
											alignItems: "center",
											color: "grey",
										}}
									>
										<EventIcon sx={{ fontSize: "medium", mr: ".5rem" }} />
										{recent.formattedDateTime}
									</Typography>

									<Typography
										variant="subtitle1"
										sx={{
											fontWeight: 600,
											lineHeight: "1rem",
											mb: ".5rem",
											mt: ".5rem",
											overflow: "hidden",
										}}
										noWrap
									>
										{recent.title}
									</Typography>

									<Typography
										variant="body2"
										sx={{
											overflowWrap: "break-word",
											height: "2rem",
											maxHeight: "4rem",
											overflow: "hidden",
											justifyContent: "space-between",
										}}
										noWrap
									>
										{recent.content}
									</Typography>
								</CardContent>

								<CardActions sx={{ marginTop: "-1rem" }}>
									<Button
										variant="text"
										size="small"
										endIcon={<EastIcon />}
										sx={{ fontWeight: "600", cursor: "pointer" }}
										onClick={() => handleClick(recent.id)}
									>
										Xem thêm
									</Button>
								</CardActions>
							</Card>
						))}
					</Slider>
				</Grid>
			</Grid>
		</>
	);
};

export default NewsDetailPage;

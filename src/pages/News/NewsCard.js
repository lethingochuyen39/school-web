import React, { useEffect, useState } from "react";
import {
	Card,
	CardMedia,
	CardContent,
	Typography,
	Grid,
	Button,
	CardActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import EastIcon from "@mui/icons-material/East";
import EventIcon from "@mui/icons-material/Event";
import client from "../../api/client";
const NewsCard = ({ news }) => {
	const handleClick = () => {
		const role = localStorage.getItem("role");
		if (role === "STUDENT" || role === "PARENT") {
			navigate(`/user/news-detail/${news.id}`);
		}
		if (role === "TEACHER") {
			navigate(`/teacher/news-detail/${news.id}`);
		}
	};
	const navigate = useNavigate();

	const [imageSrc, setImageSrc] = useState("");

	useEffect(() => {
		const fetchImage = async () => {
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

	return (
		<Grid item xs={12}>
			<Card
				sx={{
					maxWidth: 500,
					height: 300,
					m: "0 auto",
					boxShadow: "1 2px 30px rgba(0, 0, 0, 0.12)",
					border: 0.05,
					borderRadius: 3,
					margin: 1,
					backgroundColor: "#ffff",
				}}
			>
				<CardMedia
					component="img"
					sx={{ height: 100 }}
					src={imageSrc}
					title={news.title}
				/>
				<CardContent sx={{ paddingTop: "0.5rem" }}>
					<Typography
						variant="overline"
						sx={{ display: "flex", alignItems: "center", color: "grey" }}
					>
						<EventIcon sx={{ fontSize: "medium", mr: ".5rem" }} />
						{news.formattedDateTime}
					</Typography>

					<Typography
						variant="subtitle1"
						sx={{
							fontWeight: 600,
							lineHeight: "1.2rem",
							mb: ".5rem",
							mt: ".5rem",
							height: "2.5rem",
							overflow: "hidden",
						}}
					>
						{news.title}
					</Typography>

					<Typography
						variant="body2"
						sx={{
							overflow: "hidden",
							height: "2.5rem",
						}}
						// noWrap
					>
						{news.content}
					</Typography>
				</CardContent>

				<CardActions>
					<Button
						variant="text"
						size="small"
						endIcon={<EastIcon />}
						sx={{ fontWeight: "600", cursor: "pointer" }}
						onClick={handleClick}
					>
						Xem thêm
					</Button>
				</CardActions>
			</Card>
		</Grid>
	);
};

export default NewsCard;

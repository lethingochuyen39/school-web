import React from "react";
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
const NewsCard = ({ news }) => {
	const handleClick = () => {
		navigate(`/teacher/news-detail/${news.id}`);
	};
	const navigate = useNavigate();

	return (
		<Grid item xs={12}>
			<Card sx={{ maxWidth: 500, height: 320, m: "0 auto" }}>
				<CardMedia
					sx={{ height: 140 }}
					image={process.env.PUBLIC_URL + `/${news.imagePath}`}
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
						}}
						noWrap
					>
						{news.title}
					</Typography>

					<Typography
						variant="body2"
						sx={{
							overflow: "hidden",
							height: "2.5rem",
						}}
						noWrap
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

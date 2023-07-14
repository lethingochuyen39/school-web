import * as React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Container from "@mui/material/Container";
import {
	Facebook,
	Instagram,
	LocationOn,
	Mail,
	Phone,
	Twitter,
} from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import ScrollToTopButton from "../common/Scroll/ScrollToTopButton";

const FooterContainer = styled("footer")(({ theme }) => ({
	borderTop: `1px solid ${theme.palette.divider}`,
	borderBottom: `1px solid ${theme.palette.divider}`,
	marginTop: theme.spacing(3),
	paddingTop: theme.spacing(1, 3),
	backgroundColor: "#f5f5f5",
	width: "100%",
}));
const FooterGrid = styled(Grid)({
	"& ul": {
		margin: 3,
		padding: 0,
		listStyle: "none",
	},
});

const SocialMediaLink = styled(Link)(({ theme, color }) => ({
	color: "theme.palette.text.secondary",
	textDecoration: "none",
	display: "flex",
	alignItems: "center",
}));

const SocialMediaIcon = styled(IconButton)(({ theme, color }) => ({
	color: color || "inherit",
}));

export default function FooterStudent() {
	const footers = [
		{
			title: "Social Media",
			description: [
				{
					name: "Twitter",
					link: "https://www.twitter.com",
					icon: <Twitter />,
					color: "#0091ea",
				},
				{
					name: "Instagram",
					link: "https://www.instagram.com",
					icon: <Instagram />,
					color: "red",
				},

				{
					name: "Facebook",
					link: "https://www.facebook.com",
					icon: <Facebook />,
					color: "#00b0ff",
				},
			],
		},
		{
			title: "Liên hệ ngay",
			description: [
				{
					icon: <LocationOn />,
					text: "590 CMT8, Q.3, TP.HCM",
				},
				{
					icon: <Phone />,
					text: "1900 02 10 39 (P.DT)",
				},
				{
					icon: <Mail />,
					text: "admin@gmail.com",
				},
			],
		},
	];

	return (
		<React.Fragment>
			<FooterContainer component="footer">
				<FooterGrid container justifyContent="space-evenly">
					{footers.map((footer) => (
						<Grid item xs={6} sx={{ paddingTop: 2 }} sm={3} key={footer.title}>
							<Typography variant="h6" color="text.primary" gutterBottom>
								{footer.title}
							</Typography>
							<ul>
								{footer.description.map((item) => (
									<li key={item.name}>
										<SocialMediaLink
											href="#"
											variant="subtitle1"
											color="text.secondary"
										>
											<SocialMediaIcon color={item.color || "inherit"}>
												{item.icon}
											</SocialMediaIcon>
											{item.name} {item.text}
										</SocialMediaLink>
									</li>
								))}
							</ul>
						</Grid>
					))}
				</FooterGrid>
				<Grid container justifyContent="flex-end">
					<Typography variant="body2" color="text.secondary" align="center">
						{"Copyright © "}
						<Link color="inherit" href="https://mui.com/">
							School Management
						</Link>{" "}
						{new Date().getFullYear()}
						{"."}
					</Typography>
				</Grid>
			</FooterContainer>

			<ScrollToTopButton />
		</React.Fragment>
	);
}

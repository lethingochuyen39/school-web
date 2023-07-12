import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { Box } from "@mui/material";

export default function FooterAmin() {
	return (
		<Box
			sx={{
				backgroundColor: "#f5f5f5",
				p: 2,
				mt: "auto",
				marginBottom: "-8px",
			}}
			component="footer"
		>
			<Container maxWidth="sm">
				<Typography variant="body2" color="text.secondary" align="center">
					{"Copyright © "}
					<Link color="inherit" href="https://your-website.com/">
						School Management
					</Link>{" "}
					{new Date().getFullYear()}
					{"."}
				</Typography>
			</Container>
		</Box>
	);
}

import * as React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import Container from "@mui/material/Container";
import HeaderStudent from "../components/Header/HeaderStudent";
import FooterStudent from "../components/Footer/FooterStudent";
import { Outlet } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

const defaultTheme = createTheme();

export default function LayoutStudent() {
	const theme = useTheme();
	const styles = {
		content: {
			paddingTop: 10,
			[theme.breakpoints.up("xs")]: {
				paddingTop: 25,
			},
			[theme.breakpoints.up("sm")]: {
				paddingTop: 23,
			},
			[theme.breakpoints.up("md")]: {
				paddingTop: 16,
			},
			[theme.breakpoints.up("lg")]: {
				paddingTop: 12,
			},
		},
	};
	return (
		<ThemeProvider theme={defaultTheme}>
			<GlobalStyles
				styles={{ ul: { margin: 0, padding: 0, listStyle: "none" } }}
			/>
			<CssBaseline />
			<HeaderStudent />
			<Container maxWidth="md" component="main" sx={styles.content}>
				<Outlet />
			</Container>
			<FooterStudent />
		</ThemeProvider>
	);
}

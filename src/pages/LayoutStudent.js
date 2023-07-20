import * as React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import Container from "@mui/material/Container";
import HeaderStudent from "../components/Header/HeaderStudent";
import FooterStudent from "../components/Footer/FooterStudent";
import { Outlet } from "react-router-dom";

const defaultTheme = createTheme();

export default function LayoutStudent() {
	const styles = {
		content: {
			paddingTop: 10,
		},
	};
	return (
		<ThemeProvider theme={defaultTheme}>
			<GlobalStyles
				styles={{ ul: { margin: 0, padding: 0, listStyle: "none" } }}
			/>
			<CssBaseline />
			<HeaderStudent />
			<Container component="main" sx={styles.content}>
				<Outlet />
			</Container>
			<FooterStudent />
		</ThemeProvider>
	);
}

import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { mainListItems, secondaryListItems } from "../pages/Teacher/listItems";
import LogoutIcon from "@mui/icons-material/Logout";
import { Outlet, useNavigate } from "react-router-dom";
import { logout } from "../api/client";

function Footer(props) {
	return (
		<Typography
			variant="body2"
			color="text.secondary"
			align="center"
			marginBottom={2}
			{...props}
		>
			{"Copyright © "}
			<Link color="inherit" href="https://mui.com/">
				School Management
			</Link>{" "}
			{new Date().getFullYear()}
			{"."}
		</Typography>
	);
}

function Logo() {
	return (
		<Box sx={{ display: "flex", alignItems: "center" }}>
			<img
				src="/images/logo/elogo.jpg"
				alt="Logo"
				style={{ width: 100, height: 75, marginLeft: 35 }}
			/>
		</Box>
	);
}

const drawerWidth = 200;

const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
	zIndex: theme.zIndex.drawer + 1,
	transition: theme.transitions.create(["width", "margin"], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	...(open && {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(["width", "margin"], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	}),
}));

const Drawer = styled(MuiDrawer, {
	shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
	"& .MuiDrawer-paper": {
		position: "relative",
		whiteSpace: "nowrap",
		width: drawerWidth,
		transition: theme.transitions.create("width", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
		boxSizing: "border-box",

		...(!open && {
			overflowX: "hidden",
			transition: theme.transitions.create("width", {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.leavingScreen,
			}),
			width: theme.spacing(7),
			[theme.breakpoints.up("sm")]: {
				width: theme.spacing(9),
			},
		}),
	},
}));

const defaultTheme = createTheme();

export default function LayoutTeacher() {
	const navigate = useNavigate();
	const handleLogout = () => {
		logout();
		navigate("/login");
	};
	const [open, setOpen] = React.useState(true);
	const toggleDrawer = () => {
		setOpen(!open);
	};

	return (
		<ThemeProvider theme={defaultTheme}>
			<Box sx={{ display: "flex" }}>
				<CssBaseline />
				<AppBar position="absolute" open={open}>
					<Toolbar
						sx={{
							pr: "24px",
						}}
					>
						<IconButton
							edge="start"
							color="inherit"
							aria-label="open drawer"
							onClick={toggleDrawer}
							sx={{
								marginRight: "36px",
								...(open && { display: "none" }),
							}}
						>
							<MenuIcon />
						</IconButton>
						<Typography sx={{ flexGrow: 1 }}>
							<Link
								href="/teacher/home"
								underline="none"
								color={"HighlightText"}
								variant="h6"
							>
								{"Trang chủ"}
							</Link>
						</Typography>
						<IconButton color="inherit" onClick={handleLogout}>
							<LogoutIcon />
						</IconButton>
					</Toolbar>
				</AppBar>
				<Drawer variant="permanent" open={open}>
					<Toolbar
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							px: [1],
						}}
					>
						{" "}
						<Typography variant="h6" component="div">
							<Logo />
						</Typography>
						<IconButton onClick={toggleDrawer}>
							<ChevronLeftIcon />
						</IconButton>
					</Toolbar>
					<Divider />
					<List component="nav">
						{mainListItems}
						<Divider sx={{ my: 1 }} />
						{secondaryListItems}
					</List>
				</Drawer>
				<Box
					component="main"
					sx={{
						backgroundColor: (theme) =>
							theme.palette.mode === "light"
								? theme.palette.grey[100]
								: theme.palette.grey[900],
						flexGrow: 1,
						minHeight: "100vh",
						overflow: "auto",
					}}
				>
					<Toolbar />
					<Container
						maxWidth="lg"
						sx={{ mt: 3, mb: 4, minHeight: "calc(83vh - 64px)" }}
					>
						<Outlet />
					</Container>
					<Footer />
				</Box>
			</Box>
		</ThemeProvider>
	);
}

import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Grid from "@mui/material/Grid";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import Header from "../components/Header/Header";
import Navbar from "../components/Navbar/Navbar";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

function LayoutAdmin() {
	const [title, setTitle] = useState(null);
	const location = useLocation();
	const navigate = useNavigate();

	const checkLogin = async () => {
		// const cookies = new Cookies();
		// const token = await cookies.get("token");
		// if (token === undefined || token === null) {
		// 	navigate("/login");
		// }
		const token = localStorage.getItem("token");
		if(!token){
			navigate("/login");
		}
	};
	useEffect(() => {
		const parsedTitle = location.pathname.replace(/\W/g, " ");
		setTitle(parsedTitle);
		checkLogin();
	}, [location]);

	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};
	const theme = useTheme();
	const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
	return (
		<Grid container>
			<Grid
				item
				xs={isSmallScreen ? 12 : isSidebarOpen ? 5 : 2}
				sm={isSmallScreen ? 12 : isSidebarOpen ? 4 : 1}
			>
				<Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
			</Grid>
			<Grid
				item
				xs={isSidebarOpen ? 7 : 12}
				sm={isSidebarOpen ? 10 : 12}
				md={isSidebarOpen ? 12 : 12}
				lg={isSidebarOpen ? 12 : 12}
				sx={{
					marginLeft: isSidebarOpen ? "210px" : 0,
					transition: "margin-left 0.3s ease-in-out",
				}}
			>
				<Header title={title} toggleSidebar={toggleSidebar} />
				<Outlet />
			</Grid>
		</Grid>
	);
}

export default LayoutAdmin;

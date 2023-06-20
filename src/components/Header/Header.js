import React, { useState } from "react";
import CommonButton from "../common/CommonButton/CommonButton";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import HelpIcon from "@mui/icons-material/Help";
import Box from "@mui/material/Box";
import { Menu as MenuIcon } from "@mui/icons-material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../api/client";
const Header = ({ title, toggleSidebar }) => {
	const navigate = useNavigate();
	const [anchorEl, setAnchorEl] = useState(null);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
	const handleLogout = () => {
		// Thực hiện đăng xuất: xóa token và chuyển hướng về trang đăng nhập
		logout();
		navigate("/login");
	};

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const headerStyles = {
		wrapper: {
			width: "100%",
			display: "flex",
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			marginTop: "-8px",
			background: "linear-gradient(to right, #ff0000, #ff9900)",
		},
		leftSection: {
			display: "flex",
			alignItems: "center",
		},
		rightSection: {
			display: "flex",
			alignItems: "center",
		},
		link: {
			fontWeight: 300,
			color: "rgba(255, 255, 255, 0.7)",
			"&:hover": {
				color: "#fff",
				cursor: "pointer",
			},
		},
		webButton: {
			marginRight: "5px",
		},
		username: {
			fontWeight: "bold",
			marginRight: "5px",
		},
		menuDivider: {
			margin: "0 10px",
			borderLeft: "1px solid rgba(255, 255, 255, 0.5)",
			height: "20px",
		},
		middleRow: {
			display: "flex",
			flexDirection: "row",
			alignItems: "center",
		},
		title: {
			marginRight: "20px",
			color: "white",
			fontSize: "18px",
			fontWeight: "bold",
		},
	};

	return (
		<Box sx={headerStyles.wrapper}>
			<Box sx={headerStyles.leftSection}>
				<IconButton
					color="white"
					aria-label="toggle sidebar"
					onClick={toggleSidebar}
				>
					<MenuIcon />
				</IconButton>
				<Typography variant="h1" color="white" sx={headerStyles.title}>
					{/* <Link to="/" style={{ ...headerStyles.link, textDecoration: "none" }}>
						<span style={{ fontSize: "20px", fontWeight: "bold" }}>
							Trang chủ
						</span>
					</Link>{" "} */}
					{/* {title ? "/ " + title : ""} */}

					{title}
				</Typography>
			</Box>
			<Box sx={headerStyles.rightSection}>
				<Grid container alignItems="center" spacing={1}>
					<Grid item>
						{!isMobile && (
							<Tooltip title="Help">
								<IconButton color="white">
									<HelpIcon />
								</IconButton>
							</Tooltip>
						)}
					</Grid>
					<Grid item>
						{!isMobile && (
							<CommonButton
								sx={headerStyles.webButton}
								variant="outlined"
								onClick={handleLogout}
							>
								Đăng xuất
							</CommonButton>
						)}
					</Grid>

					<Grid item>
						<IconButton
							color="white"
							aria-label="account"
							onClick={handleClick}
						>
							<Avatar src="https://mui.com/static/images/avatar/1.jpg" />
						</IconButton>
						<Menu
							anchorEl={anchorEl}
							open={Boolean(anchorEl)}
							onClose={handleClose}
						>
							<MenuItem>
								<Typography sx={headerStyles.username}>Username</Typography>
							</MenuItem>
							<MenuItem>
								<Typography>Tài khoản</Typography>
							</MenuItem>
							<MenuItem>
								<Typography>Đăng xuất</Typography>
							</MenuItem>
						</Menu>
					</Grid>
				</Grid>
			</Box>
		</Box>
	);
};

export default Header;

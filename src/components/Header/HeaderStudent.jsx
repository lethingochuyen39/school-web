import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { styled } from "@mui/material/styles";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";
import { Box } from "@mui/system";
import { Avatar, Grid, IconButton, Tooltip } from "@mui/material";
import { Navigate, useNavigate } from "react-router-dom";
import { logout } from "../../api/client";

const HeaderAppBar = styled(AppBar)({
	backgroundColor: "#f5f5f5",
	borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
	position: "fixed",
	top: 0,
	left: 0,
	right: 0,
	zIndex: 999,
});

const HeaderLogo = styled("img")({
	width: 100,
	height: 65,
	marginTop: 3,
	marginLeft: 10,
});

const HeaderLink = styled(Link)({
	"&:hover": {
		color: "#ff3d00",
	},
});

const HeaderLinkMenu = styled(Link)(({ isOpen }) => ({
	color: isOpen ? "#ff3d00" : "inherit",
	"&:hover": {
		color: "#ff3d00",
	},
}));

export default function HeaderStudent() {
	const navigate = useNavigate();
	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	const [anchorEl, setAnchorEl] = React.useState(null);
	const [anchorElUser, setAnchorElUser] = React.useState(null);

	const handleMenuOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const handleOpenUserMenu = (event) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	return (
		<HeaderAppBar position="static" elevation={0}>
			<Grid container>
				<Grid item xs={4}>
					<Toolbar sx={{ flexWrap: "wrap", flexGrow: 1 }}>
						<HeaderLogo src="/images/logo/logo-st.png" alt="Logo" />
					</Toolbar>
				</Grid>
				<Grid item xs={8}>
					<Toolbar sx={{ display: "flex", justifyContent: "flex-end" }}>
						<nav>
							<HeaderLink
								variant="button"
								color="text.primary"
								href="#"
								sx={{ my: 1, mx: 1.5, textDecoration: "none" }}
								onClick={handleMenuOpen}
							>
								<HeaderLinkMenu
									isOpen={Boolean(anchorEl)}
									href="#"
									color="inherit"
									underline="none"
								>
									Tổng quan
								</HeaderLinkMenu>
							</HeaderLink>
							<Menu
								anchorEl={anchorEl}
								open={Boolean(anchorEl)}
								onClose={handleMenuClose}
								TransitionComponent={Fade}
								keepMounted
							>
								<MenuItem onClick={handleMenuClose}>
									<Link href="/path1" color="inherit" underline="none">
										Điểm danh
									</Link>
								</MenuItem>
								<MenuItem onClick={handleMenuClose}>
									<Link href="/path2" color="inherit" underline="none">
										Hạng kiểm
									</Link>
								</MenuItem>
								<MenuItem onClick={handleMenuClose}>
									<Link href="/path3" color="inherit" underline="none">
										Thống kê
									</Link>
								</MenuItem>
								<MenuItem onClick={handleMenuClose}>
									<Link href="/user/document" color="inherit" underline="none">
										Tài liệu tham khảo
									</Link>
								</MenuItem>
							</Menu>
							<HeaderLink
								variant="button"
								color="text.primary"
								href="/user/schedule"
								sx={{ my: 1, mx: 1, textDecoration: "none" }}
							>
								Thời khóa biểu
							</HeaderLink>

							<HeaderLink
								variant="button"
								color="text.primary"
								href="#"
								sx={{ my: 1, mx: 1.5, textDecoration: "none" }}
							>
								Bảng điểm
							</HeaderLink>

							<HeaderLink
								variant="button"
								color="text.primary"
								href="/user/news"
								sx={{ my: 1, mx: 1.5, textDecoration: "none" }}
							>
								Tin tức
							</HeaderLink>
						</nav>

						<Box sx={{ flexGrow: 0, pl: 3 }}>
							<Tooltip title="Tài khoản của tôi">
								<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
									<Avatar alt="Name" src="/images/avatar/girl_avatar.png" />
								</IconButton>
							</Tooltip>
							<Menu
								sx={{ mt: "45px" }}
								id="menu-appbar"
								anchorEl={anchorElUser}
								anchorOrigin={{
									vertical: "top",
									horizontal: "right",
								}}
								keepMounted
								transformOrigin={{
									vertical: "top",
									horizontal: "right",
								}}
								open={Boolean(anchorElUser)}
								onClose={handleCloseUserMenu}
							>
								<MenuItem key="tk" onClick={handleLogout}>
									<Typography textAlign="center">Tài khoản</Typography>
								</MenuItem>
								<MenuItem key="mk" onClick={handleLogout}>
									<Typography textAlign="center">Mật khẩu</Typography>
								</MenuItem>
								<MenuItem key="dk" onClick={handleLogout}>
									<Typography textAlign="center">Đăng xuất</Typography>
								</MenuItem>
							</Menu>
						</Box>
					</Toolbar>
				</Grid>
			</Grid>
		</HeaderAppBar>
	);
}

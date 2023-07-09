import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { styled } from "@mui/material/styles";

const HeaderAppBar = styled(AppBar)({
	backgroundColor: "#f5f5f5",
	borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
	position: "fixed",
	top: 0,
	left: 0,
	right: 0,
	zIndex: 999,
});

const HeaderButton = styled(Button)({
	color: "#ffffff",
	backgroundColor: "#ff5722",
	"&:hover": {
		backgroundColor: "#ff3d00",
	},
});

const HeaderLogo = styled("img")({
	width: 80,
	height: 60,
});

const HeaderLink = styled(Link)({
	"&:hover": {
		color: "#ff3d00",
	},
});

export default function HeaderStudent() {
	return (
		<HeaderAppBar position="static" elevation={0}>
			<Toolbar sx={{ flexWrap: "wrap" }}>
				<Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
					<HeaderLogo src="/images/logo/logo-st.png" alt="Logo" />
				</Typography>
				<nav>
					<HeaderLink
						variant="button"
						color="text.primary"
						href="/user/home"
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
						Điểm danh
					</HeaderLink>
					<HeaderLink
						variant="button"
						color="text.primary"
						href="#"
						sx={{ my: 1, mx: 1.5, textDecoration: "none" }}
					>
						Thống kê
					</HeaderLink>
					<HeaderLink
						variant="button"
						color="text.primary"
						href="/user/home"
						sx={{ my: 1, mx: 1, textDecoration: "none" }}
					>
						Hạng kiểm
					</HeaderLink>
					<HeaderLink
						variant="button"
						color="text.primary"
						href="#"
						sx={{ my: 1, mx: 1.5, textDecoration: "none" }}
					>
						Điểm
					</HeaderLink>
					<HeaderLink
						variant="button"
						color="text.primary"
						href="/teacher/news"
						sx={{ my: 1, mx: 1.5, textDecoration: "none" }}
					>
						Tin tức
					</HeaderLink>
					<HeaderLink
						variant="button"
						color="text.primary"
						href="/teacher/news"
						sx={{ my: 1, mx: 1.5, textDecoration: "none" }}
					>
						Tài liệu tham khảo
					</HeaderLink>
				</nav>
				<HeaderButton href="#" variant="outlined" sx={{ my: 1, mx: 1.5 }}>
					Đăng xuất
				</HeaderButton>
			</Toolbar>
		</HeaderAppBar>
	);
}

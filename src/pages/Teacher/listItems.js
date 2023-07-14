import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { Link } from "react-router-dom";
import HttpsIcon from "@mui/icons-material/Https";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
export const mainListItems = (
	<React.Fragment>
		<ListItemButton component={Link} to="/teacher/home">
			<ListItemIcon>
				<DashboardIcon />
			</ListItemIcon>
			<ListItemText primary="Trang chủ" />
		</ListItemButton>
		<ListItemButton>
			<ListItemIcon>
				<BarChartIcon />
			</ListItemIcon>
			<ListItemText primary="Thống kê" />
		</ListItemButton>
		<ListItemButton>
			<ListItemIcon>
				<AssignmentIcon />
			</ListItemIcon>
			<ListItemText primary="Điểm danh" />
		</ListItemButton>
		<ListItemButton component={Link} to="/teacher/schedule">
			<ListItemIcon>
				<CalendarMonthIcon />
			</ListItemIcon>
			<ListItemText primary="Lịch biểu" />
		</ListItemButton>
		<ListItemButton component={Link} to="/teacher/score">
			<ListItemIcon>
				<FactCheckIcon />
			</ListItemIcon>
			<ListItemText primary="Nhập điểm" />
		</ListItemButton>

		<ListItemButton component={Link} to="/teacher/document">
			<ListItemIcon>
				<LibraryBooksIcon />
			</ListItemIcon>
			<ListItemText primary="Tài liệu" />
		</ListItemButton>
		<ListItemButton component={Link} to="/teacher/news">
			<ListItemIcon>
				<NewspaperIcon />
			</ListItemIcon>
			<ListItemText primary="Tin tức" />
		</ListItemButton>
		<ListItemButton component={Link} to="/teacher/evaluationRecords">
			<ListItemIcon>
				<NewspaperIcon />
			</ListItemIcon>
			<ListItemText primary="Bảng đánh giá" />
		</ListItemButton>
		<ListItemButton component={Link} to="/teacher/reportCards">
			<ListItemIcon>
				<NewspaperIcon />
			</ListItemIcon>
			<ListItemText
				primary="Nhập Điểm Trung Bình"
				primaryTypographyProps={{ style: { whiteSpace: "normal" } }}
			/>
		</ListItemButton>
	</React.Fragment>
);

export const secondaryListItems = (
	<React.Fragment>
		<ListSubheader component="div" inset>
			Hồ sơ của bạn
		</ListSubheader>
		<ListItemButton>
			<ListItemIcon>
				<PeopleIcon />
			</ListItemIcon>
			<ListItemText primary="Tài khoản" />
		</ListItemButton>
		<ListItemButton>
			<ListItemIcon>
				<HttpsIcon />
			</ListItemIcon>
			<ListItemText primary="Đổi mật khẩu" />
		</ListItemButton>
	</React.Fragment>
);

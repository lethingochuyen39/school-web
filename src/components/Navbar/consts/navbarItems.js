import HomeIcon from "@mui/icons-material/Home";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import DateRangeIcon from "@mui/icons-material/DateRange";
import FiberNewIcon from "@mui/icons-material/FiberNew";
import AssessmentIcon from "@mui/icons-material/Assessment";
import FlightClassIcon from "@mui/icons-material/FlightClass";
import GradeIcon from "@mui/icons-material/Grade";
import ContactEmergencyIcon from "@mui/icons-material/ContactEmergency";
import StarsIcon from "@mui/icons-material/Stars";
import StackedBarChartIcon from "@mui/icons-material/StackedBarChart";
import SnippetFolderIcon from "@mui/icons-material/SnippetFolder";
import SwitchAccountIcon from "@mui/icons-material/SwitchAccount";
export const mainNavbarItems = [
	{
		id: 1,
		icon: <HomeIcon />,
		label: "Trang chủ",
		route: "home",
	},
	{
		id: 2,
		icon: <SwitchAccountIcon />,
		label: "Quản lý tài khoản",
		route: "home",
		children: [
			{
				id: 3,
				label: "Học sinh",
				route: "student",
			},
			{
				id: 4,
				label: "Giáo viên",
				route: "teacher",
			},
		],
	},
	{
		id: 5,
		icon: <EditCalendarIcon />,
		label: "Quản lý thời khóa biểu",
		route: "schedule",
	},
	{
		id: 6,
		icon: <FiberNewIcon />,
		label: "Quản lý tin tức",
		route: "news",
	},
	{
		id: 7,
		icon: <DateRangeIcon />,
		label: "Quản lý năm học",
		route: "academicYear",
	},
	{
		id: 8,
		icon: <MenuBookIcon />,
		label: "Quản lý môn học",
		route: "subject",
	},
	{
		id: 9,
		icon: <FlightClassIcon />,
		label: "Quản lý lớp học",
		route: "classes",
	},
	{
		id: 10,
		icon: <SnippetFolderIcon />,
		label: "Quản lý tài liệu",
		route: "document",
	},
	{
		id: 11,
		icon: <GradeIcon />,
		label: "Quản lý điểm số",
		route: "score",
		children: [
			{
				id: 20,
				label: "Loại điểm",
				route: "score-type",
			},
			{
				id: 21,
				label: "Điểm",
				route: "score",
			},
		],
	},
	{
		id: 13,
		icon: <StackedBarChartIcon />,
		label: "Quản lý thống kê",
		route: "metric",
	},
	{
		id: 14,
		icon: <AssessmentIcon />,
		label: "Quản lý báo cáo",
		route: "evaluationRecord",
	},
	{
		id: 15,
		icon: <StarsIcon />,
		label: "Quản lý hạng kiểm",
		route: "reportCard",
	},
];

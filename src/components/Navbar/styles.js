export const navbarStyles = {
	drawer: {
		width: 220,
		flexShrink: 0,
		"& .MuiDrawer-paper": {
			width: 220,
			boxSizing: "border-box",
			backgroundColor: "#f5f5f5",
			color: "#333",
		},
		"& .Mui-selected": {
			color: "red",
		},
	},
	icons: {
		color: "#3e2723!important",
		marginLeft: "0px",
	},
	text: {
		"& span": {
			marginLeft: "-15px",
			fontWeight: "600",
			fontSize: "16px",
			transition: "color 0.3s",
			color: "#4e342e",
		},
		"&:hover": {
			"& span": {
				color: "#795548",
				fontWeight: "bold",
			},
		},
	},
	subItem: {
		"&:hover": {
			backgroundColor: "rgba(255, 255, 255, 0.1)",
		},
	},

	//logo

	logoContainer: {
		display: "flex",
		alignItems: "center",
		marginBottom: "8px",
		padding: "4px",
		width: "100%",
		justifyContent: "center",
	},

	logoIcon: {
		color: "#5d4037",
		fontSize: "42px",
	},

	logoText: {
		color: "#5d4037",
		fontWeight: "bold",
	},
};

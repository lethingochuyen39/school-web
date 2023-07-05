import React, { useState } from "react";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import { mainNavbarItems } from "./consts/navbarItems";
import { navbarStyles } from "./styles";
import { useNavigate } from "react-router-dom";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SchoolIcon from "@mui/icons-material/School";
import { Box, Typography } from "@mui/material";
const Navbar = ({ isSidebarOpen, toggleSidebar }) => {
	const navigate = useNavigate();
	const [expandedItems, setExpandedItems] = useState([]);

	const handleItemClick = (route) => {
		navigate(route);
	};

	const handleExpandItem = (itemId) => {
		if (expandedItems.includes(itemId)) {
			setExpandedItems((prevExpandedItems) =>
				prevExpandedItems.filter((item) => item !== itemId)
			);
		} else {
			setExpandedItems((prevExpandedItems) => [...prevExpandedItems, itemId]);
		}
	};

	const isItemExpanded = (itemId) => {
		return expandedItems.includes(itemId);
	};

	const renderNavbarItems = (items) => {
		return items.map((item) => {
			if (item.children && item.children.length > 0) {
				const isExpanded = isItemExpanded(item.id);

				return (
					<React.Fragment key={item.id}>
						<ListItem button onClick={() => handleExpandItem(item.id)}>
							<ListItemIcon sx={navbarStyles.icons}>{item.icon}</ListItemIcon>
							<ListItemText sx={navbarStyles.text} primary={item.label} />
							{isExpanded ? (
								<ExpandLessIcon sx={navbarStyles.icons} />
							) : (
								<ExpandMoreIcon sx={navbarStyles.icons} />
							)}
						</ListItem>
						<Collapse in={isExpanded} timeout="auto" unmountOnExit>
							<List component="div" disablePadding>
								{renderNavbarItems(item.children)}
							</List>
						</Collapse>
					</React.Fragment>
				);
			} else {
				return (
					<ListItem
						button
						key={item.id}
						onClick={() => handleItemClick(item.route)}
					>
						<ListItemIcon sx={navbarStyles.icons}>{item.icon}</ListItemIcon>
						<ListItemText sx={navbarStyles.text} primary={item.label} />
					</ListItem>
				);
			}
		});
	};

	return (
		<Drawer
			sx={navbarStyles.drawer}
			variant="persistent"
			anchor="left"
			open={isSidebarOpen}
		>
			<Toolbar>
				<Box sx={navbarStyles.logoContainer}>
					<SchoolIcon sx={navbarStyles.logoIcon} />
					<Typography variant="h6" sx={navbarStyles.logoText}>
						Quản lý trường học
					</Typography>
				</Box>
			</Toolbar>
			<Divider />
			<List>{renderNavbarItems(mainNavbarItems)}</List>
		</Drawer>
	);
};

export default Navbar;

import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

const BasicCard = ({ header, content }) => {
	const cardStyles = {
		borderRadius: "8px",
	};

	return (
		<Card sx={cardStyles}>
			{header}
			<CardContent>{content}</CardContent>
		</Card>
	);
};

export default BasicCard;

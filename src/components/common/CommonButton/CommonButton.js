import React from "react";
import Button from "@mui/material/Button";

const CommonButton = ({
	children,
	color,
	disabled,
	size,
	sx,
	variant,
	onClick,
}) => {
	return (
		<Button
			color={color}
			disabled={disabled}
			size={size}
			sx={{
				color: "white",
				backgroundImage: "linear-gradient(to right, #ff0000, #ff9900)",
				...sx,
			}}
			variant={variant}
			onClick={onClick}
		>
			{children}
		</Button>
	);
};

export default CommonButton;

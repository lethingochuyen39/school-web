import React, { useState } from "react";
import { IconButton } from "@mui/material";
import { KeyboardArrowUp } from "@mui/icons-material";

const ScrollToTopButton = () => {
	const [showButton, setShowButton] = useState(false);

	const handleScroll = () => {
		const currentScrollY = window.pageYOffset;
		if (currentScrollY > 300) {
			setShowButton(true);
		} else {
			setShowButton(false);
		}
	};

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	React.useEffect(() => {
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<>
			{showButton && (
				<IconButton
					sx={{
						position: "fixed",
						bottom: 60,
						right: 16,
						backgroundColor: "#ff5722",
						color: "#ffffff",
						"&:hover": {
							backgroundColor: "#ff3d00",
						},
					}}
					onClick={scrollToTop}
				>
					<KeyboardArrowUp />
				</IconButton>
			)}
		</>
	);
};

export default ScrollToTopButton;

import React from "react";
import Grid from "@mui/material/Grid";

const GridWrapper = ({ children }) => {
	return (
		<Grid item xs={12}>
			{children}
		</Grid>
	);
};

export default GridWrapper;

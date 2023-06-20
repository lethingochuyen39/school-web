import React from "react";
import BasicCard from "../../components/common/BasicCard/BasicCard";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import Input from "@mui/material/Input";
import IconButton from "@mui/material/IconButton";
import CommonButton from "../../components/common/CommonButton/CommonButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import GridWrapper from "../../components/common/GridWrapper/GridWrapper";

const Home = () => {
	const handleChange = (value) => {
		console.log(value);
	};

	const addUser = () => {
		console.log("click");
	};

	const getHeader = () => (
		<Box
			display="flex"
			flexDirection={{ xs: "column", sm: "row" }}
			justifyContent="space-between"
			alignItems="center"
			paddingLeft="20px"
			paddingBottom="20px"
			paddingTop="10px"
			paddingRight="10px"
			flexWrap="wrap"
		>
			<Box
				flex={1}
				minWidth={{ xs: "100%", sm: 0, md: "500px" }}
				marginRight={{ xs: 0, sm: "10px" }}
				marginBottom={{ xs: "10px", sm: 0 }}
				backgroundColor="#f5f5f5"
				borderRadius="4px"
				padding="4px"
				display="flex"
				alignItems="center"
			>
				<SearchIcon sx={{ marginRight: "15px" }} />
				<Input
					placeholder="Search by email address, phone number, or user UID"
					onChange={(event) => handleChange(event.target.value)}
					sx={{
						width: { xs: "100%", sm: "auto", md: "100%" },
						color: "rgba(0, 0, 0, 0.6)",
						fontSize: "1.1rem",
					}}
					disableUnderline
				/>
			</Box>
			<Box display="flex" alignItems="center" marginTop={{ xs: "10px", sm: 0 }}>
				<CommonButton
					variant="contained"
					sx={{
						color: "white",
						backgroundImage: "linear-gradient(to right, #8bc34a, #4caf50)",
					}}
					onClick={addUser}
					size="large"
				>
					Add New
				</CommonButton>
				<IconButton>
					<RefreshIcon />
				</IconButton>
			</Box>
		</Box>
	);

	const getContent = () => (
		<Typography
			align="center"
			sx={{
				margin: "40px 16px",
				color: "rgba(0, 0, 0, 0.6)",
				fontSize: "1.rem",
			}}
		>
			No users for this project yet
		</Typography>
	);

	return (
		<GridWrapper>
			<BasicCard header={getHeader()} content={getContent()} />
		</GridWrapper>
	);
};

export default Home;

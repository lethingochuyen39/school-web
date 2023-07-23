import React, { useState, useEffect, useCallback } from "react";
import BasicCard from "../../components/common/BasicCard/BasicCard";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import client from "../../api/client";

import GridWrapper from "../../components/common/GridWrapper/GridWrapper";

const Home = () => {
	const [studentData, setStudentData] = useState([]);
	const [numStudents, setNumStudents] = useState(0); // Số lượng học sinh

	const fetchDataStudents = useCallback(async () => {
		try {
			const response = await client.get("/api/student/all");
			const students = response.data;
			setStudentData(students);
		} catch (error) {
			console.error(error);
		}
	}, []);

	useEffect(() => {
		fetchDataStudents();
	}, [fetchDataStudents]);

	// Sử dụng useEffect để theo dõi thay đổi của studentData
	useEffect(() => {
		// Cập nhật tổng số lượng học sinh khi studentData thay đổi
		setNumStudents(studentData.length);
	}, [studentData]);

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
			></Box>
		</Box>
	);

	const getContent = () => {
		return (
			<Typography
				align="center"
				sx={{
					margin: "40px 16px",
					color: "rgba(0, 0, 0, 0.6)",
					fontSize: "1.rem",
				}}
			>
				Number of Students: {numStudents}
			</Typography>
		);
	};
	return (
		<GridWrapper>
			<BasicCard header={getHeader()} content={getContent()} />
		</GridWrapper>
	);
};

export default Home;

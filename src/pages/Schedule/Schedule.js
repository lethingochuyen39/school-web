import React, { useState, useEffect, useContext, useCallback } from "react";

import Grid from "@mui/material/Grid";
import BasicCard from "../../components/common/BasicCard/BasicCard";
import SearchIcon from "@mui/icons-material/Search";
import Input from "@mui/material/Input";
import CommonButton from "../../components/common/CommonButton/CommonButton";
import Box from "@mui/material/Box";
import GridWrapper from "../../components/common/GridWrapper/GridWrapper";
import DataTable from "../../components/common/DataTable/DataTable";
import client from "../../api/client";
import { Button, Modal } from "@mui/material";
import { useNavigate } from "react-router-dom";
const Schedule = () => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [schedule, setSchedule] = useState(null);
	const [selectedSchedule, setSelectedSchedule] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [scheduleDetails, setScheduleDetails] = useState([]);
	const [error, setError] = useState("");

	const navigate = useNavigate();

	const handleOpenForm = async () => {
		navigate(`/admin/schedule-add`);
	};
	const fetchData = useCallback(async () => {
		try {
			let url = "/api/schedules";
			if (searchTerm) {
				url += `?className=${searchTerm}`;
			}
			const response = await client.get(url);
			setData(response.data);
			setLoading(false);
		} catch (error) {
			console.error(error);
			setLoading(false);
		}
	}, [searchTerm]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const handleSearchChange = (event) => {
		setSearchTerm(event.target.value);
	};

	const handleView = async (id) => {
		try {
			const response = await client.get(`/api/schedules/${id}`);
			const data = response.data;
			setSchedule(data);
			setScheduleDetails(data.scheduleDetails);
			navigate(`/admin/schedule-view/${id}`, { state: { scheduleData: data } });
		} catch (error) {
			console.error(error);
		}
	};

	const getHeader = () => (
		<Box
			display="flex"
			flexDirection={{ xs: "column", sm: "row" }}
			justifyContent="space-between"
			alignItems="center"
			paddingLeft="20px"
			paddingBottom="10px"
			paddingTop="10px"
			paddingRight="10px"
			flexWrap="wrap"
		>
			<Box
				display="flex"
				alignItems="center"
				marginTop={{ xs: "10px", sm: 0 }}
				marginRight={{ xs: "10px" }}
			>
				<CommonButton
					variant="contained"
					sx={{
						color: "white",
						backgroundImage: "linear-gradient(to right, #8bc34a, #4caf50)",
					}}
					onClick={handleOpenForm}
					size="large"
				>
					Thêm mới
				</CommonButton>
			</Box>

			<Box
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
					placeholder="Tìm kiếm theo tiêu đề... "
					onChange={handleSearchChange}
					value={searchTerm}
					sx={{
						width: { xs: "100%", sm: "auto", md: "100%" },
						color: "rgba(0, 0, 0, 0.6)",
						fontSize: "1.1rem",
					}}
					disableUnderline
				/>
			</Box>
		</Box>
	);

	const columns = [
		{ field: "id", headerName: "ID", width: 50 },
		{ field: "startDate", headerName: "Ngày bắt đầu", width: 150 },
		{ field: "endDate", headerName: "Ngày kết thúc", width: 150 },
		// { field: "semester", headerName: "Học kì", width: 100 },
		{
			field: "classes",
			headerName: "Lớp",
			width: 100,
			valueGetter: (params) => params.row.classes?.name || "",
		},
	];

	const getContent = () => (
		<DataTable
			initialRows={data}
			columns={columns}
			loading={loading}
			handleView={handleView}
			// handleEdit={handleEdit}
			// handleDelete={handleDelete}
			fetchData={fetchData}
		/>
	);
	return <BasicCard header={getHeader()} content={getContent()} />;
};

export default Schedule;

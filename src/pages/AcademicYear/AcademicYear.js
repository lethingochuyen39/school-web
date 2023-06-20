import React, { useState, useEffect } from "react";
import BasicCard from "../../components/common/BasicCard/BasicCard";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import Input from "@mui/material/Input";
import IconButton from "@mui/material/IconButton";
import CommonButton from "../../components/common/CommonButton/CommonButton";
import Box from "@mui/material/Box";
import GridWrapper from "../../components/common/GridWrapper/GridWrapper";
import DataTable from "../../components/common/DataTable/DataTable";
import client from "../../api/client";
import AddForm from "../../components/academicYear/AddForm";
const AcademicYear = () => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showAddForm, setShowAddForm] = useState(false);

	const handleAddAcademicYear = async () => {
		setShowAddForm(!showAddForm);
	};

	const fetchData = async () => {
		try {
			const response = await client.get("/api/academic-years");
			setData(response.data);
			setLoading(false);
		} catch (error) {
			console.error(error);
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const handleView = (id) => {
		console.log("View academic year with ID:", id);
	};

	const handleEdit = (id) => {
		console.log("Edit academic year with ID:", id);
	};

	const handleDelete = (id) => {
		console.log("Delete academic year with ID:", id);
	};

	const handleRefresh = () => {
		setLoading(true);
		fetchData();
	};

	const handleChange = (value) => {
		console.log(value);
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
					onClick={handleAddAcademicYear}
					size="large"
				>
					{showAddForm ? "Hủy" : "Thêm mới"}
				</CommonButton>
				<IconButton onClick={handleRefresh}>
					<RefreshIcon />
				</IconButton>
			</Box>
		</Box>
	);

	const columns = [
		{ field: "id", headerName: "ID", width: 100 },
		{ field: "name", headerName: "Tên", width: 150 },
		{ field: "startDate", headerName: "Ngày bắt đầu", width: 150 },
		{ field: "endDate", headerName: "Ngày kết thúc", width: 150 },
	];

	const getContent = () => (
		<DataTable
			initialRows={data}
			columns={columns}
			loading={loading}
			handleView={handleView}
			handleEdit={handleEdit}
			handleDelete={handleDelete}
		/>
	);

	return (
		<GridWrapper>
			{showAddForm && <AddForm handleAddAcademicYear={handleAddAcademicYear} />}
			<BasicCard header={getHeader()} content={getContent()} />
		</GridWrapper>
	);
};

export default AcademicYear;

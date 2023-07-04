import React, { useState, useEffect, useCallback } from "react";

import BasicCard from "../../components/common/BasicCard/BasicCard";
import SearchIcon from "@mui/icons-material/Search";
import Input from "@mui/material/Input";
import CommonButton from "../../components/common/CommonButton/CommonButton";
import Box from "@mui/material/Box";
import GridWrapper from "../../components/common/GridWrapper/GridWrapper";
import DataTable from "../../components/common/DataTable/DataTable";
import client from "../../api/client";
import { Button, Modal, Switch, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
const Schedule = () => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [schedule, setSchedule] = useState(null);
	const [selectedSchedule, setSelectedSchedule] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [classSchedule, setClassSchedule] = useState([]);
	const [selectedClass, setSelectedClass] = useState(null);
	const [isEditMode, setIsEditMode] = useState(false);
	const [selectedScore, setselectedScore] = useState(null);
	const navigate = useNavigate();

	const handleClassClick = (classId) => {
		setSelectedClass(classId);
		navigate(`/admin/class-schedule/${classId}`);
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
	const handleOpenClassScheduleModal = async () => {
		try {
			const response = await client.get("/api/classes");
			setClassSchedule(response.data);
			setIsModalOpen(true);
		} catch (error) {
			console.error(error);
		}
	};

	const handleSearchChange = (event) => {
		setSearchTerm(event.target.value);
	};

	const handleView = async (id) => {
		try {
			const response = await client.get(`/api/schedules/${id}`);
			const data = response.data;
			setSchedule(data);
			setIsModalOpen(true);
		} catch (error) {
			console.error(error);
		}
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setSchedule(null);
	};

	const handleEdit = (scheduleId) => {
		const selectedSchedule = data.find((item) => item.id === scheduleId);
		if (selectedSchedule) {
			setIsEditMode(true);
			setSelectedSchedule(selectedSchedule);
			navigate(`/admin/schedule-update/${scheduleId}`);
		}
	};

	const handleUpdateSwitch = async (scheduleId) => {
		try {
			const updatedStatus =
				data.find((item) => item.id === scheduleId)?.status === "Active"
					? "InActive"
					: "Active";

			await client.put(`/api/schedules/${scheduleId}/status`, null, {
				params: {
					status: updatedStatus,
				},
			});

			setData((prevData) => {
				const updatedData = prevData.map((item) =>
					item.id === scheduleId ? { ...item, status: updatedStatus } : item
				);
				return updatedData;
			});

			setSelectedSchedule((prevSchedule) => {
				if (prevSchedule && prevSchedule.id === scheduleId) {
					return { ...prevSchedule, status: updatedStatus };
				}
				return prevSchedule;
			});
		} catch (error) {
			console.error(error);
		}
	};

	const handleDelete = async (id) => {
		try {
			await client.delete(`/api/schedules/${id}`);
			fetchData();
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
					onClick={handleOpenClassScheduleModal}
					size="large"
				>
					Thêm thời khóa biểu
				</CommonButton>
				<Box sx={{ marginLeft: "10px" }}></Box>
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
					placeholder="Tìm kiếm theo tên lớp... "
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
		{
			field: "lesson",
			headerName: "Tiết học",
			width: 100,
			valueGetter: (params) => params.row.lesson?.name || "",
		},
		{
			field: "dayOfWeek",
			headerName: "Thứ trong tuần",
			width: 100,
			valueGetter: (params) => params.row.dayOfWeek?.name || "",
		},

		{
			field: "subject",
			headerName: "Môn học",
			width: 100,
			valueGetter: (params) => params.row.subject?.name || "",
		},
		{
			field: "teacher",
			headerName: "Giáo viên",
			width: 100,
			valueGetter: (params) => params.row.teacher?.name || "",
		},
		{
			field: "classes",
			headerName: "Lớp",
			width: 100,
			valueGetter: (params) => params.row.classes?.name || "",
		},
		{
			field: "status",
			headerName: "Trạng thái",
			width: 100,
			renderCell: (params) => (
				<Switch
					checked={params.row.status !== "InActive"}
					onChange={() => handleUpdateSwitch(params.row.id)}
					color="primary"
				/>
			),
		},
	];

	const getContent = () => (
		<DataTable
			initialRows={data}
			columns={columns}
			loading={loading}
			handleView={handleView}
			handleEdit={handleEdit}
			handleDelete={handleDelete}
			// hiddenActions={["delete"]}
		/>
	);

	return (
		<GridWrapper>
			{classSchedule && (
				<Modal
					open={isModalOpen}
					onClose={closeModal}
					aria-labelledby="modal-title"
					aria-describedby="modal-description"
				>
					<Box
						sx={{
							position: "fixed",
							top: "50%",
							left: "50%",
							transform: "translate(-50%, -50%)",
							width: 400,
							bgcolor: "background.paper",
							borderRadius: 4,
							p: 2,
							maxWidth: "90%",
							maxHeight: "90%",
							overflow: "auto",
						}}
					>
						<Typography
							id="modal-title"
							variant="h4"
							sx={{
								mb: 2,
								fontWeight: "bold",
								textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)",
								color: "#FF4500",
								textAlign: "center",
							}}
						>
							Chọn lớp học
						</Typography>
						<ul>
							{classSchedule.map((classItem) => (
								<li
									key={classItem.id}
									onClick={() => handleClassClick(classItem.id)}
									style={{
										cursor: "pointer",
										marginBottom: 8,
									}}
								>
									{classItem.name}
								</li>
							))}
						</ul>
						<Button variant="contained" onClick={closeModal}>
							Đóng
						</Button>
					</Box>
				</Modal>
			)}
			{schedule && (
				<Modal
					open={isModalOpen}
					onClose={closeModal}
					aria-labelledby="modal-title"
					aria-describedby="modal-content"
				>
					<Box
						sx={{
							position: "fixed",
							top: "50%",
							left: "50%",
							transform: "translate(-50%, -50%)",
							width: 500,
							bgcolor: "background.paper",
							borderRadius: 4,
							p: 2,
							maxWidth: "90%",
							maxHeight: "90%",
							overflow: "auto",
						}}
					>
						<>
							<Typography
								variant="h4"
								id="modal-title"
								sx={{
									mb: 2,
									fontWeight: "bold",
									textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)",
									color: "#FF4500",
									textAlign: "center",
								}}
							>
								Thông tin chi tiết thời khóa biểu
							</Typography>
							<Typography variant="body1" id="modal-content">
								<b>ID:</b> {schedule.id}
							</Typography>
							<Typography variant="body1">
								<b>Tiết học:</b> {schedule.lesson.name}
							</Typography>
							<Typography variant="body1">
								<b>Thời gian bắt đầu:</b> {schedule.lesson.startTime}
							</Typography>
							<Typography variant="body1">
								<b>Thời gian kết thúc:</b> {schedule.lesson.endTime}
							</Typography>
							<Typography variant="body1">
								<b>Thứ trong tuần:</b> {schedule.dayOfWeek.name}
							</Typography>
							<Typography variant="body1">
								<b>Môn học:</b> {schedule.subject.name}
							</Typography>
							<Typography variant="body1" noWrap>
								<b>Giáo viên:</b> {schedule.teacher.name}
							</Typography>
							<Typography variant="body1">
								<b>Lớp học:</b> {schedule.classes.name}-<b> Năm học:</b>{" "}
								{schedule.classes.academicYear.name} ( Từ{" "}
								{schedule.classes.academicYear.startDate} đến{" "}
								{schedule.classes.academicYear.endDate})
							</Typography>
							<Typography variant="body1">
								<b>Trạng thái:</b>{" "}
								{schedule.status === "Active"
									? "Đang hoạt động"
									: "Ẩn hoạt động"}
							</Typography>
						</>
						<Button variant="contained" onClick={closeModal} sx={{ mt: 2 }}>
							Đóng
						</Button>
					</Box>
				</Modal>
			)}
			<BasicCard header={getHeader()} content={getContent()} />
		</GridWrapper>
	);
};

export default Schedule;

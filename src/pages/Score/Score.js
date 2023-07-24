import React, { useState, useEffect, useCallback } from "react";
import BasicCard from "../../components/common/BasicCard/BasicCard";
import SearchIcon from "@mui/icons-material/Search";
import Input from "@mui/material/Input";
import CommonButton from "../../components/common/CommonButton/CommonButton";
import Box from "@mui/material/Box";
import GridWrapper from "../../components/common/GridWrapper/GridWrapper";
import DataTable from "../../components/common/DataTable/DataTable";
import client from "../../api/client";
import { Button, Modal, Typography } from "@mui/material";
import ScoreForm from "../../components/score/ScoreForm";
import { useNavigate } from "react-router-dom";

const Score = () => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [score, setScore] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);
	const [selectedScore, setselectedScore] = useState(null);
	const [error, setError] = useState("");
	const [searchTerm, setSearchTerm] = useState("");
	const [students, setStudents] = useState([]);
	const [subjects, setSubjects] = useState([]);
	const [scoreTypes, setScoreTypes] = useState([]);
	const [selectedClass, setSelectedClass] = useState(null);
	const [searchClass, setSearchClass] = useState("");
	const [filteredClassSchedule, setFilteredClassSchedule] = useState([]);
	const [classScores, setClassScores] = useState([]);
	const [classes, setClasses] = useState([]);
	const [viewScores, setViewScores] = useState([]);
	const [selectedView, setSelectedView] = useState(null);

	const navigate = useNavigate();
	const handleOpenForm = async () => {
		if (score) {
			setIsEditMode(true);
			setselectedScore(score);
		} else {
			setIsEditMode(false);
			setselectedScore(null);
		}

		try {
			const responseStudents = await client.get("/api/student/allStudent");
			const responseSubjects = await client.get("/api/subjects");
			const responseScoreType = await client.get("/api/score-types");
			const responseClasses = await client.get("/api/classes");

			setStudents(responseStudents.data);
			const filteredSubjects = responseSubjects.data.filter(
				(subject) => !subject.name.startsWith("SHDC")
			);
			setSubjects(filteredSubjects);
			setScoreTypes(responseScoreType.data);
			setClasses(responseClasses.data);
		} catch (error) {
			console.error(error);
			if (error.response) {
				setError(error.response.data);
			}
		}
		setIsFormOpen(true);
	};

	const handleCloseForm = () => {
		setIsFormOpen(false);
		setScore(null);
	};

	const fetchData = useCallback(async () => {
		try {
			let url = "/api/scores";
			if (searchTerm) {
				url += `?studentName=${searchTerm}`;
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

	const handleFilteredClassChange = (event) => {
		setSearchClass(event.target.value);
		if (event.target.value === "") {
			setFilteredClassSchedule(classScores);
		} else {
			const filteredClasses = classScores.filter((classItem) =>
				classItem.name.toLowerCase().includes(event.target.value.toLowerCase())
			);
			setFilteredClassSchedule(filteredClasses);
		}
	};
	const handleView = async (id) => {
		try {
			const response = await client.get(`/api/scores/${id}`);
			const data = response.data;
			setScore(data);
			setIsModalOpen(true);
		} catch (error) {
			console.error(error);
		}
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setScore(null);
	};

	const handleEdit = (id) => {
		const selectedScore = data.find((item) => item.id === id);
		if (selectedScore) {
			setIsEditMode(true);
			setselectedScore(selectedScore);
			setIsFormOpen(true);
		}
	};

	const handleDelete = async (id) => {
		try {
			await client.delete(`/api/scores/${id}`);
			fetchData();
		} catch (error) {
			console.error(error);
		}
	};
	const handleOpenClassScoresModal = async () => {
		try {
			const response = await client.get("/api/classes");
			setClassScores(response.data);
			setFilteredClassSchedule(response.data);
			setIsModalOpen(true);
		} catch (error) {
			console.error(error);
		}
	};
	const handleOpenViewScoresModal = async () => {
		try {
			const response = await client.get("/api/classes");
			setViewScores(response.data);
			setFilteredClassSchedule(response.data);
			setIsModalOpen(true);
		} catch (error) {
			console.error(error);
		}
	};

	const handleClassClick = (classId) => {
		setSelectedClass(classId);
		navigate(`/admin/class-score/${classId}`);
	};

	const handleViewClick = (classId) => {
		setSelectedClass(classId);
		// Chuyển hướng đến trang điểm của lớp đó
		navigate(`/admin/view-score/${classId}`);
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
				marginBottom={{ xs: "10px", sm: 0 }}
			>
				<CommonButton
					variant="contained"
					sx={{
						color: "white",
						backgroundImage: "linear-gradient(to right, #1565c0, #0d47a1)",
					}}
					onClick={handleOpenViewScoresModal}
					size="large"
				>
					Tra cứu điểm
				</CommonButton>
				<Box sx={{ marginLeft: "10px" }}></Box>
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
				<Box sx={{ marginLeft: "10px" }}></Box>
				<CommonButton
					variant="contained"
					sx={{
						color: "white",
						backgroundImage: "linear-gradient(to right, #9c27b0, #673ab7)",
					}}
					onClick={handleOpenClassScoresModal}
					size="large"
				>
					Thêm Điểm Lớp
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
					placeholder="Tìm kiếm theo tên học sinh... "
					onChange={handleSearchChange}
					value={searchTerm}
					sx={{
						width: { xs: "100%", sm: "100%", md: "100%" },
						color: "rgba(0, 0, 0, 0.6)",
						fontSize: "1.1rem",
					}}
					disableUnderline
				/>
			</Box>
		</Box>
	);

	const columns = [
		{ field: "id", headerName: "ID", width: 70 },

		{
			field: "classes",
			headerName: "Lớp học",
			width: 100,
			valueGetter: (params) => params.row.classes?.name || "",
		},
		{
			field: "semester",
			headerName: "Học kỳ",
			width: 60,
		},
		{
			field: "student",
			headerName: "Học sinh",
			width: 100,
			valueGetter: (params) => params.row.student?.name || "",
		},
		{
			field: "subject",
			headerName: "Môn học",
			width: 100,
			valueGetter: (params) => params.row.subject?.name || "",
		},
		{
			field: "scoreType",
			headerName: "Loại điểm",
			width: 100,
			valueGetter: (params) => params.row.scoreType?.name || "",
		},

		{ field: "score", headerName: "Điểm", width: 100 },
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
			{isFormOpen && (
				<ScoreForm
					handleClose={handleCloseForm}
					isEditMode={isEditMode}
					initialData={selectedScore}
					error={error}
					students={students}
					subjects={subjects}
					scoreTypes={scoreTypes}
					classes={classes}
					fetchData={fetchData}
				/>
			)}
			{classScores && (
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

						<Box
							minWidth={{ xs: "100%", sm: 0, md: "80%" }}
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
								onChange={handleFilteredClassChange}
								value={searchClass}
								sx={{
									width: { xs: "100%", sm: "auto", md: "100%" },
									color: "rgba(0, 0, 0, 0.6)",
									fontSize: "1.1rem",
								}}
								disableUnderline
							/>
						</Box>
						<ul>
							{filteredClassSchedule.map((classItem) => (
								<li
									key={classItem.id}
									onClick={() => handleClassClick(classItem.id)}
									style={{
										cursor: "pointer",
										marginBottom: 8,
									}}
								>
									LH{classItem.id}_{classItem.name} (năm học:
									{classItem.academicYear.name})
								</li>
							))}
						</ul>
						<Button variant="contained" onClick={closeModal}>
							Đóng
						</Button>
					</Box>
				</Modal>
			)}

			{viewScores && (
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

						<Box
							minWidth={{ xs: "100%", sm: 0, md: "80%" }}
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
								onChange={handleFilteredClassChange}
								value={searchClass}
								sx={{
									width: { xs: "100%", sm: "auto", md: "100%" },
									color: "rgba(0, 0, 0, 0.6)",
									fontSize: "1.1rem",
								}}
								disableUnderline
							/>
						</Box>
						<ul>
							{filteredClassSchedule.map((classItem) => (
								<li
									key={classItem.id}
									onClick={() => handleViewClick(classItem.id)}
									style={{
										cursor: "pointer",
										marginBottom: 8,
									}}
								>
									LH{classItem.id}_{classItem.name} (năm học:
									{classItem.academicYear.name})
								</li>
							))}
						</ul>
						<Button variant="contained" onClick={closeModal}>
							Đóng
						</Button>
					</Box>
				</Modal>
			)}

			{score && (
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
							Thông tin điểm
						</Typography>

						<Typography variant="body1" sx={{ overflowWrap: "break-word" }}>
							<b>ID:</b> {score.id}
						</Typography>
						<Typography variant="body1" sx={{ overflowWrap: "break-word" }}>
							<b>Lớp: </b> {score.classes.name}
						</Typography>
						<Typography variant="body1" sx={{ overflowWrap: "break-word" }}>
							<b>Học sinh:</b> {score.student.name}
						</Typography>
						<Typography variant="body1" sx={{ overflowWrap: "break-word" }}>
							<b>Môn học: </b> {score.subject.name}
						</Typography>
						<Typography variant="body1" sx={{ overflowWrap: "break-word" }}>
							<b>Loại điểm: </b> {score.scoreType.name}
						</Typography>
						<Typography variant="body1" sx={{ overflowWrap: "break-word" }}>
							<b>Học kỳ:</b> {score.semester}
						</Typography>
						<Typography
							variant="body1"
							sx={{ overflowWrap: "break-word", mb: 2 }}
						>
							<b>Điểm: </b> {score.score}
						</Typography>
						<Button variant="contained" onClick={closeModal}>
							Đóng
						</Button>
					</Box>
				</Modal>
			)}

			<BasicCard header={getHeader()} content={getContent()} />
		</GridWrapper>
	);
};

export default Score;

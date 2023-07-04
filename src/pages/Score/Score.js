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
	const [classScores, setClassScores] = useState([]);

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
			const responseStudents = await client.get("/allStudent");
			const responseSubjects = await client.get("/api/subjects");
			const responseScoreType = await client.get("/api/score-types");
			setStudents(responseStudents.data);
			setSubjects(responseSubjects.data);
			setScoreTypes(responseScoreType.data);
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

	const handleAddScore = async (newScore) => {
		try {
			await client.post("/api/scores", newScore);

			await fetchData();
		} catch (error) {
			if (error.response) {
				setError(error.response.data);
			} else {
				setError("Đã xảy ra lỗi khi cập nhật điểm.");
			}
		}
	};

	const handleSearchChange = (event) => {
		setSearchTerm(event.target.value);
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
		const selectedScore = data.find((year) => year.id === id);
		if (selectedScore) {
			setIsEditMode(true);
			setselectedScore(selectedScore);
			setIsFormOpen(true);
		}
	};
	const handleUpdateScore = async (id, updatedScore) => {
		try {
			await client.put(`/api/scores/${id}`, updatedScore);
			await fetchData();
		} catch (error) {
			console.error(error);
			if (error.response) {
				setError(error.response.data);
			} else {
				setError("Đã xảy ra lỗi khi cập nhật điểm.");
			}
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
			setIsModalOpen(true);
		} catch (error) {
			console.error(error);
		}
		// navigate("/admin/class-score");
	};

	const handleClassClick = (classId) => {
		setSelectedClass(classId);
		navigate(`/admin/class-score/${classId}`);
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
		{ field: "id", headerName: "ID", width: 100 },
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
			width: 250,
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
					handleAddScore={handleAddScore}
					handleUpdateScore={handleUpdateScore}
					handleClose={handleCloseForm}
					isEditMode={isEditMode}
					initialData={selectedScore}
					error={error}
					students={students}
					subjects={subjects}
					scoreTypes={scoreTypes}
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
						<ul>
							{classScores.map((classItem) => (
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
						<p id="modal-description">ID: {score.id}</p>
						<p>Học sinh: {score.student.name}</p>
						<p>Môn học: {score.subject.name}</p>
						<p>Loại điểm: {score.scoreType.name}</p>
						<p>Điểm: {score.score}</p>

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

import React, { useState, useEffect, useContext, useCallback } from "react";
import BasicCard from "../../components/common/BasicCard/BasicCard";
import SearchIcon from "@mui/icons-material/Search";
import Input from "@mui/material/Input";
import CommonButton from "../../components/common/CommonButton/CommonButton";
import Box from "@mui/material/Box";
import GridWrapper from "../../components/common/GridWrapper/GridWrapper";
import DataTable from "../../components/common/DataTable/DataTable";
import client from "../../api/client";
import { Button, FormHelperText, Grid, Modal } from "@mui/material";
import StudentForm from "../../components/student/StudentForm";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import StudentExcelForm from "../../components/student/StudentExcelForm";

const Student = () => {
// <<<<<<< HEAD
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isFormExcelOpen, setIsFormExcelOpen] = useState(false);

  const [student, setStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  // const [searchTerm, setSearchTerm] = useState("");
  // const [isActive, setIsActive] = useState(false);
  
  const handleStudentOpenForm = async () => {
    if (student) {
      setIsEditMode(true);
      setSelectedStudent(student);
    } else {
      setIsEditMode(false);
      setSelectedStudent(null);
    }

    setIsFormOpen(true);
    setIsFormExcelOpen(true);
  };

  const handleCloseStudentForm = () => {
    setIsFormOpen(false);
    setIsFormExcelOpen(false);
    setStudent(null);
  };

  const fetchData = useCallback(async () => {
    try {
      let url = "/api/student/all";
      // if (searchTerm) {
      //   url += `?name=${searchTerm}`;
      // }
      const response = await client.get(url);
      const fetchedData = response.data;
// =======
// 	const [data, setData] = useState([]);
// 	const [loading, setLoading] = useState(true);
// 	const [isFormOpen, setIsFormOpen] = useState(false);
// 	const [student, setStudent] = useState(null);
// 	const [isModalOpen, setIsModalOpen] = useState(false);
// 	const [isEditMode, setIsEditMode] = useState(false);
// 	const [selectedStudent, setSelectedStudent] = useState(null);
// 	// const [searchTerm, setSearchTerm] = useState("");
// 	// const [isActive, setIsActive] = useState(false);

// 	const handleStudentOpenForm = async () => {
// 		if (student) {
// 			setIsEditMode(true);
// 			setSelectedStudent(student);
// 		} else {
// 			setIsEditMode(false);
// 			setSelectedStudent(null);
// 		}

// 		setIsFormOpen(true);
// 	};

// 	const handleCloseStudentForm = () => {
// 		setIsFormOpen(false);
// 		setStudent(null);
// 	};

// 	const fetchData = useCallback(async () => {
// 		try {
// 			let url = "/api/student/all";
// 			// if (searchTerm) {
// 			//   url += `?name=${searchTerm}`;
// 			// }
// 			const response = await client.get(url);
// 			const fetchedData = response.data;
// >>>>>>> f8d43a6e7d39de0948634bed89583986e9e7d9d1

			const updatedData = fetchedData.map((item) => ({
				...item,
				// isActive: item.isActive,
			}));
			setData(updatedData);
			setLoading(false);

			if (student) {
				const fetchedStudent = fetchedData.find(
					(item) => item.id === student.id
				);
				// if (fetchedTeacher) {
				//   setIsActive(fetchedTeacher.isActive);
				// }
			}
		} catch (error) {
			console.error(error);
			setLoading(false);
		}
	}, [
		// searchTerm,
		student,
	]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	// const handleSearchChange = (event) => {
	//   setSearchTerm(event.target.value);
	// };

	const handleView = async (id) => {
		try {
			const response = await client.get(`/api/student/` + id);
			const data = response.data;
			setStudent(data);
			setIsModalOpen(true);
		} catch (error) {
			console.error(error);
		}
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setStudent(null);
	};

// <<<<<<< HEAD
  const handleEdit = (id) => {
    const selectedStudent = data.find((item) => item.id === id);
    if (selectedStudent) {
      setSelectedStudent(selectedStudent);
      setStudent(selectedStudent);
      setIsEditMode(true);
      setIsFormOpen(true);
      setIsFormExcelOpen(true);

    }
  };

  const handleDelete = async (id) => {
    try {
      await client.delete(`/api/student/delete/${id}`);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };
// =======
// 	const handleEdit = (id) => {
// 		const selectedStudent = data.find((item) => item.id === id);
// 		if (selectedStudent) {
// 			setSelectedStudent(selectedStudent);
// 			setStudent(selectedStudent);
// 			setIsEditMode(true);
// 			setIsFormOpen(true);
// 		}
// 	};

// 	const handleDelete = async (id) => {
// 		try {
// 			await client.delete(`/api/student/deleteStudent/${id}`);
// 			fetchData();
// 		} catch (error) {
// 			console.error(error);
// 		}
// 	};
// >>>>>>> f8d43a6e7d39de0948634bed89583986e9e7d9d1

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
					onClick={handleStudentOpenForm}
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
				{/* <SearchIcon sx={{ marginRight: "15px" }} />
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
        /> */}
			</Box>
		</Box>
	);

	const columns = [
		{ field: "id", headerName: "ID", width: 100 },
		{ field: "name", headerName: "Tên", width: 150 },
		{ field: "dob", headerName: "Ngày sinh", width: 150 },
		{ field: "gender", headerName: "Giới tính", width: 150 },
		{ field: "address", headerName: "Địa chỉ", width: 150 },
		{ field: "email", headerName: "Email", width: 150 },
		{ field: "phone", headerName: "Số điện thoại", width: 150 },
		{ field: "status", headerName: "Trạng thái", width: 150 },
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

// <<<<<<< HEAD
  return (
    <>

    
    <GridWrapper>
      {isFormOpen && (
        <StudentForm
          handleClose={handleCloseStudentForm}
          isEditMode={isEditMode}
          initialData={selectedStudent}
          fetchData={fetchData}
        />
      )}
        {isFormExcelOpen && (
        <StudentExcelForm 
        fetchData={fetchData}
        handleClose={handleCloseStudentForm}
        />

      )}
      {student && (
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
                Thông tin tin tức
              </Typography>
              <Typography variant="body1" id="modal-content">
                <b>ID:</b> {student.id}
              </Typography>
              <Typography variant="body1" sx={{ overflowWrap: "break-word" }}>
                <b>Tên:</b> {student.name}
              </Typography>
              <Typography variant="body1" sx={{ overflowWrap: "break-word" }}>
                <b>Ngày sinh:</b> {student.dob}
              </Typography>
              <Typography variant="body1" sx={{ overflowWrap: "break-word" }}>
                <b>Giới tính:</b> {student.gender}
              </Typography>
              <Typography variant="body1" sx={{ overflowWrap: "break-word" }}>
                <b>Địa chỉ:</b> {student.address}
              </Typography>
              <Typography variant="body1" sx={{ overflowWrap: "break-word" }}>
                <b>Email:</b> {student.email}
              </Typography>
              <Typography variant="body1" sx={{ overflowWrap: "break-word" }}>
                <b>Số điện thoại:</b> {student.phone}
              </Typography>
              <Typography variant="body1" sx={{ overflowWrap: "break-word" }}>
                <b>Trạng thái:</b> {student.status}
              </Typography>
            </>
{/* =======
	return (
		<GridWrapper>
			{isFormOpen && (
				<StudentForm
					handleClose={handleCloseStudentForm}
					isEditMode={isEditMode}
					initialData={selectedStudent}
					fetchData={fetchData}
				/>
			)}

			{student && (
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
								Thông tin tin tức
							</Typography>
							<Typography variant="body1" id="modal-content">
								<b>ID:</b> {student.id}
							</Typography>
							<Typography variant="body1" sx={{ overflowWrap: "break-word" }}>
								<b>Tên:</b> {student.name}
							</Typography>
							<Typography variant="body1" sx={{ overflowWrap: "break-word" }}>
								<b>Ngày sinh:</b> {student.dob}
							</Typography>
							<Typography variant="body1" sx={{ overflowWrap: "break-word" }}>
								<b>Giới tính:</b> {student.gender}
							</Typography>
							<Typography variant="body1" sx={{ overflowWrap: "break-word" }}>
								<b>Địa chỉ:</b> {student.address}
							</Typography>
							<Typography variant="body1" sx={{ overflowWrap: "break-word" }}>
								<b>Email:</b> {student.email}
							</Typography>
							<Typography variant="body1" sx={{ overflowWrap: "break-word" }}>
								<b>Số điện thoại:</b> {student.phone}
							</Typography>
							<Typography variant="body1" sx={{ overflowWrap: "break-word" }}>
								<b>Trạng thái:</b> {student.status}
							</Typography>
						</>
>>>>>>> f8d43a6e7d39de0948634bed89583986e9e7d9d1 */}

						<Button variant="contained" onClick={closeModal} sx={{ mt: 2 }}>
							Đóng
						</Button>
					</Box>
				</Modal>
			)}

{/* <<<<<<< HEAD */}
      <BasicCard header={getHeader()} content={getContent()} />
    </GridWrapper>
    </>

  );
// =======
// 			<BasicCard header={getHeader()} content={getContent()} />
// 		</GridWrapper>
// 	);
// >>>>>>> f8d43a6e7d39de0948634bed89583986e9e7d9d1
};

export default Student;

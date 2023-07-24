import { Typography } from "@mui/material";
import React, { useState, useEffect, useContext, useCallback } from "react";
import SearchIcon from "@mui/icons-material/Search";
import Input from "@mui/material/Input";
import Box from "@mui/material/Box";
import { Button, Modal } from "@mui/material";
import Switch from "@mui/material/Switch";
import TeacherForm from "../../../components/teacher/TeacherForm";
import client from "../../../api/client";
import CommonButton from "../../../components/common/CommonButton/CommonButton";
import DataTable from "../../../components/common/DataTable/DataTable";
import GridWrapper from "../../../components/common/GridWrapper/GridWrapper";
import BasicCard from "../../../components/common/BasicCard/BasicCard";

const Profile = ({ loggedInUserId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [teacher, setTeacher] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleTeacherOpenForm = () => {
    if (teacher) {
      setIsEditMode(true);
      setSelectedTeacher(teacher);
    } else {
      setIsEditMode(false);
      setSelectedTeacher(null);
    }

    setIsFormOpen(true);
  };

  const handleCloseTeacherForm = () => {
    setIsFormOpen(false);
    setTeacher(null);
  };

  const fetchData = useCallback(async () => {
    try {
      const teacherId = localStorage.getItem("id");
      const teacherResponse = await client.get(`/api/teachers/${teacherId}`);
      const teacherData = teacherResponse.data;
      setTeacher(teacherData);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [loggedInUserId, teacher]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  //   const handleSearchChange = (event) => {
  //     setSearchTerm(event.target.value);
  //   };

  const handleView = async (id) => {
    try {
      const response = await client.get(`/api/teachers/${id}`);
      const data = response.data;
      setTeacher(data);
      setIsModalOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTeacher(null);
  };

  const handleEdit = (id) => {
    const selectedTeacher = data.find((item) => item.id === id);
    if (selectedTeacher) {
      setSelectedTeacher(selectedTeacher);
      setTeacher(selectedTeacher);
      setIsEditMode(true);
      setIsFormOpen(true);
    }
  };

  //   const handleDelete = async (id) => {
  //     try {
  //       await client.delete(`/api/teachers/delete/${id}`);
  //       fetchData();
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

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
      {/* <Box
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
          onClick={handleTeacherOpenForm}
          size="large"
        >
          Thêm mới
        </CommonButton>
      </Box> */}

      {/* <Box
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
      </Box> */}
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
  ];

  const getContent = () => (
    <DataTable
      initialRows={data}
      columns={columns}
      loading={loading}
      handleEdit={handleEdit}
      hiddenActions={("delete", "view")}
      //   handleDelete={handleDelete}
      //   handleView={handleView}
    />
  );

  return (
    <GridWrapper>
      {isFormOpen && (
        <TeacherForm
          handleClose={handleCloseTeacherForm}
          isEditMode={isEditMode}
          initialData={selectedTeacher}
          fetchData={fetchData}
        />
      )}

      {teacher && (
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
                Thông tin
              </Typography>
              <Typography variant="body1" id="modal-content">
                <b>ID:</b> {teacher.id}
              </Typography>
              <Typography variant="body1" sx={{ overflowWrap: "break-word" }}>
                <b>Tên:</b> {teacher.name}
              </Typography>
              <Typography variant="body1" sx={{ overflowWrap: "break-word" }}>
                <b>Ngày sinh:</b> {teacher.dob}
              </Typography>
              <Typography variant="body1" sx={{ overflowWrap: "break-word" }}>
                <b>Giới tính:</b> {teacher.gender}
              </Typography>
              <Typography variant="body1" sx={{ overflowWrap: "break-word" }}>
                <b>Địa chỉ:</b> {teacher.address}
              </Typography>
              <Typography variant="body1" sx={{ overflowWrap: "break-word" }}>
                <b>Email:</b> {teacher.email}
              </Typography>
              <Typography variant="body1" sx={{ overflowWrap: "break-word" }}>
                <b>Số điện thoại:</b> {teacher.phone}
              </Typography>
              <Typography variant="body1">
                <b>Trạng thái:</b>{" "}
                {teacher.isActive ? "Đang hoạt động" : "Ẩn hoạt động"}
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

export default Profile;

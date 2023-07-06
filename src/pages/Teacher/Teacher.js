import Box from "@mui/material/Box";
import React, { useCallback, useEffect, useState } from "react";
import client from "../../api/client";
import BasicCard from "../../components/common/BasicCard/BasicCard";
import DataTable from "../../components/common/DataTable/DataTable";
import GridWrapper from "../../components/common/GridWrapper/GridWrapper";
import { Button, Modal } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Input from "@mui/material/Input";
import CommonButton from "../../components/common/CommonButton/CommonButton";
import TeacherForm from "../../components/teacher/TeacherForm";

const Teacher = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isTeacherFormOpen, setIsTeacherFormOpen] = useState(false);
  const [teacher, setTeacher] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleOpenTeacherForm = () => {
    console.log(teacher);
    if (teacher) {
      setIsEditMode(true);
      setSelectedTeacher(teacher);
    } else {
      setIsEditMode(false);
      setSelectedTeacher(null);
    }
    setIsTeacherFormOpen(true);
  };

  const handleCloseTeacherForm = () => {
    setIsTeacherFormOpen(false);
    setTeacher(null);
  };

  const handleAddTeacher = async (newTeacher) => {
    try {
      await client.post("/api/teachers", newTeacher);
      setIsModalOpen(true);
      await fetchData();
    } catch (error) {
      console.error(error);
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("Đã xảy ra lỗi khi cập nhật.");
      }
    }
  };

  // hiển thị thông tin
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
    const selectedTeacher = data.find((teacher) => teacher.id === id);
    if (selectedTeacher) {
      setIsEditMode(true);
      setSelectedTeacher(selectedTeacher);
      setIsTeacherFormOpen(true);
    }
  };

  const handleUpdateTeacher = async (updatedTeacher) => {
    try {
      await client.put(`/api/teachers/${updatedTeacher.id}`, updatedTeacher);
      fetchData();
      setIsModalOpen(true);
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("Đã xảy ra lỗi khi cập nhật.");
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await client.delete(`/api/teachers/${id}`);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const fetchData = useCallback(async () => {
    try {
      let url = "/api/teachers";
      if (searchTerm) {
        url += `?name=${searchTerm}`;
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
          onClick={handleOpenTeacherForm}
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
          placeholder="Tìm kiếm theo tên.. "
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
    { field: "name", headerName: "Tên", width: 150 },
    { field: "dob", headerName: "Ngày sinh", width: 150 },
    { field: "gender", headerName: "Giới tính", width: 150 },
    { field: "address", headerName: "Địa chỉ", width: 150 },
    { field: "email", headerName: "Email", width: 150 },
    { field: "phone", headerName: "Số điện thoại", width: 150 },
    { field: "status", headerName: "Trạng thái", width: 150 },
  ];

  const getContent = () => {
    return (
      <DataTable
        initialRows={data}
        columns={columns}
        loading={loading}
        handleView={handleView}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    );
  };

  return (
    <GridWrapper>
      {isTeacherFormOpen && (
        <TeacherForm
          handleAddTeacher={handleAddTeacher}
          handleUpdateTeacher={handleUpdateTeacher}
          handleClose={handleCloseTeacherForm}
          isEditMode={isEditMode}
          initialData={setSelectedTeacher}
          error={error}
        />
      )}

      {teacher && (
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
            <h2 id="modal-title">Thông tin giáo viên</h2>
            <p id="modal-description">ID: {teacher.id}</p>
            <p id="modal-description">Tên: {teacher.name}</p>
            <p id="modal-description">Ngày sinh: {teacher.dob}</p>
            <p id="modal-description">Giới tính: {teacher.gender}</p>
            <p id="modal-description">Địa chỉ: {teacher.address}</p>
            <p id="modal-description">Email: {teacher.email}</p>
            <p id="modal-description">Số điện thoại: {teacher.phone}</p>
            <p id="modal-description">Trạng thái: {teacher.status}</p>
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

export default Teacher;

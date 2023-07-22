import React, { useState, useEffect, useContext, useCallback } from "react";
import BasicCard from "../../components/common/BasicCard/BasicCard";
import SearchIcon from "@mui/icons-material/Search";
import Input from "@mui/material/Input";
import CommonButton from "../../components/common/CommonButton/CommonButton";
import Box from "@mui/material/Box";
import GridWrapper from "../../components/common/GridWrapper/GridWrapper";
import DataTable from "../../components/common/DataTable/DataTable";
import client from "../../api/client";
import { Button, Modal } from "@mui/material";
import TeacherForm from "../../components/teacher/TeacherForm";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";

const Teacher = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [teacher, setTeacher] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isActive, setIsActive] = useState(false);

  const handleTeacherOpenForm = async () => {
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
      let url = "/api/teachers";
      if (searchTerm) {
        url += `?name=${searchTerm}`;
      }
      const response = await client.get(url);
      const fetchedData = response.data;

      const updatedData = fetchedData.map((item) => ({
        ...item,
        isActive: item.isActive,
      }));
      setData(updatedData);
      setLoading(false);

      if (teacher) {
        const fetchedTeacher = fetchedData.find(
          (item) => item.id === teacher.id
        );
        if (fetchedTeacher) {
          setIsActive(fetchedTeacher.isActive);
        }
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [searchTerm, teacher]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

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

  const handleDelete = async (id) => {
    try {
      await client.delete(`/api/teachers/delete/${id}`);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateSwitch = async (event, id) => {
    const { checked } = event.target;
    console.log(id);
    try {
      await client.put(`/api/teachers/isActive/${id}`);

      setData((prevData) => {
        const updatedData = prevData.map((item) =>
          item.id === id ? { ...item, isActive: checked } : item
        );
        return updatedData;
      });

      setSelectedTeacher((prevTeacher) => {
        if (prevTeacher && prevTeacher.id === id) {
          return { ...prevTeacher, isActive: checked };
        }
        return prevTeacher;
      });

      setIsActive(checked); // Đảm bảo trường "isActive" luôn được xác định giá trị.
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
          onClick={handleTeacherOpenForm}
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
    { field: "id", headerName: "ID", width: 100 },
    { field: "name", headerName: "Tên", width: 150 },
    { field: "dob", headerName: "Ngày sinh", width: 150 },
    { field: "gender", headerName: "Giới tính", width: 150 },
    { field: "address", headerName: "Địa chỉ", width: 150 },
    { field: "email", headerName: "Email", width: 150 },
    { field: "phone", headerName: "Số điện thoại", width: 150 },
    {
      field: "isActive",
      headerName: "Trạng thái",
      width: 100,
      renderCell: (params) => (
        <Switch
          checked={params.row.isActive}
          onChange={(event) => handleUpdateSwitch(event, params.row.id)}
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
                Thông tin tin tức
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

export default Teacher;

import Box from "@mui/material/Box";
import React, { useCallback, useEffect, useState } from "react";
import client from "../../api/client";
import BasicCard from "../../components/common/BasicCard/BasicCard";
import DataTable from "../../components/common/DataTable/DataTable";
import GridWrapper from "../../components/common/GridWrapper/GridWrapper";
import { Button, Modal } from "@mui/material";
import CommonButton from "../../components/common/CommonButton/CommonButton";
import ClassForm from "../../components/class/ClassForm";

const Class = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedClasses, setSelectedClasses] = useState(null);
  const [academicYear, setAcademicYears] = useState([]);
  const [teacher, setTeachers] = useState([]);
  const [error, setError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleOpenForm = async () => {
    if (classes) {
      setIsEditMode(true);
      setSelectedClasses(classes);
    } else {
      setIsEditMode(false);
      setSelectedClasses(null);
    }

    try {
      const responseAcademicYears = await client.get("/api/academic-years");
      const responseTeachers = await client.get("/api/teachers");
      setAcademicYears(responseAcademicYears.data);
      setTeachers(responseTeachers.data);
    } catch (error) {
      console.error(error);
      if (error.response) {
        setError(error.response.data);
      }
    }
    setIsFormOpen(true);
  };

  const handleAddClasses = async (newClasses) => {
    try {
      await client.post("/api/classes/create", newClasses);
      setIsModalOpen(true);
      await fetchData();
    } catch (error) {
      console.error(error);
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("Đã xảy ra lỗi khi cập nhật năm học.");
      }
    }
  };

  // hiển thị thông tin
  const handleView = async (id) => {
    try {
      const response = await client.get(`/api/classes/findById/${id}`);
      const data = response.data;
      setClasses(data);
      setIsModalOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setClasses(null);
  };

  const handleEdit = (id) => {
    const selectedClass = data.find((classes) => classes.id === id);
    if (selectedClass) {
      setIsEditMode(true);
      setSelectedClasses(selectedClass);
      setIsFormOpen(true);
    }
  };

  const handleUpdateClasses = async (updateClass) => {
    try {
      await client.put(`/api/classes/update/${updateClass.id}`, updateClass);
      fetchData();
      setIsModalOpen(true);
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("Đã xảy ra lỗi khi cập nhật năm học.");
      }
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setClasses(null);
  };

  const handleDelete = async (id) => {
    try {
      await client.delete(`/api/classes/delete/${id}`);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const fetchData = useCallback(async () => {
    try {
      let url = "/api/classes";

      const response = await client.get(url);
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  });

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "description", headerName: "Mô tả", width: 150 },
    { field: "grade", headerName: "Khối", width: 150 },
    { field: "name", headerName: "Lớp", width: 150 },
    {
      field: "academicYearId",
      headerName: "Năm học",
      width: 100,
      valueGetter: (params) => params.row.academicYear?.name || "",
    },
    {
      field: "teacherId",
      headerName: "Giáo viên",
      width: 100,
      valueGetter: (params) => params.row.teacher?.name || "",
    },
  ];

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
          onClick={handleOpenForm}
          size="large"
        >
          Thêm mới
        </CommonButton>
      </Box>
    </Box>
  );

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
      {isFormOpen && (
        <ClassForm
          handleAddClasses={handleAddClasses}
          handleUpdateClasses={handleUpdateClasses}
          handleClose={handleCloseForm}
          isEditMode={isEditMode}
          initialData={selectedClasses}
          error={error}
          academicYearId={academicYear}
          teacherId={teacher}
        />
      )}
      {classes && (
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
            <h2 id="modal-title">Thông tin lớp học</h2>
            <p id="modal-description">ID: {classes.id}</p>
            <p id="modal-description">Mô tả: {classes.description}</p>
            <p id="modal-description">Khối: {classes.grade}</p>
            <p id="modal-description">Tên lớp: {classes.name}</p>
            <p>Năm học: {classes.academicYear.name}</p>
            <p>Giáo viên: {classes.teacher.name}</p>

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

export default Class;
import Box from "@mui/material/Box";
import React, { useCallback, useEffect, useState } from "react";
import client from "../../api/client";
import BasicCard from "../../components/common/BasicCard/BasicCard";
import DataTable from "../../components/common/DataTable/DataTable";
import GridWrapper from "../../components/common/GridWrapper/GridWrapper";
import { Button, Modal } from "@mui/material";
import CommonButton from "../../components/common/CommonButton/CommonButton";
import SubjectForm from "../../components/subject/SubjectForm";

const Subject = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [teacher, setTeachers] = useState([]);
  const [error, setError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleOpenForm = async () => {
    if (subject) {
      setIsEditMode(true);
      setSelectedSubject(subject);
    } else {
      setIsEditMode(false);
      setSelectedSubject(null);
    }

    try {
      const responseTeachers = await client.get("/api/teachers");
      setTeachers(responseTeachers.data);
    } catch (error) {
      console.error(error);
      if (error.response) {
        setError(error.response.data);
      }
    }
    setIsFormOpen(true);
  };

  const handleAddSubject = async (newSubject) => {
    try {
      await client.post("/api/subjects/create", newSubject);
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
      const response = await client.get(`/api/subjects/findById/${id}`);
      const data = response.data;
      setSubject(data);
      setIsModalOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSubject(null);
  };

  const handleEdit = (id) => {
    const selectedSubject = data.find((Subject) => subject.id === id);
    if (selectedSubject) {
      setIsEditMode(true);
      setSelectedSubject(selectedSubject);
      setIsFormOpen(true);
    }
  };

  const handleUpdateSubject = async (updateSubject) => {
    try {
      await client.put(`/api/subjects/update/${updateSubject.id}`, updateSubject);
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

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSubject(null);
  };

  const handleDelete = async (id) => {
    try {
      await client.delete(`/api/subjects/delete/${id}`);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const fetchData = useCallback(async () => {
    try {
      let url = "/api/subjects";

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
    { field: "name", headerName: "Tên môn học", width: 150 },
    {
      field: "teacher",
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
        <SubjectForm
          handleAddSubject={handleAddSubject}
          handleUpdateSubject={handleUpdateSubject}
          handleClose={handleCloseForm}
          isEditMode={isEditMode}
          initialData={selectedSubject}
          error={error}
          teacherId={teacher}
        />
      )}
      {subject && (
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
           <h2 id="modal-title">Thông tin môn học</h2>
            <p id="modal-description">ID: {subject.id}</p>
            <p id="modal-description">Tên môn: {subject.name}</p>
            <p>Giáo viên: {subject.teacher.name}</p>

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

export default Subject;
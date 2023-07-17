import React, { useState, useEffect, useCallback } from "react";
import BasicCard from "../../components/common/BasicCard/BasicCard";
import SearchIcon from "@mui/icons-material/Search";
import Input from "@mui/material/Input";
import CommonButton from "../../components/common/CommonButton/CommonButton";
import Box from "@mui/material/Box";
import GridWrapper from "../../components/common/GridWrapper/GridWrapper";
import DataTable from "../../components/common/DataTable/DataTable";
import client from "../../api/client";
import { Button, Modal } from "@mui/material";
import EvaluationRecordForm from "../../components/evaluationRecord/EvaluationRecordForm";

const EvaluationRecord = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [evaluationRecord, setEvaluationRecord] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedEvaluationRecord, setSelectedEvaluationRecord] =
    useState(null);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState([]);

  const handleOpenForm = async () => {
    if (evaluationRecord) {
      setIsEditMode(true);
      setSelectedEvaluationRecord(evaluationRecord);
    } else {
      setIsEditMode(false);
      setSelectedEvaluationRecord(null);
    }

    try {
      const responseStudents = await client.get("/api/student/allStudent");
      setStudents(responseStudents.data);
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
    setEvaluationRecord(null);
  };

  const fetchData = useCallback(async () => {
    try {
      let url = "/api/evaluation_records";
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

  const handleAddEvaluationRecord = async (newEvaluationRecord) => {
    try {
      await client.post("/api/evaluation_records/create", newEvaluationRecord);
      setIsModalOpen(true);
      await fetchData();
    } catch (error) {
      console.error(error);
      if (error.response) {
        setError(error.response.data);
      } else {
        setError("Đã xảy ra lỗi khi cập nhật bảng đánh giá.");
      }
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleView = async (id) => {
    try {
      const response = await client.get(
        `/api/evaluation_records/findById/${id}`
      );
      const data = response.data;
      setEvaluationRecord(data);
      setIsModalOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEvaluationRecord(null);
  };

  const handleEdit = (id) => {
    const selectedEvaluationRecord = data.find((year) => year.id === id);
    if (selectedEvaluationRecord) {
      setIsEditMode(true);
      setSelectedEvaluationRecord(selectedEvaluationRecord);
      setIsFormOpen(true);
    }
  };
  const handleUpdateEvaluationRecord = async (id, updatedEvaluationRecord) => {
    try {
      await client.put(
        `/api/evaluation_records/update/${id}`,
        updatedEvaluationRecord
      );
      setIsModalOpen(true);
      await fetchData();
    } catch (error) {
      console.error(error);
      if (error.response) {
        setError(error.response.data);
      } else {
        setError("Đã xảy ra lỗi khi cập nhật bảng đánh giá.");
      }
    }
  };
  const handleDelete = async (id) => {
    try {
      await client.delete(`/api/evaluation_records/delete/${id}`);
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
          placeholder="Tìm kiếm theo tên bảng đánh giá... "
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
    { field: "disciplineReason", headerName: "Lí do", width: 100 },
    { field: "achievement", headerName: "Thành tựu", width: 100 },
    { field: "date", headerName: "Ngày", width: 100 },
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
        <EvaluationRecordForm
          handleAddEvaluationRecord={handleAddEvaluationRecord}
          handleUpdateEvaluationRecord={handleUpdateEvaluationRecord}
          handleClose={handleCloseForm}
          isEditMode={isEditMode}
          initialData={selectedEvaluationRecord}
          error={error}
          students={students}
        />
      )}
      {evaluationRecord && (
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
            <h2 id="modal-title">Thông tin bảng đánh giá</h2>
            <p id="modal-description">ID: {evaluationRecord.id}</p>
            <p>Học sinh: {evaluationRecord.student.name}</p>
            <p>Lí do: {evaluationRecord.disciplineReason}</p>
            <p>Thành tựu: {evaluationRecord.achievement}</p>
            <p>Ngày: {evaluationRecord.date}</p>
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

export default EvaluationRecord;

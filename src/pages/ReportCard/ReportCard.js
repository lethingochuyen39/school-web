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
import ReportCardForm from "../../components/reportCard/ReportCardForm";

const ReportCard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [reportCard, setReportCard] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedReportCard, setSelectedReportCard] = useState(null);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);

  const handleOpenForm = async () => {
    if (reportCard) {
      setIsEditMode(true);
      setSelectedReportCard(reportCard);
    } else {
      setIsEditMode(false);
      setSelectedReportCard(null);
    }

    try {
      const responseStudents = await client.get("/api/student/allStudent");
      const responseAcademicYears = await client.get("/api/academic-years/all");
      setStudents(responseStudents.data);
      setAcademicYears(responseAcademicYears.data);
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
    setReportCard(null);
  };

  const fetchData = useCallback(async () => {
    try {
      let url = "/api/report_cards";
      if (searchTerm) {
        url += `?violate=${searchTerm}`;
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

  const handleAddReportCard = async (newReportCard) => {
    console.log(newReportCard);
    try {
      await client.post("/api/report_cards/create", newReportCard);

      await fetchData();
    } catch (error) {
      console.error(error);
      if (error.response) {
        setError(error.response.data);
      } else {
        setError("Đã xảy ra lỗi khi cập nhật hạng kiểm.");
      }
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleView = async (id) => {
    try {
      const response = await client.get(`/api/report_cards/findById/${id}`);
      const data = response.data;
      setReportCard(data);
      setIsModalOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setReportCard(null);
  };

  const handleEdit = (id) => {
    const selectedReportCard = data.find((reportCard) => reportCard.id === id);
    if (selectedReportCard) {
      setIsEditMode(true);
      setSelectedReportCard(selectedReportCard);
      setIsFormOpen(true);
    }
  };
  const handleUpdateReportCard = async (id, updatedReportCard) => {
    try {
      await client.put(`/api/report_cards/update/${id}`, updatedReportCard);

      await fetchData();
    } catch (error) {
      console.error(error);
      if (error.response) {
        setError(error.response.data);
      } else {
        setError("Đã xảy ra lỗi khi cập nhật hạng kiểm.");
      }
    }
  };
  const handleDelete = async (id) => {
    try {
      await client.delete(`/api/report_cards/delete/${id}`);
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
          placeholder="Tìm kiếm theo vi phạm... "
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
      width: 150,
      valueGetter: (params) => params.row.student?.name || "",
    },
    { field: "violate", headerName: "Vi phạm", width: 150 },
    { field: "description", headerName: "Mô tả", width: 150 },
    { field: "date", headerName: "Ngày", width: 150 },
    {
      field: "academicYear",
      headerName: "Năm học",
      width: 100,
      valueGetter: (params) => params.row.academicYear?.name || "",
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
        <ReportCardForm
          handleAddReportCard={handleAddReportCard}
          handleUpdateReportCard={handleUpdateReportCard}
          handleClose={handleCloseForm}
          isEditMode={isEditMode}
          initialData={selectedReportCard}
          error={error}
          students={students}
          academicYears={academicYears}
        />
      )}
      {reportCard && (
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
            <h2 id="modal-title">Thông tin hạnh kiểm</h2>
            <p id="modal-description">ID: {reportCard.id}</p>
            <p>Học sinh: {reportCard.student.name}</p>
            <p>Vi phạm: {reportCard.violate}</p>
            <p>Mô tả: {reportCard.description}</p>
            <p>Ngày: {reportCard.date}</p>
            <p>Năm học: {reportCard.academicYear.name}</p>

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

export default ReportCard;

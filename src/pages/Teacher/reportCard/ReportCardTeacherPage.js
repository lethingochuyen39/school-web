import React, { useState, useEffect, useCallback } from "react";
import BasicCard from "../../../components/common/BasicCard/BasicCard";
import CommonButton from "../../../components/common/CommonButton/CommonButton";
import Box from "@mui/material/Box";
import GridWrapper from "../../../components/common/GridWrapper/GridWrapper";
import DataTable from "../../../components/common/DataTable/DataTable";
import client from "../../../api/client";
import { Button, Modal, LinearProgress } from "@mui/material";
import ReportCardForm from "../../../components/reportCard/ReportCardForm";

const ReportCardTeacherPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [reportCard, setReportCard] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedReportCard, setSelectedReportCard] = useState(null);
  const [error, setError] = useState("");
  const [students, setStudents] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [teacher, setTeacher] = useState(null);
  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const teacherId = localStorage.getItem("id");
        const response = await client.get(`/api/teachers/${teacherId}`);
        setTeacher(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTeacherData();
  }, []);

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
      const response = await client.get(url);
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, []);

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

  const columns = [
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
      hiddenActions={["delete", "edit"]}
    />
  );

  return (
    <>
      {teacher === null ? (
        <LinearProgress />
      ) : teacher && !teacher.isActive ? (
        <div style={{ fontWeight: "bold", color: "#1565c0" }}>
          Tài khoản cá nhân bạn đang bị khóa. Vui lòng liên hệ nhà trường để
          biết thêm thông tin.
        </div>
      ) : (
        <GridWrapper>
          {isFormOpen && (
            <ReportCardForm
              handleAddReportCard={handleAddReportCard}
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
      )}
    </>
  );
};

export default ReportCardTeacherPage;

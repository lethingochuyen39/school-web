import React, { useState, useEffect, useCallback } from "react";
import BasicCard from "../../../components/common/BasicCard/BasicCard";
import CommonButton from "../../../components/common/CommonButton/CommonButton";
import Box from "@mui/material/Box";
import GridWrapper from "../../../components/common/GridWrapper/GridWrapper";
import DataTable from "../../../components/common/DataTable/DataTable";
import client from "../../../api/client";
import MetricForm from "../../../components/metric/MetricForm";
import { Button, Modal } from "@mui/material";

const MetricTeacherPage2 = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMetricFormOpen, setIsMetricFormOpen] = useState(false);
  const [metric, setMetric] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [error, setError] = useState("");
  const [academicYears, setAcademicYears] = useState([]);

  const handleOpenMetricForm = async () => {
    if (metric) {
      setIsEditMode(true);
      setSelectedMetric(metric);
    } else {
      setIsEditMode(false);
      setSelectedMetric(null);
    }

    try {
      const responseAcademicYears = await client.get("/api/academic-years/all");
      setAcademicYears(responseAcademicYears.data);
    } catch (error) {
      console.error(error);
      if (error.response) {
        setError(error.response.data);
      }
    }
    setIsMetricFormOpen(true);
  };

  const handleCloseMetricForm = () => {
    setIsMetricFormOpen(false);
    setMetric(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setMetric(null);
  };

  const fetchData = useCallback(async () => {
    try {
      let url = "/api/metrics";
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

  const handleAddMetric = async (newMetric) => {
    console.log(newMetric);
    try {
      await client.post("/api/metrics", newMetric);

      await fetchData();
    } catch (error) {
      console.error(error);
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("Đã xảy ra lỗi khi cập nhật thống kê.");
      }
    }
  };

  // hiển thị thông tin
  const handleView = async (id) => {
    try {
      const response = await client.get(`/api/metrics/${id}`);
      const data = response.data;
      setMetric(data);
      setIsModalOpen(true);
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
          onClick={handleOpenMetricForm}
          size="large"
        >
          Thêm mới
        </CommonButton>
      </Box>
    </Box>
  );

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "name", headerName: "Tên thống kê", width: 200 },
    { field: "description", headerName: "Miêu tả", width: 200 },
    { field: "value", headerName: "Giá trị", width: 150 },
    {
      field: "academicYear",
      headerName: "Năm học",
      width: 150,
      valueGetter: (params) => params.row.academicYear?.name || "",
    },
  ];

  const getContent = () => {
    return (
      <DataTable
        initialRows={data}
        columns={columns}
        loading={loading}
        handleView={handleView}
        hiddenActions={["delete", "edit"]}
      />
    );
  };

  return (
    <GridWrapper>
      {isMetricFormOpen && (
        <MetricForm
          handleAddMetric={handleAddMetric}
          handleClose={handleCloseMetricForm}
          isEditMode={isEditMode}
          initialData={selectedMetric}
          error={error}
          academicYears={academicYears}
        />
      )}

      {metric && (
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
            <h2 id="modal-title">Thông tin thống kê</h2>
            <p id="modal-description">ID: {metric.id}</p>
            <p>Tên thống kê: {metric.name}</p>
            <p>Miêu tả: {metric.description}</p>
            <p>Giá trị: {metric.value}</p>
            <p>Năm học: {metric.academicYear.name}</p>
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

export default MetricTeacherPage2;

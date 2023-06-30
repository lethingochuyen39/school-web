import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import validate from "validate.js";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

const schema = {
  studentId: {
    presence: {
      allowEmpty: false,
      message: "^Vui lòng chọn học sinh",
    },
  },
  averageScore: {
    presence: {
      allowEmpty: false,
      message: "^Vui lòng nhập điểm trung bình",
    },
    numericality: {
      greaterThanOrEqualTo: 0,
      lessThanOrEqualTo: 10,
      message: "^Điểm trung bình phải nằm trong khoảng từ 0 đến 10",
    },
  },
  academicYearId: {
    presence: {
      allowEmpty: false,
      message: "^Vui lòng chọn năm học",
    },
  },
};

const ReportCardForm = ({
  handleAddReportCard,
  handleUpdateReportCard,
  handleClose,
  isEditMode,
  initialData,
  students,
  academicYears,
}) => {
  const [reportCard, setReportCard] = useState({
    id: isEditMode ? initialData.id : "",
    studentId: isEditMode ? initialData.student.id : "",
    averageScore: isEditMode ? initialData.averageScore : "",
    academicYearId: isEditMode ? initialData.academicYear.id : "",
  });

  const [showModal, setShowModal] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (isEditMode && initialData) {
      setReportCard({
        id: initialData.id,
        studentId: initialData.student.id,
        averageScore: initialData.averageScore,
        academicYearId: initialData.academicYear.id,
      });
    }
  }, [isEditMode, initialData, students, academicYears]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const errors = validate(reportCard, schema);
      if (errors) {
        setError(errors);
        return;
      }

      if (isEditMode) {
        const updatedReportCard = {
          averageScore: reportCard.averageScore,
        };
        await handleUpdateReportCard(reportCard.id, updatedReportCard);
      } else {
        await handleAddReportCard(reportCard);
      }

      handleClose();
    } catch (error) {
      setError(error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    handleClose();
  };

  const hasError = (field) => {
    return error && error[field] ? true : false;
  };

  const getErrorMessage = (field) => {
    return hasError(field) ? error[field][0] : "";
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setReportCard((prevReportCard) => ({
      ...prevReportCard,
      [name]: value,
    }));
  };

  return (
    <Modal open={showModal} onClose={handleCloseModal}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
      >
        <h2>{isEditMode ? "Cập nhật hạng kiểm" : "Thêm hạng kiểm"}</h2>

        <form onSubmit={handleSubmit}>
          {isEditMode ? (
            <TextField
              type="number"
              name="averageScore"
              label="Điểm trung bình"
              value={reportCard.averageScore}
              onChange={handleChange}
              fullWidth
              margin="normal"
              variant="outlined"
              required
              error={hasError("averageScore")}
              helperText={getErrorMessage("averageScore")}
            />
          ) : (
            <>
              <FormControl
                fullWidth
                margin="normal"
                error={hasError("studentId")}
              >
                <InputLabel id="student-label">Học sinh</InputLabel>
                <Select
                  labelId="student-label"
                  id="student-select"
                  name="studentId"
                  value={reportCard.studentId}
                  onChange={handleChange}
                  label="Học sinh"
                  required
                >
                  {students.map((student) => (
                    <MenuItem key={student.id} value={student.id}>
                      {student.name}
                    </MenuItem>
                  ))}
                </Select>
                {hasError("studentId") && (
                  <FormHelperText>
                    {getErrorMessage("studentId")}
                  </FormHelperText>
                )}
              </FormControl>

              <TextField
                type="number"
                name="averageScore"
                label="Điểm trung bình"
                value={reportCard.averageScore}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                required
                error={hasError("averageScore")}
                helperText={getErrorMessage("averageScore")}
              />

              <FormControl
                fullWidth
                margin="normal"
                error={hasError("academicYearId")}
              >
                <InputLabel id="academicYear-label">Năm học</InputLabel>
                <Select
                  labelId="academicYear-label"
                  id="academicYear-select"
                  name="academicYearId"
                  value={reportCard.academicYearId}
                  onChange={handleChange}
                  label="Năm học"
                >
                  {academicYears.map((academicYear) => (
                    <MenuItem key={academicYear.id} value={academicYear.id}>
                      {academicYear.name}
                    </MenuItem>
                  ))}
                </Select>
                {hasError("academicYearId") && (
                  <FormHelperText>
                    {getErrorMessage("academicYearId")}
                  </FormHelperText>
                )}
              </FormControl>
            </>
          )}
          <Button type="submit" variant="contained" onClick={handleSubmit}>
            {isEditMode ? "Cập nhật" : "Thêm"}
          </Button>
          <Button onClick={handleCloseModal} color="error">
            Hủy
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default ReportCardForm;

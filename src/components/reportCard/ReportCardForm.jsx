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
  violate: {
    presence: {
      allowEmpty: false,
      message: "^Vi phạm không được bỏ trống",
    },
    length: {
      minimum: 1,
      maximum: 255,
      message: "^Vi phạm phải có từ 1 đến 255 ký tự",
    },
  },
  description: {
    presence: {
      allowEmpty: false,
      message: "^Mô tả không được bỏ trống",
    },
    length: {
      minimum: 1,
      maximum: 255,
      message: "^Mô tả phải có từ 1 đến 255 ký tự",
    },
  },
  date: {
    presence: {
      allowEmpty: false,
      message: "^Ngày không được bỏ trống",
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
    violate: isEditMode ? initialData.violate : "",
    description: isEditMode ? initialData.description : "",
    date: isEditMode ? initialData.date : "",
    academicYearId: isEditMode ? initialData.academicYear.id : "",
  });

  const [showModal, setShowModal] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (isEditMode && initialData) {
      setReportCard({
        id: initialData.id,
        studentId: initialData.student.id,
        violate: initialData.violate,
        description: initialData.description,
        date: initialData.date,
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
          violate: reportCard.violate,
          description: reportCard.description,
          date: reportCard.date,
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
        <h2>{isEditMode ? "Cập nhật hạnh kiểm" : "Thêm hạnh kiểm"}</h2>

        <form onSubmit={handleSubmit}>
          {isEditMode ? (
            <>
              <TextField
                name="violate"
                label="Vi phạm"
                value={reportCard.violate}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                focused
                error={hasError("violate")}
                helperText={getErrorMessage("violate")}
              />
              <TextField
                name="description"
                label="Mô tả"
                value={reportCard.description}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                focused
                error={hasError("description")}
                helperText={getErrorMessage("description")}
              />
              <TextField
                name="date"
                label="Ngày"
                type="date"
                value={reportCard.date}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                focused
                error={hasError("date")}
                helperText={getErrorMessage("date")}
              />
            </>
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
                name="violate"
                label="Vi phạm"
                value={reportCard.violate}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                focused
                error={hasError("violate")}
                helperText={getErrorMessage("violate")}
              />
              <TextField
                name="description"
                label="Mô tả"
                value={reportCard.description}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                focused
                error={hasError("description")}
                helperText={getErrorMessage("description")}
              />
              <TextField
                name="date"
                label="Ngày"
                type="date"
                value={reportCard.date}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                focused
                error={hasError("date")}
                helperText={getErrorMessage("date")}
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

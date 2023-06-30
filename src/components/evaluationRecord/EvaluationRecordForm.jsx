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
  disciplineReason: {
    presence: {
      allowEmpty: false,
      message: "^Lí do không được bỏ trống",
    },
    length: {
      minimum: 1,
      maximum: 255,
      message: "^Lí do phải có từ 1 đến 255 ký tự",
    },
  },
  achievement: {
    presence: {
      allowEmpty: false,
      message: "^Thành tựu không được bỏ trống",
    },
    length: {
      minimum: 1,
      maximum: 255,
      message: "^Thành tựu phải có từ 1 đến 255 ký tự",
    },
  },
  date: {
    presence: {
      allowEmpty: false,
      message: "^Ngày không được bỏ trống",
    },
  },
};

const EvaluationRecordForm = ({
  handleAddEvaluationRecord,
  handleUpdateEvaluationRecord,
  handleClose,
  isEditMode,
  initialData,
  students,
}) => {
  const [evaluationRecord, setEvaluationRecord] = useState({
    id: isEditMode ? initialData.id : "",
    studentId: isEditMode ? initialData.student.id : "",
    disciplineReason: isEditMode ? initialData.disciplineReason : "",
    achievement: isEditMode ? initialData.achievement : "",
    date: isEditMode ? initialData.date : "",
  });

  const [showModal, setShowModal] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (isEditMode && initialData) {
      setEvaluationRecord({
        id: initialData.id,
        studentId: initialData.student.id,
        disciplineReason: initialData.disciplineReason,
        achievement: initialData.achievement,
        date: initialData.date,
      });
    }
  }, [isEditMode, initialData, students]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const errors = validate(evaluationRecord, schema);
      if (errors) {
        setError(errors);
        return;
      }

      if (isEditMode) {
        const updatedEvaluationRecord = {
          disciplineReason: evaluationRecord.disciplineReason,
          achievement: evaluationRecord.achievement,
          date: evaluationRecord.date,
        };
        await handleUpdateEvaluationRecord(evaluationRecord.id, updatedEvaluationRecord);
      } else {
        await handleAddEvaluationRecord(evaluationRecord);
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
    setEvaluationRecord((prevEvaluationRecord) => ({
      ...prevEvaluationRecord,
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
        <h2>{isEditMode ? "Cập nhật bảng đánh giá" : "Thêm bảng đánh giá"}</h2>

        <form onSubmit={handleSubmit}>
          {isEditMode ? (
            <>
              <TextField
                name="disciplineReason"
                label="Lí do"
                value={evaluationRecord.disciplineReason}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                focused
                error={hasError("disciplineReason")}
                helperText={getErrorMessage("disciplineReason")}
              />
              <TextField
                name="achievement"
                label="Thành tựu"
                value={evaluationRecord.achievement}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                focused
                error={hasError("achievement")}
                helperText={getErrorMessage("achievement")}
              />
              <TextField
                name="date"
                label="Ngày"
                type="date"
                value={evaluationRecord.date}
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
                  value={evaluationRecord.studentId}
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
                name="disciplineReason"
                label="Lí do"
                value={evaluationRecord.disciplineReason}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                focused
                error={hasError("disciplineReason")}
                helperText={getErrorMessage("disciplineReason")}
              />
              <TextField
                name="achievement"
                label="Thành tựu"
                value={evaluationRecord.achievement}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                focused
                error={hasError("achievement")}
                helperText={getErrorMessage("achievement")}
              />
              <TextField
                name="date"
                label="Ngày"
                type="date"
                value={evaluationRecord.date}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                focused
                error={hasError("date")}
                helperText={getErrorMessage("date")}
              />
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

export default EvaluationRecordForm;

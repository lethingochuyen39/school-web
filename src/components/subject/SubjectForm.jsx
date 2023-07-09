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
  name: {
    presence: {
      allowEmpty: false,
      message: "^Tên không được bỏ trống.",
    },
  },
  teacherId: {
    presence: {
      allowEmpty: false,
      message: "^giáo viên không được bỏ trống.",
    },
  },
};

const SubjectForm = ({
  handleAddSubject,
  handleUpdateSubject,
  handleClose,
  isEditMode,
  initialData,
  teachers,
}) => {
  const [subject, setSubject] = useState({
    id: isEditMode ? initialData.id : "",
    name: isEditMode ? initialData.name : "",
    teacherId: isEditMode ? initialData.teacher.id : "",
  });

  const [showModal, setShowModal] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (isEditMode && initialData) {
      setSubject({
        id: initialData.id,
        name: initialData.name,
        teacherId: initialData.teacher.id,
      });
    }
  }, [isEditMode, initialData, teachers]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const errors = validate(subject, schema);
      if (errors) {
        setError(errors);
        return;
      }

      if (isEditMode) {
        const updatedSubject = {
          name: subject.name,
          teacherId: subject.teacherId,
        };
        await handleUpdateSubject(subject.id, updatedSubject);
      } else {
        await handleAddSubject(subject);
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
    setSubject((prevSubject) => ({
      ...prevSubject,
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
        <h2>{isEditMode ? "Cập nhật" : "Thêm mới"}</h2>

        <form onSubmit={handleSubmit}>
          {isEditMode ? (
            <>
              <TextField
                name="name"
                label="Tên lớp"
                value={subject.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                required
                error={hasError("name")}
                helperText={getErrorMessage("name")}
              />

              <FormControl
                fullWidth
                margin="normal"
                error={hasError("teacherId")}
              >
                <InputLabel id="teacher-label">Giáo viên</InputLabel>
                <Select
                  labelId="teacher-label"
                  id="teacher-select"
                  name="teacherId"
                  value={subject.teacherId}
                  onChange={handleChange}
                  label="Giáo viên"
                >
                  {teachers.map((teacher) => (
                    <MenuItem key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </MenuItem>
                  ))}
                </Select>
                {hasError("teacherId") && (
                  <FormHelperText>
                    {getErrorMessage("teacherId")}
                  </FormHelperText>
                )}
              </FormControl>
            </>
          ) : (
            <>
              <TextField
                name="name"
                label="Tên lớp"
                value={subject.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                required
                error={hasError("name")}
                helperText={getErrorMessage("name")}
              />

              <FormControl
                fullWidth
                margin="normal"
                error={hasError("teacherId")}
              >
                <InputLabel id="teacher-label">Giáo viên</InputLabel>
                <Select
                  labelId="teacher-label"
                  id="teacher-select"
                  name="teacherId"
                  value={subject.teacherId}
                  onChange={handleChange}
                  label="Giáo viên"
                >
                  {teachers.map((teacher) => (
                    <MenuItem key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </MenuItem>
                  ))}
                </Select>
                {hasError("teacherId") && (
                  <FormHelperText>
                    {getErrorMessage("teacherId")}
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

export default SubjectForm;

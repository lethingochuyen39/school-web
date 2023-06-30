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
      message: "^Tên môn không được bỏ trống",
    },
  },
  description: {
    presence: {
      allowEmpty: false,
      message: "^Ngày bắt đầu không được bỏ trống",
    },
  },
  grade: {
    presence: {
      allowEmpty: false,
      message: "^Khoi không được bỏ trống",
    },
  },
  academicYear: {
    presence: {
      allowEmpty: false,
      message: "^Khoi không được bỏ trống",
    },
  },
  teacher: {
    presence: {
      allowEmpty: false,
      message: "^Khoi không được bỏ trống",
    },
  },
};

const ClassForm = ({
  handleAddclasses,
  handleUpdateclasses,
  handleClose,
  isEditMode,
  initialData,
  teacher,
  academicYear,
}) => {
  const [classes, setclasses] = useState({
    id: isEditMode ? initialData.id : "",
    description: isEditMode ? initialData.description : "",
    grade: isEditMode ? initialData.grade : "",
    name: isEditMode ? initialData.name : "",
    academicYear: isEditMode ? initialData.academicYear.name : "",
    teacher: isEditMode ? initialData.teacher.name : "",
  });

  const [showModal, setShowModal] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (isEditMode && initialData) {
      setclasses({
        id: initialData.id,
        description: initialData.description,
        grade: initialData.grade,
        name: initialData.name,
        academicYear: initialData.academicYear.name,
        teacher: initialData.teacher.name,
      });
    }
  }, [isEditMode, initialData, teacher, academicYear]);

  const handleChange = (event) => {
    setclasses((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const errors = validate(classes, schema);
      if (errors) {
        setError(errors);
        return;
      }
      if (isEditMode) {
        await handleUpdateclasses(classes);
      } else {
        await handleAddclasses(classes);
      }
      handleClose();
    } catch (error) {
      console.log(error);
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
  return (
    <Modal open={showModal} onClose={handleCloseModal}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
      >
        <h2>{isEditMode ? "Cập nhật lớp" : "Thêm mới lớp"}</h2>

        <form onSubmit={handleSubmit}>
          {isEditMode ? (
          <>
		    <TextField
              name="name"
              label="Tên lớp học"
              value={classes.name}
              onChange={handleChange}
              fullWidth
              margin="normal"
              variant="outlined"
              focused
              required
              error={hasError("name")}
              helperText={getErrorMessage("name")}
            />
			<TextField
                name="description"
                label="Mô tả"
                value={classes.description}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                focused
                error={hasError("description")}
                helperText={getErrorMessage("description")}
              />
              <TextField
                name="grade"
                label="khối"
                value={classes.grade}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                focused
                error={hasError("grade")}
                helperText={getErrorMessage("grade")}
              /></>
          ) : (
            <>
              <TextField
                name="name"
                label="Tên lớp học"
                value={classes.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                focused
                required
                error={hasError("name")}
                helperText={getErrorMessage("name")}
              />
              <FormControl
                fullWidth
                margin="normal"
                error={hasError("academicYear")}
              >
                <InputLabel id="academic-year-label">Năm</InputLabel>
                <Select
                  labelId="academic-year-label"
                  id="academic-year-select"
                  name="academicYear"
                  value={classes.academicYear.name}
                  onChange={handleChange}
                  label="Năm"
                  required
                >
                  {academicYear.map((academicYear) => (
                    <MenuItem key={academicYear.id} value={academicYear.id}>
                      {academicYear.name}
                    </MenuItem>
                  ))}
                </Select>
                {hasError("academicYear") && (
                  <FormHelperText>
                    {getErrorMessage("academicYear")}
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl
                fullWidth
                margin="normal"
                error={hasError("teacher")}
              >
                <InputLabel id="teacher-label">Giáo viên</InputLabel>
                <Select
                  labelId="teacher-label"
                  id="teacher-select"
                  name="teacher"
                  value={classes.teacher.name}
                  onChange={handleChange}
                  label="Giáo viên"
                  required
                >
                  {teacher.map((teacher) => (
                    <MenuItem key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </MenuItem>
                  ))}
                </Select>
                {hasError("teacher") && (
                  <FormHelperText>{getErrorMessage("teacher")}</FormHelperText>
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

export default ClassForm;

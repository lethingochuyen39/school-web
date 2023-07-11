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
      message: "^Mô tả không được bỏ trống",
    },
  },
  grade: {
    presence: {
      allowEmpty: false,
      message: "^Khối không được bỏ trống",
    },
  },
  academicYearId: {
    presence: {
      allowEmpty: false,
      message: "^Năm học không được bỏ trống",
    },
  },
  teacherId: {
    presence: {
      allowEmpty: false,
      message: "^Giáo viên không được bỏ trống",
    },
  },
};

const ClassesForm = ({
  handleAddClasses,
  handleUpdateClasses,
  handleClose,
  isEditMode,
  initialData,
  academicYears,
  teachers,
}) => {
  const [classes, setClasses] = useState({
    id: isEditMode ? initialData.id : "",
    name: isEditMode ? initialData.name : "",
    description: isEditMode ? initialData.description : "",
    grade: isEditMode ? initialData.grade : "",
    academicYearId: isEditMode ? initialData.academicYear.id : "",
    teacherId: isEditMode ? initialData.teacher.id : "",
  });

  const [showModal, setShowModal] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (isEditMode && initialData) {
      setClasses({
        id: initialData.id,
        name: initialData.name,
        description: initialData.description,
        grade: initialData.grade,
        academicYearId: initialData.academicYear.id,
        teacherId: initialData.teacher.id,
      });
    }
  }, [isEditMode, initialData, academicYears, teachers]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const errors = validate(classes, schema);
      if (errors) {
        setError(errors);
        return;
      }

      if (isEditMode) {
        const updatedClasses = {
          name: classes.name,
          description: classes.description,
          grade: classes.grade,
          academicYearId: classes.academicYearId,
          teacherId: classes.teacherId,
        };
        await handleUpdateClasses(classes.id, updatedClasses);
      } else {
        await handleAddClasses(classes);
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
    setClasses((prevClasses) => ({
      ...prevClasses,
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
                value={classes.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
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
                required
                error={hasError("description")}
                helperText={getErrorMessage("description")}
              />

              <TextField
                name="grade"
                label="Khối"
                value={classes.grade}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                required
                error={hasError("grade")}
                helperText={getErrorMessage("grade")}
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
                  value={classes.teacherId}
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
                  value={classes.academicYearId}
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
          ) : (
            <>
              <TextField
                name="name"
                label="Tên lớp"
                value={classes.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
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
                required
                error={hasError("description")}
                helperText={getErrorMessage("description")}
              />

              <TextField
                name="grade"
                label="Khối"
                value={classes.grade}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                required
                error={hasError("grade")}
                helperText={getErrorMessage("grade")}
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
                  value={classes.teacherId}
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
                  value={classes.academicYearId}
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

export default ClassesForm;

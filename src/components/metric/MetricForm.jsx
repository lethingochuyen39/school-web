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
  description: {
    presence: {
      allowEmpty: false,
      message: "^Miêu tả không được bỏ trống",
    },
    length: {
      minimum: 1,
      maximum: 255,
      message: "^Miêu tả phải có từ 1 đến 255 ký tự",
    },
  },
  name: {
    presence: {
      allowEmpty: false,
      message: "^Tên thống kê không được bỏ trống",
    },
    length: {
      minimum: 1,
      maximum: 255,
      message: "^Tên thống kê phải có từ 1 đến 255 ký tự",
    },
  },
  value: {
    presence: {
      allowEmpty: false,
      message: "^Vui lòng nhập giá trị",
    },
    numericality: {
      greaterThanOrEqualTo: 0,
      lessThanOrEqualTo: 1000,
      message: "^Giá trị phải nằm trong khoảng từ 0 đến 1000",
    },
  },
  academicYearId: {
    presence: {
      allowEmpty: false,
      message: "^Vui lòng chọn năm học",
    },
  },
};

const MetricForm = ({
  handleAddMetric,
  handleUpdateMetric,
  handleClose,
  isEditMode,
  initialData,
  academicYears,
}) => {
  const [metric, setMetric] = useState({
    id: isEditMode ? initialData.id : "",
    name: isEditMode ? initialData.name : "",
    description: isEditMode ? initialData.description : "",
    value: isEditMode ? initialData.value : "",
    academicYearId: isEditMode ? initialData.academicYear.id : "",
  });
  const [showModal, setShowModal] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (isEditMode && initialData) {
      setMetric({
        id: initialData.id,
        name: initialData.name,
        description: initialData.description,
        value: initialData.value,
        academicYearId: initialData.academicYear.id,
      });
    }
  }, [isEditMode, initialData, academicYears]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setMetric((prevMetric) => ({
      ...prevMetric,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const errors = validate(metric, schema);
      if (errors) {
        setError(errors);
        return;
      }

      if (isEditMode) {
        const updatedMetric = {
          name: metric.name,
          description: metric.description,
          value: metric.value,
        };
        await handleUpdateMetric(metric.id, updatedMetric);
      } else {
        await handleAddMetric(metric);
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
        <h2>{isEditMode ? "Cập nhật thống kê" : "Thêm mới thống kê"}</h2>

        <form onSubmit={handleSubmit}>
          {isEditMode ? (
            <>
              <TextField
                name="name"
                label="Tên thống kê"
                value={metric.name}
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
                label="Miêu tả"
                value={metric.description}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                focused
                error={hasError("description")}
                helperText={getErrorMessage("description")}
              />
              <TextField
                name="value"
                label="Giá trị"
                value={metric.value}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                focused
                error={hasError("value")}
                helperText={getErrorMessage("value")}
              />
            </>
          ) : (
            <>
              <TextField
                name="name"
                label="Tên thống kê"
                value={metric.name}
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
                label="Miêu tả"
                value={metric.description}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                focused
                error={hasError("description")}
                helperText={getErrorMessage("description")}
              />
              <TextField
                name="value"
                label="Giá trị"
                value={metric.value}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                focused
                error={hasError("value")}
                helperText={getErrorMessage("value")}
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
                  value={metric.academicYearId}
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

export default MetricForm;
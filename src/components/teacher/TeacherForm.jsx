import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import validate from "validate.js";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Grid from "@mui/material/Grid";
import {
  Alert,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Switch,
  Typography,
} from "@mui/material";
import client from "../../api/client";
import { format } from "date-fns";
const schema = {
  name: {
    presence: {
      allowEmpty: false,
      message: "^Tên không được bỏ trống",
    },
  },
  dob: {
    presence: {
      allowEmpty: false,
      message: "^Ngày sinh không được bỏ trống",
    },
  },
  gender: {
    presence: {
      allowEmpty: false,
      message: "^Giới tính không được bỏ trống",
    },
  },
  address: {
    presence: {
      allowEmpty: false,
      message: "^Địa chỉ không được bỏ trống",
    },
    length: {
      minimum: 1,
      maximum: 255,
      message: "^Tên năm học phải có từ 1 đến 255 ký tự",
    },
  },
  email: {
    presence: {
      allowEmpty: false,
      message: "^Email không được bỏ trống",
    },
    email: {
      message: "^Email phải đúng định dạng",
    },
  },
  phone: {
    presence: {
      allowEmpty: false,
      message: "^Số điện thoại không được bỏ trống",
    },
    format: {
      pattern: "^[0-9]*$",
      message: "^Số điện thoại phải là số",
    },
    length: {
      minimum: 10,
      maximum: 10,
      tooShort: "^Số điện thoại quá ngắn",
      tooLong: "^Số điện thoại quá dài",
    },
  },
};

const TeacherForm = ({ handleClose, isEditMode, initialData, fetchData }) => {
  const defaultIsActive = isEditMode ? initialData.isActive : false;
  const [teacher, setTeacher] = useState({
    id: isEditMode ? initialData.id : "",
    name: isEditMode ? initialData.name : "",
    dob: isEditMode ? initialData.dob : "",
    gender: isEditMode ? initialData.gender : "",
    address: isEditMode ? initialData.address : "",
    email: isEditMode ? initialData.email : "",
    phone: isEditMode ? initialData.phone : "",
    status: isEditMode ? initialData.status : "",
    isActive: defaultIsActive,
  });
  const [showModal, setShowModal] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (isEditMode && initialData) {
      setTeacher((prev) => ({
        ...prev,
        isActive: initialData.isActive,
      }));
    }
  }, [isEditMode, initialData]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const teacherData = {
      name: teacher.name,
      dob: teacher.dob,
      gender: teacher.gender,
      address: teacher.address,
      email: teacher.email,
      phone: teacher.phone,
      isActive: teacher.isActive,
    };

    try {
      if (isEditMode && teacher.id) {
        await client.put(`/api/teachers/update/${teacher.id}`, teacherData);
        fetchData();
      } else {
        const errors = validate(teacherData, schema);
        if (errors) {
          setError(errors);
          return;
        }
        await client.post("/api/teachers/create", teacherData);
        await fetchData();
      }

      setSuccessMessage("Thao tác thành công");
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.response.data);
      setSuccessMessage("");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    handleClose();
    fetchData();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    // Kiểm tra nếu trường "isActive" chưa được xác định, đặt giá trị mặc định là false.
    const isActiveValue =
      name === "isActive" ? event.currentTarget.checked : teacher.isActive;

    setTeacher((prev) => ({
      ...prev,
      [name]: value,
      isActive: isActiveValue, // Đảm bảo giá trị của "isActive" được xác định trước khi sử dụng.
    }));

    const errors = validate({ ...teacher, [name]: value }, schema);
    setError((prevError) => ({
      ...prevError,
      [name]: errors ? errors[name] : null,
    }));
  };

  const handleSwitchChange = (event) => {
    const { checked } = event.currentTarget;
    setTeacher((prev) => ({
      ...prev,
      isActive: checked, // Đảm bảo giá trị của "isActive" được xác định trước khi sử dụng.
    }));
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
          width: 500,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
          maxWidth: "90%",
          maxHeight: "80%",
          overflow: "auto",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            mb: 2,
            fontWeight: "bold",
            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)",
            color: "#FF4500",
            textAlign: "center",
          }}
        >
          {isEditMode ? "Cập nhật" : "Thêm mới"}
        </Typography>

        {successMessage && (
          <Alert severity="success" onClose={() => setSuccessMessage("")}>
            {successMessage}
          </Alert>
        )}
        {errorMessage && (
          <Alert severity="error" onClose={() => setErrorMessage("")}>
            {errorMessage}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {isEditMode ? (
            <>
              <TextField
                type="text"
                name="name"
                label="Tên giáo viên"
                value={teacher.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                focused
                required
                sx={{ mb: 2 }}
                error={hasError("name")}
                helperText={getErrorMessage("name")}
              />

              <TextField
                name="dob"
                label="Ngày sinh"
                type="date"
                value={teacher.dob}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                focused
                required
                sx={{ mb: 2 }}
                error={hasError("dob")}
                helperText={getErrorMessage("dob")}
              />

              <FormControl
                component="fieldset"
                margin="normal"
                required
                error={hasError("gender")}
              >
                <FormLabel component="legend">Giới tính</FormLabel>
                <RadioGroup
                  name="gender"
                  value={teacher.gender}
                  onChange={handleChange}
                  row
                >
                  <FormControlLabel
                    value="male"
                    control={<Radio color="primary" />}
                    label="Nam"
                  />
                  <FormControlLabel
                    value="female"
                    control={<Radio color="primary" />}
                    label="Nữ"
                  />
                </RadioGroup>
                {hasError("gender") && (
                  <span style={{ color: "red" }}>
                    {getErrorMessage("gender")}
                  </span>
                )}
              </FormControl>

              <TextField
                name="address"
                label="Địa chỉ"
                value={teacher.address}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                focused
                required
                error={hasError("address")}
                helperText={getErrorMessage("address")}
              />

              <TextField
                name="phone"
                label="Số điện thoại"
                value={teacher.phone}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                focused
                required
                error={hasError("phone")}
                helperText={getErrorMessage("phone")}
              />
            </>
          ) : (
            <>
              <TextField
                type="text"
                name="name"
                label="Tên giáo viên"
                value={teacher.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                focused
                required
                sx={{ mb: 2 }}
                error={hasError("name")}
                helperText={getErrorMessage("name")}
              />

              <TextField
                name="dob"
                label="Ngày sinh"
                type="date"
                value={teacher.dob}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                focused
                required
                sx={{ mb: 2 }}
                error={hasError("dob")}
                helperText={getErrorMessage("dob")}
              />

              <FormControl
                component="fieldset"
                margin="normal"
                required
                error={hasError("gender")}
              >
                <FormLabel component="legend">Giới tính</FormLabel>
                <RadioGroup
                  name="gender"
                  value={teacher.gender}
                  onChange={handleChange}
                  row
                >
                  <FormControlLabel
                    value="male"
                    control={<Radio color="primary" />}
                    label="Nam"
                  />
                  <FormControlLabel
                    value="female"
                    control={<Radio color="primary" />}
                    label="Nữ"
                  />
                </RadioGroup>
                {hasError("gender") && (
                  <span style={{ color: "red" }}>
                    {getErrorMessage("gender")}
                  </span>
                )}
              </FormControl>
              <TextField
                name="address"
                label="Địa chỉ"
                value={teacher.address}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                focused
                required
                error={hasError("address")}
                helperText={getErrorMessage("address")}
              />
              <TextField
                name="email"
                label="Email"
                value={teacher.email}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                focused
                required
                error={hasError("email")}
                helperText={getErrorMessage("email")}
              />
              <TextField
                name="phone"
                label="Số điện thoại"
                value={teacher.phone}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                focused
                required
                error={hasError("phone")}
                helperText={getErrorMessage("phone")}
              />
            </>
          )}
          <Button
            type="submit"
            variant="contained"
            onClick={handleSubmit}
            sx={{ mt: 2 }}
          >
            {isEditMode ? "Cập nhật" : "Thêm"}
          </Button>
          <Button onClick={handleCloseModal} color="error" sx={{ mt: 2 }}>
            Hủy
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default TeacherForm;

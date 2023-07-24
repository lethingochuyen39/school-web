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
      message: "^Giới tính được bỏ trống",
    },
  },
  address: {
    presence: {
      allowEmpty: false,
      message: "^Địa chỉ không được bỏ trống",
    },
  },
  email: {
    presence: {
      allowEmpty: false,
      message: "^Email không được bỏ trống",
    },
  },
  phone: {
    presence: {
      allowEmpty: false,
      message: "^SĐT không được bỏ trống",
    },
  },
};

const StudentForm = ({ handleClose, isEditMode, initialData, fetchData }) => {
  const [student, setStudent] = useState({
    id: isEditMode ? initialData.id : "",
    name: isEditMode ? initialData.name : "",
    dob: isEditMode ? initialData.dob : "",
    gender: isEditMode ? initialData.gender : "",
    address: isEditMode ? initialData.address : "",
    email: isEditMode ? initialData.email : "",
    phone: isEditMode ? initialData.phone : "",
    status: isEditMode ? initialData.status : "",
  });
  const [showModal, setShowModal] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (isEditMode && initialData) {
      setStudent((prev) => ({
        ...prev,
      }));
    }
  }, [isEditMode, initialData]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const studentData = {
      name: student.name,
      dob: student.dob,
      gender: student.gender,
      address: student.address,
      email: student.email,
      phone: student.phone,
      status: student.status,
    };

    try {
      if (isEditMode && student.id) {
        await client.put(
          `/api/student/updateStudent/${student.id}`,
          studentData
        );
        fetchData();
      } else {
        const errors = validate(studentData, schema);
        if (errors) {
          setError(errors);
          return;
        }
        await client.post("/api/student/create", studentData);
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

    setStudent((prev) => ({
      ...prev,
      [name]: value,
    }));

    const errors = validate({ ...student, [name]: value }, schema);
    setError((prevError) => ({
      ...prevError,
      [name]: errors ? errors[name] : null,
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
          <TextField
            type="text"
            name="name"
            label="Tên học sinh"
            value={student.name}
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
            value={student.dob}
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
              value={student.gender}
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
              <span style={{ color: "red" }}>{getErrorMessage("gender")}</span>
            )}
          </FormControl>
          <TextField
            name="address"
            label="Địa chỉ"
            value={student.address}
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
            value={student.email}
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
            value={student.phone}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            focused
            required
            error={hasError("phone")}
            helperText={getErrorMessage("phone")}
          />

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

export default StudentForm;

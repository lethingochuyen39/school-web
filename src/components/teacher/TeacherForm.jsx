import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import validate from "validate.js";

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
  status: {
    presence: {
      allowEmpty: false,
      message: "^Trạng thái không được bỏ trống",
    },
  },
};

const TeacherForm = ({
  handleAddTeacher,
  handleUpdateTeacher,
  handleClose,
  isEditMode,
  initialData,
}) => {
  const [teacher, setTeacher] = useState({
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
  useEffect(() => {
    if (isEditMode && initialData) {
      setTeacher(initialData);
    }
  }, [isEditMode, initialData]);

  const handleChange = (event) => {
    setTeacher((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const errors = validate(teacher, schema);
      if (errors) {
        setError(errors);
        return;
      }
      if (isEditMode) {
        await handleUpdateTeacher(teacher);
      } else {
        await handleAddTeacher(teacher);
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
        <h2>{isEditMode ? "Cập nhật" : "Thêm mới"}</h2>

        <form onSubmit={handleSubmit}>
          <>
            <TextField
              name="name"
              label="Tên"
              value={teacher.name}
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
              error={hasError("dob")}
              helperText={getErrorMessage("dob")}
            />
            <TextField
              name="gender"
              label="Giới tính"
              value={teacher.gender}
              onChange={handleChange}
              fullWidth
              margin="normal"
              variant="outlined"
              focused
              required
              error={hasError("gender")}
              helperText={getErrorMessage("gender")}
            />
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
            <TextField
              name="status"
              label="Trạng thái"
              value={teacher.status}
              onChange={handleChange}
              fullWidth
              margin="normal"
              variant="outlined"
              focused
              required
              error={hasError("status")}
              helperText={getErrorMessage("status")}
            />
          </>
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

export default TeacherForm;

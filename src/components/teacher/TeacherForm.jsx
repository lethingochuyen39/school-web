import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Modal from "@mui/material/Modal";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import TextField from "@mui/material/TextField";
import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { Alert, Switch, Typography } from "@mui/material";
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

  const handleSwitchChange = (event) => {
    const { checked } = event.target;
    setTeacher((prev) => ({
      ...prev,
      isActive: checked,
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
          width: 400,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
      >
        <h2>{isEditMode ? "Cập nhật" : "Thêm mới"}</h2>

        <form onSubmit={handleSubmit}>
          <TextField
            name="name"
            label="Tên giáo viên"
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
              <span style={{ color: "red" }}>{getErrorMessage("gender")}</span>
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
          <Grid
            item
            xs={12}
            sx={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Typography
              variant="body1"
              sx={{
                display: "flex",
                alignItems: "center",
                marginRight: "8px",
              }}
            >
              Trạng thái
            </Typography>
            <Switch
              checked={teacher.isActive}
              onChange={handleSwitchChange}
              color="primary"
            />
          </Grid>
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

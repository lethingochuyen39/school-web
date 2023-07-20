import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import validate from "validate.js";
import { Alert, Typography } from "@mui/material";
import client from "../../api/client";
const schema = {
  name: {
    presence: {
      allowEmpty: false,
      message: "^Tên năm học không được bỏ trống",
    },
    length: {
      minimum: 1,
      maximum: 255,
      message: "^Tên năm học phải có từ 1 đến 255 ký tự",
    },
  },
};
const SubjectForm = ({ handleClose, isEditMode, initialData, fetchData }) => {
  const [subject, setSubject] = useState({
    id: isEditMode ? initialData.id : "",
    name: isEditMode ? initialData.name : "",
  });
  const [showModal, setShowModal] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (isEditMode && initialData) {
      setSubject(initialData);
    }
  }, [isEditMode, initialData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSubject((prev) => ({
      ...prev,
      [name]: value,
    }));

    const errors = validate({ ...subject, [name]: value }, schema);
    setError((prevError) => ({
      ...prevError,
      [name]: errors ? errors[name] : null,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const errors = validate(subject, schema);
      if (errors) {
        setError(errors);
        return;
      }
      if (isEditMode) {
        await client.put(`/api/subjects/update/${subject.id}`, subject);
      } else {
        await client.post("/api/subjects/create", subject);
      }
      await fetchData();

      console.log("Data from API:", subject);
      setSuccessMessage("Thao tác thành công");
      setErrorMessage("");
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data);
      } else {
        setErrorMessage("Có lỗi xảy ra");
      }
      setSuccessMessage("");
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
          maxWidth: "90%",
          maxHeight: "80%",
          overflow: "auto",
        }}
      >
        <Typography
          id="modal-title"
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
            name="name"
            label="Tên"
            value={subject.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            focused
            required
            error={hasError("name")}
            helperText={getErrorMessage("name")}
          />

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

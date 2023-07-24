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
    FormHelperText,
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

const StudentExcelForm = ({ handleClose,fetchData }) => {

    const [showModal, setShowModal] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");


    // const handleSubmit = async (event) => {
    //     event.preventDefault();



    // };

    const handleCloseModal = () => {
        setShowModal(false);
        handleClose();
        fetchData();
    };

    // const handleChange = (event) => {
    //     const { name, value } = event.target;
    // };

    const hasError = (field) => {
        return error && error[field] ? true : false;
    };

    const getErrorMessage = (field) => {
        return hasError(field) ? error[field][0] : "";
    };
    // const [error, setError] = useState(null);

    // const hasError = (field) => {
    // 	return error && error[field] ? true : false;
    // };
    // const getErrorMessage = (field) => {
    // 	return hasError(field) ? error[field][0] : "";
    // };
    const [document, setDocument] = useState({
        file: null,
        // file: initialData ? { name: initialData.fileName } : null,
    });
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setDocument((prev) => ({
            file: file,
        }));
    };
    const handleSubmitFile = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("file", document.file);
        try {

            await client.post(`/api/student/import`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            await fetchData();
            setSuccessMessage("Thao tác thành công");
            setErrorMessage("");
        } catch (error) {
            setErrorMessage(error.response.data);
            setSuccessMessage("");
        }

        // await fetchData();
    }
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

                <form onSubmit={handleSubmitFile}>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <label
                                htmlFor="file-upload"
                                style={{ display: "flex", alignItems: "center" }}
                            >
                                <Button
                                    variant="outlined"
                                    component="span"
                                    startIcon={<CloudUploadIcon />}
                                    sx={{
                                        backgroundColor: "#9e9e9e",
                                        color: "black",
                                        marginBottom: "8px",
                                        "&:hover": {
                                            color: "black",
                                        },
                                    }}
                                >
                                    Chọn file
                                </Button>
                                <input
                                    type="file"
                                    id="file-upload"
                                    name="file"
                                    accept=".xlsx"
                                    style={{ display: "none" }}
                                    onChange={handleFileChange}
                                />
                            </label>
                        </Grid>
                        <Grid item xs={4}>
                            {document.file && (
                                <Typography
                                    variant="body1"
                                    sx={{
                                        width: "50%",
                                        // padding: "8px",
                                        backgroundColor: "#eee",
                                        color: "#555",
                                        border: "none",
                                        borderRadius: "4px",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {document.file.name}
                                </Typography>
                            )}
                            {error && !document.file  && (
                                <FormHelperText error>{getErrorMessage("file")}</FormHelperText>
                            )}
                        </Grid>
                        <Button
                            type="submit"
                            variant="contained"
                            onClick={handleSubmitFile}
                            sx={{ mt: 2 }}
                        >
                            Thêm
                        </Button>
                        <Grid item xs={4}></Grid>
                    </Grid>
                    <Button onClick={handleCloseModal} color="error" sx={{ mt: 2 }}>
                        Hủy
                    </Button>
                </form>
            </Box>
        </Modal>
    );
};

export default StudentExcelForm;

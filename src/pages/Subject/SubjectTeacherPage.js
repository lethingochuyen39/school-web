import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import client from "../../api/client";
import BasicCard from "../../components/common/BasicCard/BasicCard";
import DataTable from "../../components/common/DataTable/DataTable";
import GridWrapper from "../../components/common/GridWrapper/GridWrapper";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SubjectTeacherPage() {
  const { id } = useParams();
  const [teachers, setTeachers] = useState([]);
  const [selectTeachers, setSelectTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const navigate = useNavigate();
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTeacherDetails, setSelectedTeacherDetails] = useState(null);
  const [selectedTeachers, setSelectedTeachers] = useState([]);

  const fetchTeacherData = async () => {
    try {
      const response = await client.get(
        `/api/teachers/subjects/${id}/teachers`
      );
      const teachersResponse = await client.get("/api/teachers");
      const activeTeachers = teachersResponse.data.filter(
        (teacher) => teacher.isActive
      );
      setSelectTeachers(activeTeachers);
      setSelectedTeacher(activeTeachers[0]?.id || "");
      setTeachers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTeacherData();
  }, [id]);

  const handleTeacherChange = (event) => {
    const selectedIds = event.target.value;
    setSelectedTeachers(selectedIds);
  };

  const handleSubmit = () => {
    if (selectedTeachers.length === 0) {
      toast.warning("Vui lòng chọn ít nhất một giáo viên để thêm vào môn học.");
      return;
    }

    // Check if any of the selected teachers are already in the teachers state
    const existingTeachers = selectedTeachers.filter((teacherId) =>
      teachers.find((teacher) => teacher.id === teacherId)
    );

    if (existingTeachers.length > 0) {
      toast.warning("Một số giáo viên đã tồn tại trong môn học.");
      return;
    }

    Promise.all(
      selectedTeachers.map((teacherId) =>
        client.post(`/api/subjects/${id}/teachers/${teacherId}`)
      )
    )
      .then(() => {
        fetchTeacherData();
        toast.success("Thêm giáo viên vào môn học thành công");
      })
      .catch((error) => {
        console.error("Lỗi khi thêm:", error.response.data);
      });
  };

  const handleView = (teacherId) => {
    // Find the teacher in the teachers state based on the teacherId
    const selectedTeacher = teachers.find(
      (teacher) => teacher.id === teacherId
    );
    setSelectedTeacherDetails(selectedTeacher);
    setIsViewModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsViewModalOpen(false);
  };

  const handleDelete = async (teacherId) => {
    const data = {
      teacherId: teacherId,
      subjectId: id,
    };
    try {
      await client.delete(
        `/api/subjects/${data.subjectId}/teachers/${data.teacherId}`
      );
      fetchTeacherData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleRowCheckboxClick = (event, teacherId) => {
    if (event.target.checked) {
      setSelectedTeachers((prevSelected) => [...prevSelected, teacherId]);
    } else {
      setSelectedTeachers((prevSelected) =>
        prevSelected.filter((id) => id !== teacherId)
      );
    }
  };

  const handleAllCheckboxClick = (event) => {
    if (event.target.checked) {
      const allTeacherIds = selectTeachers.map((teacher) => teacher.id);
      setSelectedTeachers(allTeacherIds);
    } else {
      setSelectedTeachers([]);
    }
  };
  

  const handleSubmitBatchDeletion = () => {
    if (selectedTeachers.length === 0) {
      toast.warning("Vui lòng chọn ít nhất một giáo viên để xóa.");
      return;
    }

    Promise.all(
      selectedTeachers.map((teacherId) =>
        client.delete(`/api/subjects/${id}/teachers/${teacherId}`)
      )
    )
      .then(() => {
        fetchTeacherData();
        toast.success("Xóa giáo viên khỏi môn học thành công");
      })
      .catch((error) => {
        console.error("Lỗi khi xóa:", error.response.data);
      });
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const getHeader = () => (
    <>
      {/* Back button */}
      <IconButton onClick={handleGoBack}>
        <ArrowBackIcon />
      </IconButton>

      {/* Teacher select dropdown */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        padding="5px"
        flexWrap="wrap"
      >
        <FormControl fullWidth margin="normal" size="small">
          <InputLabel id="teacher-label">Chọn giáo viên</InputLabel>
          <Select
            labelId="teacher-label"
            id="teacher-select"
            name="teacherId"
            value={selectedTeachers}
            onChange={handleTeacherChange}
            label="Chọn giáo viên"
            sx={{ height: "40px" }}
            multiple // Enable multiple selection
          >
            {selectTeachers.map((teacher) => (
              <MenuItem key={teacher.id} value={teacher.id}>
                {teacher.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </>
  );

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 100,
      disableActions: true,
      // Render a checkbox for each row
      renderCell: (params) => (
        <Checkbox
          checked={selectedTeachers.includes(params.row.id)}
          onClick={(e) => handleRowCheckboxClick(e, params.row.id)}
        />
      ),
    },
    {
      field: "name",
      headerName: "Giáo viên",
      width: 150,
      disableActions: true,
    },
  ];

  const getContent = () => (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        fontSize="2rem"
        fontWeight="bold"
        sx={{
          fontWeight: "bold",
          textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)",
          color: "#FF4500",
          textAlign: "center",
        }}
      >
        Nhập giáo viên
      </Box>

      <Box
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
        padding="5px"
        gap={1}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{
            background: "linear-gradient(45deg, #304ffe, #42a5f5)",
            fontSize: "1.2rem",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            "&:hover": {
              background: "#1e40af",
            },
          }}
        >
          Thêm
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmitBatchDeletion}
          disabled={teachers.length === 0} // Disable button if no teachers to delete
          sx={{
            background: "linear-gradient(45deg, #304ffe, #42a5f5)",
            fontSize: "1.2rem",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            "&:hover": {
              background: "#1e40af",
            },
          }}
        >
          Xóa
        </Button>
      </Box>

      <DataTable
        initialRows={teachers}
        columns={columns}
        handleDelete={handleDelete}
        handleView={handleView}
        hiddenActions={["edit"]}
      />

      {/* View Teacher Modal */}
      <Dialog open={isViewModalOpen} onClose={handleCloseModal}>
        <DialogTitle>{selectedTeacherDetails?.name}</DialogTitle>
        <DialogContent>
          {selectedTeacherDetails && (
            <>
              <Box
                sx={{
                  position: "fixed",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 500,
                  bgcolor: "background.paper",
                  borderRadius: 4,
                  p: 2,
                  maxWidth: "90%",
                  maxHeight: "90%",
                  overflow: "auto",
                }}
              >
                <>
                  <Typography
                    variant="h4"
                    id="modal-title"
                    sx={{
                      mb: 2,
                      fontWeight: "bold",
                      textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)",
                      color: "#FF4500",
                      textAlign: "center",
                    }}
                  >
                    Thông tin giáo viên
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ overflowWrap: "break-word" }}
                  >
                    <b>Tên:</b> {selectedTeacherDetails.name}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ overflowWrap: "break-word" }}
                  >
                    <b>Ngày sinh:</b> {selectedTeacherDetails.dob}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ overflowWrap: "break-word" }}
                  >
                    <b>Giới tính:</b> {selectedTeacherDetails.gender}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ overflowWrap: "break-word" }}
                  >
                    <b>Địa chỉ:</b> {selectedTeacherDetails.address}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ overflowWrap: "break-word" }}
                  >
                    <b>Email:</b> {selectedTeacherDetails.email}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ overflowWrap: "break-word" }}
                  >
                    <b>Số điện thoại:</b> {selectedTeacherDetails.phone}
                  </Typography>
                </>

                <Button
                  variant="contained"
                  onClick={handleCloseModal}
                  sx={{ mt: 2 }}
                >
                  Đóng
                </Button>
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
  return (
    <GridWrapper>
      <ToastContainer />
      <BasicCard header={getHeader()} content={getContent()} />
    </GridWrapper>
  );
}

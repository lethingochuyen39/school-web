import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
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
    const id = event.target.value;
    setSelectedTeacher(id);
    console.log(selectedTeacher);
  };

  const handleSubmit = () => {
    const data = {
      teacherId: selectedTeacher,
      subjectId: id,
    };

    client
      .post(`/api/subjects/${data.subjectId}/teachers/${data.teacherId}`)
      .then((response) => {
        fetchTeacherData();
        toast.success("Thêm giáo viên vào môn học thành công");
      })
      .catch((error) => {
        console.error("Lỗi khi thêm:", error.response.data);
      });
  };

  const handleDelete = async (id) => {
    const data = {
      teacherId: selectedTeacher,
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

  const handleGoBack = () => {
    navigate(-1);
  };

  const getHeader = () => (
    <>
      <IconButton onClick={handleGoBack}>
        <ArrowBackIcon />
      </IconButton>

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
            value={selectedTeacher}
            onChange={handleTeacherChange}
            label="Chọn giáo viên"
            sx={{ height: "40px" }}
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
    { field: "id", headerName: "ID", width: 100, disableActions: true },
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
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          style={{
            background: "linear-gradient(45deg, #304ffe, #42a5f5)",
            fontSize: "1.2rem",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          Lưu
        </Button>
      </Box>

      <DataTable
        initialRows={teachers}
        columns={columns}
        handleDelete={handleDelete}
        hiddenActions={["view", "edit"]}
        // hiddenActions={["view", "edit", "delete"]}
      />
    </>
  );
  return (
    <GridWrapper>
      <ToastContainer />
      <BasicCard header={getHeader()} content={getContent()} />
    </GridWrapper>
  );
}

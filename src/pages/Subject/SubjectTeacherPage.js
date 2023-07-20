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

export default function SubjectTeacherPage() {
  const { id } = useParams();
  const [teachers, setTeachers] = useState([]);
  const [selectTeachers, setSelectTeachers] = useState([]);
  const [subjectTeacher, setSubjectTeacher] = useState([]);
  const [selecteddTeacher, setSelecteddTeacher] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const teacher = localStorage.getItem("id");
        const response = await client.get(
          `/api/teachers/subjects/${id}/teachers`
        );
        const teachersResponse = await client.get("/api/teachers");
        const activeTeachers = teachersResponse.data.filter(
          (teacher) => teacher.isActive
        );
        setSelectTeachers(activeTeachers);
        setSelectTeachers(activeTeachers[0]?.id || "");
        setTeachers(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTeacherData();
  }, [id]);

	const handleTeacherChange = (event) => {
		const id = event.target.value;
		setSelecteddTeacher(id);
		fetchTeacherSubjects(id);
	};

  const fetchTeacherSubjects = async (id) => {
    try {
      const response = await client.get(`/api/teachers/${id}/subjects`);
      setSubjectTeacher(response.data);

      if (response.data.length > 0) {
        // setSelectedSubject(response.data[0].id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // const handleSaveTeacher = async () => {
  //   setErrors({});
  //   for (const row of teachers) {
  //     if (row.subject !== "") {
  //       const teacherToAdd = {
          // studentId: row.id,
          // subjectId: selectedSubject,
          // scoreTypeId: selectedScoreType,
          // classId: classId,
          // semester: semester,
          // score: row.score,
  //       };

  //       try {
  //         await client.post("/api/teacher ", teacherToAdd);

  //         setErrors((prevErrors) => {
  //           const updatedErrors = { ...prevErrors };
  //           delete updatedErrors[row.id];
  //           return updatedErrors;
  //         });
  //         setSuccessMessage("Thao tác thành công");
  //         setErrorMessage("");
  //       } catch (error) {
  //         setSuccessMessage("");
  //         setErrors((prevErrors) => ({
  //           ...prevErrors,
  //           [row.id]: { message: error.response.data || "Lỗi khi lưu điểm" },
  //         }));
  //       }
  //     }
  //   }
  // };

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
            value={selectTeachers}
            // onChange={handleTeacherChange}
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
          // onClick={handleSaveTeacher}
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
        // loading={loading}
        hiddenActions={["view", "edit", "delete"]}
      />
    </>
  );
  return (
    <GridWrapper>
      <BasicCard header={getHeader()} content={getContent()} />
    </GridWrapper>
  );
}

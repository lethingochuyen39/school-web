import React, { useState, useEffect, useCallback } from "react";
import BasicCard from "../../components/common/BasicCard/BasicCard";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ClassIcon from "@mui/icons-material/Class";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import client from "../../api/client";
import GridWrapper from "../../components/common/GridWrapper/GridWrapper";
import StatBox from "../../components/StatBox";

const Home = () => {
  const [studentData, setStudentData] = useState([]);
  const [numStudents, setNumStudents] = useState(0); // Số lượng học sinh
  const [classData, setClassData] = useState([]);
  const [numClasses, setNumClasses] = useState(0);
  const [teacherData, setTeacherData] = useState([]);
  const [numTeachers, setNumTeachers] = useState(0);
  const [userData, setUserData] = useState([]);
  const [numUsers, setUsers] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const responseStudents = await client.get("/api/student/allStudent");
      const responseTeachers = await client.get("/api/teachers/all");
      const responseClasses = await client.get("/api/classes/all");
      const responseUsers = await client.get("auth/all");

      const students = responseStudents.data;
      const classes = responseClasses.data;
      const teachers = responseTeachers.data;
      const users = responseUsers.data;

      setStudentData(students);
      setClassData(classes);
      setTeacherData(teachers);
      setUserData(users);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Sử dụng useEffect để theo dõi thay đổi của data
  useEffect(() => {
    // Cập nhật tổng số lượng học sinh khi studentData thay đổi
    setNumStudents(studentData.length);
    // Cập nhật tổng số lượng lớp học khi classData thay đổi
    setNumClasses(classData.length);
    // Cập nhật tổng số lượng giáo viên khi teacherData thay đổi
    setNumTeachers(teacherData.length);
    // Cập nhật tổng số lượng user khi userData thay đổi
    setUsers(userData.length);
  }, [studentData, classData, teacherData, userData]);

  const getHeader = () => (
    <Box
      display="flex"
      flexDirection={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      alignItems="center"
      paddingLeft="20px"
      paddingBottom="20px"
      paddingTop="10px"
      paddingRight="10px"
      flexWrap="wrap"
    >
      <Box
        flex={1}
        minWidth={{ xs: "100%", sm: 0, md: "500px" }}
        marginRight={{ xs: 0, sm: "10px" }}
        marginBottom={{ xs: "10px", sm: 0 }}
        backgroundColor="#f5f5f5"
        borderRadius="4px"
        padding="4px"
        display="flex"
        alignItems="center"
      >
        <h2>School Management Dashboard</h2>
      </Box>
    </Box>
  );

  const getContent = () => {
    return (
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor="rgb(220,220,220)"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={numStudents + " students"}
            subtitle="Total Students"
            icon={<AccountCircleIcon />}
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor="rgb(220,220,220)"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={numTeachers + " teachers"}
            subtitle="Total Teachers"
            icon={<AccountCircleIcon />}
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor="rgb(220,220,220)"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={numUsers + " users"}
            subtitle="Total User"
            icon={<AccountCircleIcon />}
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor="rgb(220,220,220)"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={numClasses + " classes"}
            subtitle="Total Classes"
            icon={<ClassIcon />}
          />
        </Box>
      </Box>
    );
  };
  return (
    <GridWrapper>
      <BasicCard header={getHeader()} content={getContent()} />
    </GridWrapper>
  );
};

export default Home;

// // ----------------------------------------------------------------

// import React, { useState, useEffect, useCallback } from "react";
// import BasicCard from "../../components/common/BasicCard/BasicCard";
// import AccountCircleIcon from "@mui/icons-material/AccountCircle";
// import ClassIcon from "@mui/icons-material/Class";
// import Box from "@mui/material/Box";
// import { Button } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import client from "../../api/client";
// import GridWrapper from "../../components/common/GridWrapper/GridWrapper";
// import StatBox from "../../components/StatBox";

// const Dashboard = () => {
//   const [classData, setClassData] = useState([]);
//   const [numClasses, setNumClasses] = useState(0);

//   const [metricData, setMetricData] = useState([]);
//   const [numMetrics, setNumMetrics] = useState(0);

//   const [scheduleData, setScheduleData] = useState([]);
//   const [numSchedules, setNumSchedules] = useState(0);

//   const fetchData = useCallback(async () => {
//     try {
//       const responseClasses = await client.get(
//         "/api/classes/teachers/{teacherId}"
//       );
//       const responseSchedules = await client.get(
//         "/api/schedules/teachers/{teacherId}"
//       );
//       const responseMetrics = await client.get("/api/metric");

//       const classes = responseClasses.data;
//       const metrics = responseMetrics.data;

//       const schedules = responseSchedules.data;

//       setClassData(classes);
//       setMetricData(metrics);

//       setScheduleData(schedules);
//     } catch (error) {
//       console.error(error);
//     }
//   }, []);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   useEffect(() => {
//     setNumClasses(classData.length);
//     setNumMetrics(metricData.length);

//     setNumSchedules(scheduleData.length);
//   }, [classData, metricData, scheduleData]);

//   const getHeader = () => (
//     <Box
//       display="flex"
//       flexDirection={{ xs: "column", sm: "row" }}
//       justifyContent="space-between"
//       alignItems="center"
//       paddingLeft="20px"
//       paddingBottom="20px"
//       paddingTop="10px"
//       paddingRight="10px"
//       flexWrap="wrap"
//     >
//       <Box
//         flex={1}
//         minWidth={{ xs: "100%", sm: 0, md: "500px" }}
//         marginRight={{ xs: 0, sm: "10px" }}
//         marginBottom={{ xs: "10px", sm: 0 }}
//         backgroundColor="#f5f5f5"
//         borderRadius="4px"
//         padding="4px"
//         display="flex"
//         alignItems="center"
//       >
//         <h2>School Management Dashboard</h2>
//       </Box>
//     </Box>
//   );

//   const getContent = () => {
//     return (
//       <Box
//         display="grid"
//         gridTemplateColumns="repeat(12, 1fr)"
//         gridAutoRows="140px"
//         gap="20px"
//       >
//         <Box
//           gridColumn="span 3"
//           backgroundColor="rgb(220,220,220)"
//           display="flex"
//           alignItems="center"
//           justifyContent="center"
//         >
//           <StatBox
//             title={numClasses + " classes"}
//             subtitle="Total Classes"
//             icon={<ClassIcon />}
//           />
//         </Box>

//         <Box
//           gridColumn="span 3"
//           backgroundColor="rgb(220,220,220)"
//           display="flex"
//           alignItems="center"
//           justifyContent="center"
//         >
//           <StatBox
//             title={numSchedules + " schedule"}
//             subtitle="Total Schedules"
//             icon={<AccountCircleIcon />}
//           />
//         </Box>

//         <Box
//           gridColumn="span 3"
//           backgroundColor="rgb(220,220,220)"
//           display="flex"
//           alignItems="center"
//           justifyContent="center"
//         >
//           <StatBox
//             title={numMetrics + " metrics"}
//             subtitle="Total Metrics"
//             icon={<AccountCircleIcon />}
//           />
//         </Box>
//       </Box>
//     );
//   };
//   return (
//     <GridWrapper>
//       <BasicCard header={getHeader()} content={getContent()} />
//     </GridWrapper>
//   );
// };

// export default Dashboard;

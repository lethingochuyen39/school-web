import React, { useState, useEffect, useCallback } from "react";
import BasicCard from "../../components/common/BasicCard/BasicCard";
import ClassIcon from "@mui/icons-material/Class";
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import Box from "@mui/material/Box";
import client from "../../api/client";
import GridWrapper from "../../components/common/GridWrapper/GridWrapper";
import StatBox from "../../components/StatBox";

const Dashboard = () => {
  const [scheduleData, setScheduleData] = useState([]);
  const [numSchedules, setNumSchedules] = useState(0);
  const [classData, setClassData] = useState([]);
  const [numClasses, setNumClasses] = useState(0);
  const [documentData, setDocumentData] = useState([]);
  const [numDocuments, setNumDocuments] = useState(0);
  const [newData, setNewData] = useState([]);
  const [numNews, setNews] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const teacherId = localStorage.getItem("id");

      const responseSchedules = await client.get(`/api/schedules/teachers/${teacherId}`);
      const responseDocuments = await client.get("/api/documents/allDocument");
      const responseClasses = await client.get(`/api/classes/teachers/${teacherId}`);
      const responseNews = await client.get("/api/news/allNew");

      const schedules = responseSchedules.data;
      const documents = responseDocuments.data;
      const classes = responseClasses.data;
      const news = responseNews.data;

      setScheduleData(schedules);
      setDocumentData(documents);
      setClassData(classes);
      setNewData(news);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setNumSchedules(scheduleData.length);
    setNumClasses(classData.length);
    setNumDocuments(documentData.length);
    setNews(newData.length);
  }, [scheduleData, classData, documentData, newData]);

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
            title={numSchedules + " tiết"}
            subtitle="Số tiết học của bạn"
            icon={<CalendarMonthIcon />}
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
            title={numDocuments + " tài liệu"}
            subtitle="Tổng số tài liệu"
            icon={<LibraryBooksIcon />}
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
            title={numNews + " tin tức"}
            subtitle="Tổng số tin tức"
            icon={<NewspaperIcon />}
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
            title={numClasses + " lớp"}
            subtitle="Số lớp học của bạn"
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

export default Dashboard;
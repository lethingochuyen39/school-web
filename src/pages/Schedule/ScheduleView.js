import React, { useEffect, useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
} from "@mui/material";
import client from "../../api/client";

const ScheduleView = ({ classId, refresh, setRefresh }) => {
	const [scheduleData, setScheduleData] = useState([]);
	const [dayOfWeekData, setDayOfWeekData] = useState([]);

	useEffect(() => {
		const fetchScheduleData = async () => {
			try {
				const tietResponse = await client.get("/api/lessons");
				const dayOfWeekResponse = await client.get("/api/dayofweek");
				const tkbResponse = await client.get(`/api/schedules/class/${classId}`);

				const tietData = tietResponse.data;
				const fetchedDayOfWeekData = dayOfWeekResponse.data;
				const tkbData = tkbResponse.data;

				const scheduleRows = tietData.map((t) => {
					const scheduleRow = {
						tietId: t.id,
						tietName: t.name,
						startTime: t.startTime,
						endTime: t.endTime,
					};

					fetchedDayOfWeekData.forEach((d) => {
						const findMon = tkbData.find(
							(m) =>
								m.lesson.id === t.id &&
								m.dayOfWeek.id === d.id &&
								m.status === "Active"
						);

						if (findMon) {
							scheduleRow[d.id] = {
								subjectId: findMon.subject.id,
								subjectName: findMon.subject.name,
								teacherId: findMon.teacher.id,
								teacherName: findMon.teacher.name,
								startTime: findMon.startTime,
								endTime: findMon.endTime,
							};
						} else {
							scheduleRow[d.id] = {
								subjectId: "",
								subjectName: "",
								teacherId: "",
								teacherName: "",
								startTime: "",
								endTime: "",
							};
						}
					});

					return scheduleRow;
				});

				setScheduleData(scheduleRows);
				setDayOfWeekData(fetchedDayOfWeekData);
			} catch (error) {
				console.error("Lôi:", error);
			}
		};

		fetchScheduleData();
	}, [refresh]);

	useEffect(() => {
		if (refresh) {
			setRefresh(false);
		}
	}, [refresh, setRefresh]);

	return (
		<TableContainer component={Paper}>
			<Table sx={{ minWidth: 650 }} aria-label="simple table">
				<TableHead>
					<TableRow>
						<TableCell
							sx={{
								fontWeight: "bold",
								backgroundColor: "#0097a7",
								color: "#FFFFFF",
								textAlign: "center",
								border: "1px solid black",
							}}
						>
							Tiết
						</TableCell>
						{dayOfWeekData.map((d) => (
							<TableCell
								key={d.id}
								align="center"
								sx={{
									fontWeight: "bold",
									color: "#FFFFFF",
									backgroundColor: "#0097a7",
									textAlign: "center",
									border: "1px solid black",
								}}
							>
								{d.name}
							</TableCell>
						))}
					</TableRow>
				</TableHead>
				<TableBody>
					{scheduleData.map((row, i) => (
						<TableRow
							key={i}
							sx={{
								"&:nth-of-type(odd)": {
									backgroundColor: "#e3f2fd",
								},
								"&:last-child td": {
									borderBottom: "none",
								},
							}}
						>
							<TableCell
								sx={{
									fontWeight: "bold",
									width: "100px",
									textAlign: "center",
									whiteSpace: "nowrap",
									border: "1px solid black",
								}}
							>
								{row.tietName}
								<br />( {row.startTime} - {row.endTime})
							</TableCell>
							{dayOfWeekData.map((d) => (
								<TableCell
									key={d.id}
									align="center"
									sx={{
										border: "1px solid black",
									}}
								>
									{row[d.id].subjectName ? (
										<>
											{row[d.id].subjectName} - {row[d.id].teacherName}
										</>
									) : (
										"-"
									)}
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default ScheduleView;

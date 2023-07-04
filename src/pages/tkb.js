import { Divider, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import client from "../api/client";
const Tkb = () => {
	const [tkbTemplate, setTkbTemplate] = useState([]);
	const [dayOfWeekData, setDayOfWeekData] = useState([]);

	useEffect(() => {
		const fetchTkbData = async () => {
			try {
				const tietResponse = await client.get("/api/lessons");
				const dayOfWeekResponse = await client.get("/api/dayofweek");
				const tkbResponse = await client.get(`/api/schedules`);

				const tietData = tietResponse.data;
				const fetchedDayOfWeekData = dayOfWeekResponse.data;
				const tkbData = tkbResponse.data;

				const filledTkbTemplate = tietData.map((t) =>
					fetchedDayOfWeekData.map((d) => {
						const findMon = tkbData.find(
							(m) => m.lesson.id === t.id && m.dayOfWeek.id === d.id
						);

						if (findMon) {
							return {
								tietId: t.id,
								tietName: t.name,
								dayOfWeekId: d.id,
								dayOfWeekName: d.name,
								subjectId: findMon.subject.id,
								subjectName: findMon.subject.name,
								teacherId: findMon.teacher.id,
							};
						}
						return {
							tietId: t.id,
							tietName: t.name,
							dayOfWeekId: d.id,
							dayOfWeekName: d.name,
							subjectId: "",
							subjectName: "",
							teacherId: "",
						};
					})
				);

				setTkbTemplate(filledTkbTemplate);
				setDayOfWeekData(fetchedDayOfWeekData);
			} catch (error) {
				console.error("Error fetching TKB data:", error);
			}
		};

		fetchTkbData();
	}, []);

	return (
		<TableContainer component={Paper}>
			<Table sx={{ minWidth: 650 }} aria-label="simple table">
				<TableHead>
					<TableRow>
						<TableCell align="right">Tiết</TableCell>
						{dayOfWeekData.map((d) => (
							<TableCell key={d.id} align="right">
								{d.name}
							</TableCell>
						))}
					</TableRow>
				</TableHead>
				<TableBody>
					{tkbTemplate.map((row, i) => (
						<TableRow
							key={i}
							sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
						>
							{row.map((d, j) => (
								<TableCell key={j} align="right">
									{j === 0 ? d.tietName : `${d.subjectName}_${d.teacherId}`}
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default Tkb;

// import { Divider, Grid, Typography } from "@mui/material";
// import React, { useEffect, useState } from "react";
// import {
// 	Table,
// 	TableBody,
// 	TableCell,
// 	TableContainer,
// 	TableHead,
// 	TableRow,
// 	Paper,
// } from "@mui/material";
// import client from "../../api/client";

// const ScheduleView = () => {
// 	const [tkbTemplate, setTkbTemplate] = useState([]);
// 	const [dayOfWeekData, setDayOfWeekData] = useState([]);

// 	useEffect(() => {
// 		const fetchTkbData = async () => {
// 			try {
// 				const tietResponse = await client.get("/api/lessons");
// 				const dayOfWeekResponse = await client.get("/api/dayofweek");
// 				const tkbResponse = await client.get(`/api/schedules`);

// 				const tietData = tietResponse.data;
// 				const fetchedDayOfWeekData = dayOfWeekResponse.data;
// 				const tkbData = tkbResponse.data;

// 				const filledTkbTemplate = tietData.map((t) =>
// 					fetchedDayOfWeekData.map((d) => {
// 						const findMon = tkbData.find(
// 							(m) => m.lesson.id === t.id && m.dayOfWeek.id === d.id
// 						);

// 						if (findMon) {
// 							return {
// 								tietId: t.id,
// 								tietName: t.name,
// 								dayOfWeekId: d.id,
// 								dayOfWeekName: d.name,
// 								subjectId: findMon.subject.id,
// 								subjectName: findMon.subject.name,
// 								teacherId: findMon.teacher.id,
// 							};
// 						}
// 						return {
// 							tietId: t.id,
// 							tietName: t.name,
// 							dayOfWeekId: d.id,
// 							dayOfWeekName: d.name,
// 							subjectId: "",
// 							subjectName: "",
// 							teacherId: "",
// 						};
// 					})
// 				);

// 				setTkbTemplate(filledTkbTemplate);
// 				setDayOfWeekData(fetchedDayOfWeekData);
// 			} catch (error) {
// 				console.error("Error fetching TKB data:", error);
// 			}
// 		};

// 		fetchTkbData();
// 	}, []);

// 	return (
// 		<TableContainer component={Paper}>
// 			<Table sx={{ minWidth: 650 }} aria-label="simple table">
// 				<TableHead>
// 					<TableRow>
// 						<TableCell align="right">Tiết</TableCell>
// 						{dayOfWeekData.map((d) => (
// 							<TableCell key={d.id} align="right">
// 								{d.name}
// 							</TableCell>
// 						))}
// 					</TableRow>
// 				</TableHead>
// 				<TableBody>
// 					{tkbTemplate.map((row, i) => (
// 						<TableRow
// 							key={i}
// 							sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
// 						>
// 							{row.map((d, j) => (
// 								<TableCell key={j} align="right">
// 									{j === 0 ? d.tietName : `${d.subjectName}_${d.teacherId}`}
// 								</TableCell>
// 							))}
// 						</TableRow>
// 					))}
// 				</TableBody>
// 			</Table>
// 		</TableContainer>
// 	);
// };
// export default ScheduleView;

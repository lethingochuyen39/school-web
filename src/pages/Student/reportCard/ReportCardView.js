import React, { useEffect, useState } from "react";
import {
    Typography,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
} from "@mui/material";
import client from "../../../api/client";

const ReportCardView = ({ refresh, setRefresh }) => {
    const [reportCardData, setReportCardData] = useState([]);

    useEffect(() => {
		const fetchScoreData = async () => {
			try {
				const studentId = localStorage.getItem("id");

				const reportCardResponse = await client.get(
					`api/report_cards/getReportCard?studentId=${studentId}`
				);

				const fetchedReportCard = reportCardResponse.data;

				const reportCardRows = fetchedReportCard.map((reportCard) => {
					const reportCardRow = {
						description: reportCard.description,
						violate: reportCard.violate,
                        date: reportCard.date,
					};

					return reportCardRow;
				});
                setReportCardData(reportCardRows);
			} catch (error) {
				console.error("Lỗi:", error);
			}
		};

		fetchScoreData();
	}, [refresh]);

    useEffect(() => {
		if (refresh) {
			setRefresh(false);
		}
	}, [refresh, setRefresh]);

    return(
        <>
        <Typography
					variant="h4"
					sx={{
						mb: 2,
						fontWeight: "bold",
						textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)",
						color: "#FF4500",
						textAlign: "center",
					}}
				>
					Hạnh Kiểm
				</Typography>
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
								Vi phạm
							</TableCell>
                            <TableCell
								sx={{
									fontWeight: "bold",
									backgroundColor: "#0097a7",
									color: "#FFFFFF",
									textAlign: "center",
									border: "1px solid black",
								}}
							>
								Mô tả
							</TableCell>
                            <TableCell
								sx={{
									fontWeight: "bold",
									backgroundColor: "#0097a7",
									color: "#FFFFFF",
									textAlign: "center",
									border: "1px solid black",
								}}
							>
								Ngày
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{reportCardData.map((row, i) => (
							<TableRow
								key={i}
								sx={{
									"&:nth-of-type(odd)": {
										backgroundColor: "#e3f2fd",
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
									{row.violate}
								</TableCell>
								<TableCell
									sx={{
										fontWeight: "bold",
										width: "100px",
										textAlign: "center",
										whiteSpace: "nowrap",
										border: "1px solid black",
									}}
								>
									{row.description}
								</TableCell>
                                <TableCell
									sx={{
										fontWeight: "bold",
										width: "100px",
										textAlign: "center",
										whiteSpace: "nowrap",
										border: "1px solid black",
									}}
								>
									{row.date}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
        </>
    );
};



export default ReportCardView;
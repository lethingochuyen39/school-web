import { Divider, Grid, Typography } from "@mui/material";
import React from "react";

import dayOfWeek from "../mock/dayOfWeek";
import tkb from "../mock/tkb";
const Tbk = () => {
	return (
		<Grid container>
			{dayOfWeek.map((day, i) => (
				<Grid item key={day.id} md={2}>
					<Typography variant="h5">{day.name}</Typography>

					<Grid container>
						{tkb
							.filter((d) => d.DayOfWeeek_Id === day.id)
							.map((e) => (
								<React.Fragment>
									<Grid item md={12}>
										<Divider />
										<Divider />
										<Divider />
									</Grid>
									<Grid item md={12}>
										<Grid container>
											<Grid item md={8}>
												<Grid container direction="column">
													<Grid item md={12}>
														<Typography> {e["Subject/mônhọc"]}</Typography>
													</Grid>
													<Grid item md={12}>
														{e.Teacher_id === "" && i <= 4 ? (
															<div style={{ paddingBottom: "5.1px" }}>
																&nbsp;&nbsp;&nbsp;
															</div>
														) : (
															<Typography component="p">
																{e.Teacher_id}
															</Typography>
														)}
													</Grid>
												</Grid>
											</Grid>
										</Grid>
									</Grid>
								</React.Fragment>
							))}
					</Grid>
				</Grid>
			))}
		</Grid>
	);
};

export default Tbk;

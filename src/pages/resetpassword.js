import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../../src/api/AuthContext";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Outlet, useNavigate } from "react-router-dom";
import { forgotpassword, resetpassword } from "../api/client";
// import Cookies from "universal-cookie";
const ResetPassword = () => {
	// const { forgotpassword } = useContext(AuthContext);
	const navigate = useNavigate();
	const defaultTheme = createTheme();

	const forgotpasswordsubmit = async (event) => {
		// const cookies = new Cookies();
		// cookies.remove("token");
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		let payload = {
						password: data.get("password"),
					};
        try{
            resetpassword(payload);
            navigate("/")
        }
        catch(e){
            console.log(e);
        }
	};

	useEffect(() => {
		const role = localStorage.getItem("role");
		// console.log(role);
		if (role === "ADMIN") {
			navigate("/admin/home");
		}
		if (role === "STUDENT" || role === "PARENT") {
			navigate("/user/success");
		}
		if (role === "TEACHER") {
			navigate("/teacher/home");
		}
	});

	return (
		<>
			<ThemeProvider theme={defaultTheme}>
				<Container component="main" maxWidth="xs">
					<CssBaseline />
					<Box
						sx={{
							marginTop: 8,
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
						}}
					>
						<Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
							<LockOutlinedIcon />
						</Avatar>
						<Typography component="h1" variant="h5">
							Get New Password
						</Typography>
						<Box
							component="form"
							onSubmit={forgotpasswordsubmit}
							noValidate
							sx={{ mt: 1 }}
						>
							{/* <TextField
								margin="normal"
								required
								fullWidth
								type="email"
								id="email"
								label="Email Address"
								name="username"
								autoComplete="email"
								autoFocus
							/> */}
							<TextField
								margin="normal"
								required
								fullWidth
								name="password"
								label="New Password"
								type="text"
								id="password"
								autoComplete="current-password"
							/>
							<Button
								type="submit"
								fullWidth
								variant="contained"
								sx={{ mt: 3, mb: 2 }}
							>
								CHANGE
							</Button>
						</Box>
					</Box>
				</Container>
			</ThemeProvider>
		</>
	);
};
export default ResetPassword;

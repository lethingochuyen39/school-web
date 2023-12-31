import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../../src/api/AuthContext";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Outlet, useNavigate } from "react-router-dom";
import { forgotpassword } from "../api/client";
// import Cookies from "universal-cookie";
const ForgotPass = () => {
	// const { forgotpassword } = useContext(AuthContext);
	// localStorage.removeItem("role");
	const navigate = useNavigate();
	const defaultTheme = createTheme();

	const forgotpasswordsubmit = async (event) => {
		// const cookies = new Cookies();
		// cookies.remove("token");
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		let payload = {
			email: data.get("email"),
		};
        try{
            forgotpassword(payload);
            navigate("/login");
        }
        catch(e){
            console.log(e);
        }
	};


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
							Verify Email
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
								name="email"
								label="Email"
								type="text"
								id="email"
								autoComplete="email"
							/>
							<Button
								type="submit"
								fullWidth
								variant="contained"
								sx={{ mt: 3, mb: 2 }}
							>
								Send Verification Code
							</Button>
						</Box>
					</Box>
				</Container>
			</ThemeProvider>
		</>
	);
};
export default ForgotPass;

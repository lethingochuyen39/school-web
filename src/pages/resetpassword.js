import { Avatar, Button, CssBaseline, TextField, Typography } from "@mui/material";
import { Box, Container, ThemeProvider, createTheme } from "@mui/system";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { resetpassword } from "../api/client";

const ResetPassword = ()=>{
	// const { forgotpassword } = useContext(AuthContext);
	const navigate = useNavigate();
	const defaultTheme = createTheme();

	const resetpasssubmit = async (event) => {
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
							Verify Email
						</Typography>
						<Box
							component="form"
							onSubmit={resetpasssubmit}
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
								label="password"
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
								Send Verification Code
							</Button>
						</Box>
					</Box>
				</Container>
			</ThemeProvider>
		</>
	);
}
export default ResetPassword;
import { Avatar, Button, CssBaseline, TextField, Typography } from "@mui/material";
import { Box, Container, ThemeProvider, createTheme } from "@mui/system";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { changepassword } from "../api/client";

const ChangePassword = ()=>{
	// const { forgotpassword } = useContext(AuthContext);
	localStorage.removeItem("role");
	const navigate = useNavigate();
	const defaultTheme = createTheme();

	const forgotpasswordsubmit = async (event) => {
		// const cookies = new Cookies();
		// cookies.remove("token");
		event.preventDefault();
		const data = new FormData(event.currentTarget);
        if(data.get("confirmpass")!==data.get("newpass")){

        }else{
            let payload = {
                id:localStorage.getItem("uid"),
                oldpass:data.get("oldpass"),
                newpass:data.get("newpass")
            };
            changepassword(payload);
            try{
                
                navigate("/login");
            }
            catch(e){
                console.log(e);
            }
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
							Đổi mật khẩu
						</Typography>
						<Box
							component="form"
							onSubmit={forgotpasswordsubmit}
							noValidate
							sx={{ mt: 1 }}
						>
							<TextField
								margin="normal"
								required
								fullWidth
								type="password"
								id="old-pasword"
								label="Mật khẩu cũ"
								name="oldpass"
								autoComplete="password"
								autoFocus
							/>
							<TextField
								margin="normal"
								required
								fullWidth
								name="newpass"
								label="Mật khẩu mới"
								type="password"
								id="new-password"
								autoComplete="password"
							/>
                            <TextField
								margin="normal"
								required
								fullWidth
								name="confirmpass"
								label="Mật khẩu mới"
								type="password"
								id="confirm-password"
								autoComplete="password"
							/>
							<Button
								type="submit"
								fullWidth
								variant="contained"
								sx={{ mt: 3, mb: 2 }}
							>
								Đổi Mật Khẩu
							</Button>
						</Box>
					</Box>
				</Container>
			</ThemeProvider>
		</>
	);
}
export default ChangePassword;
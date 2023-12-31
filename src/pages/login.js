import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../../src/api/AuthContext";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { Alert, IconButton, InputAdornment } from "@mui/material";
import { Label, Visibility, VisibilityOff } from "@mui/icons-material";

// import Cookies from "universal-cookie";
const Login = () => {

	const { login } = useContext(AuthContext);
	const navigate = useNavigate();
	const defaultTheme = createTheme();
  const [error,setError] = useState();

	const loginSubmit = async (event) => {
    
		// const cookies = new Cookies();
		// cookies.remove("token");
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		let payload = {
			username: data.get("username"),
			password: data.get("password"),
		};
		try{
      await login(payload);
    }
    catch(e){
      console.log(e);
      setError('Sai tên đăng nhập hoặc mật khẩu!');
    }
	};
	const [showPassword, setShowPassword] = useState(false);
	const handleClickShowPassword = () => setShowPassword(!showPassword);
	const handleMouseDownPassword = () => setShowPassword(!showPassword);
	useEffect(() => {
		const role = localStorage.getItem("role");
		// console.log(role);
		if (role === "ADMIN") {
			navigate("/admin/home");
		}
		if (role === "STUDENT") {
			navigate("/user/home");
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
              Đăng nhập
            </Typography>

            <Box
              component="form"
              onSubmit={loginSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              {error?<Alert severity="error">{error}</Alert>:null}          
              <TextField
                margin="normal"
                required
                fullWidth
                type="email"
                id="email"
                label="Địa chỉ email"
                name="username"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Mật khẩu"
                // type="password"
                id="password"
                autoComplete="current-password"
                type={showPassword ? "text" : "password"} 
                // onChange={someChangeHandler}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Đăng nhặp
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="/forgotpassword" variant="body2">
                    Quên mật khẩu?
                  </Link>
                </Grid>
                <Grid item xs sx={{paddingLeft: "165px"}}>
                  <Link href="/checkinfo" variant="body2">
                    Lấy tài khoản
                  </Link>
                </Grid>
              </Grid>

            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );

};
export default Login;

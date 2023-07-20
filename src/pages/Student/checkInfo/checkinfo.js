import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Outlet, useNavigate } from "react-router-dom";
import { Divider, FormControl, FormLabel, Grid, Input, Radio, RadioGroup } from "@mui/material";
import { GridRow } from "@mui/x-data-grid";
import { border, borderBottom } from "@mui/system";
import { confirm } from "../../../api/client";
import { useState } from "react";
// import Cookies from "universal-cookie";
const CheckInfo = () => {
  const [state,setState] = useState({ selected: "female" });
  const handleChange = ev => {
    setState({ selected: ev.target.value });
  };
  const { selected } = state;
  // const { forgotpassword } = useContext(AuthContext);
  const navigate = useNavigate();
  const defaultTheme = createTheme();

  const forgotpasswordsubmit = async (event) => {
    // const cookies = new Cookies();
    // cookies.remove("token");
    event.preventDefault();
	const data = new FormData(event.currentTarget);
	console.log(data.get("dob"));
    let payload = {
	  name: data.get("name"),
      dob:data.get("dob"),
	  gender:data.get("gender"),
      email: data.get("email"),
	  phone:data.get("phone"),
    };
	try{
		confirm(payload);
	}catch(e){
		console.log(e.message);
	}
  };
const backHome = ()=>{
	navigate("/")
}

  return (
    <>
	<Button onClick={backHome}>Back</Button>
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
			  borderRadius: '16px' 
            }}
			border={1}
			
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Confirm Information
            </Typography>
            <Box
              component="form"
              onSubmit={forgotpasswordsubmit}
              noValidate
              sx={{ mt: 1 }}
            >
				<Grid>
				<TextField
                margin="normal"
                required
                fullWidth
                name="name"
                label="Tên"
                type="text"
                id="name"
                autoComplete="name"
              />
			  <Divider/>
              <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">
                  Giới Tính
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="gender"
				  onChange={handleChange} value={selected}
                >
                  <FormControlLabel
                    value="female"
                    control={<Radio name="gender"/>}
                    label="Nữ"
                  />
                  <FormControlLabel
                    value="male"
                    control={<Radio  name="gender"/>}
                    label="Nam"
                  />
                  <FormControlLabel
                    value="other"
                    control={<Radio  name="gender"/>}
                    label="Khác"
                  />
                </RadioGroup>
              </FormControl>
			  <Divider/>

              {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]}>
                  <DatePicker label="Basic date picker" />
                </DemoContainer>
              </LocalizationProvider>{" "} */}
			  <Grid>
			  <FormControl>
				<FormLabel id="dob">Ngày sinh</FormLabel>
				<Input id="dob" type="date" name="dob" disableUnderline={true} />
			</FormControl>
			<Divider/>
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
			  </Grid>
				</Grid>
				<TextField
                margin="normal"
                required
                fullWidth
                name="phone"
                label="Số Điện thoại"
                type="number"
                id="phone"
                autoComplete="phone"
              />
			
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Check
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
};
export default CheckInfo;

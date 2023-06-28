import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Schedule from "./pages/Schedule/Schedule";
import Login from "./pages/login";
import Home from "./pages/Home/Home";
import AcademicYear from "./pages/AcademicYear/AcademicYear";
import { AuthContextProvider } from "./api/AuthContext";
import { dashboardTheme } from "./dashboardTheme";
import Score from "./pages/Score/Score";
import LayoutAdmin from "./pages/LayoutAdmin";
import ScoreType from "./pages/ScoreType/ScoreType";
import ClassScorePage from "./pages/Score/ClassScorePage";
import Document from "./pages/Document/Document";
import RoleAccess from "./api/checkRole";
import Success from "./pages/success";
import Class from "./pages/Class/Class";
function App() {
	return (
		<ThemeProvider theme={dashboardTheme}>
			<BrowserRouter>
				<AuthContextProvider>
					<Routes>
						<Route path="/login" element={<Login />} />
						<Route path="/" element={<Login />} />
						<Route element={<RoleAccess roles={["ADMIN"]}/>}>
							<Route path="/admin/" element={<LayoutAdmin />}>
								<Route path="/admin/home" element={<Home />} />
								<Route path="/admin/academicYear" element={<AcademicYear />} />
								<Route path="/admin/schedule" element={<Schedule />} />
								<Route path="/admin/score" element={<Score />} />
								<Route path="/admin/score-type" element={<ScoreType />} />
								<Route
								path="/admin/class-score/:classId"
								element={<ClassScorePage />}
<Route path="/admin/classes" element={<Class/>} />
							/>

							<Route path="/admin/document" element={<Document />} />

							</Route>
						</Route>
						<Route element={<RoleAccess roles={["STUDENT","PARENTS","TEACHER"]} />}>
							<Route path="/user/" element={<LayoutAdmin/>}>
								<Route element={<Success/>} path="/user/success"/>
							</Route>
						</Route>
					</Routes>
				</AuthContextProvider>
			</BrowserRouter>
		</ThemeProvider>
	);
}

export default App;

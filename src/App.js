import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Schedule from "./pages/Schedule/Schedule";
import Login from "./pages/login";
import Home from "./pages/Home/Home";
import AcademicYear from "./pages/AcademicYear/AcademicYear";
import { AuthContextProvider, AuthContext } from "./api/AuthContext";
import { dashboardTheme } from "./dashboardTheme";
import Score from "./pages/Score/Score";
import LayoutAdmin from "./pages/LayoutAdmin";
import ScoreType from "./pages/ScoreType/ScoreType";
function App() {
	return (
		<ThemeProvider theme={dashboardTheme}>
			<BrowserRouter>
				<AuthContextProvider>
					<Routes>
						<Route path="/login" element={<Login />} />
						<Route path="/" element={<Home />} />
						<Route path="/admin/" element={<LayoutAdmin />}>
							<Route path="/admin/home" element={<Home />} />
							<Route path="/admin/academicYear" element={<AcademicYear />} />
							<Route path="/admin/schedule" element={<Schedule />} />
							<Route path="/admin/score" element={<Score />} />
							<Route path="/admin/score-type" element={<ScoreType />} />
						</Route>
					</Routes>
				</AuthContextProvider>
			</BrowserRouter>
		</ThemeProvider>
	);
}

export default App;

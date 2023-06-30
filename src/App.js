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
import ScheduleAdd from "./pages/Schedule/ScheduleAdd";
import ScheduleView from "./pages/Schedule/ScheduleView";
import News from "./pages/News/News";
function App() {
	return (
		<ThemeProvider theme={dashboardTheme}>
			<BrowserRouter>
				<AuthContextProvider>
					<Routes>
						<Route path="/login" element={<Login />} />
						<Route path="/" element={<Login />} />
						<Route path="/admin/" element={<LayoutAdmin />}>
							<Route path="/admin/home" element={<Home />} />
							<Route path="/admin/academicYear" element={<AcademicYear />} />
							<Route path="/admin/schedule" element={<Schedule />} />
							<Route path="/admin/score" element={<Score />} />
							<Route path="/admin/score-type" element={<ScoreType />} />
							<Route
								path="/admin/class-score/:classId"
								element={<ClassScorePage />}
							/>
							<Route path="/admin/document" element={<Document />} />
							<Route path="/admin/news" element={<News />} />
							<Route path="/admin/schedule-add" element={<ScheduleAdd />} />

							<Route
								path="/admin/schedule-view/:id"
								element={<ScheduleView />}
							/>
						</Route>
					</Routes>
				</AuthContextProvider>
			</BrowserRouter>
		</ThemeProvider>
	);
}

export default App;

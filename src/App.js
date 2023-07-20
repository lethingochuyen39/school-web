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
import RoleAccess from "./api/checkRole";
import Success from "./pages/Student/checkInfo/success";
import Class from "./pages/Class/Class";
import UpdateSchedulePage from "./pages/Schedule/UpdateSchedulePage";
import Dashboard from "./pages/Teacher/Dashboard";
import LayoutTeacher from "./pages/LayoutTeacher";
import DocumentTeacherPage from "./pages/Teacher/document/DocumentTeacher";
import Metric from "./pages/Metric/Metric";
import EvaluationRecord from "./pages/EvaluationRecords/EvaluationRecords";
import ReportCard from "./pages/ReportCard/ReportCard";
import ForgotPass from "./pages/forgotpassword";
import CheckInfo from "./pages/Student/checkInfo/checkinfo";

function App() {
	return (
		<ThemeProvider theme={dashboardTheme}>
			<BrowserRouter>
				<AuthContextProvider>
					<Routes>
						<Route path="/login" element={<Login />} />
						<Route path="/" element={<Login />} />
						<Route element={<RoleAccess roles={["ADMIN"]} />}>
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
								<Route path="/admin/classes" element={<Class />} />

								<Route path="/admin/document" element={<Document />} />
								<Route path="/admin/news" element={<News />} />
								<Route path="/admin/schedule-add" element={<ScheduleAdd />} />
								<Route path="/admin/schedule-view" element={<ScheduleView />} />
								<Route
									path="/admin/class-schedule/:classId"
									element={<ScheduleAdd />}
								/>
								<Route
									path="/admin/schedule-update/:scheduleId"
									element={<UpdateSchedulePage />}
								/>
								<Route path="/admin/metric" element={<Metric />} />
								<Route
									path="/admin/evaluationRecord"
									element={<EvaluationRecord />}
								/>
								<Route path="/admin/reportCard" element={<ReportCard />} /> 
							</Route>
						</Route>

						<Route element={<RoleAccess roles={["TEACHER"]} />}>
							<Route path="/teacher/" element={<LayoutTeacher />}>
								<Route path="/teacher/home" element={<Dashboard />} />
								<Route
									path="/teacher/document"
									element={<DocumentTeacherPage />}
								/>
							</Route>
						</Route>

						<Route element={<RoleAccess roles={["STUDENT", "PARENTS"]} />}>
							<Route path="/user/" element={<LayoutAdmin />}>
								<Route element={<Success />} path="/user/success" />
							</Route>
						</Route>
						<Route path="/forgotpassword" element={<ForgotPass />} />
						<Route path="/checkInfo" element={<CheckInfo />} />
					</Routes>
				</AuthContextProvider>
			</BrowserRouter>
		</ThemeProvider>
	);
}

export default App;

import React, { useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
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
import Classes from "./pages/Classes/Classes";
import Subject from "./pages/Subject/Subject";
import Teacher from "./pages/Teacher/Teacher";
import Document from "./pages/Document/Document";
import ScheduleAdd from "./pages/Schedule/ScheduleAdd";
import ScheduleView from "./pages/Schedule/ScheduleView";
import News from "./pages/News/News";
import RoleAccess from "./api/checkRole";
import Success from "./pages/Student/checkInfo/success";
import Dashboard from "./pages/Teacher/Dashboard";
import LayoutTeacher from "./pages/LayoutTeacher";
import DocumentTeacherPage from "./pages/Teacher/document/DocumentTeacher";
import Metric from "./pages/Metric/Metric";
import EvaluationRecord from "./pages/EvaluationRecords/EvaluationRecords";
import ReportCard from "./pages/ReportCard/ReportCard";
import ForgotPass from "./pages/forgotpassword";
import CheckInfo from "./pages/Student/checkInfo/checkinfo";
import ScoreTeacherPage from "./pages/Teacher/score/ScoreTeacherPage";
import ClassScoreTeacherPage from "./pages/Teacher/score/ClassScoreTeacherPage";
import NewsTeacherPage from "./pages/Teacher/news/NewsTeacherPage";
import NewsDetailPage from "./pages/Teacher/news/NewsDetail";
import ScheduleTeacherPage from "./pages/Teacher/schedule/TeacherScheduleView";
import LayoutStudent from "./pages/LayoutStudent";
import StudentHome from "./pages/Student/Home";
import NewsStudentPage from "./pages/Student/news/NewsStudentPage";
import NewsDetailStudentPage from "./pages/Student/news/NewsDetail";
import ReportCardTeacherPage from "./pages/Teacher/reportCard/ReportCardTeacherPage";
import Profile from "./pages/Teacher/profile/Profile";
import EvaluationRecordTeacherPage from "./pages/Teacher/evaluationRecord/EvaluationRecordTeacherPage";
import MetricTeacherPage2 from "./pages/Teacher/metric/MetricTeacherPage2";
import StudentScheduleView from "./pages/Student/schedule/StudentScheduleView";
import DocumentStudentPage from "./pages/Student/document/DocumentStudent";
import ScoreView from "./pages/Student/score/ScoreView";
import ReportCardView from "./pages/Student/reportCard/ReportCardView";
import SubjectTeacherPage from "./pages/Subject/SubjectTeacherPage";
import ResetPassword from "./pages/resetpassword";
import Student from "./pages/Student/StudentAdmin";
import DateChecker from "./components/DateChecker";
import ChangePassword from "./pages/changepassword";
import ViewScorePage from "./pages/Score/ViewScorePage";
import StudentClassPage from "./pages/Classes/StudentClassPage";
function App() {
	// 	const navigate = useNavigate();
	//   useEffect(() => {

	//     let date = new Date(localStorage.getItem("date") * 1000);
	// 	// let date = localStorage.getItem("date");
	//     // console.log(date);
	// 	var unixTime = Date.now();
	//     let dateNow = new Date(unixTime*1000);

	//     if (date < dateNow) {
	//     //   return <Login />;
	// 		navigate('/login');
	//     }
	//   });
	return (
		<ThemeProvider theme={dashboardTheme}>
			<BrowserRouter>
				<AuthContextProvider>
					<DateChecker />
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
								<Route
									path="/admin/view-score/:classId"
									element={<ViewScorePage />}
								/>
								<Route path="/admin/classes" element={<Classes />} />

								<Route path="/admin/document" element={<Document />} />
								<Route path="/admin/news" element={<News />} />
								<Route path="/admin/schedule-add" element={<ScheduleAdd />} />
								<Route path="/admin/schedule-view" element={<ScheduleView />} />
								<Route
									path="/admin/class-schedule/:classId"
									element={<ScheduleAdd />}
								/>
								<Route path="/admin/classes" element={<Classes />} />
								<Route path="/admin/subject" element={<Subject />} />
								<Route
									path="/admin/subject-teacher/:id"
									element={<SubjectTeacherPage />}
								/>
								<Route path="/admin/teacher" element={<Teacher />} />
								<Route path="/admin/student" element={<Student />} />
								<Route path="/admin/metric" element={<Metric />} />
								<Route
									path="/admin/evaluationRecord"
									element={<EvaluationRecord />}
								/>
								<Route path="/admin/reportCard" element={<ReportCard />} />
								<Route
									path="/admin/student-classes/:classId"
									element={<StudentClassPage />}
								/>
							</Route>
						</Route>

            <Route element={<RoleAccess roles={["TEACHER"]} />}>
              <Route path="/teacher/" element={<LayoutTeacher />}>
                <Route path="/teacher/home" element={<Dashboard />} />
                <Route
                  path="/teacher/document"
                  element={<DocumentTeacherPage />}
                />
                <Route path="/teacher/score" element={<ScoreTeacherPage />} />
<Route
                  path="/teacher/class-score/:classId"
                  element={<ClassScoreTeacherPage />}
                />
                <Route
                  path="/teacher/metrics"
                  element={<MetricTeacherPage2 />}
                />
                <Route
                  path="/teacher/reportCards"
                  element={<ReportCardTeacherPage />}
                />
                <Route
                  path="/teacher/evaluationRecords"
                  element={<EvaluationRecordTeacherPage />}
                />
                <Route
                  path="/teacher/profile"
                  element={<Profile />}
                />
                <Route path="/teacher/news" element={<NewsTeacherPage />} />
                <Route
                  path="/teacher/news-detail/:id"
                  element={<NewsDetailPage />}
                />
                <Route
                  path="/teacher/schedule"
                  element={<ScheduleTeacherPage />}
                />
              </Route>
            </Route>

            <Route element={<RoleAccess roles={["STUDENT"]} />}>
              <Route path="/user/" element={<LayoutStudent />}>
                <Route path="/user/home" element={<StudentHome />} />
                <Route path="/user/news" element={<NewsStudentPage />} />
                <Route
                  path="/user/news-detail/:id"
                  element={<NewsDetailStudentPage />}
                />
                <Route
                  path="/user/schedule"
                  element={<StudentScheduleView />}
                />
                <Route
                  path="/user/document"
                  element={<DocumentStudentPage />}
                />
                <Route path="/user/score" element={<ScoreView />} />
                <Route path="/user/reportCard" element={<ReportCardView />} />
              </Route>
            </Route>
            <Route element={<RoleAccess roles={["STUDENT","TEACHER"]}/>}>
              <Route element={<LayoutStudent/>}>
              <Route
                  path="/user/changepasswords"
                  element={<ChangePassword />}
                />
              </Route>
              <Route element={<LayoutTeacher/>}>
              <Route
                  path="/teacher/changepasswords"
                  element={<ChangePassword />}
                />
              </Route>
            </Route>
            <Route path="/forgotpassword" element={<ForgotPass />} />
            <Route path="/reset_password" element={<ResetPassword />} />
            <Route path="/checkInfo" element={<CheckInfo />} />
          </Routes>
        </AuthContextProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

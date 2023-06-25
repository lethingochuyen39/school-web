import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ClassScorePage = ({ classId }) => {
	const [subjectId, setSubjectId] = useState("");
	const [scoreType, setScoreType] = useState("");
	const [scores, setScores] = useState([]);
	const [error, setError] = useState("");

	// Lấy danh sách học sinh của lớp dựa trên classId
	useEffect(() => {
		const fetchClassScores = async () => {
			try {
				// Gọi API để lấy danh sách điểm của lớp với classId
				const response = await client.get(`/api/class-scores/${classId}`);
				setScores(response.data);
			} catch (error) {
				console.error(error);
				if (error.response) {
					setError(error.response.data);
				} else {
					setError("Đã xảy ra lỗi khi lấy danh sách điểm lớp.");
				}
			}
		};

		fetchClassScores();
	}, [classId]);

	// Xử lý sự kiện thay đổi môn học
	const handleSubjectChange = (event) => {
		setSubjectId(event.target.value);
	};

	// Xử lý sự kiện thay đổi loại điểm
	const handleScoreTypeChange = (event) => {
		setScoreType(event.target.value);
	};

	// Xử lý sự kiện nhập điểm cho học sinh
	const handleScoreChange = (event, studentId) => {
		const updatedScores = scores.map((score) => {
			if (score.studentId === studentId) {
				return { ...score, score: event.target.value };
			}
			return score;
		});
		setScores(updatedScores);
	};

	// Xử lý sự kiện nhấn nút "Lưu điểm"
	const handleSaveScores = async () => {
		try {
			// Gọi API để lưu danh sách điểm của lớp
			await client.post("/api/class-scores", {
				classId,
				subjectId,
				scoreType,
				scores,
			});
			// Thực hiện các xử lý tương ứng, ví dụ thông báo lưu thành công
		} catch (error) {
			console.error(error);
			if (error.response) {
				setError(error.response.data);
			} else {
				setError("Đã xảy ra lỗi khi lưu danh sách điểm lớp.");
			}
		}
	};

	// Xử lý sự kiện nhấn nút "Quay lại"
	const handleBack = () => {
		// Thực hiện các xử lý tương ứng, ví dụ chuyển hướng về trang trước đó
	};

	// Render form nhập điểm cho lớp
	const renderScoreForm = () => {
		return (
			<div>
				<h2>Nhập điểm lớp</h2>
				<div>
					<label htmlFor="subject">Môn học:</label>
					<select id="subject" value={subjectId} onChange={handleSubjectChange}>
						{/* Render các tùy chọn môn học */}
					</select>
				</div>
				<div>
					<label htmlFor="scoreType">Loại điểm:</label>
					<select
						id="scoreType"
						value={scoreType}
						onChange={handleScoreTypeChange}
					>
						{/* Render các tùy chọn loại điểm */}
					</select>
				</div>
				<h3>Danh sách học sinh:</h3>
				<table>
					<thead>
						<tr>
							<th>ID</th>
							<th>Tên học sinh</th>
							<th>Điểm</th>
						</tr>
					</thead>
					<tbody>
						{scores.map((score) => (
							<tr key={score.studentId}>
								<td>{score.studentId}</td>
								<td>{score.studentName}</td>
								<td>
									<input
										type="text"
										value={score.score}
										onChange={(event) =>
											handleScoreChange(event, score.studentId)
										}
									/>
								</td>
							</tr>
						))}
					</tbody>
				</table>
				<button onClick={handleSaveScores}>Lưu điểm</button>
				<button onClick={handleBack}>Quay lại</button>
			</div>
		);
	};

	return (
		<div>
			{error && <p>{error}</p>}
			{renderScoreForm()}
		</div>
	);
};

export default ClassScorePage;

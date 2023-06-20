import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const AddForm = ({ handleAddAcademicYear }) => {
	const [newAcademicYear, setNewAcademicYear] = useState({
		name: "",
		startDate: "",
		endDate: "",
	});

	const handleChange = (event) => {
		setNewAcademicYear((prev) => ({
			...prev,
			[event.target.name]: event.target.value,
		}));
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		handleAddAcademicYear(newAcademicYear);
		setNewAcademicYear({
			name: "",
			startDate: "",
			endDate: "",
		});
	};

	return (
		<form onSubmit={handleSubmit}>
			<TextField
				name="name"
				label="Name"
				value={newAcademicYear.name}
				onChange={handleChange}
				fullWidth
				margin="normal"
				variant="outlined"
			/>
			<TextField
				name="startDate"
				label="Start Date"
				value={newAcademicYear.startDate}
				onChange={handleChange}
				fullWidth
				margin="normal"
				variant="outlined"
			/>
			<TextField
				name="endDate"
				label="End Date"
				value={newAcademicYear.endDate}
				onChange={handleChange}
				fullWidth
				margin="normal"
				variant="outlined"
			/>
			<Button type="submit" variant="contained" color="primary">
				Add
			</Button>
		</form>
	);
};

export default AddForm;

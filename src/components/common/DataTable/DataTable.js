import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const DataTable = ({
	initialRows,
	columns,
	loading,
	handleView,
	handleEdit,
	handleDelete,
}) => {
	const [rows, setRows] = useState([]);

	useEffect(() => {
		setRows(initialRows);
	}, [initialRows]);

	const renderCellActions = (params) => (
		<>
			<IconButton
				onClick={() => handleView(params.id)}
				style={{ color: "#888" }}
			>
				<VisibilityIcon />
			</IconButton>
			<IconButton
				onClick={() => handleEdit(params.id)}
				style={{ color: "#00bcd4" }}
			>
				<EditIcon />
			</IconButton>
			<IconButton
				onClick={() => {
					const shouldDelete = window.confirm("Bạn có chắc muốn xóa?");
					if (shouldDelete) {
						handleDelete(params.id);
					}
				}}
				style={{ color: "#f44336" }}
			>
				<DeleteIcon />
			</IconButton>
		</>
	);
	const renderCellCheckbox = (params) => (
		<input
			type="checkbox"
			checked={params.value}
			onChange={(event) => event.stopPropagation()}
		/>
	);

	const [selectedRows, setSelectedRows] = useState([]);
	const handleSelectionModelChange = (newSelection) => {
		setSelectedRows(newSelection);
	};

	const columnsWithActions = [
		{
			field: "checkbox",
			headerName: "",
			width: 50,
			sortable: false,
			renderCell: renderCellCheckbox,
		},
		...columns,
		{
			field: "actions",
			headerName: "Chức năng",
			width: 150,
			renderCell: renderCellActions,
		},
	];

	return (
		<div style={{ height: 400, width: "100%" }}>
			<DataGrid
				rows={rows}
				columns={columnsWithActions}
				loading={loading}
				// checkboxSelection
				onSelectionModelChange={handleSelectionModelChange}
				disableSelectionOnClick
				pagination
				pageSize={10}
				rowsPerPageOptions={[10, 25, 50]}
			/>
		</div>
	);
};

export default DataTable;

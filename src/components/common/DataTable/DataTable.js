import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const DataTable = ({
	initialRows,
	columns,
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
				onClick={() => handleDelete(params.id)}
				style={{ color: "#f44336" }}
			>
				<DeleteIcon />
			</IconButton>
		</>
	);

	const columnsWithActions = [
		...columns,
		{
			field: "actions",
			headerName: "Chức năng",
			width: 200,
			renderCell: renderCellActions,
		},
	];

	return (
		<div style={{ height: 400, width: "100%" }}>
			<DataGrid
				rows={rows}
				columns={columnsWithActions}
				loading={!rows.length}
				checkboxSelection
				pagination
				pageSize={10}
				rowsPerPageOptions={[10, 25, 50]}
			/>
		</div>
	);
};

export default DataTable;

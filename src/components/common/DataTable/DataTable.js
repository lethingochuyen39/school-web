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
	hiddenActions = [],
}) => {
	const [rows, setRows] = useState([]);

	useEffect(() => {
		setRows(initialRows);
	}, [initialRows]);

	const renderCellActions = (params) => (
		<>
			{!hiddenActions.includes("view") && (
				<IconButton
					onClick={() => handleView(params.id)}
					style={{ color: "#888" }}
				>
					<VisibilityIcon />
				</IconButton>
			)}
			{!hiddenActions.includes("edit") && (
				<IconButton
					onClick={() => handleEdit(params.id)}
					style={{ color: "#00bcd4" }}
				>
					<EditIcon />
				</IconButton>
			)}
			{!hiddenActions.includes("delete") && (
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
			)}
		</>
	);

	// const renderCellCheckbox = (params) => (
	// 	<input
	// 		type="checkbox"
	// 		checked={params.value}
	// 		onChange={(event) => event.stopPropagation()}
	// 	/>
	// );

	const [selectedRows, setSelectedRows] = useState([]);
	const handleSelectionModelChange = (newSelection) => {
		setSelectedRows(newSelection);
	};

	const columnsWithActions = [
		// {
		// 	field: "checkbox",
		// 	headerName: "",
		// 	width: 50,
		// 	sortable: false,
		// renderCell: renderCellCheckbox,
		// },
		...columns,
		{
			field: "actions",
			headerName: "Chức năng",
			width: 150,
			renderCell: renderCellActions,
		},
	];
	// Kiểm tra nếu tất cả các hành động đều bị ẩn thì không hiển thị cột chức năng
	const shouldHideActionsColumn = hiddenActions.length === 3;
	return (
		<div style={{ height: 450, width: "100%", marginBottom: "10px" }}>
			<DataGrid
				rows={rows}
				columns={shouldHideActionsColumn ? columns : columnsWithActions}
				loading={loading}
				onSelectionModelChange={handleSelectionModelChange}
				disableSelectionOnClick
				pagination={true}
				pageSize={10}
				// rowsPerPageOptions={[25, 50, 100]}
			/>
		</div>
	);
};

export default DataTable;

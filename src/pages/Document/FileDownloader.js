import React from "react";
import client from "../../api/client";

const FileDownloader = ({ url, fileName }) => {
	const handleDownload = async () => {
		try {
			const response = await client.get(url, {
				responseType: "blob",
			});

			const downloadUrl = window.URL.createObjectURL(response.data);
			const link = document.createElement("a");
			link.href = downloadUrl;
			link.download = fileName;
			link.click();
			window.URL.revokeObjectURL(downloadUrl);
		} catch (error) {
			console.error(error);
		}
	};

	return <button onClick={handleDownload}>Tải xuống</button>;
};

export default FileDownloader;

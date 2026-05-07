import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DeleteDialog from "./DeleteDialog";
import Target from "./Target";

import { useToast } from "./context/Toast";

export default function Dashboard() {
	const [targets, setTargets] = useState([]);
	const [name, setName] = useState("");
	const [url, setUrl] = useState("");

	const { showHideToast } = useToast();

	const navigate = useNavigate();
	const token = localStorage.getItem("token");

	const addTarget = async (e) => {
		e.preventDefault();

		try {
			await axios.post(
				"https://vigil-rust.vercel.app/api/targets",
				{
					name,
					url,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);

			getTarget();
			setUrl("");
			setName("");
		} catch {
			showHideToast("Invalid request", "error");
		}
	};

	const deleteTarget = async (id) => {
		try {
			await axios.delete(`https://vigil-rust.vercel.app/api/targets/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			getTarget();
			showHideToast("Deleted successfully", "success");
		} catch {
			showHideToast("Deletion failed", "error");
		}
	};

	const toggleTarget = async (id) => {
		try {
			await axios.patch(
				`https://vigil-rust.vercel.app/api/targets/${id}/toggle`,
				{},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);

			getTarget();
			showHideToast("successful Target Status change", "success");
		} catch {
			showHideToast("failed Target Status change", "error");
		}
	};

	const getTarget = useCallback(() => {
		axios
			.get("https://vigil-rust.vercel.app/api/targets", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((response) => {
				console.log(response.data.targets);
				setTargets(response.data.targets);
			});
	}, [token]);

	useEffect(() => {
		getTarget();
	}, [getTarget]);

	return (
		<div className="min-h-screen bg-gray-100">
			{/* Navbar */}

			<div className="bg-white shadow flex justify-between items-center px-6 py-4">
				<h1 className="text-xl font-semibold">Vigil Dashboard</h1>

				<button
					className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
					onClick={() => {
						localStorage.removeItem("token");
						navigate("/login");
					}}
				>
					Logout
				</button>
			</div>

			{/* Content */}

			<div className="p-6">
				{/* Stats */}

				<div className="grid grid-cols-3 gap-4 mb-6">
					<div className="bg-white rounded-lg shadow p-4">
						<p className="text-gray-500 text-sm">Total Targets</p>
						<h2 className="text-3xl font-bold">{targets.length}</h2>
					</div>

					<div className="bg-white rounded-lg shadow p-4">
						<p className="text-gray-500 text-sm">Active</p>
						<h2 className="text-3xl font-bold text-green-500">
							{targets.filter((t) => t.isActive).length}
						</h2>
					</div>

					<div className="bg-white rounded-lg shadow p-4">
						<p className="text-gray-500 text-sm">Down</p>
						<h2 className="text-3xl font-bold text-red-500">
							{targets.filter((t) => !t.isActive).length}
						</h2>
					</div>
				</div>

				{/* new target */}

				<div className="bg-white rounded-lg shadow p-4 mb-4 border-b grid gap-4">
					<h2 className="text-lg font-semibold">Targets</h2>

					<form
						onSubmit={addTarget}
						className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full"
					>
						<input
							type="text"
							placeholder="Enter URL"
							value={url}
							onChange={(e) => setUrl(e.target.value)}
							className="border rounded px-3 py-2 w-full"
						/>

						<input
							type="text"
							placeholder="Enter Name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="border rounded px-3 py-2 w-full"
						/>

						<button
							disabled={!(name && url)}
							type="submit"
							className={`${name && url ? "bg-blue-600" : "bg-blue-300"} text-white px-4 py-2 rounded w-full lg:w-auto`}
						>
							Add Target
						</button>
					</form>
				</div>

				<DeleteDialog />
				{/* Table */}

				<div className="bg-white rounded-lg shadow ">
					<table className="w-full text-sm">
						<thead className="bg-gray-50 text-gray-600">
							<tr>
								<th className="p-3 text-left  ">URL</th>
								<th className="p-3 text-center">Status</th>
								<th className="p-3 text-center">Response Time</th>
								<th className="p-3 text-center">Actions</th>
							</tr>
						</thead>

						<tbody>
							{targets.map((target) => (
								<Target
									key={target._id}
									target={target}
									toggleTarget={toggleTarget}
									deleteTarget={deleteTarget}
								/>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}

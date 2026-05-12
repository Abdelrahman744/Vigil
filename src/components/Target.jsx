export default function Target({ target, toggleTarget, deleteTarget }) {
	const isUp = target.currentStatus === "Up";
	return (
		<tr className="border-t">
			<td className="p-3">{target.url}</td>

			<td className="text-center">
				<span
					className={`py-1 rounded text-xs font-medium ${
						isUp
							? "bg-green-100 text-green-700 px-4"
							: "bg-red-100 text-red-700 px-2"
					}`}
				>
					{isUp ? "Up" : "Down"}
				</span>
			</td>

			<td className="space-x-2 text-center">
				{Math.round(Number(target?.stats?.averageLatency || 0)) || "- "} ms
			</td>

			<td className="space-x-2 text-center">
				<button
					onClick={() => toggleTarget(target._id)}
					className={`${
						target.isActive
							? "bg-yellow-400 px-5 hover:bg-yellow-500"
							: "bg-green-400 px-3 hover:bg-green-500"
					} py-1 text-white rounded`}
				>
					{target.isActive ? "Pause" : "Activate"}
				</button>

				<button
					onClick={() => deleteTarget(target._id)}
					className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
				>
					Delete
				</button>
			</td>
		</tr>
	);
}

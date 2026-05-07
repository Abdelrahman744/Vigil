import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export default function SnackBar({ open, message, type }) {
	return (
		<div>
			<Snackbar open={open} autoHideDuration={3000}>
				<Alert severity={type} variant="filled" sx={{ width: "100%" }}>
					{message}
				</Alert>
			</Snackbar>
		</div>
	);
}

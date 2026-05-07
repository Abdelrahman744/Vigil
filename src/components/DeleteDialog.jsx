import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";

import { useToast } from "./context/Toast";

export default function DeleteDialog() {
	const [open, setOpen] = React.useState(false);

	const { showHideToast } = useToast();

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleOk = async () => {
		const token = localStorage.getItem("token");

		try {
			await axios.delete("https://vigil-rust.vercel.app/api/targets", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			handleClose();
			window.location.reload();
			showHideToast("Target has been deleted", "success");
		} catch (error) {
			showHideToast("deletion failed", "error");
			console.log(error);
		}
	};
	return (
		<React.Fragment>
			<Button
				variant="outlined"
				onClick={handleClickOpen}
				fullWidth
				sx={{
					backgroundColor: "#ef4444",
					fontWeight: "bold",
					color: "white",
					marginBottom: "20px",
					border: "none",
					padding: "8px 0",
					":hover": { backgroundColor: "#dc2626" },
				}}
			>
				Delete all Target
			</Button>
			<Dialog
				open={open}
				onClose={handleClose}
				disableRestoreFocus
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">
					{"Are you sure about this ?"}
				</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						By pressing OK, all targets will be permanently deleted.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>cancel</Button>
					<Button onClick={handleOk}>ok</Button>
				</DialogActions>
			</Dialog>
		</React.Fragment>
	);
}

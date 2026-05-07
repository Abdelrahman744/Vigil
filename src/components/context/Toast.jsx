import { createContext, useState, useContext } from "react";
import SnackBar from "../SnackBar";
const ToastContext = createContext({});

export const ToastProvider = ({ children }) => {
	const [open, setOpen] = useState(false);
	const [message, setMessage] = useState("");
	const [type, setType] = useState("success");

	function showHideToast(message, toastType) {
		setOpen(true);
		setMessage(message);
		setType(toastType);
		setTimeout(() => {
			setOpen(false);
		}, 3000);
	}
	return (
		<ToastContext.Provider value={{ showHideToast }}>
			<SnackBar open={open} message={message} type={type} />
			{children}
		</ToastContext.Provider>
	);
};

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
	return useContext(ToastContext);
};

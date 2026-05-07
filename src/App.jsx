import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import { ToastProvider } from "./components/context/Toast";

import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { Component } from "react";

function App() {
	return (
		<>
			<ToastProvider>
				<Routes>
					<Route path="/" element={<Navigate to="/login" />} />
					<Route path="/register" element={<Auth />} />
					<Route path="/login" element={<Auth />} />
					<Route path="/dashboard" element={<Dashboard />} />
				</Routes>
			</ToastProvider>
		</>
	);
}

export default App;

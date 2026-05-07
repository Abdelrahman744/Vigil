import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "./context/Toast";
export default function Auth() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [loading, setLoading] = useState(false);

	const { showHideToast } = useToast();

	const navigate = useNavigate();

	const isLogin = useLocation().pathname === "/login";

	const handleSubmit = (e) => {
		e.preventDefault();
		setLoading(true);

		if (isLogin) {
			axios
				.post(
					"https://vigil-rust.vercel.app/api/login",
					{
						email,
						password,
					},
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem("token")}`,
						},
					},
				)
				.then(function (response) {
					localStorage.setItem("token", response.data.token);
					showHideToast("Login successful", "success");
					navigate("/dashboard");
				})
				.catch(function () {
					showHideToast("Register failed", "error");
				});
		} else {
			axios
				.post("https://vigil-rust.vercel.app/api/signup", {
					name,
					email,
					password,
				})
				.then(function () {
					showHideToast("Register successful", "success");
					navigate("/login");
				})
				.catch(function () {
					showHideToast("Register failed", "error");
				});
		}
		setLoading(false);
	};

	return (
		<div
			className={`min-h-screen flex items-center justify-center ${isLogin ? "bg-linear-to-br from-blue-300/60 via-blue-100 to-white" : "bg-linear-to-br from-emerald-200/60 via-emerald-100 to-white"}`}
		>
			<div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
				<h2 className="text-2xl font-bold text-center mb-6">
					{isLogin ? "Login" : "Create Account"}
				</h2>
				<hr className="m-4 ..." />

				<form onSubmit={handleSubmit} className="space-y-4">
					{!isLogin && (
						<div>
							<label className="block mb-1 text-sm font-medium">Name</label>
							<input
								type="text"
								className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Enter your name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
							/>
						</div>
					)}
					<div>
						<label className="block mb-1 text-sm font-medium">Email</label>
						<input
							type="email"
							className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Enter your email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>

					<div>
						<label className="block mb-1 text-sm font-medium">Password</label>
						<input
							type="password"
							className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder={
								isLogin ? "Enter your password" : "Create a password"
							}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>

					<button
						type="submit"
						disabled={loading}
						className={`${
							isLogin
								? "bg-blue-600  hover:bg-blue-700"
								: "bg-green-600  hover:bg-green-700"
						} w-full text-white py-2 rounded-lg transition`}
					>
						{loading ? "loading..." : isLogin ? "Login" : "Register"}
					</button>
				</form>
				<hr className="m-2 ..." />
				<p className="text-center mt-4">
					{isLogin ? "Don't have account?" : "Already have account?"}

					<Link
						to={isLogin ? "/register" : "/login"}
						className={`${
							isLogin ? "text-blue-600" : "text-green-600"
						} hover:underline`}
					>
						{isLogin ? " Register" : " Login"}
					</Link>
				</p>
			</div>
		</div>
	);
}

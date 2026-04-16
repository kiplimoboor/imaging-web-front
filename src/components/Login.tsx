import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

type Credentials = { email: string | null; password: string | null };

function Login() {
	const [step, setStep] = useState<"gate" | "identify" | "login" | "onboarding">("gate");
	const [errors, setErrors] = useState({ login: "", newPass: "", confirmPass: "" });
	const [setup, setSetup] = useState({ newPass: "", confirmPass: "" });
	const [credentials, setCredentials] = useState<Credentials>({ email: null, password: null });

	const handleNext = async () => {
		if (step === "identify") {
			try {
				const res = await fetch(API_URL + "/external/user/" + credentials.email);
				if (res.status !== 200) {
					const error = await res.json().catch(() => ({}));
					throw new Error(error.error || "internal server error");
				}
				const data = await res.json();
				setErrors((prev) => ({ ...prev, login: "" }));
				if (data.firstLogin) {
					setStep("onboarding");
				} else {
					setStep("login");
				}
			} catch (e) {
				setErrors((prev) => ({ ...prev, login: "An error occurred." }));
				console.error(e);
			}
		}

		if (step === "onboarding") {
			const { newPass, confirmPass } = setup;
			if (newPass !== confirmPass) {
				setErrors((prev) => ({ ...prev, login: "Passwords do not match" }));
				return;
			}

			const res = await fetch(API_URL + "/external/user/" + credentials.email + "/onboard-password", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ password: newPass }),
			});
			if (res.status === 200) {
				setErrors((prev) => ({ ...prev, login: "" }));
				setStep("identify");
			} else {
				setErrors((prev) => ({ ...prev, login: "An error occurred." }));
			}
		}

		if (step === "login") {
			const { email, password } = credentials;
			try {
				const res = await fetch(API_URL + "/oauth/login", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
					body: JSON.stringify({ email, password }),
				});
				if (res.status === 200) {
					setErrors((prev) => ({ ...prev, login: "" }));
					window.location.href = "/";
				} else if (res.status === 401) {
					setErrors((prev) => ({ ...prev, login: "Invalid login credentials" }));
					return;
				} else {
					const error = await res.json().catch(() => ({}));
					throw new Error(error.error || "internal server error");
				}
			} catch (e) {
				setErrors((prev) => ({ ...prev, login: "An error occurred." }));
				console.error(e);
			}
		}
	};

	const deactivateBasicAuth = async () => {
		setCredentials({ email: null, password: null });
		setErrors({ login: "", newPass: "", confirmPass: "" });
		setStep("gate");
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-slate-50">
			<div className="absolute inset-0 z-0 opacity-5 pointer-events-none">
				<svg width="100%" height="100%">
					<pattern id="pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
						<path d="M20 0v40M0 20h40" fill="none" stroke="currentColor" strokeWidth="1" />
					</pattern>
					<rect width="100%" height="100%" fill="url(#pattern)" />
				</svg>
			</div>

			<div className="relative z-10 w-full max-w-md p-8 bg-white shadow-2xl border border-slate-200">
				<div className="text-center mb-10">
					<div className="flex justify-center mb-6">
						<img src="/mtrh.svg" alt="MTRH Logo" className="h-20 w-auto object-contain" />
					</div>
					<h1 className="text-2xl ">Radiology</h1>
				</div>
				{step === "gate" && (
					<div className="space-y-6">
						<a
							href="/"
							className="flex items-center justify-center w-full py-4 px-4 text-white bg-blue-600 hover:bg-blue-700 font-bold transition-all duration-200"
						>
							LOG IN WITH ERPNEXT
						</a>

						<div className="relative flex items-center py-2">
							<div className="flex-grow border-t border-slate-300"></div>
							<span className="flex-shrink mx-4 text-slate-400 text-xs font-bold tracking-widest">OR</span>
							<div className="flex-grow border-t border-slate-300"></div>
						</div>

						<div className="text-center">
							<p className="text-sm text-slate-600 mb-4">No ERP Account?</p>
							<button
								onClick={() => setStep("identify")}
								className="w-full py-3 px-4 border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold transition-colors text-sm uppercase"
							>
								Log in with email address
							</button>
						</div>
					</div>
				)}

				{errors.login && <ErrorMessage message={errors.login} />}

				{(step === "identify" || step === "login") && (
					<input
						type="email"
						className="w-full p-3 border border-slate-300 rounded-none focus:ring-1 focus:ring-blue-500 outline-none transition-all text-center"
						placeholder="enter email address"
						value={credentials.email || ""}
						onChange={(e) => setCredentials({ ...credentials, email: e.currentTarget.value })}
					/>
				)}

				{step === "login" && (
					<input
						type="password"
						className={`w-full p-3 border border-slate-300 rounded-none focus:ring-1 focus:ring-blue-500 outline-none transition-all text-center ${credentials.email ? "mt-2" : ""}`}
						placeholder="enter password"
						onChange={(e) => setCredentials({ ...credentials, password: e.currentTarget.value })}
					/>
				)}

				{step === "onboarding" && (
					<>
						<p className="text-sm mt-3 text-center">
							We have noticed that this is your first login attempt. Please create a password.
						</p>

						<input
							type="password"
							className={`w-full p-3 border border-slate-300 rounded-none focus:ring-1 focus:ring-blue-500 outline-none transition-all text-center ${credentials.email ? "mt-2" : ""}`}
							placeholder="new password"
							onChange={(e) => setSetup({ ...setup, newPass: e.currentTarget.value })}
						/>

						<input
							type="password"
							className={`w-full p-3 border border-slate-300 rounded-none focus:ring-1 focus:ring-blue-500 outline-none transition-all text-center ${credentials.email ? "mt-2" : ""}`}
							placeholder="confirm password"
							onChange={(e) => setSetup({ ...setup, confirmPass: e.currentTarget.value })}
						/>
					</>
				)}

				{step !== "gate" && (
					<>
						<button
							className={
								step === "login"
									? "w-full py-3 px-4 bg-blue-600 text-white hover:bg-blue-700 font-bold transition-colors text-sm uppercase mt-2"
									: `w-full py-3 px-4 border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold transition-colors text-sm uppercase mt-2`
							}
							onClick={handleNext}
						>
							{step === "login" ? "Login" : "Next"}
						</button>

						<div className="flex items-center justify-center mt-6 flex-col text-slate-700">
							<p className="text-sm">Want to use your MTRH ERP Account?</p>
							<p className="mt-2 cursor-pointer hover:text-blue-500" onClick={deactivateBasicAuth}>
								Login with ERPNext
							</p>
						</div>
					</>
				)}
				<footer className="mt-12 text-center">
					<p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
						&copy; {new Date().getFullYear()} Moi Teaching and Referral Hospital
					</p>
				</footer>
			</div>
		</div>
	);
}

function ErrorMessage({ message }: { message: string }) {
	return <p className="text-center my-3 text-sm font-medium text-red-600">{message}</p>;
}

export default Login;

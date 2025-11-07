import React from "react";

function Login() {
	const [bgColor, setBgColor] = React.useState("#2563eb");

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
			<div className="text-center">
				<h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">MTRH Radiology Department</h1>
				<p className="mt-4 text-lg sm:text-xl text-gray-700 max-w-xl mx-auto">Welcome to MTRH Radiology</p>

				<div style={{ marginTop: "2rem" }}>
					<a
						href="/"
						style={{
							display: "inline-block",
							padding: "0.75rem 2rem",
							fontSize: "1.125rem",
							fontWeight: 600,
							color: "#ffffff",
							backgroundColor: bgColor,
							transition: "background-color 0.3s ease",
							textDecoration: "none",
							cursor: "pointer",
						}}
						onMouseOver={() => setBgColor("#1d4ed8")}
						onMouseOut={() => setBgColor("#2563eb")}
					>
						Log in with ERPNext
					</a>
				</div>
			</div>
		</div>
	);
}

export default Login;

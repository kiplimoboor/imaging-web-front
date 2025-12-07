import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router";
import StudiesLayout from "@/components/StudiesLayout.tsx";
import AllStudies from "@/components/studies/tables/AllStudies";
import UsersPage from "@/pages/Users/UsersPage.tsx";
import Unauthorized from "./components/401.tsx";
import AuthCallback from "./components/AuthCallback";
import Dashboard from "./components/Dashboard.tsx";
import Index from "./components/Index.tsx";
import LoadingSpinner from "./components/LoadingSpinner.tsx";
import Login from "./components/Login.tsx";
import CompletedStudies from "./components/studies/tables/CompletedStudies.tsx";
import NewStudies from "./components/studies/tables/NewStudies";
import { AuthProvider } from "./context/AuthContext";
import { AdminRoutes, PrivateRoutes } from "./routes/AppRoutes";

const Viewer = lazy(() => import("./components/Viewer.tsx"));

const queryClient = new QueryClient();
function App() {
	return (
		<div className="font-inter">
			<QueryClientProvider client={queryClient}>
				<AuthProvider>
					<Routes>
						<Route path="/dashboard" element={<Dashboard />} />
						<Route path="/login" element={<Login />} />
						<Route path="/auth" element={<AuthCallback />} />
						<Route path="/401" element={<Unauthorized />} />

						<Route element={<PrivateRoutes />}>
							<Route path="/" element={<Index />} />
							<Route
								path="/all"
								element={
									<StudiesLayout>
										<AllStudies />
									</StudiesLayout>
								}
							/>

							<Route element={<AdminRoutes />}>
								<Route path="/users" element={<UsersPage />} />

								<Route
									path="/completed"
									element={
										<StudiesLayout>
											<CompletedStudies />
										</StudiesLayout>
									}
								/>

								<Route
									path="/new"
									element={
										<StudiesLayout>
											<NewStudies />
										</StudiesLayout>
									}
								/>
							</Route>

							<Route
								path="/viewer/:uid"
								element={
									<Suspense fallback={<LoadingSpinner message="Loading Viewer" />}>
										<Viewer />
									</Suspense>
								}
							/>
						</Route>
					</Routes>
				</AuthProvider>
				<ReactQueryDevtools initialIsOpen={false} />
			</QueryClientProvider>
		</div>
	);
}

export default App;

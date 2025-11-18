import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router";
import AllStudies from "@/components/studies/tables/AllStudies";
import UsersPage from "@/pages/Users/UsersPage.tsx";
import Unauthorized from "./components/401.tsx";
import AuthCallback from "./components/AuthCallback";
import LoadingSpinner from "./components/LoadingSpinner.tsx";
import Login from "./components/Login.tsx";
import CompletedStudies from "./components/studies/tables/CompletedStudies.tsx";
import StudiesIndex from "./components/studies/tables/IndexStudies.tsx";
import NewStudies from "./components/studies/tables/NewStudies";
import { AuthProvider } from "./context/AuthContext";
import StudiesLayout from "./pages/Studies/StudiesLayout.tsx";
import { AdminRoutes, PrivateRoutes, RadiologistRoutes } from "./routes/AppRoutes";

const Viewer = lazy(() => import("./components/Viewer.tsx"));

const queryClient = new QueryClient();
function App() {
	return (
		<div className="font-inter">
			<QueryClientProvider client={queryClient}>
				<AuthProvider>
					<Routes>
						<Route path="/login" element={<Login />} />
						<Route path="/auth" element={<AuthCallback />} />
						<Route path="/401" element={<Unauthorized />} />

						<Route element={<PrivateRoutes />}>
							<Route
								path="/viewer/:uid"
								element={
									<Suspense fallback={<LoadingSpinner message="Loading Viewer" />}>
										<Viewer />
									</Suspense>
								}
							/>
							<Route element={<AdminRoutes />}>
								<Route path="/users" element={<UsersPage />} />
							</Route>

							<Route path="/" element={<StudiesLayout />}>
								<Route index element={<StudiesIndex />} />
								<Route element={<RadiologistRoutes />}>
									<Route path="all" element={<AllStudies />} />
								</Route>
								<Route element={<AdminRoutes />}>
									<Route path="new" element={<NewStudies />} />
									<Route path="complete" element={<CompletedStudies />} />
								</Route>
							</Route>
						</Route>
					</Routes>
				</AuthProvider>
				<ReactQueryDevtools initialIsOpen={false} />
			</QueryClientProvider>
		</div>
	);
}

export default App;

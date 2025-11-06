import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Button from "@mui/material/Button";
import { useState } from "react";
import Analytics from "@/components/Analytics";
import Navbar from "@/components/Navbar";
import CreateUserDialog from "@/components/users/CreateUserDialog";
import UsersTable from "@/components/users/UserTable";

function UsersPage() {
	const [createUserOpen, setCreateUserOpen] = useState(false);
	return (
		<>
			<Navbar />
			<Analytics />
			<div className="w-10/12 mx-auto">
				<div className="flex items-center justify-between my-6">
					<h2 className="text-xl font-sm">Users</h2>
					<Button variant="contained" startIcon={<PersonAddIcon />} onClick={() => setCreateUserOpen(true)}>
						Add User
					</Button>
				</div>
				<UsersTable />
			</div>
			<CreateUserDialog open={createUserOpen} setOpen={setCreateUserOpen} />
		</>
	);
}
export default UsersPage;

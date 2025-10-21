import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Button from "@mui/material/Button";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import UserCreateDialog from "./UserCreateDialog";
import UsersTable from "./UsersTable";

function UsersPage() {
	const [createUserOpen, setCreateUserOpen] = useState(false);
	return (
		<>
			<Navbar />
			<div className="w-10/12 mx-auto">
				<div className="flex items-center justify-between my-6">
					<h2 className="text-xl font-sm">User List</h2>
					<Button variant="contained" startIcon={<PersonAddIcon />} onClick={() => setCreateUserOpen(true)}>
						Add User
					</Button>
				</div>
				<UsersTable />
			</div>
			<UserCreateDialog open={createUserOpen} setOpen={setCreateUserOpen} />
		</>
	);
}
export default UsersPage;

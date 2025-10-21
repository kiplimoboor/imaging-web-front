import Switch from "@mui/material/Switch";
import Tooltip from "@mui/material/Tooltip";
import { useQueryClient } from "@tanstack/react-query";
import type { MRT_Row } from "material-react-table";
import { useUpdateUser } from "@/hooks/users";
import type { User } from "@/types";

type RowActionProps = { row: MRT_Row<User> };
function RowActions({ row }: RowActionProps) {
	const queryClient = useQueryClient();
	const updateMutation = useUpdateUser();
	const { id, status, role } = row.original;
	const isActive = status === 1;

	const toggleUserStatus = () => {
		updateMutation.mutate(
			{ id, field: "status", value: isActive ? 0 : 1 },
			{
				onSuccess: () => {
					queryClient.setQueryData(["users"], (old: User[]) =>
						old.map((user) => {
							if (user.id === id) return { ...user, status: isActive ? 0 : 1 };
							return user;
						}),
					);
					queryClient.invalidateQueries({ queryKey: ["users", "active"] });
				},
			},
		);
	};
	return (
		<Tooltip title={status === 1 ? "Deactivate" : "Activate"}>
			<Switch name={"user-status"} checked={isActive} disabled={role === "Support"} onChange={toggleUserStatus} />
		</Tooltip>
	);
}

export default RowActions;

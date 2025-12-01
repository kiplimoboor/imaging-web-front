import CheckIcon from "@mui/icons-material/Check";
import { IconButton, Tooltip } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { useUpdateStudy } from "@/hooks/studies";

function SelfAssignAction({ id }: { id: number }) {
	const { user } = useAuth();
	if (!user) return;

	const queryClient = useQueryClient();
	const mutation = useUpdateStudy();
	const isRegistrar = user.role === "Registrar";

	const handleSelfAssign = () => {
		const updateData = isRegistrar ? { student: user.id, status: 2 } : { radiologist: user.id, status: 1 };
		mutation.mutate(
			{ id, data: updateData },
			{ onSuccess: () => queryClient.invalidateQueries({ queryKey: ["studies"] }) },
		);
	};

	return (
		<Tooltip title="Self Assign">
			<IconButton onClick={handleSelfAssign}>
				<CheckIcon />
			</IconButton>
		</Tooltip>
	);
}

export default SelfAssignAction;

import CheckIcon from "@mui/icons-material/Check";
import { IconButton, Tooltip } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { useUpdateStudy } from "@/hooks/studies";
import type { Study } from "@/types";

function SelfAssignAction({ id }: { id: number }) {
	const { user } = useAuth();
	if (!user) return;

	const queryClient = useQueryClient();
	const mutation = useUpdateStudy();
	const isRegistrar = user.role === "Registrar";

	const handleSelfAssign = () => {
		queryClient.setQueryData(["studies", []], (old: Study[]) =>
			old.map((study) => {
				if (study.id === id) {
					const newStudy: Study = isRegistrar
						? { ...study, status: 2, student_name: user.full_name }
						: { ...study, status: 1, radiologist_name: user.full_name };
					return newStudy;
				}
				return study;
			}),
		);
		const updateData = isRegistrar ? { student: user.id, status: 2 } : { radiologist: user.id, status: 1 };
		mutation.mutate({ id, data: updateData });
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

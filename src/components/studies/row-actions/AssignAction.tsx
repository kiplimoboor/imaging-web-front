import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useUpdateStudy } from "@/hooks/studies";
import { useUsers } from "@/hooks/users";
import type { Study, User } from "@/types";

function AssignAction({ id }: { id: number }) {
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
	const queryClient = useQueryClient();
	const mutation = useUpdateStudy();
	const { data } = useUsers();
	const radiologists = data?.filter((user) => user.status === 1 && user.role != "Support");

	const handleAssign = (radiologist: User) => {
		const isRegistrar = radiologist.role === "Registrar";
		queryClient.setQueryData(["studies", []], (old: Study[]) =>
			old.map((study) => {
				if (study.id === id) {
					const newStudy: Study = isRegistrar
						? { ...study, status: 2, student_name: radiologist.full_name }
						: { ...study, status: 1, radiologist_name: radiologist.full_name };
					return newStudy;
				}
				return study;
			}),
		);
		const updateData = isRegistrar
			? { student: radiologist.id, status: 2 }
			: { radiologist: radiologist.id, status: 1 };
		mutation.mutate({ id, data: updateData });

		setAnchorEl(null);
	};

	return (
		<>
			<Tooltip title="Assign to Radiologist">
				<IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
					<PersonAddIcon />
				</IconButton>
			</Tooltip>

			<Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
				{radiologists?.map((radiologist) => (
					<MenuItem key={radiologist.id} onClick={() => handleAssign(radiologist)}>
						{radiologist.full_name}
					</MenuItem>
				))}
			</Menu>
		</>
	);
}

export default AssignAction;

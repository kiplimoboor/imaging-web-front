import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useAssignment, useStudentAssignment } from "@/hooks/studies";
import { useActiveUsers } from "@/hooks/users";
import type { User } from "@/types";

function AssignAction({ dicomUid }: { dicomUid: string }) {
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
	const queryClient = useQueryClient();
	const radiologistMutation = useAssignment();
	const registrarMutation = useStudentAssignment();
	const { data: radiologists } = useActiveUsers();

	const handleAssign = (radiologist: User) => {
		if (radiologist.role === "Registrar") {
			registrarMutation.mutate(
				{ dicom_uid: dicomUid, radiologist_id: radiologist.id },
				{
					onSuccess: () => {
						queryClient.invalidateQueries({ queryKey: ["studies", "all"] });
					},
				},
			);
		} else {
			radiologistMutation.mutate(
				{ dicom_uid: dicomUid, radiologist_id: radiologist.id },
				{
					onSuccess: () => {
						queryClient.invalidateQueries({ queryKey: ["studies", "all"] });
					},
				},
			);
		}

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
				{radiologists?.map((radiologist) => {
					return (
						<MenuItem key={radiologist.id} onClick={() => handleAssign(radiologist)}>
							{radiologist.full_name}
						</MenuItem>
					);
				})}
			</Menu>
		</>
	);
}

export default AssignAction;

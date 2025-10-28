import CheckIcon from "@mui/icons-material/Check";
import { IconButton, Tooltip } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { useAssignment, useStudentAssignment } from "@/hooks/studies";
import type { Study } from "@/types";

function SelfAssignAction({ dicomUid }: { dicomUid: string }) {
	const { user } = useAuth();
	if (!user) return;

	const queryClient = useQueryClient();
	const radiologistMutation = useAssignment();
	const registrarMutation = useStudentAssignment();

	const handleAssign = () => {
		queryClient.setQueryData(["studies", "all"], (old: Study[]) =>
			old.map((study) => {
				if (study.dicom_uid === dicomUid) {
					if (user?.role === "Registrar") return { ...study, status: 2, student_name: user.full_name };
					return { ...study, status: 1, radiologist_name: user?.full_name };
				}
				return study;
			}),
		);

		if (user?.role === "Registrar") {
			registrarMutation.mutate(
				{ dicom_uid: dicomUid, radiologist_id: user.id },
				{ onSuccess: () => queryClient.invalidateQueries({ queryKey: ["studies", user?.id] }) },
			);
		} else {
			radiologistMutation.mutate(
				{ dicom_uid: dicomUid, radiologist_id: user.id },
				{ onSuccess: () => queryClient.invalidateQueries({ queryKey: ["studies", user?.id] }) },
			);
		}
	};

	return (
		<Tooltip title="Self Assign">
			<IconButton onClick={handleAssign}>
				<CheckIcon />
			</IconButton>
		</Tooltip>
	);
}

export default SelfAssignAction;

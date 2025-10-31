import RateReviewIcon from "@mui/icons-material/RateReview";
import { IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useUpdateStudy } from "@/hooks/studies";
import { useActiveUsers } from "@/hooks/users";
import type { Study, User } from "@/types";

function ReviewAction({ id }: { id: number }) {
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
	const queryClient = useQueryClient();
	const mutation = useUpdateStudy();
	const { data: radiologists } = useActiveUsers();
	const { user } = useAuth();

	const chooseReviewer = async (radiologist: User) => {
		mutation.mutate(
			{ id, data: { radiologist: radiologist.id } },
			{
				onSuccess: () =>
					queryClient.setQueryData(["studies", [user?.id]], (old: Study[]) =>
						old.map((study) => {
							if (study.id === id) return { ...study, radiologist_name: radiologist.full_name };
							return study;
						}),
					),
			},
		);

		setAnchorEl(null);
	};

	return (
		<>
			<Tooltip title="Request Review">
				<IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
					<RateReviewIcon />
				</IconButton>
			</Tooltip>

			<Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
				{radiologists
					?.filter((radiologist) => radiologist.role === "System User")
					.map((radiologist) => {
						return (
							<MenuItem key={radiologist.id} onClick={() => chooseReviewer(radiologist)}>
								{radiologist.full_name}
							</MenuItem>
						);
					})}
			</Menu>
		</>
	);
}

export default ReviewAction;

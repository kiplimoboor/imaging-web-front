import RateReviewIcon from "@mui/icons-material/RateReview";
import { IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useUpdateStudy } from "@/hooks/studies";
import { useUsers } from "@/hooks/users";
import type { User } from "@/types";

function ReviewAction({ id }: { id: number }) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const queryClient = useQueryClient();
  const mutation = useUpdateStudy();
  const { data } = useUsers();
  const radiologists = data?.filter((radiologist) => radiologist.role === "Radiologist" && radiologist.status === 1);

  const chooseReviewer = async (radiologist: User) => {
    mutation.mutate(
      { id, data: { radiologist: radiologist.id } },
      { onSuccess: () => queryClient.invalidateQueries({ queryKey: ["studies"] }) },
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
        {radiologists?.map((radiologist) => {
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

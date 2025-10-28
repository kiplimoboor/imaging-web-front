import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import type { Dispatch, SetStateAction } from "react";
import { useActiveUsers } from "@/hooks/users";
import type { User } from "@/types";

type MenuProps = { anchorEl: HTMLElement | null; setAnchorEl: Dispatch<SetStateAction<HTMLElement | null>> };

function RadiologistMenu({ anchorEl, setAnchorEl }: MenuProps) {
	const { data: radiologists } = useActiveUsers();

	const handleAssign = (radiologist: User) => {
		console.log(radiologist.id);
		setAnchorEl(null);
	};

	return (
		<Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
			{radiologists?.map((radiologist) => {
				return (
					<MenuItem key={radiologist.id} onClick={() => handleAssign(radiologist)}>
						{radiologist.full_name}
					</MenuItem>
				);
			})}
		</Menu>
	);
}

export default RadiologistMenu;

import NotesIcon from "@mui/icons-material/Notes";
import { IconButton, Tooltip } from "@mui/material";
import Menu from "@mui/material/Menu";
import { useState } from "react";

const MTRH_RADIOLOGY_API = "https://portal.mtrh.go.ke/api/method/clinical.api.radiology.ris";

function RequestNotes({ accession }: { accession: string }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [note, setNote] = useState("");

  const fetchNotes = async (e: React.MouseEvent<HTMLElement>) => {
    const procedure = "HLC-CPR-20" + accession.slice(0, 2) + "-" + accession.slice(2);
    setAnchorEl(e.currentTarget);
    const res = await fetch(`${MTRH_RADIOLOGY_API}.request.request_note?accession=${procedure}`);
    if (!res.ok) {
      setNote("The note seems to be missing for this study.");
      return;
    }
    const { message } = await res.json();
    setNote(message);
  };

  return (
    <>
      <Tooltip title="Request Notes">
        <IconButton onClick={(e) => fetchNotes(e)}>
          <NotesIcon />
        </IconButton>
      </Tooltip>

      <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={() => setAnchorEl(null)}>
        <div className="p-2 w-72">
          <h1 className="font-bold mb-2">Request Note</h1>
          <p className="whitespace-pre-wrap">{note}</p>
        </div>
      </Menu>
    </>
  );
}

export default RequestNotes;

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import type { Dispatch, SetStateAction } from "react";
import type { Study } from "@/types";

type FormProps = {
  study: Study;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setStudy: Dispatch<SetStateAction<Study | null>>;
};

export default function StudyDetailsUpdate({ study, setStudy, open, setOpen }: FormProps) {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson: Partial<Study> = Object.fromEntries((formData as any).entries());
    const res = await fetch("https://radiology.mtrh.go.ke/api/studies/" + study?.id, {
      headers: { "Content-Type": "application/json" },
      method: "PATCH",
      credentials: "include",
      body: JSON.stringify(formJson),
    });
    if (res.ok) setStudy({ ...study, ...formJson });
    setOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Patient Details</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This study is missing some patient information. To ensure the accuracy and completeness of the record,
            please fill in all of the patient's details before printing.
          </DialogContentText>
          <form onSubmit={handleSubmit} id="patient-form">
            <TextField
              autoFocus
              defaultValue={study?.patient_name}
              error={!study?.patient_name}
              required
              margin="dense"
              id="patient-name"
              name="patient_name"
              label="Patient Name"
              type="text"
              fullWidth
              variant="standard"
            />
            <TextField
              defaultValue={study?.patient_id}
              error={!study?.patient_id}
              required
              margin="dense"
              id="patient-id"
              name="patient_id"
              label="Patient ID"
              type="text"
              fullWidth
              variant="standard"
              onChange={() => {}}
            />

            <TextField
              defaultValue={study?.gender}
              error={!study?.gender}
              required
              margin="dense"
              id="gender"
              name="gender"
              label="Gender"
              type="text"
              fullWidth
              variant="standard"
            />

            <TextField
              defaultValue={study?.dob}
              error={!study?.dob}
              required
              margin="dense"
              id="date-of-birth"
              name="dob"
              label="Date of Birth"
              type="text"
              fullWidth
              variant="standard"
            />

            <TextField
              defaultValue={study?.examination}
              error={!study?.examination}
              required
              margin="dense"
              id="examination-type"
              name="examination"
              label="Examination"
              type="text"
              fullWidth
              variant="standard"
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button type="submit" form="patient-form">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

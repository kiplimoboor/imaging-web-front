import { type Dispatch, type SetStateAction } from "react";
import type { Study } from "../hooks/studies";

const API_URL = import.meta.env.VITE_API_URL;

type PrinterProps = {
  setPdfLoading: Dispatch<SetStateAction<boolean>>;
  rowData: Study;
  setCurrentStudy: Dispatch<SetStateAction<Study | null>>;
  setPatientModalOpen: Dispatch<SetStateAction<boolean>>;
};

const handlePrint = async ({ setPdfLoading, rowData, setCurrentStudy, setPatientModalOpen }: PrinterProps) => {
  setPdfLoading(true);
  const requiredFields = ["patient_name", "patient_id", "dob", "gender", "examination", "study_date"];

  for (const field of requiredFields) {
    if (!Boolean(rowData[field as keyof Study])) {
      setCurrentStudy(rowData);
      setPatientModalOpen(true);
      return;
    }
  }

  try {
    const noteRes = await fetch(API_URL + "/notes/" + rowData.dicom_uid, { credentials: "include" });
    const { note } = await noteRes.json();
    const res = await fetch(API_URL + "/pdf", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...rowData, report: note }),
    });
    const data = await res.json();
    window.open(API_URL + "/pdf?filename=" + data.filename, "_blank");
    setPdfLoading(false);
  } catch (error) {
    setPdfLoading(false);
    console.error("PDF generation failed:", error);
  }
  return;
};

export { handlePrint };

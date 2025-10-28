import type { QueryClient } from "@tanstack/react-query";
import type { Study, StudyTableInstance } from "@/types";

async function studyUpdate(dicomUid: string, values: Study, table: StudyTableInstance, queryClient: QueryClient) {
	const { patient_id, patient_name, examination, dob, gender } = values;

	await fetch("https://radiology.mtrh.go.ke/api/studies/modify/" + dicomUid, {
		method: "PUT",
		credentials: "include",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ patient_id, patient_name, examination, dob, gender }),
	});

	queryClient.invalidateQueries({ queryKey: ["studies", "all"] });
	table.setEditingRow(null);
}

export { studyUpdate };

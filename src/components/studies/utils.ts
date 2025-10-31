import type { Study } from "@/types";

async function studyUpdate(id: number, values: Study) {
	const { patient_id, patient_name, examination, dob, gender } = values;
	await fetch("http://127.0.0.1:3000/studies/" + id, {
		method: "PATCH",
		credentials: "include",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ patient_id, patient_name, examination, dob, gender }),
	});
}

export { studyUpdate };

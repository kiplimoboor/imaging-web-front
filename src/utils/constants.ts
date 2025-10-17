type StudyStatus = Record<number, { text: string; color: "warning" | "primary" | "success" | "error" | "secondary" }>;

const studyStatusMap: StudyStatus = {
	0: { text: "New Study", color: "primary" },
	1: { text: "Assigned", color: "warning" },
	2: { text: "Resident", color: "secondary" },
	3: { text: "Draft", color: "error" },
	4: { text: "Completed", color: "success" },
};

const allStudiesStatusMap: StudyStatus = {
	0: studyStatusMap[0],
	1: studyStatusMap[1],
	2: studyStatusMap[1],
	3: studyStatusMap[1],
	4: studyStatusMap[4],
};

const userStatusMap: Record<number, { text: string; color: "error" | "primary" }> = {
	0: { text: "Inactive", color: "error" },
	1: { text: "Active", color: "primary" },
};

export { allStudiesStatusMap, studyStatusMap, type StudyStatus, userStatusMap };

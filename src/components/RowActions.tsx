import React from "react";
import { useAuth } from "@/context/AuthContext";
import type { RowActionsProps } from "@/types";
import ReviewAction from "./studies/RowActions/ReviewAction";
import ViewAction from "./studies/RowActions/ViewAction";

const AssignAction = React.lazy(() => import("./studies/RowActions/AssignAction"));
const EditAction = React.lazy(() => import("./studies/RowActions/EditAction"));
const PdfAction = React.lazy(() => import("./studies/RowActions/PdfAction"));
const SelfAssignAction = React.lazy(() => import("./studies/RowActions/SelfAssignAction"));

function RowActions({ row, actions, table }: RowActionsProps) {
	const { dicom_uid, status, student, radiologist, id } = row.original;
	const { user, isPrivileged } = useAuth();

	const radiologistRole = ["Registrar", "System User"];

	if (!user) return;
	if (!actions) return <ViewAction dicomUid={dicom_uid} status={status} />;

	const isOwnStudy = user.id === student || user.id === radiologist;
	const canAssign = actions.includes("assign") && isPrivileged && status !== 4;
	const canSelfAssign = actions.includes("self-assign") && status === 0 && radiologistRole.includes(user.role);
	const canRequestReview = actions.includes("review") && user.role === "Registrar";
	const canEdit = table && actions.includes("edit") && (isOwnStudy || isPrivileged) && status === 4;
	const canGeneratePdf = table && actions.includes("pdf") && (isOwnStudy || isPrivileged) && status === 4;

	return (
		<>
			<ViewAction dicomUid={dicom_uid} status={status} />
			<React.Suspense fallback={null}>
				{canAssign && <AssignAction dicomUid={dicom_uid} />}
				{canSelfAssign && <SelfAssignAction dicomUid={dicom_uid} />}
				{canRequestReview && <ReviewAction dicomUid={dicom_uid} id={id} />}
				{canEdit && <EditAction table={table} row={row} />}
				{canGeneratePdf && <PdfAction table={table} row={row} />}
			</React.Suspense>
		</>
	);
}

export default React.memo(RowActions);

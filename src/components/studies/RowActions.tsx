import React from "react";
import { useAuth } from "@/context/AuthContext";
import type { RowActionsProps } from "@/types";
import RequestNotes from "./row-actions/RequestNotes";
import ViewAction from "./row-actions/ViewAction";

const AssignAction = React.lazy(() => import("./row-actions/AssignAction"));
const EditAction = React.lazy(() => import("./row-actions/EditAction"));
const PdfAction = React.lazy(() => import("./row-actions/PdfAction"));
const SelfAssignAction = React.lazy(() => import("./row-actions/SelfAssignAction"));
const ReviewAction = React.lazy(() => import("./row-actions/ReviewAction"));

function RowActions({ row, actions, table }: RowActionsProps) {
	const { dicom_uid, status, student, radiologist, id, accession } = row.original;
	const { user, isPrivileged, isSecretary, isRadiologist } = useAuth();

	if (!user) return;
	if (!actions) return <ViewAction dicomUid={dicom_uid} status={status} />;

	const accessionRegex = /^\d{7}$/;
	const isOwnStudy = user.id === student || user.id === radiologist;
	const canAssign = actions.includes("assign") && isPrivileged && status !== 4;
	const hasRequestNotes = actions.includes("note") && accessionRegex.test(accession);
	const canSelfAssign = actions.includes("self-assign") && status === 0 && isRadiologist;
	const canRequestReview = actions.includes("review") && user.role === "Registrar" && isOwnStudy;
	const canEdit = table && actions.includes("edit") && (isOwnStudy || isPrivileged || isSecretary);
	const canGeneratePdf = table && actions.includes("pdf") && status === 4;

	return (
		<>
			{hasRequestNotes && <RequestNotes accession={row.original.accession} />}
			<ViewAction dicomUid={dicom_uid} status={status} />
			<React.Suspense fallback={null}>
				{canAssign && <AssignAction id={id} status={status} />}
				{canSelfAssign && <SelfAssignAction id={id} />}
				{canRequestReview && <ReviewAction id={id} />}
				{canEdit && <EditAction table={table} row={row} />}
				{canGeneratePdf && <PdfAction table={table} row={row} />}
			</React.Suspense>
		</>
	);
}

export default React.memo(RowActions);

import React from "react";
import { useAuth } from "@/context/AuthContext";
import getStudyPolicy from "@/policies/studyPolicy";
import type { RowActionsProps } from "@/types";
import RequestNotes from "./row-actions/RequestNotes";
import ViewAction from "./row-actions/ViewAction";

const AssignAction = React.lazy(() => import("./row-actions/AssignAction"));
const EditAction = React.lazy(() => import("./row-actions/EditAction"));
const PdfAction = React.lazy(() => import("./row-actions/PdfAction"));
const SelfAssignAction = React.lazy(() => import("./row-actions/SelfAssignAction"));
const ReviewAction = React.lazy(() => import("./row-actions/ReviewAction"));

function RowActions({ row, actions, table }: RowActionsProps) {
  const { dicom_uid, status, id, accession, created_at } = row.original;
  const { user } = useAuth();
  if (!user) {
    return;
  }
  if (!actions) {
    return <ViewAction dicomUid={dicom_uid} status={status} created_at={created_at} />;
  }
  const permissions = getStudyPolicy(user, row.original, actions);
  return (
    <>
      {actions.includes("note") && /^\d{7}$/.test(accession) && <RequestNotes accession={accession} />}
      <ViewAction dicomUid={dicom_uid} status={status} created_at={created_at} />
      <React.Suspense fallback={null}>
        {permissions.canAssign && <AssignAction id={id} status={status} />}
        {permissions.canSelfAssign && <SelfAssignAction id={id} />}
        {permissions.canRequestReview && <ReviewAction id={id} />}
        {permissions.canEdit && table && <EditAction table={table} row={row} />}
        {permissions.canGeneratePdf && table && <PdfAction table={table} row={row} />}
      </React.Suspense>
    </>
  );
}

export default React.memo(RowActions);

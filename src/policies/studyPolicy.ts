import type { Actions, Study, User } from "@/types";

function getStudyPolicy(user: User, study: Study, actions: Actions[]) {
  const { role } = user;
  const { student, radiologist, status } = study;

  const checkAssign = () => {
    if (actions.includes("assign") === false) {
      return false;
    }
    if (role === "Support") {
      return true;
    }
    if (role === "Administrator") {
      return true;
    }
    return false;
  };

  const checkEdit = () => {
    if (actions.includes("edit") === false) {
      return false;
    }
    if (role === "Support") {
      return true;
    }
    if (role === "Administrator") {
      return true;
    }
    // check if the study is assigned to them
    if (user.id === student || user.id === radiologist) {
      return true;
    }
    if (role === "Secretary" && status === 4) {
      return true;
    }
    if (role === "Radiographer" && status === 4) {
      return true;
    }
    return false;
  };

  const checkGeneratePdf = () => {
    if (actions.includes("pdf") === false) {
      return false;
    }
    if (role !== "Guest" && status === 4) {
      return true;
    }
    return false;
  };

  const checkRequestReview = () => {
    if (actions.includes("review") === false) {
      return false;
    }
    if (user.id === student) {
      return true;
    }
    return false;
  };

  const checkSelfAssign = () => {
    if (actions.includes("self-assign") === false) {
      return false;
    }
    if (role === "Radiologist" && status === 0) {
      return true;
    }
    if (role === "Registrar" && status === 0) {
      return true;
    }
    return false;
  };

  return {
    canAssign: checkAssign(),
    canEdit: checkEdit(),
    canGeneratePdf: checkGeneratePdf(),
    canRequestReview: checkRequestReview(),
    canSelfAssign: checkSelfAssign(),
  };
}

export default getStudyPolicy;

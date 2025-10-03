import { useEffect, useRef } from "react";
import { useParams } from "react-router";
import { useStudies } from "../hooks/studies";

const URL = "https://radiology.mtrh.go.ke";

function Viewer() {
  const { data } = useStudies();
  const { uid } = useParams();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const study = data?.find((study) => study.dicom_uid === uid);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !study) return;

    const load = () => iframe.contentWindow?.postMessage({ type: "STUDY_DATA", payload: study }, URL + "/editor/");
    iframe.addEventListener("load", load);
    if (iframe.contentDocument?.readyState === "complete") load();

    return () => iframe.removeEventListener("load", load);
  }, [study]);

  return (
    <div className="flex h-screen w-full">
      <iframe
        src={`${URL}/ohif/viewer?StudyInstanceUIDs=${uid}`}
        className={`h-full ${study?.radiologist ? "w-8/12" : "w-full"}`}
      />

      {Boolean(study?.radiologist) && <iframe ref={iframeRef} src={URL + "/editor/"} className="w-4/12" />}
    </div>
  );
}
export default Viewer;

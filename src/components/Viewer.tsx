import { useEffect, useRef } from "react";
import { useParams } from "react-router";
import { useGetStudies } from "../hooks/studies";

function Viewer() {
  const { data } = useGetStudies();
  const { uid } = useParams();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const study = data?.find((study) => study.dicom_uid === uid);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !study) return;

    const handleLoad = () => {
      if (iframe.contentWindow) {
        iframe.contentWindow.postMessage({ type: "STUDY_DATA", payload: study }, "http://172.16.0.29/editor/");
      }
    };

    iframe.addEventListener("load", handleLoad);
    if (iframe.contentDocument?.readyState === "complete") handleLoad();
    return () => iframe.removeEventListener("load", handleLoad);
  }, [study]);

  return (
    <div className="flex h-screen w-full">
      <iframe
        src={`http://172.16.0.29/ohif/viewer?StudyInstanceUIDs=${uid}`}
        className={`h-full ${study?.radiologist ? "w-8/12" : "w-full"}`}
      />

      {Boolean(study?.radiologist) && <iframe ref={iframeRef} src="http://172.16.0.29/editor/" className="w-4/12" />}
    </div>
  );
}
export default Viewer;

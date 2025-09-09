import { useEffect, useRef } from "react";
import { useParams } from "react-router";
import { useGetStudies } from "../hooks/studies";

function Viewer() {
  const { data } = useGetStudies();
  const { uid } = useParams();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const study = data?.find((study) => study.dicom_uid === uid);

  useEffect(() => {
    if (study && iframeRef.current) {
      const iframe = iframeRef.current;
      iframe.onload = () => {
        if (iframe.contentWindow) {
          iframe.contentWindow.postMessage({ type: "STUDY_DATA", payload: study }, "http://172.16.0.29/editor/");
        }
      };
    }
  }, [study]);

  return (
    <div className="flex h-screen w-full">
      <iframe src={"http://172.16.0.29/ohif/viewer?StudyInstanceUIDs=" + uid} className="w-8/12 h-full"></iframe>
      <iframe ref={iframeRef} src="http://172.16.0.29/editor/" className="w-4/12"></iframe>
    </div>
  );
}
export default Viewer;

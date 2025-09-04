import { useParams } from "react-router";

function Viewer() {
  const { id } = useParams();

  return (
    <div className="flex h-screen w-full">
      <iframe
        src={"https://imaging.mtrh.go.ke/ohif/viewer?url=../studies/" + id + "/ohif-dicom-json"}
        className="w-8/12 h-full"
      ></iframe>
      <iframe src="http://127.0.0.1:5174" className="w-4/12"></iframe>
    </div>
  );
}
export default Viewer;

import { useGetStudies } from "../hooks/studies";

function Analytics() {
  let new_studies = 0;
  let incomplete = 0;
  let complete = 0;
  let total = 0;
  let completion = "0%";

  const { data: studies } = useGetStudies();

  if (studies) {
    studies.forEach((study) => (study.status === 0 ? new_studies++ : study.status === 1 ? incomplete++ : complete++));

    total = complete + incomplete;
    completion = total > 0 ? ((complete / total) * 100).toFixed(1) + "%" : "0%";

    const data = [
      { title: "New Studies", value: new_studies, color: "blue" },
      { title: "Completed", value: complete, color: "green" },
      { title: "Incomplete Studies", value: incomplete, color: "red" },
      { title: "Completion Rate", value: completion, color: "indigo" },
    ];

    return (
      <div className="w-10/12 mx-auto my-6 ">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {data.map((item, index) => (
            <div
              key={index}
              className={`bg-${item.color}-50 p-4 shadow flex flex-col items-start hover:shadow-md transition-all duration-200`}
            >
              <h3 className={`text-xs font-medium text-${item.color}-600 mb-1`}>{item.title}</h3>
              <p className={`text-2xl font-semibold text-${item.color}-900`}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Analytics;

import Poc from "../../pages/POC";

function PF({ report, pageOffset }) {
  const colors = [
    { severity: "Info", color: "#00B0F0" },
    { severity: "Low", color: "#FFFF00" },
    { severity: "Medium", color: "#FFC000" },
    { severity: "High", color: "#FF0000" },
    { severity: "Critical", color: "#C00000" }
  ]


  return <>
    {report && report.map((report, key) => {

   const page = pageOffset + key  ; 
if (report.severity === "Info")

        return <Poc rowColor={colors[0].color} key={report._id} report={report} page={page} />;

      else if (report.severity === "Low") {

        return <Poc textColor="#000000" rowColor={colors[1].color} key={report._id} report={report} page={page} />;

      } else if (report.severity === "Medium") {

        return <Poc textColor="#000000" rowColor={colors[2].color} key={report._id} report={report} page={page} />;

      } else if (report.severity === "High") {

        return <Poc rowColor={colors[3].color} key={report._id} report={report} page={page} />;

      } else if (report.severity === "Critical") {

        return <Poc rowColor={colors[4].color} key={report._id} report={report} page={page} />;

      }
    })
    }
  </>
}

export default PF 
// const getSeverityCounts = (bugs) => {
//     // Initialize counters for each severity level
//     const severityCounts = {
//       Info: 0,
//       Low: 0,
//       Medium: 0,
//       High: 0,
//       Critical: 0
//     };
//   console.log("line 10 in getSeverityCounts : " , bugs )
//     // Iterate over the bugs array and count each severity
//     bugs?.forEach(bug => {
//       if (severityCounts.hasOwnProperty(bug.severity)) {
//         severityCounts[bug.severity]++;
//       }
//     });
  
//     return severityCounts;
//   };
  

//   export default getSeverityCounts 


const getSeverityCounts = (bugs) => {
  // Define the “canonical” labels and a map from lowercase → canonical
  const severityMap = {
    info:     "Info",
    low:      "Low",
    medium:   "Medium",
    high:     "High",
    critical: "Critical",
  };

  // Initialize counters for each canonical severity
  const severityCounts = {
    Info:     0,
    Low:      0,
    Medium:   0,
    High:     0,
    Critical: 0,
  };

  bugs?.forEach(bug => {
    if (!bug.severity) return;
    const key = bug.severity.toString().trim().toLowerCase();
    const canonical = severityMap[key];
    if (canonical) {
      severityCounts[canonical]++;
    }
  });

  return severityCounts;
};

export default getSeverityCounts;

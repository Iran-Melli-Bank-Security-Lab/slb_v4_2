const getSeverityCounts = (bugs) => {
    // Initialize counters for each severity level
    const severityCounts = {
      Info: 0,
      Low: 0,
      Medium: 0,
      High: 0,
      Critical: 0
    };
  
    // Iterate over the bugs array and count each severity
    bugs.forEach(bug => {
      if (severityCounts.hasOwnProperty(bug.severity)) {
        severityCounts[bug.severity]++;
      }
    });
  
    return severityCounts;
  };
  

  export default getSeverityCounts 
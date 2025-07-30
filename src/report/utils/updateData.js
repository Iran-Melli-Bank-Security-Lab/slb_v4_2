export const upData = (data, page) => {
    if (!page || typeof page !== 'object') {
      return data; // Return the original data if page is invalid
    }
  
    console.log("Page structure:", page);
  
    // Combine all bugs from explicitly checking each key
    const allBugs = [];
    if (page.pf10) allBugs.push(...page.pf10);
    if (page.pf11) allBugs.push(...page.pf11);
    if (page.pf12) allBugs.push(...page.pf12);
    if (page.pf13) allBugs.push(...page.pf13);
    if (page.pf14) allBugs.push(...page.pf14);
    if (page.pf15) allBugs.push(...page.pf15);
    if (page.pf16) allBugs.push(...page.pf16);
    if (page.pf17) allBugs.push(...page.pf17);
    if (page.pf18) allBugs.push(...page.pf18);
    if (page.pf19) allBugs.push(...page.pf19);
    if (page.pf1a) allBugs.push(...page.pf1a);
    if (page.pf1b) allBugs.push(...page.pf1b);
    if (page.pf1c) allBugs.push(...page.pf1c);

    console.log("Combined allBugs:", allBugs);
  
    // Map through the data and update based on matched bugs
    return data.map(item => {
      const matchedBug = allBugs.find(bug => bug.id === item.id);
      console.log("Matched Bug for item:", item, "is:", matchedBug);
      if (matchedBug) {
        return {
          ...item,
          page: matchedBug.page, // Fill in the page from bugs array
          state: "FAILE",       // Example: populate additional fields
          cvss: matchedBug.cvss // Map CVSS from the matched bug
        };
      }
      return item; // Return original item if no match is found
    });
  };
  
export const transformObject = (originalObject) => {
  // If originalObject is null or undefined, return a default transformed object
  if (!originalObject) {
    console.warn("originalObject is null or undefined, returning default transformedObject");
    return {
      _id: null,
      project: null,
      projectManager: null,
      bugs: []
    };
  }

  // Start with the unchanged properties
  console.log("original object in line 3: ", originalObject);
  delete originalObject.pf17;
  const transformedObject = {
    _id: originalObject?._id,
    project: originalObject?.project,
    projectManager: originalObject?.projectManager,
    bugs: []
  };

  // Consolidate all "pf10" to "pf1c" lists into the "bugs" array
  Object.keys(originalObject).forEach((key) => {
    if (
      (key.startsWith("pf") && 
       (parseInt(key.slice(2), 16) >= 0x10 && parseInt(key.slice(2), 16) <= 0x1c)) &&
      Array.isArray(originalObject[key])
    ) {
      transformedObject.bugs = [...transformedObject.bugs, ...originalObject[key]];
    }
  });

  // Sort the bugs array based on cvss in descending order
  transformedObject.bugs.sort((a, b) => parseFloat(b.cvss) - parseFloat(a.cvss));

  return transformedObject;
};

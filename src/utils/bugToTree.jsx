
export const convertToBugTree =async  (data=[]) => {

    console.log("data as bugScopes 4000: " ,  data )
    const lookup = {};
    const tree = [];

    data.forEach((item) => {
        lookup[item.id] = { ...item, name: item.label, children: [] };
    });

    data.forEach((item) => {
        const parentId = item.id.substring(0, item.id.lastIndexOf('.'));
        if (lookup[parentId]) {
            lookup[parentId].children.push(lookup[item.id]);
        } else {
            tree.push(lookup[item.id]);
        }
    });
console.log("tree line 3000: " , tree )
    return tree;
};

 // Helper function to find bug by ID in nested structure
 export const findBugById = (bugs, id) => {
    for (const bug of bugs) {
        if (bug.id === id) return bug;
        if (bug.children) {
            const found = findBugById(bug.children, id);
            if (found) return found;
        }
    }
    return null;
};
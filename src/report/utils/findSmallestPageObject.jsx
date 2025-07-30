export const findSmallestPageObject = (arr) => {
    return arr.reduce((smallest, current) => {
        const smallestPage = parseInt(smallest.page) || Infinity; // Convert to number or use Infinity if invalid
        const currentPage = parseInt(current.page) || Infinity;  // Convert to number or use Infinity if invalid

        return currentPage < smallestPage ? current : smallest;
    });
};


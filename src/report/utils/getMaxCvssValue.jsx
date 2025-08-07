export const getMaxCvssValue = (data) => {
    // Check if all `cvss` values are empty strings
    const allEmpty = data?.every(item => item.cvss === "");

    // If all are empty, return -1
    if (allEmpty) {
        return -1;
    }

    // Extract `cvss` values, convert to numbers, and filter valid numbers
    const cvssValues = data?.map(item => parseFloat(item.cvss)) // Convert to float
        .filter(value => !isNaN(value)); // Remove invalid numbers

    // Return the maximum value or -1 if there are no valid `cvss` values
    return cvssValues?.length > 0 ? Math.max(...cvssValues) : -1;
};
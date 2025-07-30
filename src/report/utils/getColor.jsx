const getColor = (cvss) => {
    console.log("cvss in getColor file IN LINE 2 : " , cvss )
    const colors = [
        { severity: "Info", color: "#00B0F0" },
        { severity: "Low", color: "#FFFF00" },
        { severity: "Medium", color: "#FFC000" },
        { severity: "High", color: "#FF0000" },
        { severity: "Critical", color: "#C00000" }
    ];

    switch (true) {
        case cvss === 0:
            return "#00B0F0";
        case cvss >= 0.1 && cvss <= 3.9:
            return "#FFFF00"; 
        case cvss >= 4.0 && cvss <= 6.9:
            return "#FFC000" ; 
        case cvss >= 7.0 && cvss <= 8.9:
            return "#FF0000"
        case cvss >= 9.0 && cvss <= 10.0:
            return "#C00000" ; 
        default:
            return null; // Return null or a default color if the cvss value is invalid
    }
};
export default getColor 


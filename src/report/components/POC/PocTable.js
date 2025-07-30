import React from "react";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import ImageRow from "./ImageRow";
import SeverityRow from "./SeverityRow";
import DoneAllIcon from "@mui/icons-material/DoneAll"; // Import Double Check Icon
import CloseIcon from "@mui/icons-material/Close"; // Import Close Icon

const PocTable = ({ report, className = "ry291", pocUrl, rowColor, textColor = "#ffffff" }) => {
    // Helper function to safely access values or return a fallback
    const getSafeValue = (value, fallback = "-") => (value !== null && value !== undefined && value !== "" ? value : fallback);

    const renderCheckStatus = (checked) => {
        return checked ? <DoneAllIcon  style={{ color: "black" , fontSize:"15pt"}} /> : <CloseIcon  style={{ color: "black" , fontSize:"15pt" }} />;
    };

    return (
        <div className={`r00 rx90 ${className} rhbb`}>
            <table
                width="750px"
                style={{
                    borderCollapse: "collapse",
                    marginLeft: "5.32pt",
                    backgroundColor: "white"
                }}
                cellSpacing="0"
            >
                <SeverityRow 
                    textColor={textColor}
                    rowColor={rowColor}
                    Score={getSafeValue(report?.CVSS)}
                    Severity={getSafeValue(report?.severity)}
                    WSTG={getSafeValue(report?.wstg)}
                    Header={getSafeValue(report?.labelfa)}
                    fontSize={13}
                />

                <TableRow fontSize={13} fontFamily="Times New Roman" textColor={textColor} rowColor={rowColor} cell="Path">
                    <TableHeader>{getSafeValue(report?.path)}</TableHeader>
                </TableRow>

                <TableRow fontSize={13} textColor={textColor} rowColor={rowColor} cell="Attack Vector" bgcolor="#D9D9D9">
                    <TableHeader fontFamily="Times New Roman">{getSafeValue(report?.vector)}</TableHeader>
                </TableRow>

                <TableRow fontSize={13} textColor={textColor} rowColor={rowColor} cell="Attack Score">
                    <TableHeader fontFamily="Times New Roman">{getSafeValue(report?.CVSS)}</TableHeader>
                </TableRow>

                <TableRow fontSize={13} textColor={textColor} rowColor={rowColor} cell="CVSS" bgcolor="#D9D9D9">
                    <strong>
                        <TableHeader fontFamily="Times New Roman">{`${getSafeValue(report?.CVSS)}/${getSafeValue(report?.severity)}`}</TableHeader>
                    </strong>
                </TableRow>

                <TableRow fontSize={13} textColor={textColor} rowColor={rowColor} cell="CVE">
                    <strong>
                        <TableHeader fontFamily="Times New Roman">{getSafeValue(report?.CVE)}</TableHeader>
                    </strong>
                </TableRow>

                <TableRow textColor={textColor} rowColor={rowColor} cell="نتیجه آزمون" bgcolor="#D9D9D9">
                    <TableHeader fontFamily="Times New Roman">FAIL</TableHeader>
                </TableRow>

                <ImageRow textColor={textColor} rowColor={rowColor} cell="شواهد آزمون">
                    <TableHeader fontFamily="bnazanin" dir="rtl">
                        تمام فایل های POC در یک فایل RAR  قرار دارند.
                    </TableHeader>
                </ImageRow>

                <TableRow textColor={textColor} rowColor={rowColor} cell="توضیحات" bgcolor="#D9D9D9">
                    <TableHeader textAlign="justify" fontFamily="bnazanin" dir="rtl" margintop={15}>
                        {getSafeValue(report?.description)}
                    </TableHeader>
                </TableRow>

                <TableRow textColor={textColor} rowColor={rowColor} cell="راهکار امنیتی">
                    <TableHeader textAlign="justify" fontFamily="bnazanin" dir="rtl" margintop={15}>
                        {getSafeValue(report?.solutions)}
                    </TableHeader>
                </TableRow>

                <TableRow textColor={textColor} rowColor={rowColor} cell="امکان امن سازی توسط" bgcolor="#D9D9D9">
                    <TableHeader fontFamily="bnazanin">
                        <label dir="rtl">
                            {renderCheckStatus(Boolean(report?.securingByOptions?.modificationInProgramCode))}
                            <span style={{ marginRight: "5px", fontFamily: "bnazanin" }}>تغییر در کد برنامه</span>
                        </label>
                        <label style={{ padding: "10px" }} dir="rtl">
                            {renderCheckStatus(Boolean(report?.securingByOptions?.webServerSettings))}
                            <span style={{ marginRight: "5px", fontFamily: "bnazanin" }}>تنظیمات وب سرور</span>
                        </label>
                    </TableHeader>
                </TableRow>

                <TableRow textColor={textColor} rowColor={rowColor} cell="امکان امن سازی توسط WAF">
                    <TableHeader>
                        <label dir="rtl">
                            {renderCheckStatus(report?.securingByWAF === "Yes")}
                            <span style={{ marginRight: "5px", fontFamily: "bnazanin" }}>بله</span>
                        </label>
                        <label dir="rtl" style={{ marginLeft: "10px" }}>
                            {renderCheckStatus(report?.securingByWAF === "Somewhat")}
                            <span style={{ marginRight: "5px", fontFamily: "bnazanin" }}>تا حدودی</span>
                        </label>
                        <label dir="rtl" style={{ marginLeft: "10px" }}>
                            {renderCheckStatus(report?.securingByWAF === "No")}
                            <span style={{ marginRight: "5px", fontFamily: "bnazanin" }}>خیر</span>
                        </label>
                    </TableHeader>
                </TableRow>
            </table>
        </div>
    );
};

export default PocTable;

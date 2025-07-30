import React from 'react';
import "./document.css";
import Tr from './Tr';
import TestOrder from './TestOrder';

const ReportTest = ({count}) => {
    
    // Function to determine test prop values based on count
    const getTestValues = (count) => {
        return {
            test1: true,
            test2: count >= 2,
            test3: count >= 3,
            test4: count >= 4
        };
    };

    return (
        <table 
            style={{ borderCollapse: 'collapse', marginLeft: '28.904pt', backgroundColor: "white" }} 
            cellSpacing="0">
                
            <tbody>
                <TestOrder>
                    عنوان الزام
                </TestOrder>

                <Tr {...getTestValues(count)}>
                    FAU_GEN
                </Tr>

                <Tr {...getTestValues(count)} bgcolor="#D7D7D7">
                    FAU_STG
                </Tr>

                <Tr {...getTestValues(count)}>
                    FAU_SAR
                </Tr>

                <Tr {...getTestValues(count)} bgcolor="#D7D7D7">
                    FAU_SEL
                </Tr>

                <Tr {...getTestValues(count)}>
                    FCS_CKM
                </Tr>

                <Tr {...getTestValues(count)} bgcolor="#D7D7D7">
                    FCS_COP
                </Tr>

                <Tr {...getTestValues(count)}>
                    FCS-TLSS_EXT
                </Tr>

                <Tr {...getTestValues(count)} bgcolor="#D7D7D7">
                    FCS-TLSC_EXT
                </Tr>

                <Tr {...getTestValues(count)}>
                    FIA_AFL
                </Tr>

                <Tr {...getTestValues(count)} bgcolor="#D7D7D7">
                    FIA_PMG_EXT
                </Tr>

                <Tr {...getTestValues(count)}>
                    FIA_UAU
                </Tr>

                <Tr {...getTestValues(count)} bgcolor="#D7D7D7">
                    FIA_ATD
                </Tr>

                <Tr {...getTestValues(count)}>
                    FIA_UID
                </Tr>

                <Tr {...getTestValues(count)} bgcolor="#D7D7D7">
                    FIA_USB
                </Tr>

                <Tr {...getTestValues(count)}>
                    FTP_TRP
                </Tr>
            </tbody>
        </table>
    );
};

export default ReportTest;

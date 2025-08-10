import React from 'react';
import "./document.css";
import Tr from './Tr';
import TestOrder from './TestOrder';

const ReportTest = ({count , data }) => {
    
    // Function to determine test prop values based on count
    const getTestValues = (count) => {
        // return {
        //     test1: false,
        //     test2: count >= 2,
        //     test3: count >= 3,
        //     test4: count >= 4
        // };
         return {
            test1: false,
            test2: false , 
            test3: false , 
            test4: true 
        };
    };

    return (
        <table 
            style={{ borderCollapse: 'collapse', marginLeft: '28.904pt', backgroundColor: "white" }} 
            cellSpacing="0">
                
            <tbody>
                <TestOrder >
                    عنوان الزام
                </TestOrder>

                <Tr label="FAU_GEN" data={data} {...getTestValues(count)}>
                    FAU_GEN
                </Tr>

                <Tr label="FAU_STG" data={data} {...getTestValues(count)} bgcolor="#D7D7D7">
                    FAU_STG
                </Tr>

                <Tr label="FAU_SAR" data={data} {...getTestValues(count)}>
                    FAU_SAR
                </Tr>

                <Tr  label="FAU_SEL" data={data} {...getTestValues(count)} bgcolor="#D7D7D7">
                    FAU_SEL
                </Tr>

                <Tr label="FCS_CKM" data={data} {...getTestValues(count)}>
                    FCS_CKM
                </Tr>

                <Tr label="FCS_COP" data={data} {...getTestValues(count)} bgcolor="#D7D7D7">
                    FCS_COP
                </Tr>

                <Tr label="FCS-TLSS_EXT" data={data} {...getTestValues(count)}>
                    FCS-TLSS_EXT
                </Tr>

                <Tr label="FCS-TLSC_EXT" data={data} {...getTestValues(count)} bgcolor="#D7D7D7">
                    FCS-TLSC_EXT
                </Tr>

                <Tr label="FIA_AFL" data={data} {...getTestValues(count)}>
                    FIA_AFL
                </Tr>

                <Tr label="FIA_PMG_EXT" data={data} {...getTestValues(count)} bgcolor="#D7D7D7">
                    FIA_PMG_EXT
                </Tr>

                <Tr label="FIA_UAU" data={data} {...getTestValues(count)}>
                    FIA_UAU
                </Tr>

                <Tr label="FIA_ATD" data={data} {...getTestValues(count)} bgcolor="#D7D7D7">
                    FIA_ATD
                </Tr>

                <Tr label="FIA_UID" data={data} {...getTestValues(count)}>
                    FIA_UID
                </Tr>

                <Tr label="FIA_USB" data={data} {...getTestValues(count)} bgcolor="#D7D7D7">
                    FIA_USB
                </Tr>

                <Tr label="FTP_TRP"  data={data} {...getTestValues(count)}>
                    FTP_TRP
                </Tr>
            </tbody>
        </table>
    );
};

export default ReportTest;

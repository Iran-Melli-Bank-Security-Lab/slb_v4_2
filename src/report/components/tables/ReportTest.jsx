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

                <Tr data={data} {...getTestValues(count)}>
                    FAU_GEN
                </Tr>

                <Tr data={data} {...getTestValues(count)} bgcolor="#D7D7D7">
                    FAU_STG
                </Tr>

                <Tr data={data} {...getTestValues(count)}>
                    FAU_SAR
                </Tr>

                <Tr  data={data} {...getTestValues(count)} bgcolor="#D7D7D7">
                    FAU_SEL
                </Tr>

                <Tr data={data} {...getTestValues(count)}>
                    FCS_CKM
                </Tr>

                <Tr data={data} {...getTestValues(count)} bgcolor="#D7D7D7">
                    FCS_COP
                </Tr>

                <Tr data={data} {...getTestValues(count)}>
                    FCS-TLSS_EXT
                </Tr>

                <Tr data={data} {...getTestValues(count)} bgcolor="#D7D7D7">
                    FCS-TLSC_EXT
                </Tr>

                <Tr data={data} {...getTestValues(count)}>
                    FIA_AFL
                </Tr>

                <Tr data={data} {...getTestValues(count)} bgcolor="#D7D7D7">
                    FIA_PMG_EXT
                </Tr>

                <Tr  data={data} {...getTestValues(count)}>
                    FIA_UAU
                </Tr>

                <Tr data={data} {...getTestValues(count)} bgcolor="#D7D7D7">
                    FIA_ATD
                </Tr>

                <Tr data={data} {...getTestValues(count)}>
                    FIA_UID
                </Tr>

                <Tr data={data} {...getTestValues(count)} bgcolor="#D7D7D7">
                    FIA_USB
                </Tr>

                <Tr  data={data} {...getTestValues(count)}>
                    FTP_TRP
                </Tr>
            </tbody>
        </table>
    );
};

export default ReportTest;

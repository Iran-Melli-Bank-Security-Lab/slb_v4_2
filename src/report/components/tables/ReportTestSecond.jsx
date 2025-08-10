import React from 'react';
import "./document.css";
import Tr from './Tr';

const ReportTestSecond = ({count , data }) => {

    // Function to determine test prop values based on count
    const getTestValues = (count) => {
        // return {
        //     test1: true,
        //     test2: count >= 2,
        //     test3: count >= 3,
        //     test4: count >= 4
        // };
         return {
            test1: false ,
            test2: false ,
            test3: false ,
            test4: true 
        };
    };

    return (
        <table 
            style={{ borderCollapse: 'collapse', marginLeft: '28.904pt', backgroundColor: "white" }} 
            cellSpacing="0"
        >
            <tbody>
                <Tr label="FRU_FLT" {...getTestValues(count)} data={data}>
                    FRU_FLT
                </Tr>

                <Tr label="FDP_RIP" {...getTestValues(count)} bgcolor="#D7D7D7" data={data}>
                    FDP_RIP
                </Tr>

                <Tr label="FDP_ITC" {...getTestValues(count)}>
                    FDP_ITC
                </Tr>

                <Tr label="FMT_MOF" {...getTestValues(count)} bgcolor="#D7D7D7" data={data}>
                    FMT_MOF
                </Tr>

                <Tr label="FMT_MTD" {...getTestValues(count)} data={data}>
                    FMT_MTD
                </Tr>

                <Tr label="FMT_SMF" {...getTestValues(count)} bgcolor="#D7D7D7" data={data}>
                    FMT_SMF
                </Tr>

                <Tr label="FMT_SMR" {...getTestValues(count)} data={data} >
                    FMT_SMR
                </Tr>

                <Tr label="FMT_MSA" {...getTestValues(count)} bgcolor="#D7D7D7" data={data}>
                    FMT_MSA
                </Tr>

                <Tr label="FPT_TUD_EXT" {...getTestValues(count)} data={data}>
                    FPT_TUD_EXT
                </Tr>

                <Tr label="FPT_FLS" {...getTestValues(count)} bgcolor="#D7D7D7" data={data}>
                    FPT_FLS
                </Tr>

                <Tr label="FPT_TDC" {...getTestValues(count)} data={data}>
                    FPT_TDC
                </Tr>

                <Tr label="FPT_ITT" {...getTestValues(count)} bgcolor="#D7D7D7" data={data}>
                    FPT_ITT
                </Tr>

                <Tr label="FPT_STM" {...getTestValues(count)} data={data}>
                    FPT_STM
                </Tr>

                <Tr label="FTA_SSL" {...getTestValues(count)} bgcolor="#D7D7D7" data={data}>
                    FTA_SSL
                </Tr>

                <Tr label="FTA_MCS" {...getTestValues(count)} data={data}>
                    FTA_MCS
                </Tr>

                <Tr label="FTA_TAH" {...getTestValues(count)} bgcolor="#D7D7D7" data={data}>
                    FTA_TAH
                </Tr>

                <Tr label="FTA_TSE" {...getTestValues(count)} data={data}>
                    FTA_TSE
                </Tr>

                <Tr  label="FDP_ETC" {...getTestValues(count)} bgcolor="#D7D7D7" data={data}>
                    FDP_ETC
                </Tr>

                <Tr label="FDP_SDI" {...getTestValues(count)} data={data}>
                    FDP_SDI
                </Tr>

                <Tr label="FDP_ACC" {...getTestValues(count)} bgcolor="#D7D7D7" data={data}>
                    FDP_ACC
                </Tr>

                <Tr label="FDP_ACF" {...getTestValues(count)} data={data}>
                    FDP_ACF
                </Tr>

                <Tr label="FCS_HTTPS_EXT" {...getTestValues(count)} bgcolor="#D7D7D7" data={data}>
                    FCS_HTTPS_EXT
                </Tr>

                <Tr label="FCS-DTLS_EXT" {...getTestValues(count)} data={data}>
                    FCS-DTLS_EXT
                </Tr>

                <Tr  label="FCS_X509_EXT" {...getTestValues(count)} bgcolor="#D7D7D7" data={data}>
                    FCS_X509_EXT
                </Tr>

                <Tr label="FPT_API_EXT" {...getTestValues(count)} data={data}>
                    FPT_API_EXT
                </Tr>

                <Tr  label="FPT_AEX_EXT" {...getTestValues(count)} bgcolor="#D7D7D7" data={data}>
                    FPT_AEX_EXT
                </Tr>

                <Tr label="FPT_LIB_EXT" {...getTestValues(count)} data={data}>
                    FPT_LIB_EXT
                </Tr>

                <tr style={{ height: '23pt' }}>
                    <td style={{ width: '434pt' }} colSpan="5" bgcolor="#FF0000">
                        <p
                            className="s66"
                            style={{
                                paddingTop: '1pt',
                                paddingLeft: '89pt',
                                paddingRight: '88pt',
                                textIndent: '0pt',
                                textAlign: 'center'
                            }}
                        >
                            : نتیجه نهایی ارزیابی (درصد انطباق بیان شود )
                        </p>
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

export default ReportTestSecond;

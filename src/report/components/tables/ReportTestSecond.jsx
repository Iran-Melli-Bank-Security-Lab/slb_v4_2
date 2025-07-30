import React from 'react';
import "./document.css";
import Tr from './Tr';

const ReportTestSecond = ({count}) => {

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
            cellSpacing="0"
        >
            <tbody>
                <Tr {...getTestValues(count)}>
                    FRU_FLT
                </Tr>

                <Tr {...getTestValues(count)} bgcolor="#D7D7D7">
                    FDP_RIP
                </Tr>

                <Tr {...getTestValues(count)}>
                    FDP_ITC
                </Tr>

                <Tr {...getTestValues(count)} bgcolor="#D7D7D7">
                    FMT_MOF
                </Tr>

                <Tr {...getTestValues(count)}>
                    FMT_MTD
                </Tr>

                <Tr {...getTestValues(count)} bgcolor="#D7D7D7">
                    FMT_SMF
                </Tr>

                <Tr {...getTestValues(count)}>
                    FMT_SMR
                </Tr>

                <Tr {...getTestValues(count)} bgcolor="#D7D7D7">
                    FMT_MSA
                </Tr>

                <Tr {...getTestValues(count)}>
                    FPT_TUD_EXT
                </Tr>

                <Tr {...getTestValues(count)} bgcolor="#D7D7D7">
                    FPT_FLS
                </Tr>

                <Tr {...getTestValues(count)}>
                    FPT_TDC
                </Tr>

                <Tr {...getTestValues(count)} bgcolor="#D7D7D7">
                    FPT_ITT
                </Tr>

                <Tr {...getTestValues(count)}>
                    FPT_STM
                </Tr>

                <Tr {...getTestValues(count)} bgcolor="#D7D7D7">
                    FTA_SSL
                </Tr>

                <Tr {...getTestValues(count)}>
                    FTA_MCS
                </Tr>

                <Tr {...getTestValues(count)} bgcolor="#D7D7D7">
                    FTA_TAH
                </Tr>

                <Tr {...getTestValues(count)}>
                    FTA_TSE
                </Tr>

                <Tr {...getTestValues(count)} bgcolor="#D7D7D7">
                    FDP_ETC
                </Tr>

                <Tr {...getTestValues(count)}>
                    FDP_SDI
                </Tr>

                <Tr {...getTestValues(count)} bgcolor="#D7D7D7">
                    FDP_ACC
                </Tr>

                <Tr {...getTestValues(count)}>
                    FDP_ACF
                </Tr>

                <Tr {...getTestValues(count)} bgcolor="#D7D7D7">
                    FCS_HTTPS_EXT
                </Tr>

                <Tr {...getTestValues(count)}>
                    FCS-DTLS_EXT
                </Tr>

                <Tr {...getTestValues(count)} bgcolor="#D7D7D7">
                    FCS_X509_EXT
                </Tr>

                <Tr {...getTestValues(count)}>
                    FPT_API_EXT
                </Tr>

                <Tr {...getTestValues(count)} bgcolor="#D7D7D7">
                    FPT_AEX_EXT
                </Tr>

                <Tr {...getTestValues(count)}>
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

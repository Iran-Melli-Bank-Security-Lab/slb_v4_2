import React from 'react';
import "./document.css";
import Tr from './Tr';
import TestOrder from './TestOrder';

const SummaryTest = ({count}) => {

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
        > <TestOrder>
        دسته آسیب پذیری
    </TestOrder>
            <tbody>
               

                <Tr {...getTestValues(count)}>
                    آزمون جمع آوری اطلاعات
                </Tr>

                <Tr {...getTestValues(count)} bgcolor="#D7D7D7">
                    آزمون مدیریت پیکربندی و استقرار
                </Tr>

                <Tr {...getTestValues(count)}>
                    آزمون مدیریت هویت
                </Tr>

                <Tr {...getTestValues(count)} bgcolor="#D7D7D7">
                    آزمون احراز هویت
                </Tr>

                <Tr {...getTestValues(count)}>
                    آزمون مجازی شماری
                </Tr>

                <Tr {...getTestValues(count)} bgcolor="#D7D7D7">
                    آزمون مدیریت نشست
                </Tr>

                <Tr {...getTestValues(count)}>
                    آزمون اعتبار سنجی ورودی
                </Tr>

                <Tr {...getTestValues(count)} bgcolor="#D7D7D7">
                    آزمون مدیریت خطاها
                </Tr>

                <Tr {...getTestValues(count)}>
                    آزمون رمزنگاری
                </Tr>

                <Tr {...getTestValues(count)} bgcolor="#D7D7D7">
                    آزمون منطق کسب و کار
                </Tr>
                
                <Tr {...getTestValues(count)} bgcolor="#D7D7D7">
                    آزمون سمت مشتری
                </Tr>

                <Tr {...getTestValues(count)}>
                    <span>API آزمون</span>
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

export default SummaryTest;

import React from "react";

const MyTable = () => {

    return (
        <table style={{ borderCollapse: "collapse", marginLeft: "20.744pt" , backgroundColor:"white"}} cellSpacing="0">
            <tbody>
                <tr style={{ height: "31pt" }}>
                    <td
                        style={{
                            width: "464pt",
                            borderTopStyle: "solid",
                            borderTopWidth: "5pt",
                            borderTopColor: "#F4AE23",
                        }}
                        colSpan="2"
                        bgcolor="#006FC0"
                    >
                        <p
                            className="s5identifier"
                            style={{
                                paddingTop: "3pt",
                                paddingLeft: "151pt",
                                paddingRight: "234pt",
                                textIndent: "0pt",
                                textAlign: "center",
                            }}
                        >
                            میزان مخاطرات
                        </p>
                    </td>
                </tr>
                <tr style={{ height: "41pt" }}>
                    <td style={{ width: "368pt" }} bgcolor="#D7D7D7">
                        <p
                            className="s13p5"
                            style={{
                                paddingTop: "1pt",
                                paddingRight: "15pt",
                                textIndent: "0pt",
                                textAlign: "right",
                            }}>

آسیب پذیری هایی که تنها منجر به نشت اطلاعات کاربردی به فرد نفوذگر خواهد شد و به او در راستای طراحی حملات هدفمند کمک خواهد کرد.




                        </p>
                       
                    </td>
                    <td style={{ width: "83pt" }} bgcolor="#006FC0">
                        <p
                            className="s32"
                            style={{
                                paddingTop: "11pt",
                                paddingLeft: "5pt",
                                paddingRight: "4pt",
                                textIndent: "0pt",
                                textAlign: "center",
                            }}
                        >
                            Informational
                        </p>
                    </td>
                </tr>
                <tr style={{ height: "41pt" }}>
                    <td style={{ width: "368pt" }}>
                        <p
                            className="s13p5"
                            style={{
                                paddingTop: "1pt",
                                paddingRight: "15pt",
                                textIndent: "0pt",
                                textAlign: "right",
                            }}
                        >

آسیب پذیری هایی که دارای رتبه بندی پایین هستند، ممکن است اطلاعاتی را به کاربران غیر مجاز یا ناشناس جهت حمله به برنامه کاربردی نشت دهند.
                        </p>
                        
                    </td>
                    <td style={{ width: "83pt" }} bgcolor="#FFF1CC">
                        <p
                            className="s33"
                            style={{
                                paddingTop: "11pt",
                                paddingLeft: "4pt",
                                paddingRight: "4pt",
                                textIndent: "0pt",
                                textAlign: "center",
                            }}
                        >
                            Low
                        </p>
                    </td>
                </tr>
                <tr style={{ height: "42pt" }}>
                    <td style={{ width: "368pt" }} bgcolor="#D7D7D7">
                        <p
                            className="s13p5"
                            style={{
                                paddingTop: "1pt",
                                paddingRight: "16pt",
                                textIndent: "0pt",
                                textAlign: "right",
                            }}
                        >
آسیب پذیری هایی که دارای رتبه بندی متوسط هستند، میتواند برای مهاجم دسترسی کاربر غیر مجاز در برنامه کاربردی یا داده های حساس فراهم آورد.

                        </p>
                        
                    </td>
                    <td style={{ width: "83pt" }} bgcolor="#FFD966">
                        <p
                            className="s33"
                            style={{
                                paddingTop: "11pt",
                                paddingLeft: "5pt",
                                paddingRight: "4pt",
                                textIndent: "0pt",
                                textAlign: "center",
                            }}
                        >
                            Medium
                        </p>
                    </td>
                </tr>
                <tr style={{ height: "41pt" }}>
                    <td style={{ width: "368pt" }}>
                        <p
                            className="s13p5"
                            style={{
                                paddingTop: "1pt",
                                paddingRight: "15pt",
                                textIndent: "0pt",
                                textAlign: "right",
                            }}
                        >
آسیب پذیری هایی که دارای رتبه بندی بالا هستند، به طور مستقیم موجب می شود که مهاجم دسترسی به سیستم، برنامه کاربردی یا داده های حساس را در اختیار داشته باشد.

                        </p>
                       
                    </td>
                    <td style={{ width: "83pt" }} bgcolor="#F83913">
                        <p
                            className="s32"
                            style={{
                                paddingTop: "11pt",
                                paddingLeft: "5pt",
                                paddingRight: "4pt",
                                textIndent: "0pt",
                                textAlign: "center",
                            }}
                        >
                            High
                        </p>
                    </td>
                </tr>
                <tr style={{ height: "59pt" }}>
                    <td style={{ width: "368pt" }} bgcolor="#D7D7D7">
                        <p
                            className="s13p5"
                            style={{
                                paddingTop: "1pt",
                                paddingLeft: "5pt",
                                paddingRight: "15pt",
                                textIndent: "0pt",
                                lineHeight: "144%",
                                textAlign: "right",
                            }}
                        >
آسیب پذیری هایی که دارای رتبه بندی بحرانی هستند باعث افزایش سطح دسترسی مهاجم بر روی سیستم قربانی، برنامه های کاربردی یا داده های حساس و همچنین دسترسی بیشتر به میزبان ها یا سایر سامانه های مجاور خواهد شد.


                        </p>
                        
                    </td>
                    <td style={{ width: "83pt" }} bgcolor="#BE1204">
                        <p style={{ textIndent: "0pt", textAlign: "left" }}><br /></p>
                        <p
                            className="s32"
                            style={{
                                paddingLeft: "5pt",
                                paddingRight: "4pt",
                                textIndent: "0pt",
                                textAlign: "center",
                            }}
                        >
                            Critical
                        </p>
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

export default MyTable;

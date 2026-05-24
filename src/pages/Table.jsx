import React, { useState } from 'react';
import TableRowHeader from '../components/afta/TableRowHeader';
import SecondColumn from '../components/afta/SecondColumn';
import SecondTable from '../components/afta/SecondTable';
import { COLUMN_CONTENTS, TABLE_ROWS_DATA, TABLE_ROWS_DATA2, TABLE_ROWS_DATA4, TABLE_ROWS_DATA5 } from '../components/afta/constants';



const AuditTable = () => {

    const [checkedRows, setCheckedRows] = useState({});

    const handleCheckboxChange = (id) => {
        setCheckedRows((prevState) => ({
            ...prevState,
            [id]: !prevState[id], // معکوس کردن مقدار قبلی (اگر true بود false شود و بالعکس)
        }));
    };

    return <>


        <table width="975" cellpadding="5" cellspacing="0" dir='rtl'>

            <tbody>
                <tr>
                    <td width="31" height="81" style={{ border: '1px solid #000000', padding: '0in 0.05in' }}>
                        <p className="western" align="center" style={{ orphans: 2, widows: 2, textIndent: '0in', marginLeft: '0.08in' }}>
                            <font face="B Nazanin" size="3" style={{ fontSize: '12pt' }}>
                                <span lang="ar-SA"><b>شماره الزام</b></span>
                            </font>
                        </p>
                    </td>
                    <td colSpan="4" width="523" style={{ border: '1px solid #000000', padding: '0in 0.05in' }}>
                        <p className="western" align="center" style={{ orphans: 2, widows: 2, textIndent: '0in', marginLeft: '0in' }}>
                            <font face="B Nazanin" size="3" style={{ fontSize: '12pt' }}>
                                <span lang="ar-SA"><b>کلاس ممیزی </b></span>
                            </font>
                            <font size="2" style={{ fontSize: '11pt' }}><b>(</b></font>
                            <font face="B Nazanin" size="3" style={{ fontSize: '12pt' }}>
                                <span lang="ar-SA"><b>لاگ</b></span>
                            </font>
                            <font size="2" style={{ fontSize: '11pt' }}><b>)</b></font>
                        </p>
                    </td>
                    <td width="289" style={{ border: '1px solid #000000', padding: '0in 0.05in' }}>
                        <p className="western" align="center" style={{ orphans: 2, widows: 2, textIndent: '0in', marginLeft: '0in' }}>
                            <font face="B Nazanin" size="3" style={{ fontSize: '12pt' }}>
                                <span lang="ar-SA"><b>توضیحات</b></span>
                            </font>
                        </p>
                    </td>
                </tr>

                <TableRowHeader rowSpan={27} number={1} colSpan={3}>
                    <p className="western" style={{ orphans: 2, widows: 2, textIndent: '0in', marginLeft: '0in' }}>
                        <font face="B Nazanin" size="3" style={{ fontSize: '12pt' }}>
                            <span lang="ar-SA"><b>محصول باید برای موارد مشخص شده كه در ذیل آمده است، ركورد ممیزی تولید كند </b></span>
                        </font>
                        <font size="2" style={{ fontSize: '11pt' }}><b>(</b></font>
                        <font face="B Nazanin" size="3" style={{ fontSize: '12pt' }}>
                            <span lang="ar-SA"><b>لاگ ثبت نماید</b></span>
                        </font>
                        <font size="2" style={{ fontSize: '11pt' }}><b>).</b></font>
                    </p>

                </TableRowHeader>

                <SecondColumn>
                    {COLUMN_CONTENTS.SET_EVENTS}
                </SecondColumn>

                {TABLE_ROWS_DATA.map((row) => (
                    <SecondTable
                        key={row.id}
                        text={row.text}
                        isChecked={!!checkedRows[row.id]}
                        onToggle={() => handleCheckboxChange(row.id)}
                    />
                ))}


                <TableRowHeader rowSpan={8} number={2} colSpan={3}>
                    <p className="western" style={{ orphans: 2, widows: 2, textIndent: '0in', marginLeft: '0in' }}>
                        <font face="B Nazanin" size="3" style={{ fontSize: '12pt' }}>
                            <span lang="ar-SA"><b>محصول باید برای هر ركورد ممیزی تولید شده، مشخصاتی كه درذیل آمده است را</b></span>
                        </font>
                        <font face="B Nazanin" size="3" style={{ fontSize: '12pt' }}>
                            <span lang="ar-SA"><b>ثبت نماید.</b></span>
                        </font>
                    </p>

                </TableRowHeader>

                <SecondColumn rowSpan={7}>
                    {COLUMN_CONTENTS.USER_INFO}
                </SecondColumn>

                {TABLE_ROWS_DATA2.map((row) => (
                    <SecondTable
                        key={row.id}
                        text={row.text}
                        isChecked={!!checkedRows[row.id]}
                        onToggle={() => handleCheckboxChange(row.id)}
                    />
                ))}

                <TableRowHeader rowSpan={2} number={3} colSpan={3}>
                    <p className="western" style={{ orphans: 2, widows: 2, textIndent: '0in', marginLeft: '0in' }}>
                        <font face="B Nazanin" size="3" style={{ fontSize: '12pt' }}>
                            <span lang="ar-SA"><b>
                                محصول باید ركوردهای ممیزی را در برابر دسترسی غیرمجاز محافظت نماید .

                            </b></span>
                        </font>

                    </p>

                </TableRowHeader>


                <SecondColumn rowSpan={1}>

                </SecondColumn>

                <TableRowHeader rowSpan={5} number={4} >
                    <p className="western" style={{ orphans: 2, widows: 2, textIndent: '0in', marginLeft: '0in' }}>
                        <font face="B Nazanin" size="3" style={{ fontSize: '12pt' }}>
                            <span lang="ar-SA"><b>محصول باید برای هر ركورد ممیزی تولید شده، مشخصاتی كه درذیل آمده است را</b></span>
                        </font>
                        <font face="B Nazanin" size="3" style={{ fontSize: '12pt' }}>
                            <span lang="ar-SA"><b>ثبت نماید.</b></span>
                        </font>
                    </p>

                </TableRowHeader>

                <SecondColumn rowSpan={4}>
                    {COLUMN_CONTENTS.FOUR}
                </SecondColumn>

                {TABLE_ROWS_DATA4.map((row) => (
                    <SecondTable
                        key={row.id}
                        text={row.text}
                        isChecked={!!checkedRows[row.id]}
                        onToggle={() => handleCheckboxChange(row.id)}
                    />
                ))}

                <TableRowHeader rowSpan={9} number={5} colSpan={3}>
                    <p className="western" style={{ orphans: 2, widows: 2, textIndent: '0in', marginLeft: '0in' }}>
                        <font face="B Nazanin" size="3" style={{ fontSize: '12pt' }}>
                            <span lang="ar-SA"><b>
                                محصول باید امكان انتخاب و مرتب‌سازی برای ركوردهای ممیزی تولید شده
                                را بر اساس فیلدها و پارامترهای مختلف، برای كاربر مجاز فراهم نماید .

                            </b></span>
                        </font>

                    </p>

                </TableRowHeader>

                <SecondColumn rowSpan={9}>
                    {COLUMN_CONTENTS.FIVE}
                </SecondColumn>

 {TABLE_ROWS_DATA5.map((row) => (
                    <SecondTable
                        key={row.id}
                        text={row.text}
                        isChecked={!!checkedRows[row.id]}
                        onToggle={() => handleCheckboxChange(row.id)}
                    />
                ))}

                <TableRowHeader rowSpan={5} number={6} >
                    <p className="western" style={{ orphans: 2, widows: 2, textIndent: '0in', marginLeft: '0in' }}>
                        <font face="B Nazanin" size="3" style={{ fontSize: '12pt' }}>
                            <span lang="ar-SA"><b>
                                
                                محصول باید هرگونه حذف و تغییر غیرمجاز در ركوردهای ممیزی راتشخیص دهد و در صورت امكان جلوگیری نماید 
                                
                                </b></span>
                        </font>
                        
                    </p>

                </TableRowHeader>




            </tbody>
        </table>

    </>


};

export default AuditTable;

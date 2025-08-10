import React from 'react';
import moment from 'moment-jalaali';
moment.loadPersian({ usePersianDigits: true, dialect: 'persian-modern' });

const faDate = (v) => {
  if (!v) return '';
  const t = typeof v === 'number' ? v : new Date(v).getTime(); // هم ms، هم ISO
  return moment(t).format('jYYYY/jMM/jDD');
};

const ControlQualify = ({project}) => {
  return (
    <table style={{ borderCollapse: 'collapse', marginLeft: '17.264pt', 
      backgroundColor:"white"
     }} cellSpacing="0">
      <tbody>
        <tr style={{ height: '23pt' }}>
          <td
            style={{
              width: '83pt',
              borderTopStyle: 'solid',
              borderTopWidth: '5pt',
              borderTopColor: '#F4AE23',
              borderBottomStyle: 'solid',
              borderBottomWidth: '1pt',
            }}
            bgcolor="#006FC0"
          >
          </td>
          <td
            style={{
              width: '26pt',
              borderTopStyle: 'solid',
              borderTopWidth: '5pt',
              borderTopColor: '#F4AE23',
              borderBottomStyle: 'solid',
              borderBottomWidth: '1pt',
            }}
            bgcolor="#006FC0"
          >
                        <p className="s5identifier" style={{fontFamily:"btitr", paddingTop: '5pt', textIndent: '0pt', textAlign: 'right' }}>
                          {faDate(project?.verifiedReportByAdmin)}
                        </p>

          </td>
          <td
            style={{
              width: '102pt',
              borderTopStyle: 'solid',
              borderTopWidth: '5pt',
              borderTopColor: '#F4AE23',
              borderBottomStyle: 'solid',
              borderBottomWidth: '1pt',
            }}
            bgcolor="#006FC0"
          >
            <p className="s5identifier"
             style={{
               paddingTop: '5pt', paddingLeft: '4pt', 
               textIndent: '0pt', textAlign: 'left'  , fontFamily:"btitr"}}>: تاریخ تایید</p>
          </td>
          <td
            style={{
              width: '220pt',
              borderTopStyle: 'solid',
              borderTopWidth: '5pt',
              borderTopColor: '#F4AE23',
              borderBottomStyle: 'solid',
              borderBottomWidth: '1pt',
            }}
            bgcolor="#006FC0"
          >
            <p dir="rtl" className="s5identifier" style={{ fontFamily:"btitr",  paddingTop: '3pt', textIndent: '0pt',  }}>
              مسئول کنترل :
              <span className="s5identifier" style={{fontFamily:"btitr", margin: '2px' , paddingTop:"2px" }}>

                حسین نوروزی

              </span>
            </p>
          </td>
          <td
            style={{
              width: '39pt',
              borderTopStyle: 'solid',
              borderTopWidth: '5pt',
              borderTopColor: '#F4AE23',
            }}
            bgcolor="#006FC0"
          >
            {/* <p style={{ textIndent: '0pt', textAlign: 'left' }}><br /></p> */}
          </td>
        </tr>
        <tr style={{ height: '21pt' }}>
          <td
            style={{
              width: '419pt',
              borderTopStyle: 'solid',
              borderTopWidth: '1pt',
            }}
            colSpan="4"
            bgcolor="#D7D7D7"
          >
            <p className="s6identifier" style={{fontSize:"13pt" ,  paddingTop: '1pt', paddingLeft: '172pt', paddingRight: '172pt', textIndent: '0pt', textAlign: 'center' }}>
              موارد بررسی ‌شده
            </p>
          </td>
          <td style={{ width: '39pt' }} bgcolor="#006FC0">
            <p className="s5identifier" style={{ paddingTop: '1pt', paddingRight: '10pt', textIndent: '0pt', textAlign: 'right' }}>تأیید</p>
          </td>
        </tr>
        <tr style={{ height: '22pt' }}>
          <td style={{ width: '419pt' }} colSpan="4">
            <p dir='rtl' className="s13identifier" style={{ paddingTop: '3pt', paddingLeft: '224pt', textIndent: '0pt', textAlign: 'left' }}>
              مستند به لحاظ رعایت مسائل املایی مورد تأیید است.

            </p>
          </td>
          <td style={{ width: '39pt' }} bgcolor="#006FC0">
            <p className="s14identifier" style={{ paddingTop: '4pt', paddingRight: '14pt', textIndent: '0pt', textAlign: 'right' }}></p>
          </td>
        </tr>
        <tr style={{ height: '22pt' }}>
          <td style={{ width: '419pt' }} colSpan="4" bgcolor="#D7D7D7">
            <p dir='rtl' className="s13identifier" style={{ paddingTop: '3pt', paddingLeft: '167pt', textIndent: '0pt', textAlign: 'left' }}>

              مستند به لحاظ رعایت مسائل نگارشی ادبیات فارسی مورد تأیید است.

            </p>
          </td>
          <td style={{ width: '39pt' }} bgcolor="#006FC0">
            <p className="s14identifier" style={{ paddingTop: '3pt', paddingRight: '14pt', textIndent: '0pt', textAlign: 'right' }}></p>
          </td>
        </tr>
        <tr style={{ height: '17pt' }}>
          <td style={{ width: '419pt' }} colSpan="4">
            <p dir='rtl' className="s13identifier" style={{ paddingLeft: '200pt', textIndent: '0pt', textAlign: 'left' }}>
              مستند به لحاظ رعایت مسائل نگارش علمی مورد تأیید است.
            </p>
          </td>
          <td style={{ width: '39pt' }} bgcolor="#006FC0">
            <p className="s14identifier" style={{ paddingTop: '1pt', paddingRight: '14pt', textIndent: '0pt', textAlign: 'right' }}></p>
          </td>
        </tr>
        <tr style={{ height: '21pt' }}>
          <td style={{ width: '419pt' }} colSpan="4" bgcolor="#D7D7D7">
            <p dir='rtl' className="s13identifier" style={{ paddingTop: '3pt', paddingLeft: '193pt', textIndent: '0pt', textAlign: 'left' }}>
              مستند به لحاظ رعایت مسائل فنی و تخصصی مورد تأیید است.

            </p>
          </td>
          <td style={{ width: '39pt' }} bgcolor="#006FC0">
            <p className="s14identifier" style={{ paddingTop: '3pt', paddingRight: '14pt', textIndent: '0pt', textAlign: 'right' }}></p>
          </td>
        </tr>
        <tr style={{ height: '17pt' }}>
          <td
            style={{
              width: '419pt',
              borderBottomStyle: 'solid',
              borderBottomWidth: '1pt',
            }}
            colSpan="4"
          >
            <p dir='rtl' className="s13identifier" style={{ paddingLeft: '268pt', textIndent: '0pt', textAlign: 'left' }}>

              مستند جوابگوی نیاز واقعی کارفرما است.
            </p>
          </td>
          <td
            style={{
              width: '39pt',
              borderBottomStyle: 'solid',
              borderBottomWidth: '1pt',
            }}
            bgcolor="#006FC0"
          >
            <p className="s14identifier" style={{ paddingTop: '1pt', paddingRight: '14pt', textIndent: '0pt', textAlign: 'right' }}></p>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default ControlQualify;

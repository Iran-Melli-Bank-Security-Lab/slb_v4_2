import React from 'react';
import Tr from './IdentifierDoc/Tr';
import Td from './IdentifierDoc/Td';

import { ordinalLabel } from './OrdinalLabel';
import moment from 'moment-jalaali';
moment.loadPersian({ usePersianDigits: true, dialect: 'persian-modern' });

const faDate = (v) => {
  if (!v) return '';
  const t = typeof v === 'number' ? v : new Date(v).getTime(); // هم ms، هم ISO
  return moment(t).format('jYYYY/jMM/jDD');
};


const IdentifierDoc = ({ project  }) => {


  return (

    <table style={{ backgroundColor:"white",borderCollapse: 'collapse', marginLeft: '3pt' }} cellSpacing="0">

      <tbody>

        <tr style={{ height: '36pt' }}>
          <td
            style={{
              width: '256pt',
              borderTopStyle: 'solid',
              borderTopWidth: '5pt',
              borderTopColor: '#F4AE23',
              borderBottomStyle: 'solid',
              borderBottomWidth: '1pt',
            }}
            colSpan="3"
            bgcolor="#006FC0"
          >
            <p
              style={{
                paddingTop: '4pt',
                
                textIndent: '0pt',
                textAlign: 'center',
              }}
            >
              <span className="s2identifier" >SLB-W-0309222900110603</span>
            </p>
          </td>
          
          
          <td
            style={{
              width: '102pt',
              borderTopStyle: 'solid',
              borderTopWidth: '5pt',
              borderTopColor: '#F4AE23',
            }}
            bgcolor="#006FC0"
          >
            <p
              className="s3identifier"
              style={{
                paddingTop:'4pt',
                paddingLeft: '8pt',
                paddingRight: '4pt',
                textIndent: '0pt',
                lineHeight: '22pt',
                textAlign: 'center',
                fontFamily:"btitr"
              }}
            >
              شناسنامه مستند
            </p>
          </td>
        </tr>
       

{/* from here  */}
    
<Tr>
  <Td value="LQS-F708-02/00" header="کد مدرک" bgcolor="#D9D9D9" fontFamily="Times New Roman"/>
</Tr>

<Tr>
  <Td fontFamily="btitr"  value={project?.projectName} header="نام سامانه"/>
</Tr>

    <Tr>
      <Td fontFamily="btitr" className="s7" value=" فوق محرمانه" header="طبقه بندی مستند" bgcolor="#D9D9D9"/>
    </Tr>
<Tr>
  <Td fontFamily="btitr"
      value={faDate(project?.identifier?.projectAcceptanceDate)}
      header="تاریخ پذیرش سامانه" />
</Tr>

  <Tr>
  <Td fontFamily="btitr"
      value={faDate(project?.identifier?.testDate)}
      header="تاریخ آزمون" />
</Tr>
 <Tr>
  <Td fontFamily="btitr"
      value={faDate(project?.identifier?.reportIssueDate)}
      header="تاریخ صدور گزارش"
      bgcolor="#D9D9D9" />
</Tr>



   <Tr>
    <Td fontFamily="btitr" value={project?.version} header="نسخه سامانه" bgcolor="#D9D9D9"/>
   </Tr>

   <Tr>
    <Td fontFamily="btitr" className="s6" value="بانک ملی ایران" header="کارفرما"/>
   </Tr>


  <Tr>
    {/* <Td fontFamily="btitr" value={project.identifier.employer} header="پیمانکار"  bgcolor="#D9D9D9"/> */}
    <Td fontFamily="btitr" value={project?.identifier?.beneficiaryOffice} header="پیمانکار"  bgcolor="#D9D9D9"/>

  </Tr>

  <Tr>
    <Td fontFamily="btitr" value={project?.identifier?.employer} header="بهره بردار"  />

  </Tr>

  <Tr>
    <Td fontFamily="btitr" value={project?.letterNumber} header="شماره نامه دریافتی"  bgcolor="#D9D9D9"/>

  </Tr>

<Tr>
  <Td
    fontFamily="btitr"
    value={ordinalLabel(project?.numberOfTest)}   // ← «مرتبه اول/دوم/...»
    header="تعداد دفعات آزمون"
  />
</Tr>



      </tbody>


    </table>
  );
};

export default IdentifierDoc;

import React from 'react';
import getColor from '../../utils/getColor';
import { getMaxCvssValue } from '../../utils/getMaxCvssValue';

const MyTable = ({ data, className = "cy291" }) => {

  console.log("line7: " ,data  )
  let borderTopColor
  const maxCvss = parseFloat(getMaxCvssValue(data))

  if (maxCvss >= 9.0 && maxCvss <= 10.0) {
    borderTopColor = getColor(maxCvss)
  } else if (maxCvss <= 8.9 && maxCvss >= 7.0) {
    borderTopColor = getColor(maxCvss)

  } else if (maxCvss <= 6.9 && maxCvss >= 4.0) {
    borderTopColor = getColor(maxCvss)

  } else if (maxCvss >= 0.1 && maxCvss <= 3.9) {
    console.log("line 11 max : ", maxCvss)

    borderTopColor = getColor(maxCvss)
    console.log("line 11 max : ", borderTopColor)

  } else if (maxCvss === 0.0) {
    borderTopColor = getColor(maxCvss)
  } else if (maxCvss < 0) {
    borderTopColor = "#00AF50"
  }

  return (
    <div className={`c newcx90 ${className} newcw52  chbb`}>

      <table style={{ borderCollapse: 'collapse', marginLeft: '10.525pt' }} cellSpacing="0">
        <thead>
          <tr style={{ height: '35pt' }}>
            <th style={{ width: '46pt', borderTopStyle: 'solid', borderTopWidth: '5pt', borderTopColor: `${borderTopColor}`, backgroundColor: '#006FC0' }}>
              <p className='s11' style={{
                textIndent: '0pt', textAlign: 'center',
                fontFamily: "Calibri"
              }}>PAGE</p>
            </th>
            <th style={{ width: '30pt', borderTopStyle: 'solid', borderTopWidth: '5pt', borderTopColor: `${borderTopColor}`, backgroundColor: '#006FC0' }}>
              <p className='s11' style={{ textIndent: '0pt', textAlign: 'center', fontFamily: "Calibri" }}>CVSS</p>
            </th>
            <th style={{ width: '35pt', borderTopStyle: 'solid', borderTopWidth: '5pt', borderTopColor: `${borderTopColor}`, backgroundColor: '#006FC0' }}>
              <p className='s11' style={{ textIndent: '0pt', textAlign: 'center', fontFamily: "Calibri" }}>State</p>
            </th>
            <th style={{ width: '506pt', borderTopStyle: 'solid', borderTopWidth: '5pt', borderTopColor: `${borderTopColor}`, backgroundColor: '#006FC0' }}>
              <p style={{ textIndent: '0pt', textAlign: 'left' }}><br /></p>
            </th>
          </tr>
        </thead>
        <tbody >
          {data.map((row, index) => (
            <tr key={index} style={{ backgroundColor: `${row.state === "FAILE" ? getColor(parseFloat(row.cvss)) : (index % 2 === 0 ? '#D7D7D7' : '#FFF')} ` }}>

              <td style={{ height: '35pt', width: '36pt', textAlign: 'center', verticalAlign: 'middle' }}>
                <p style={{ color: `${parseFloat(row.cvss) >= 0.1 && parseFloat(row.cvss) <= 3.9 ? "#000000" : "#ffffff"}`, fontWeight: "bold" }} className="s15">{row.page}</p>
              </td>
              <td style={{ width: '30pt', textAlign: 'center', verticalAlign: 'middle' }}>
                <p style={{ color: `${parseFloat(row.cvss) >= 0.1 && parseFloat(row.cvss) <= 3.9 ? "#000000" : "#ffffff"}`, fontWeight: "bold" }} className="s15">{row.cvss}</p>
              </td>
              <td style={{ width: '50pt', textAlign: 'center', verticalAlign: 'middle' }}>
                <p className="s15" style={{
                  color: `${parseFloat(row.cvss) >= 0.1 && parseFloat(row.cvss) <= 3.9 ? "#000000" : row.state === "PASS" ? "#000000" : "#ffffff"}`
                  , fontWeight: "bolder"
                }}>{row.state}</p>
              </td>            

              <td dir='rtl' style={{ width: '80pt', backgroundColor: `${row.state === "FAILE" ? getColor(parseFloat(row.cvss)) : '#006FC0'}`, textAlign: 'right', verticalAlign: 'middle' }}>
                <p className=" cs14  ff6  ccomposite"
                  style={{
                    color: `${parseFloat(row.cvss) >= 0.1 && parseFloat(row.cvss) <= 3.9 ? "#000000" : "#ffffff"}`, paddingTop: '0pt', paddingRight: '10pt', textIndent: '0pt',

                  }}>
                  <span dir='rtl'>
                    {row.description}
                    <span dir="rtl" style={{ marginRight: '5px' }}>{row.code}</span>
                  </span>
                </p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyTable;

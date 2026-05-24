import React from 'react';

const TableRowHeader = ({children,rowSpan, number , colSpan=3}) => {
  return (
    <tr>
      <td rowSpan={rowSpan} width="31" style={{ verticalAlign: 'top', border: '1px solid #000000', padding: '0in 0.05in' }}>
        <p className="western" align="center" style={{ orphans: 2, widows: 2, textIndent: '0in', marginLeft: '0in' }}>
          <font size="2" style={{ fontSize: '11pt' }}>{number}</font>
        </p>
      </td>
      <td colSpan={colSpan} width="493" style={{ border: '1px solid #000000', padding: '0in 0.05in' }}>
       
       {children}

      </td>
      <td rowSpan={rowSpan} width="20" style={{ verticalAlign: 'top', border: '1px solid #000000', padding: '0in 0.05in' }}>
        <p className="western" align="center" style={{ orphans: 2, widows: 2, textIndent: '0in', marginLeft: '0in', marginBottom: '0.01in' }}>
          <br />
          <br />
        </p>
        <p className="western" align="center" style={{ orphans: 2, widows: 2, textIndent: '0in', marginLeft: '0in' }}>
          
        </p>
      </td>
      <td rowSpan={rowSpan} width="289" style={{ border: '1px solid #000000', padding: '0in 0.05in' }}>
        <p className="western" style={{ orphans: 2, widows: 2, textIndent: '0in', marginLeft: '0in' }}>
          <br />
        </p>
      </td>
    </tr>
  );
};

export default TableRowHeader;

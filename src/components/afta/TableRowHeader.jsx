import React from 'react';

const TableRowHeader = ({children}) => {
  return (
    <tr>
      <td rowSpan="27" width="31" style={{ verticalAlign: 'top', border: '1px solid #000000', padding: '0in 0.05in' }}>
        <p className="western" align="center" style={{ orphans: 2, widows: 2, textIndent: '0in', marginLeft: '0in' }}>
          <font size="2" style={{ fontSize: '11pt' }}>1</font>
        </p>
      </td>
      <td colSpan="3" width="493" style={{ border: '1px solid #000000', padding: '0in 0.05in' }}>
       
       {children}

      </td>
      <td rowSpan="27" width="20" style={{ verticalAlign: 'top', border: '1px solid #000000', padding: '0in 0.05in' }}>
        <p className="western" align="center" style={{ orphans: 2, widows: 2, textIndent: '0in', marginLeft: '0in', marginBottom: '0.01in' }}>
          <br />
          <br />
        </p>
        <p className="western" align="center" style={{ orphans: 2, widows: 2, textIndent: '0in', marginLeft: '0in' }}>
          
        </p>
      </td>
      <td rowSpan="27" width="289" style={{ border: '1px solid #000000', padding: '0in 0.05in' }}>
        <p className="western" style={{ orphans: 2, widows: 2, textIndent: '0in', marginLeft: '0in' }}>
          <br />
        </p>
      </td>
    </tr>
  );
};

export default TableRowHeader;

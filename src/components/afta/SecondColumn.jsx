import React from 'react';

const SecondColumn = ({children}) => {
  // We define the styles once to keep the JSX clean
  const styles = {
    tdBase: {
      border: '1px solid #000000',
      padding: '0 0.05in',
      textAlign: 'right', // Essential for Persian/Arabic text
      fontFamily: '"B Nazanin", Tahoma, sans-serif',
    }
  };

   return (
    <tr>
      <td rowSpan={26} style={{ ...styles.tdBase, width: '109px' }}>
        {children} 
      </td>
    </tr>
  );
};

export default SecondColumn;

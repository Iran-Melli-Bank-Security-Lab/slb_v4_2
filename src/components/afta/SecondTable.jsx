import React from 'react';

const SecondTable = ({ text, isChecked, onToggle }) => {
  const styles = {
    tdBase: {
      border: '1px solid #000000',
      padding: '0 0.05in',
      textAlign: 'right',
      fontFamily: '"B Nazanin", Tahoma, sans-serif',
    },
  };

  return (
    <tr>
      {/* ستون متن */}
      <td style={{ ...styles.tdBase, width: '344px' }}>
        <p style={{ fontSize: '12pt', margin: 10, lineHeight: '1.5' }}>
          {text}
        </p>
      </td>

      {/* ستون چک‌باکس */}
      <td style={{ ...styles.tdBase, width: '30px', textAlign: 'center' }}>
        <input 
          type="checkbox" 
          checked={isChecked} 
          onChange={onToggle} 
          style={{ cursor: 'pointer', width: '15px', height: '15px' }}
        />
      </td>
    </tr>
  );
};

export default SecondTable;

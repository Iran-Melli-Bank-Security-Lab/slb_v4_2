import React from 'react';

const TableRow = ({ children, height }) => {
    return (
        <tr style={{ height }}>
            {children}
        </tr>
    );
};

export default TableRow;

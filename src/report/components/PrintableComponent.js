// PrintableComponent.js
import React from 'react';

const PrintableComponent = React.forwardRef((props, ref) => {
   
    return (
        <div ref={ref}>
            <h1>Export this page to PDF</h1>
            <p>This is the content you want to print/export to PDF.</p>
            <table>
                <thead>
                    <tr>
                        <th>Header 1</th>
                        <th>Header 2</th>
                        <th>Header 3</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Row 1, Col 1</td>
                        <td>Row 1, Col 2</td>
                        <td>Row 1, Col 3</td>
                    </tr>
                    <tr>
                        <td>Row 2, Col 1</td>
                        <td>Row 2, Col 2</td>
                        <td>Row 2, Col 3</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
});

export default PrintableComponent;

// PrintPage.js
import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
// import PrintableComponent from '../components/PrintableComponent';

import Report  from '../Report';

const PrintPage = () => {
    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    return (
        <div>
            <button  style={{backgroundColor:"red" , color:"blue"}} onClick={handlePrint}>Print this out!</button>
            <Report ref={componentRef} />
        </div>
    );
};

export default PrintPage;

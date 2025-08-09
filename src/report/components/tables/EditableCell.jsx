import React, { useState } from 'react';

const EditableCell = ({ test4 , data  }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(test4 ? "Pass" : "");
    const [bgColor, setBgColor] = useState(test4 && test4 === "Fail" ? "red" : "transparent");



    const handleDoubleClick = () => {
        console.log("data in line 11 : " , data )
        if (test4) setIsEditing(true);
    };

    const handleBlur = () => {
        setIsEditing(false);
    };

    const handleChange = (event) => {
        const newValue = event.target.value;
        setValue(newValue);
        setBgColor(newValue === "Fail" ? "red" : "transparent");
    };

    return (
        <td style={{ width: '65pt', paddingTop: '5px', backgroundColor: bgColor }}>
            {isEditing ? (
                <select
                    value={value}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoFocus
                >
                    <option value="Pass">Pass</option>
                    <option value="Fail">Fail</option>
                </select>
            ) : (
                <p
                    className="s15"
                    style={{
                        textAlign: 'center',
                    }}
                    onDoubleClick={handleDoubleClick}
                >
                    {value === "Pass" ? "✔" : value === "Fail" ? "✖" : ""}
                </p>
            )}
        </td>
    );
};

export default EditableCell;

import React, { useMemo, useState } from 'react';
import { collectEligibleComponents } from '../../utils/collectEligibleComponents';

const EditableCell = ({ test4, data, label }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(test4 ? 'Pass' : '');
  const [touched, setTouched] = useState(false);

  // true => Fail, false => Pass
  const shouldFail = useMemo(
    () => collectEligibleComponents(data, null, label), // 2nd arg kept for signature compatibility
    [data, label]
  );
  const autoValue = shouldFail ? 'Fail' : 'Pass';

  // Show auto value until user edits
  const displayValue = touched ? value : (test4 ? autoValue : '');
  const bgColor = displayValue === 'Fail' ? 'red' : 'transparent';

  const handleDoubleClick = () => {
    if (!test4) return;
    if (!touched) {
      setValue(autoValue);   // seed editor with auto result
      setTouched(true);
    }
    setIsEditing(true);
  };

  const handleBlur = () => setIsEditing(false);

  const handleChange = (e) => {
    setTouched(true);
    setValue(e.target.value);
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
          style={{ textAlign: 'center', cursor: test4 ? 'pointer' : 'default' }}
          onDoubleClick={handleDoubleClick}
          title={test4 ? 'Double-click to edit' : ''}
        >
          {displayValue === 'Pass' ? '✔' : displayValue === 'Fail' ? '✖' : ''}
        </p>
      )}
    </td>
  );
};

export default EditableCell;

import React, { useMemo, useState, useEffect } from 'react';
import { summaryCollectEligibleComponents } from '../../utils/summaryCollectEligibleComponents';

const COUNTER_KEY = 'summaryFailCount';
const getFailCount = () => Number(sessionStorage.getItem(COUNTER_KEY) || '0');
const setFailCount = (n) => sessionStorage.setItem(COUNTER_KEY, String(Math.max(0, n)));
const addFail = (delta) => setFailCount(getFailCount() + delta);

const SummaryEditableCell = ({ test4, data, id }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(test4 ? 'Pass' : '');
  const [touched, setTouched] = useState(false);

  // true => Fail, false => Pass
  const shouldFail = useMemo(
    () => summaryCollectEligibleComponents(data, null, id),
    [data, id]
  );
  const autoValue = shouldFail ? 'Fail' : 'Pass';

  // Show auto value until user edits
  const displayValue = touched ? value : (test4 ? autoValue : '');
  const isFail = displayValue === 'Fail';
  const bgColor = isFail ? 'red' : 'transparent';

  // Count only if this cell has a valid `id` (first column in STr)
  useEffect(() => {
    if (!id) return; // prevent "failCell:undefined" collisions

    const CELL_KEY = `failCell:${id}`;
    const prevFlag = sessionStorage.getItem(CELL_KEY) === '1';
    const newFlag = isFail;

    if (newFlag !== prevFlag) {
      addFail(newFlag ? +1 : -1);
      sessionStorage.setItem(CELL_KEY, newFlag ? '1' : '0');
    }

    return () => {
      const lastFlag = sessionStorage.getItem(CELL_KEY) === '1';
      if (lastFlag) {
        addFail(-1);
        sessionStorage.setItem(CELL_KEY, '0');
      }
    };
  }, [isFail, id]);

  const handleDoubleClick = () => {
    if (!test4) return;
    if (!touched) {
      setValue(autoValue);
      setTouched(true);
    }
    setIsEditing(true);
  };

  const handleBlur = () => setIsEditing(false);
  const handleChange = (e) => { setTouched(true); setValue(e.target.value); };

  return (
    <td style={{ width: '65pt', paddingTop: '5px', backgroundColor: bgColor }}>
      {isEditing ? (
        <select value={value} onChange={handleChange} onBlur={handleBlur} autoFocus>
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

export default SummaryEditableCell;

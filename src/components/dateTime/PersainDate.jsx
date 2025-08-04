
import moment from 'moment-jalaali';
import { Tooltip } from '@mui/material';
import { useMemo } from 'react';

moment.loadPersian({ dialect: 'persian-modern', usePersianDigits: true });

const PersianDateWithTooltip = ({ 
  date,
  className = '',
  shortFormat = 'jD jMMMM',
  tooltipFormat = 'jD jMMMM jYYYY ساعت HH:mm'
}) => {
  const formattedDate = useMemo(() => {
    if (!date) return '';
    return moment(date).format(shortFormat);
  }, [date, shortFormat]);

  const tooltipContent = useMemo(() => {
    if (!date) return '';
    return (
      <div dir="rtl" className="text-right">
        {moment(date).format(tooltipFormat)}
      </div>
    );
  }, [date, tooltipFormat]);

  if (!date) return null;

  return (
    <Tooltip 
      title={tooltipContent}
      arrow
      placement="top"
      componentsProps={{
        tooltip: {
          sx: {
            direction: 'rtl',
            textAlign: 'right',
            fontFamily: 'IRANSans, sans-serif',
          }
        }
      }}
    >
      <span className={`cursor-pointer ${className}`} dir="rtl">
        {formattedDate}
      </span>
    </Tooltip>
  );
};

export default PersianDateWithTooltip;
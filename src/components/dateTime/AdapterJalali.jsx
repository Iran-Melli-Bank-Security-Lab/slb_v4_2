import * as React from "react";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { AdapterDateFnsJalali } from '@mui/x-date-pickers/AdapterDateFnsJalali';

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
// import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { DatePicker } from "@mui/x-date-pickers";


// Create rtl cache
const cacheRtl = createCache({
  key: "adapter-date-fns-jalali-demo",
  stylisPlugins: [prefixer, rtlPlugin],
});

export default function AdapterJalali(props) {
  // Inherit the theme from the docs site (dark/light mode)
  const existingTheme = useTheme();

  const theme = React.useMemo(
    () =>
      createTheme(existingTheme, {
        direction: "rtl",
      }),
    [existingTheme]
  );

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <div dir="rtl">
          <LocalizationProvider dateAdapter={AdapterDateFnsJalali}>
          
        
          <DatePicker 
          {...props}
          defaultValue={new Date()} 
          orientation="landscape"
          onChange={props.onChange} // Pass the onChange callback

          slotProps={{
            actionBar: { actions: ['accept' , 'today'] },
            desktopPaper: {
              dir: "rtl",
            },
            mobilePaper: {
              dir: "rtl",
            },
          }} />           
          </LocalizationProvider>
        </div>
      </ThemeProvider>
    </CacheProvider>
  );
}

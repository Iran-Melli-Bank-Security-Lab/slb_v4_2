import React ,{useEffect , useState , useMemo}from 'react';
import "./document.css";
import Tr from './Tr';

const TOTAL_ITEMS = 42;
const KEY = 'failCount'; // جایی که EditableCell می‌نویسه (sessionStorage)
const CHAN_NAME = 'failCount:chan'; // اختیاری، اگر نویسنده پیام بده

// خواندن شمارنده (اول sessionStorage، بعد localStorage به عنوان fallback)
const readCount = () => {
  const s = sessionStorage.getItem(KEY);
  if (s != null) return Number(s) || 0;
  const l = localStorage.getItem(KEY);
  return Number(l) || 0;
};
const ReportTestSecond = ({count , data }) => {
  const [failCount, setFailCount] = useState(() => readCount());


    useEffect(() => {
    let cancelled = false;

    const update = () => {
      if (cancelled) return;
      setFailCount(readCount());
    };

    // 1) Sync فوری
    update();

    // 2) Poll کوتاه برای حل race (تا 1 ثانیه، هر 50ms)
    let tries = 0;
    const iv = setInterval(() => {
      tries += 1;
      update();
      if (tries >= 20) clearInterval(iv);
    }, 50);

    // 3) اگر از BroadcastChannel استفاده می‌کنی (اختیاری اما توصیه‌شده)
    let bc = null;
    try {
      bc = new BroadcastChannel(CHAN_NAME);
      bc.onmessage = (e) => {
        if (e?.data?.type === 'sync' && typeof e.data.value === 'number') {
          setFailCount(e.data.value);
        }
      };
    } catch {}

    // 4) storage event (بین تب‌ها برای localStorage کار می‌کند)
    const onStorage = (e) => {
      if (e.key === KEY) update();
    };
    window.addEventListener('storage', onStorage);

    // 5) با فوکوس شدن صفحه، مجدد بخوان
    window.addEventListener('focus', update);

    return () => {
      cancelled = true;
      clearInterval(iv);
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', update);
      try { bc && bc.close(); } catch {}
    };
  }, []);

  
  const failurePercent = useMemo(() => {
    const pct = (failCount / TOTAL_ITEMS) * 100 ;
    // return Math.max(0, Math.min(100, pct));
    return pct ; 
  }, [failCount]);



  const displayPercent = failurePercent.toFixed(0); // یا .toFixed(1) برای یک رقم اعشار

    // Function to determine test prop values based on count
    const getTestValues = (count) => {
        // return {
        //     test1: true,
        //     test2: count >= 2,
        //     test3: count >= 3,
        //     test4: count >= 4
        // };
         return {
            test1: false ,
            test2: false ,
            test3: false ,
            test4: true 
        };
    };

    return (
        <table 
            style={{ borderCollapse: 'collapse', marginLeft: '28.904pt', backgroundColor: "white" }} 
            cellSpacing="0"
        >
            <tbody>
                <Tr label="FRU_FLT" {...getTestValues(count)} data={data}>
                    FRU_FLT
                </Tr>

                <Tr label="FDP_RIP" {...getTestValues(count)} bgcolor="#D7D7D7" data={data}>
                    FDP_RIP
                </Tr>

                <Tr label="FDP_ITC" {...getTestValues(count)}>
                    FDP_ITC
                </Tr>

                <Tr label="FMT_MOF" {...getTestValues(count)} bgcolor="#D7D7D7" data={data}>
                    FMT_MOF
                </Tr>

                <Tr label="FMT_MTD" {...getTestValues(count)} data={data}>
                    FMT_MTD
                </Tr>

                <Tr label="FMT_SMF" {...getTestValues(count)} bgcolor="#D7D7D7" data={data}>
                    FMT_SMF
                </Tr>

                <Tr label="FMT_SMR" {...getTestValues(count)} data={data} >
                    FMT_SMR
                </Tr>

                <Tr label="FMT_MSA" {...getTestValues(count)} bgcolor="#D7D7D7" data={data}>
                    FMT_MSA
                </Tr>

                <Tr label="FPT_TUD_EXT" {...getTestValues(count)} data={data}>
                    FPT_TUD_EXT
                </Tr>

                <Tr label="FPT_FLS" {...getTestValues(count)} bgcolor="#D7D7D7" data={data}>
                    FPT_FLS
                </Tr>

                <Tr label="FPT_TDC" {...getTestValues(count)} data={data}>
                    FPT_TDC
                </Tr>

                <Tr label="FPT_ITT" {...getTestValues(count)} bgcolor="#D7D7D7" data={data}>
                    FPT_ITT
                </Tr>

                <Tr label="FPT_STM" {...getTestValues(count)} data={data}>
                    FPT_STM
                </Tr>

                <Tr label="FTA_SSL" {...getTestValues(count)} bgcolor="#D7D7D7" data={data}>
                    FTA_SSL
                </Tr>

                <Tr label="FTA_MCS" {...getTestValues(count)} data={data}>
                    FTA_MCS
                </Tr>

                <Tr label="FTA_TAH" {...getTestValues(count)} bgcolor="#D7D7D7" data={data}>
                    FTA_TAH
                </Tr>

                <Tr label="FTA_TSE" {...getTestValues(count)} data={data}>
                    FTA_TSE
                </Tr>

                <Tr  label="FDP_ETC" {...getTestValues(count)} bgcolor="#D7D7D7" data={data}>
                    FDP_ETC
                </Tr>

                <Tr label="FDP_SDI" {...getTestValues(count)} data={data}>
                    FDP_SDI
                </Tr>

                <Tr label="FDP_ACC" {...getTestValues(count)} bgcolor="#D7D7D7" data={data}>
                    FDP_ACC
                </Tr>

                <Tr label="FDP_ACF" {...getTestValues(count)} data={data}>
                    FDP_ACF
                </Tr>

                <Tr label="FCS_HTTPS_EXT" {...getTestValues(count)} bgcolor="#D7D7D7" data={data}>
                    FCS_HTTPS_EXT
                </Tr>

                <Tr label="FCS-DTLS_EXT" {...getTestValues(count)} data={data}>
                    FCS-DTLS_EXT
                </Tr>

                <Tr  label="FCS_X509_EXT" {...getTestValues(count)} bgcolor="#D7D7D7" data={data}>
                    FCS_X509_EXT
                </Tr>

                <Tr label="FPT_API_EXT" {...getTestValues(count)} data={data}>
                    FPT_API_EXT
                </Tr>

                <Tr  label="FPT_AEX_EXT" {...getTestValues(count)} bgcolor="#D7D7D7" data={data}>
                    FPT_AEX_EXT
                </Tr>

                <Tr label="FPT_LIB_EXT" {...getTestValues(count)} data={data}>
                    FPT_LIB_EXT
                </Tr>

                <tr style={{ height: '23pt' }}>
                    <td style={{ width: '434pt' }} colSpan="5" bgcolor="#FF0000">
                        <p
              className="s66"
              style={{
                paddingTop: '1pt',
              
                textIndent: '0pt',
                textAlign: 'center',
                direction: 'ltr',
              }}
            >
               {displayPercent}%  : نتیجه نهایی ارزیابی (درصد انطباق بیان شود ){' '}
              
            </p>
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

export default ReportTestSecond;

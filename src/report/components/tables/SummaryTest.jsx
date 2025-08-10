import React, { useEffect, useMemo, useState } from "react";
import "./document.css";
import STr from "./STr";
import TestOrder from "./TestOrder";

const SUMMARY_KEY = "summaryFailCount";
const readSummaryFail = () =>
  Number(sessionStorage.getItem(SUMMARY_KEY) || "0");

const SummaryTest = ({ count, data }) => {
  const [summaryFailCount, setSummaryFailCount] = useState(0);

  useEffect(() => {
    let alive = true;

    const softSync = async () => {
      // تلاش فوری
      if (!alive) return;
      setSummaryFailCount(readSummaryFail());

      // فریم بعدی
      await new Promise(requestAnimationFrame);
      if (!alive) return;
      setSummaryFailCount(readSummaryFail());

      // چند retry کوتاه (جمعاً ~80ms)
      for (let i = 0; i < 8 && alive; i++) {
        await new Promise((r) => setTimeout(r, 10));
        if (!alive) return;
        setSummaryFailCount(readSummaryFail());
      }
    };

    const onChanged = (e) => {
      if (!alive) return;
      const v = Number(e?.detail ?? readSummaryFail());
      setSummaryFailCount(Number.isFinite(v) ? v : 0);
    };

    window.addEventListener("summaryFailCount:changed", onChanged);
    // شروع sync
    softSync();

    // همچنین با فوکوس صفحه هم یک sync بزن
    const onFocus = () => setSummaryFailCount(readSummaryFail());
    window.addEventListener("focus", onFocus);

    return () => {
      alive = false;
      window.removeEventListener("summaryFailCount:changed", onChanged);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  // فرمول خواسته‌شده: (summaryFailCount / 12) * 100
  const resultPercent = useMemo(() => {
    const pct = (summaryFailCount / 12) * 100;
    return Math.max(0, Math.min(100, pct));
  }, [summaryFailCount]);

  const getTestValues = () => ({
    test1: false,
    test2: false,
    test3: false,
    test4: true,
  });

  return (
    <table
      style={{
        borderCollapse: "collapse",
        marginLeft: "28.904pt",
        backgroundColor: "white",
      }}
      cellSpacing="0"
    >
      <TestOrder>دسته آسیب پذیری</TestOrder>
      <tbody>
        <STr data={data} id="4.1" {...getTestValues(count)}>
          آزمون جمع آوری اطلاعات
        </STr>
        <STr data={data} id="4.2" {...getTestValues(count)} bgcolor="#D7D7D7">
          آزمون مدیریت پیکربندی و استقرار
        </STr>
        <STr data={data} id="4.3" {...getTestValues(count)}>
          آزمون مدیریت هویت
        </STr>
        <STr data={data} id="4.4" {...getTestValues(count)} bgcolor="#D7D7D7">
          آزمون احراز هویت
        </STr>
        <STr data={data} id="4.5" {...getTestValues(count)}>
          آزمون مجازی شماری
        </STr>
        <STr data={data} id="4.6" {...getTestValues(count)} bgcolor="#D7D7D7">
          آزمون مدیریت نشست
        </STr>
        <STr data={data} id="4.7" {...getTestValues(count)}>
          آزمون اعتبار سنجی ورودی
        </STr>
        <STr data={data} id="4.8" {...getTestValues(count)} bgcolor="#D7D7D7">
          آزمون مدیریت خطاها
        </STr>
        <STr data={data} id="4.9" {...getTestValues(count)}>
          آزمون رمزنگاری
        </STr>
        <STr data={data} id="4.10" {...getTestValues(count)} bgcolor="#D7D7D7">
          آزمون منطق کسب و کار
        </STr>
        <STr data={data} id="4.11" {...getTestValues(count)} bgcolor="#D7D7D7">
          آزمون سمت مشتری
        </STr>
        <STr data={data} id="4.12" {...getTestValues(count)}>
          <span>API آزمون</span>
        </STr>

        <tr style={{ height: "23pt" }}>
          <td style={{ width: "434pt" }} colSpan="5" bgcolor="#FF0000">
            <p
              className="s66"
              style={{
                paddingTop: "1pt",
                
                textIndent: "0pt",
                textAlign: "center",
                direction: "ltr",
              }}
            >
               {resultPercent.toFixed(0)}%  : نتیجه نهایی ارزیابی (درصد انطباق بیان شود )
             
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default SummaryTest;

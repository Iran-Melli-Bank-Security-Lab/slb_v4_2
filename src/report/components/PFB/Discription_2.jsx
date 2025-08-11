import React from "react";

function Discription_2({ projectName = " بانک ملی ایران ", address = "127.0.0.1" }) {
  const normalizedAddress = React.useMemo(() => {
    if (!address) return "";
    const trimmed = String(address).trim();
    return /^https?:\/\//i.test(trimmed) ? trimmed : `http://${trimmed}`;
  }, [address]);

  return (
    <>
      <div className="pfbt bnazp12">
        <div dir="rtl">
          <span style={{ fontWeight: "bold" }}>{' '}{projectName}{' '}</span>
          به آدرس
          <span style={{ fontWeight: "bold", fontSize: "16pt", fontFamily: "Times New Roman" }}>
            {' '}{normalizedAddress}{' '}
          </span>
          می‌باشد.
        </div>
      </div>
    </>
  );
}

export default Discription_2;

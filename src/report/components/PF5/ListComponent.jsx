import React from "react";
import './style.css';

const ListComponent = ({pageNumbers}) => {
    const items = [
        { title: "تعاریف و مفاهیم", page: 5 },
        { title: "خلاصه مدیریتی آزمایشگاه امنیت", page: 10 },
        { title: "شرح کلی از سامانه", page: 12 },
        { title: "نام متولی پروژه", page: 12 },
        { title: "مفروضات ارزیابی", page: 12 },
        { title: "رویکرد آزمون نفوذ", page: 13 },
        // { title: "شکل‌ گیری گروه ارزیاب", page: 11 },
        { title: "گزارش آزمون ۱۵۴۰۸", page: 14 },
        { title: "خلاصه آزمون‌های انجام گرفته", page: 16 },
        { title: "آزمون جمع آوری اطلاعات (بند 10-15408)", page: 17 },
        { title: "آزمون پیکربندی و مدیریت استقرار", page: pageNumbers.pf11 },
        { title: "آزمون مدیریت هویت", page: pageNumbers.pf12 },
        { title: "آزمون احراز هویت (بند 11-15408)", page: pageNumbers.pf13 },
        { title: "آزمون مجاز شماری", page: pageNumbers.pf14},
        { title: "آزمون مدیریت نشست (بند 16-15408)", page: pageNumbers.pf15 },
        { title: "آزمون اعتبارسنجی ورودی (بند 14-15408)", page: pageNumbers.pf16 },
        { title: "آزمون مدیریت خطاها", page: pageNumbers.pf18 },
        { title: "آزمون رمزنگاری (بند 10-15408)", page: pageNumbers.pf19 },
        { title: "آزمون منطق کسب و کار (بند 12-15408)", page: pageNumbers.pf1a },
        { title: "آزمون سمت مشترک", page: pageNumbers.pf1b },
        { title: "آزمون API", page: pageNumbers.pf1c }
    ];

    return (
        <div className="listcontainer">
            <h1 className="listh1" > فهرست </h1>
            <ul className="listul">
                {items.map((item, index) => (
                    <li key={index} className="llist-item">
                        <span style={{fontFamily:"bnazanin" , fontWeight:"bold" , fontSize: "16pt"}} className="litem-title">{item.title}</span>
                        <span className="ldots"></span>
                        <span style={{fontFamily:"bnazanin" }} className="lpage-number">{item.page}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ListComponent;

import bg14 from "../images/bg5.png"
import HeaderPage from "./common/Header"
import PdfStructure from "./common/PdfStructure"
import MyTable from "./PF13/MyTable";
import Discription from "./PF14/Discription"
import { upData } from "../utils/updateData"

function Pf14({page , pageNumber}) {

    const data = [
        { page: '', cvss: '', state: 'PASS', id: "4.5.1", description: '4.5.1- آزمون پیمایش مسیر پوشه‌ها و فایل‌های آن', code: '(WSTG-ATHZ-01)' },
        { page: '', cvss: '', state: 'PASS', id: "4.5.2", description: '4.5.2- آزمون دور زدن شمای مجوز', code: '(WSTG-ATHZ-02)' },
        { page: '', cvss: '', state: 'PASS', id: "4.5.3", description: '4.5.3- آزمون ارتقاء سطح دسترسی', code: '(WSTG-ATHZ-03)' },
        { page: '', cvss: '', state: 'PASS', id: "4.5.4", description: '4.5.4- آزمون مراجع مستقیم ناامن به شی‌ء', code: '(WSTG-ATHZ-04)' },
        { page: '', cvss: '', state: 'PASS', id: "4.5.5.1", description: '4.5.5.1- آزمون ضعف‌های سرور احراز هویت OAuth', code: '(WSTG-ATHZ-05-01)' },
        { page: '', cvss: '', state: 'PASS', id: "4.5.5.2", description: '4.5.5.2-آزمون برای ضعف‌های کلاینت OAuth ', code: '(WSTG-ATHZ-05-02)' }

    
    ];
    const updatedData = upData(data , page )

    return <>

        <div id="pf14" className="pf w0 h0" data-page-no="14">
            <div className="pc pc14 w0 h0">

                <PdfStructure src={bg14} page={pageNumber.pf14} />

                <div className="c x0 y0 w2 h0">

                    <HeaderPage style={{ marginBottom: '10px' }} className={"cxd0pf14"}>

                        4.5- آزمون مجاز شماری

                    </HeaderPage>

                    <Discription />
                    <MyTable data={updatedData} className="cy291pf14" />

                </div>



            </div>
        </div>
    </>

}
export default Pf14 

import bg15 from "../images/bg5.png"
import MyTable from "./PF13/MyTable";
import Discription from "./PF15/Discription"
import HeaderPage from "./common/Header"
import PdfStructure from "./common/PdfStructure"
import { upData } from "../utils/updateData"

function Pf15({page , pageNumber}) {
    const data = [
        { page: '', cvss: '', state: 'PASS', id: "4.6.1", description: '4.6.1- آزمون شمای مدیریت نشست', code: '(WSTG-SESS-01)' },
        { page: '', cvss: '', state: 'PASS', id: "4.6.2", description: '4.6.2- آزمون ویژگی‌ کوکی‌ها', code: '(WSTG-SESS-02)' },
        { page: '', cvss: '', state: 'PASS', id: "4.6.3", description: '4.6.3- آزمون Session Fixation', code: '(WSTG-SESS-03)' },
        { page: '', cvss: '', state: 'PASS', id: "4.6.4", description: '4.6.4- آزمون متغیرهای افشا شده نشست', code: '(WSTG-SESS-04)' },
        { page: '', cvss: '', state: 'PASS', id: "4.6.5", description: '4.6.5- آزمون حمله‌ی جعل درخواست(CSRF)', code: '(WSTG-SESS-05)' },
        { page: '', cvss: '', state: 'PASS', id: "4.6.6", description: '4.6.6- آزمون عملکرد خروج', code: '(WSTG-SESS-06)' },
        { page: '', cvss: '', state: 'PASS', id: "4.6.7", description: '4.6.7- آزمون ناتمام مهلت نشست', code: '(WSTG-SESS-07)' },
        { page: '', cvss: '', state: 'PASS', id: "4.6.8", description: '4.6.8- آزمون Session Puzzling', code: '(WSTG-SESS-08)' },
        { page: '', cvss: '', state: 'PASS', id: "4.6.9", description: '4.6.9- آزمون  Session Hijacking', code: '(WSTG-SESS-09)' },
        { page: '', cvss: '', state: 'PASS', id: "4.6.10", description: '4.6.10- آزمون وب توکن های  JSON', code: '(WSTG-SESS-10)' }
      ];
      const updatedData = upData(data , page )

    return <>

        <div id="pf15" className="pf w0 h0" data-page-no="15">
            <div className="pc pc15 w0 h0">

                <PdfStructure src={bg15} page={pageNumber.pf15} />



                <div className="c x0 y0 w2 h0">


                    <HeaderPage style={{ marginBottom: '10px' }} className= "cxd0pf15">
                    4.6- آزمون مدیریت نشست (بند 16- 15408)

                    </HeaderPage>
                    <Discription />
                    <MyTable data={updatedData} className="cy291pf13"/>

                </div>

            </div>
        </div>
    </>
}
export default Pf15 

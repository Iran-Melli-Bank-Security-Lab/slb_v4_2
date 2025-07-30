
import React from 'react';
import TableRow from './summaryManagement/TableRow';

const colors = [{ "severity": "C", "color": "#C00000" },
{ "severity": "H", "color": "#FF0000" },
{ "severity": "L", "color": "#FFFF00" },
{ "severity": "M", "color": "#FFC000" },
{ "severity": "I", "color": "#00AFEF" }

]

const SummaryManagement = ({ pages }) => {


  return (
    <table style={{ borderCollapse: 'collapse', marginLeft: '21.824pt' , backgroundColor:"#111111" }} cellSpacing="0">
      <tbody style={{ backgroundColor: "white" }}>
        <tr style={{ height: '25pt' }}>

          <td
            style={{
              width: '20pt',
              borderTopStyle: 'solid',
              borderTopWidth: '2pt',
              borderBottomStyle: 'solid',
              borderBottomWidth: '2pt',
              backgroundColor: '#006FC0',
            }}
          >
          </td>

          <td
            style={{
              width: '331pt',
              borderTopStyle: 'solid',
              borderTopWidth: '2pt',
              borderBottomStyle: 'solid',
              borderBottomWidth: '2pt',
              backgroundColor: '#006FC0',
            }}
          >
            <p
              className="s34p10"
              style={{
                paddingTop: '4pt',
                
                textIndent: '0pt',
                textAlign: 'center',
              }}
            >
              آسیب پذیری های کشف شده
            </p>

          </td>

          <td
            style={{
              width: '63pt',
              borderTopStyle: 'solid',
              borderTopWidth: '2pt',
              borderBottomStyle: 'solid',
              borderBottomWidth: '2pt',
              backgroundColor: '#006FC0',
            }}
          >
            <p className="s47p10" style={{ paddingTop: '4pt', textIndent: '0pt', textAlign: 'center'  }}>
              CVSS 
            </p>
          </td>
          <td
            style={{
              width: '35pt',
              borderTopStyle: 'solid',
              borderTopWidth: '2pt',
              borderBottomStyle: 'solid',
              borderBottomWidth: '2pt',
              backgroundColor: '#006FC0',
            }}
          >
            <p
              className="s34p10"
              style={{
                paddingTop: '4pt',
                paddingLeft: '3pt',
                paddingRight: '4pt',
                textIndent: '0pt',
                textAlign: 'center',
              }}
            >
              صفحه
            </p>
          </td>
        </tr>

        {pages?.bugs?.map((page, key) => {

          if (parseFloat(page?.cvss) >= 9.0 && parseFloat(page?.cvss) <= 10.0) {

            return <TableRow key={key} bgcolor="#C00000" severity="C" bugName={page.labelfa} cvssScore={page.cvss} page={page.page} />

          }

          if (parseFloat(page?.cvss) >= 7.0 && parseFloat(page?.cvss) <= 8.9) {

            return <TableRow key={key} bgcolor="#FF0000" severity="H" bugName={page.labelfa} cvssScore={page.cvss} page={page.page} />

          }

          if (parseFloat(page?.cvss) >= 4.0 && parseFloat(page?.cvss) <= 6.9) {

            return <TableRow  key={key} bgcolor="#FFC000" severity="M" bugName={page.labelfa} cvssScore={page.cvss} page={page.page} />

          }

          if (parseFloat(page?.cvss) >= 1.0 && parseFloat(page?.cvss) <= 3.9) {

            return <TableRow key={key} color="s13" bgcolor="#FFFF00" severity="L" bugName={page.labelfa} cvssScore={page.cvss} page={page.page} />

          }

          if (parseFloat(page?.cvss) === 0.0) {

            return <TableRow key={key} bgcolor="#00AFEF" severity="I" bugName={page.labelfa} cvssScore={page.cvss} page={page.page} />

          }

        })}

      </tbody>
    </table>
  );
};

export default SummaryManagement;

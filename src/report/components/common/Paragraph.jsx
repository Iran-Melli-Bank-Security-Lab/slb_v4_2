

function Paragraph({ children , first=false  }) {


    return <>

     {  first ? ( <div className="t m0 xd2 h26 y22a ff2 fs2 fc0 sc0 ls0 ws0">

            {children}

        </div>): (
        <div className="t m0 xd3 h26 y22b ff2 fs2 fc0 sc0 ls3a ws0">
{children}

        </div>
        )
        }
 

    </>
}

export default Paragraph
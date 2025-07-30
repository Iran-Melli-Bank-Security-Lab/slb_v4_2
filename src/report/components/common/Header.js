function HeaderPage({ len,  children, className= '' , y="y229" , report=0}) {
    return (
        <>
        {report ===0 ? ( <div style={{direction:'rtl'   }} className={`t m0 ${className} h91 ${y} ff6 fsc fc8 sc0 ls0 ws0 ccomposite`}>
                {children}   
            </div>  ) : 
   <div style={{direction:'rtl' , left: `${800}px` , right: `${len}px`   }} className={`t m0 ${className} h91 ${y} ff6 fsc fc8 sc0 ls0 ws0 ccomposite`}>
   {children}   
</div>
            
        
        }
         
        </>
    );
}

export default HeaderPage;

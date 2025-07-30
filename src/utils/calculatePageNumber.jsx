export const calculatePageNumber =  (previousSection, defaultStartPage) => {
   
    console.log("preview section : "  , previousSection )
    //check 
    if (previousSection.length !== 0) {
        return previousSection[previousSection.length - 1]?.page + 1;
    }
    return defaultStartPage +1 ;
};

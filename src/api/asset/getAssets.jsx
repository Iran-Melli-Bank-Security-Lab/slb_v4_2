import { apiFetch } from '../api';
export const getAssets= async(formData)=>{

    return apiFetch('/api/assets/' , {
        method:"post" , 
        body:JSON.stringify({formData})
    })

}


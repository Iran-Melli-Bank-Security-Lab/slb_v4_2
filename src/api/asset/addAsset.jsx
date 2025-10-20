import { apiFetch } from '../api';
export const addAsset= async(formData)=>{

    return apiFetch('/api/assets/create' , {
        method:"post" , 
        body:JSON.stringify({formData})
    })

}


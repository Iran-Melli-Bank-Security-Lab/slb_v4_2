import { apiFetch } from '../api';

export const updateAsset= async(assetId , formData)=>{

    return apiFetch('/api/assets/update' , {
        method:"post" , 
        body:JSON.stringify({assetId , formData})
    })

}


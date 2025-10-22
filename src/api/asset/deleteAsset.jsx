import { apiFetch } from '../api';

export const deleteAsset= async(assetId)=>{

    return apiFetch('/api/assets/delete' , {
        method:"post" , 
        body:JSON.stringify({assetId})
    })

}

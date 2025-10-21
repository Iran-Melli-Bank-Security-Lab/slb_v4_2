import { apiFetch } from '../api';

export const getAsset= async(assetId)=>{
        const basePath = "/api/assets/details"

    const params = new URLSearchParams({ assetId });

     // call apiFetch with the full URL
    return apiFetch(`${basePath}?${params.toString()}`, {
        method: "GET",
    });

}


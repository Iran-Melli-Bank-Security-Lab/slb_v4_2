import { apiFetch } from '../api';


export const postIdentifier= async(projectId  , formData)=>{

    return apiFetch('/api/projects/identifier' , {
        method:"post" , 
        body:JSON.stringify({projectId  ,formData })
    })

}



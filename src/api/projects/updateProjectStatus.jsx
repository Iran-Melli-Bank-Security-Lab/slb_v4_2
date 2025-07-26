import { apiFetch } from '../api';


export const updateProjectStatus= async(projectId , newStatus   )=>{

    return apiFetch('/api/projects/user/update/status' , {
        method:"PUT" , 
        body:JSON.stringify({projectId , newStatus  })
    })

}



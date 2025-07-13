import { apiFetch } from '../api';


export const createProject= async(userId , projectName , projectVersion , letterNumber , numberTest , projectType , platform)=>{

    return apiFetch('/api/projects/devops/create' , {
        method:"post" , 
        body:JSON.stringify({userId , projectName , projectVersion , letterNumber , numberTest , projectType , platform })
    })

}



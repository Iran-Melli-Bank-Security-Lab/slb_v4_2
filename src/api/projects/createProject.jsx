import { apiFetch } from '../api';


export const createProject= async(projectName , projectVersion , letterNumber , numberTest , projectType , platform)=>{

    return apiFetch('/api/projects/devops/create' , {
        method:"post" , 
        body:JSON.stringify({projectName , projectVersion , letterNumber , numberTest , projectType , platform })
    })

}



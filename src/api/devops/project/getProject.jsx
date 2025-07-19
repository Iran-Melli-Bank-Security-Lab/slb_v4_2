import { apiFetch } from '../../api';

export const getDevopsProjects = async (userId) => {
    // choose your base path
    const basePath = "/api/devops/projects"
  
    // build a query string
    const params = new URLSearchParams({ userId });
  
    // call apiFetch with the full URL
    return  apiFetch(`${basePath}?${params.toString()}`, {
      method: "GET",
    });
  };
  

  export const getDevopsProject= async(projectId , userId )=>{

      const basePath = "/api/devops/project"
  
    // build a query string
    const params = new URLSearchParams({ projectId , userId });
  
    // call apiFetch with the full URL
    return  apiFetch(`${basePath}?${params.toString()}`, {
      method: "GET",
    });


  }

 export  const updateDevopsProject = async (projectId , userId , updatedData) =>{
          const basePath = "/api/devops/update/project"
  
    return apiFetch(basePath , {
        method:"post" , 
        body:JSON.stringify({projectId , userId ,updatedData })
    })
  }


  export const deleteDevopsProject = async(projectId , userId ) =>{
const basePath = "/api/devops/delete/project"
  
    // build a query string
    const params = new URLSearchParams({ projectId , userId  });
  
    // call apiFetch with the full URL
    return  apiFetch(`${basePath}?${params.toString()}`, {
    method: "DELETE"
    });

  }

  export const getUserProjectsByProjectId = async (projectId)=>{
const basePath = "/api/devops/project/pentesters"
  
    // build a query string
    const params = new URLSearchParams({ projectId });
  
    // call apiFetch with the full URL
    return  apiFetch(`${basePath}?${params.toString()}`, {
      method: "GET",
    });

  }

  export const submitDevOpsInfo = async (data)=>{
const basePath = "/api/devops/project/save/info"
  
  
      return apiFetch(basePath , {
        method:"post" , 
        body:JSON.stringify({data})
    })

  }
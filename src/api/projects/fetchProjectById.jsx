import { apiFetch } from '../api';

export const fetchProjectById = async (projectId, manager ) => {
    // choose your base path
    const basePath ="/api/projects/project";
  
    // build a query string
    const params = new URLSearchParams({ projectId , manager  });
  
    // call apiFetch with the full URL
    return  apiFetch(`${basePath}?${params.toString()}`, {
      method: "GET",
    });
  };

  //project is projectId for using in ProjectUser
  //pentester is id of user for using in ProjectUser 
    
export const fetchProjectByUserProjectManager = async(project, pentester  , projectManager ) =>{
    // choose your base path
    const basePath ="/api/projects/user/project/manager/getproject";
  
    // build a query string
    const params = new URLSearchParams({ project  , pentester , projectManager  });
  
    // call apiFetch with the full URL
    return  apiFetch(`${basePath}?${params.toString()}`, {
      method: "GET",
    });
  };

  export const fetchUserProjectById = async (projectId, userId  ) => {
    // choose your base path
    const basePath ="/api/projects/user/project";
  
    // build a query string
    const params = new URLSearchParams({ projectId , userId   });
  
    // call apiFetch with the full URL
    return  apiFetch(`${basePath}?${params.toString()}`, {
      method: "GET",
    });
  };
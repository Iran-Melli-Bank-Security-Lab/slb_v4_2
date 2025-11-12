import { apiFetch } from '../api';

export const generateReportonServer = async (url , projectId  ) => {

  console.log("url in line 5 at generate report on server : " , url )
    // choose your base path
    const basePath = "/api/projects/generateReport"
        
  
    // build a query string
    const params = new URLSearchParams({ url , projectId  });
  
    // call apiFetch with the full URL
    return  apiFetch(`${basePath}?${params.toString()}`, {
      method: "GET",
    });
  };
  
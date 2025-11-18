import { apiFetch } from '../api';
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// export const generateReportonServer = async (url , projectId  ) => {

//   console.log("url in line 5 at generate report on server : " , url )
//     // choose your base path
//     const basePath = "/api/projects/generateReport"
        
  
//     // build a query string
//     const params = new URLSearchParams({ url , projectId  });
  
//     // call apiFetch with the full URL
//     return  apiFetch(`${basePath}?${params.toString()}`, {
//       method: "GET",
//     });
//   };


  // export const generateReportonServer = async (url , projectId ) => {
  //     const apiUrl = `${BASE_URL}/api/projects/generateReport`;

  //   try {
  //     // Construct the API URL with query params
  //   const params = new URLSearchParams({ url , projectId  });

  //     const response = await fetch(`${apiUrl}?${params.toString()}`, {
  //       method: "GET",
  //       credentials: 'include',


  //     });

  //     if (!response.ok) {
  //       throw new Error("Failed to generate PDF");
  //     }

  //     // Convert response to blob
  //     const blob = await response.blob();

  //     // Create a link to download the blob
  //     const downloadUrl = window.URL.createObjectURL(blob);
  //     const link = document.createElement("a");
  //     link.href = downloadUrl;
  //     link.download = `${projectId}.pdf`; // suggested filename
  //     document.body.appendChild(link);
  //     link.click();
  //     link.remove();

  //     // Release memory
  //     window.URL.revokeObjectURL(downloadUrl);

  //   } catch (err) {
  //     console.error("Download error:", err);
  //   }
  // };
  

  export const generateReportonServer = async (url, projectId) => {
  const apiUrl = `${BASE_URL}/api/projects/generateReport`;

  try {
    // Construct the API URL with query params
    const params = new URLSearchParams({ url, projectId });

    const response = await fetch(`${apiUrl}?${params.toString()}`, {
      method: "GET",
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error("Failed to generate ZIP file");
    }

    // Convert response to blob
    const blob = await response.blob();

    // Create a link to download the blob
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `${projectId}.zip`; // change extension to .zip
    document.body.appendChild(link);
    link.click();
    link.remove();

    // Release memory
    window.URL.revokeObjectURL(downloadUrl);

  } catch (err) {
    console.error("Download error:", err);
  }
};

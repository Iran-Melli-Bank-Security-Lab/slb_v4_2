import { apiFetch } from "../api/api";
async function validateSession() {
    try {
      const response = await fetch('http://localhost:4000/api/validate/validatesession', {
        method: 'GET',
        credentials: 'include', // very important for cookie-based auth
      });
  
      if (response.ok) {
        const data = await response.json();
        return data; // user info, etc.
      } else {
        throw new Error('Unauthorized');
      }



// const response = await apiFetch('/api/validate/validatesession', {
//     method: 'GET'
//   });

//     if (response.ok) {
//         const data = await response.json();
//         return data; // user info, etc.
//       } else {
//         throw new Error('Unauthorized');
//       }
    } catch (error) {
      console.error('Session validation failed:', error);
      return null;
    }
  }

  export default validateSession
  
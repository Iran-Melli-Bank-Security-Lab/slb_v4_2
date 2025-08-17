import { apiFetch } from '../api';


// export const savaProjectDate= async(projectId , userId  , date , dateType )=>{

//     return apiFetch('/api/projects/save/date' , {
//         method:"post" , 
//         body:JSON.stringify({projectId  ,userId , date  , dateType  })
//     })

// }

export const savaProjectDate = async (projectId, userId, date, dateType) => {
  try {
    return await apiFetch('/api/projects/save/date', {
      method: "post",
      body: JSON.stringify({ 
        projectId, 
        userId, 
        date: date.toISOString(), // Ensure proper date format
        dateType 
      })
    });
  } catch (error) {
    console.log("error in line 25 : " , error )
    // Rethrow the error with the proper message
    throw new Error(error.message || "Failed to save project date");
  }
}

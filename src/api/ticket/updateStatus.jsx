import { apiFetch } from '../api';


export const updateStatus = async(userId , ticketId  , status )=>{

    return apiFetch('/api/ticket/status' , {
        method:"post" , 
        body:JSON.stringify({userId ,ticketId , status })
    })

}



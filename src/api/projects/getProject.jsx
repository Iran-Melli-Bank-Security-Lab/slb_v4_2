import { apiFetch } from '../api';

export const getProjects = async (role) => {
    if (role==="manager") {
  return apiFetch('/api/projects/manager', {
    method: 'GET',

});
    }if(role==="user"){
        return apiFetch('/api/projects/user', {
            method: 'GET', 
        });
    }
};

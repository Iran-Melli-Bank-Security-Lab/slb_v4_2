import { Navigate, Outlet, useLocation } from "react-router"
import useAuth from "../hooks/useAuth"

// const auth = {
//     roles:['Admin'], 
//     accessToken:""
// }

const RequireAuth = ({ allowedRoles }) => {

    const { auth } = useAuth();
    const location = useLocation();
    return (
        auth?.roles?.find(role => allowedRoles?.includes(role))
            ? <Outlet />
            : auth?.accessToken //changed from user to accessToken to persist login after refresh
                ? <Navigate to="/unauthorized" state={{ from: location }} replace />
                : <Navigate to="/sign-in" state={{ from: location }} replace />
    );
}


export default RequireAuth

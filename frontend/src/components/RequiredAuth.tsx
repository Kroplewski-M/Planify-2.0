import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function RequireAuth() {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/Login" replace state={{ from: location }} />;
    }

    return <Outlet />;
}
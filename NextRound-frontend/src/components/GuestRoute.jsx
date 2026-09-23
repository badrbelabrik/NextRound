import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function GuestRoute() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#0B0F19] text-white">
                Loading...
            </div>
        );
    }

    if (user) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}

export default GuestRoute;
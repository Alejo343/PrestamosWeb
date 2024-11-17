import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// ==============================|| MINIMAL LAYOUT ||============================== //

const MinimalLayout = () => {
    const { user } = useAuth();

    //Si estoy logeado no vendra a este grupo de paginas
    if (user) {
        return <Navigate to="/dashboard/index" replace />;
    }

    return (
        <>
            <Outlet />
        </>
    );
};

export default MinimalLayout;

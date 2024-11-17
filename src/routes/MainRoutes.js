import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));

// render - utilities
const Collectors = Loadable(lazy(() => import('pages/components-overview/Collectors')));
const Customer = Loadable(lazy(() => import('pages/components-overview/Customer')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '/',
            element: <DashboardDefault />
        },
        {
            path: 'Clientes',
            element: <Customer />
        },
        {
            path: 'dashboard',
            children: [
                {
                    path: 'index',
                    element: <DashboardDefault />
                }
            ]
        },
        {
            path: 'Cobradores',
            element: <Collectors />
        }
    ]
};

export default MainRoutes;

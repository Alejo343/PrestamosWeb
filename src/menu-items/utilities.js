// assets
import { TeamOutlined, SolutionOutlined } from '@ant-design/icons';

// icons
const icons = {
    TeamOutlined,
    SolutionOutlined
};

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const utilities = {
    id: 'utilities',
    title: 'Utilities',
    type: 'group',
    children: [
        {
            id: 'util-typography',
            title: 'Cobradores',
            type: 'item',
            url: '/Cobradores',
            icon: icons.TeamOutlined
        },
        {
            id: 'util-color',
            title: 'Clientes',
            type: 'item',
            url: '/Clientes',
            icon: icons.SolutionOutlined
        }
    ]
};

export default utilities;

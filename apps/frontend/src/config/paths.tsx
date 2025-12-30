import LayersIcon from '@mui/icons-material/Layers';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import SettingsIcon from '@mui/icons-material/Settings';
import GestureIcon from '@mui/icons-material/Gesture';
import AddToQueueIcon from '@mui/icons-material/AddToQueue';
import QueryStatsIcon from '@mui/icons-material/QueryStats';

const ways = [
    {
        text: "Мониторинг",
        icon: <LayersIcon />,
        path: '/'
    },
    {
        text: "Аналитика",
        icon: <QueryStatsIcon />,
        path: '/analytic'
    },
    {
        text: "Прогнозы и сценарии",
        icon: <GestureIcon />,
        path: '/visual'
    },
    {
        text: <>Работа с пространственными данными</>,
        icon: <ViewInArIcon />,
        path: '/spatial'
    },
    null,
    {
        text: 'Импорт данных',
        icon: <AddToQueueIcon />,
        path: '/import'
    },
    null,
    {
        text: "Настройки",
        icon: <SettingsIcon />,
        path: '/settings'
    },
]

export {
    ways
}
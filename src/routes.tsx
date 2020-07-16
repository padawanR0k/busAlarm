import Quick from './pages/Quick/Quick';
import FindRoute from './pages/FindRoute/FindRoute';
import Preference from './pages/Preference/Preference';
import Tracking from './pages/Tracking/Tracking';

const routes = [
    {
        path: '/quick',
        component: Quick,
        title: '빠른 실행',
        tab: true
    },
    {
        path: '/tracking',
        component: Tracking,
        title: '실행중',
        tab: false
    },
    {
        path: '/find',
        component: FindRoute,
        title: '정류장 찾기',
        tab: true
    },
    {
        path: '/menu',
        component: Preference,
        title: '설정',
        tab: true
    },
]


export default routes;
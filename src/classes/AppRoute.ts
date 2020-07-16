import { RouteComponentProps } from "react-router";

class AppRoutes {
    private routes: AppRoute[] = [];
    constructor(routes: AppRoute[]) {
        this.routes = routes;
    }
    get route() {
        return this.routes;
    }
}

export default AppRoutes;

interface AppRoute {
    path: string;
    component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
    title: string;
    tab: boolean;
}
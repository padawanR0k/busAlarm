import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
// import { ellipse, square, triangle } from 'ionicons/icons';
// import Tab1 from './pages/Quick';
// import Tab2 from './pages/FindRoute';
// import Tab3 from './pages/Preference';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import AppRoutes from './classes/AppRoute';
import routes from './routes';

interface Props {

}

interface States {

}

class App extends React.Component<Props, States> {
  AppRoutes = new AppRoutes(routes);
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <IonApp>
        <IonReactRouter>
          <IonTabs>
            <IonRouterOutlet>
              {this.AppRoutes.route.map(({ path, component }) => (
                <Route path={path} component={component} exact={true} key={path} />
              ))}
              <Redirect to={this.AppRoutes.route[0].path} />
            </IonRouterOutlet>

            <IonTabBar slot="bottom">
              {this.AppRoutes.route.map(({ path, title, tab }) => (
                tab
                ?
                <IonTabButton tab={title} href={path} key={path}>
                  {/* <IonIcon icon={triangle} /> */}
                  <IonLabel>{title}</IonLabel>
                </IonTabButton>
                :
                null
              ))}
            </IonTabBar>
          </IonTabs>
        </IonReactRouter>
      </IonApp>
    )
  }
}

export default App;

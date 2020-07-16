import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon } from '@ionic/react';
import Map from 'components/Atom/Map/Map';
import './Tracking.css';
import { useHistory } from 'react-router';
import { BusStop } from '../../components/Molecules/BusStopItem/BusStopItem';
import { close, bus, alarm } from 'ionicons/icons';
import Geolo from '../../classes/Geolocation';
import { GeolocationPosition, LocalNotifications } from '@capacitor/core';
import { Coord } from 'classes/Coordinate';
import { setLevel, setCenter, drawCircle, setMap } from 'util/kakaomap';
import { getDistance } from '../../util/geo';
import { App, Plugins } from '@capacitor/core';

const Tracking: React.FC = () => {
  const mapRef = React.useRef<Map>(null);
  const [busStop, setbusStop] = React.useState<BusStop>();
  const history = useHistory<{ busStop: BusStop }>();
  const track = new Geolo()

  React.useEffect(() => {
    console.log(history.location.state?.busStop);

    if (history.location.state?.busStop) {
      const BUS_STOP = history.location.state.busStop;
      setbusStop(BUS_STOP)
      console.log(BUS_STOP);
      console.log(busStop);

      if (BUS_STOP) {
        const { lat, lng } = BUS_STOP;
        const coord = new Coord({ lat, lng });
        setTimeout(() => {
          setLevel(mapRef.current?.dmap, 2);
          setCenter(mapRef.current?.dmap, coord.coordObj);
          const circle = drawCircle(coord.lat, coord.lng, false, 5)
          setMap(circle, mapRef.current?.dmap);
        }, 100);
      }

    }
  }, [])
  const startBackgroundTask = () => {
    App.addListener('appStateChange', (state) => {

      if (!state.isActive) {
        // The app has become inactive. We should check if we have some work left to do, and, if so,
        // execute a background task that will allow us to finish that work before the OS
        // suspends or terminates our app:

        const taskId = Plugins.BackgroundTask.beforeExit(async () => {
          // In this function We might finish an upload, let a network request
          // finish, persist some data, or perform some other task

          // Example of long task
          let start = new Date().getTime();
          for (let i = 0; i < 1e18; i++) {
            if ((new Date().getTime() - start) > 20000) {
              break;
            }
          }
          // Must call in order to end our task otherwise
          // we risk our app being terminated, and possibly
          // being labeled as impacting battery life
          Plugins.BackgroundTask.finish({
            taskId
          });
        });
      }
    })
  }
  const startTracking = () => {
    track.getCurrentPosition();
    track.watchPosition(callback);
    // startBackgroundTask();
  }

  const stopTracking = () => {
    track.clearWatch();
  }

  const notification = async () => {
    const notifs = await LocalNotifications.schedule({
      notifications: [
        {
          title: `${busStop?.busStopName}까지 도착 500m 전입니다!`,
          body: ``,
          id: 1,
          schedule: { at: new Date(Date.now() + 3) },
          sound: '',
          // attachments: null,
          actionTypeId: "",
          extra: null
        }
      ]
    });
  }

  const callback = (position: GeolocationPosition, err?: any) => {
    const { latitude: lat, longitude: lng } = position.coords;
    const circle = drawCircle(lat, lng, false, 2.5);
    setMap(circle, mapRef.current?.dmap);

    if (busStop) {
      const currPosi = { lat, lng };
      const dist = getDistance(busStop, currPosi, 'meters');
      console.log(`거리는 ${dist}m 남았음`);

      if (dist < 500) {
        notification()
      }
    }

    if (err) {
      console.error(err);
    }

  }


  return (
    <IonPage className="Tracking">
      <IonHeader>
        <IonToolbar>
          <IonTitle>실행중</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => startTracking()} >시작</IonButton>
            <IonButton onClick={() => stopTracking()} >중단</IonButton>
            <IonButton onClick={() => history.push('/quick')} >
              <IonIcon icon={close}></IonIcon>
            </IonButton>
          </IonButtons>

        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 3</IonTitle>
          </IonToolbar>
        </IonHeader>
        <Map ref={mapRef} func={{}}>

        </Map>
      </IonContent>
    </IonPage>
  );
};

export default Tracking;

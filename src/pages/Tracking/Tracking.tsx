import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon } from '@ionic/react';
import { Location } from "cordova-background-geolocation-lt";
import Map from 'components/Atom/Map/Map';
import './Tracking.css';
import { useHistory } from 'react-router';
import { BusStop } from '../../components/Molecules/BusStopItem/BusStopItem';
import { close } from 'ionicons/icons';
import { LocalNotifications } from '@capacitor/core';
import { Coord } from 'classes/Coordinate';
import { setLevel, setCenter, drawCircle, setMap, setPolylineOption } from 'util/kakaomap';
import { getDistance } from '../../util/geo';
import { App, Plugins } from '@capacitor/core';
import Track from 'models/Tracking';
import { setMapNull, setPolygon, setPolyline, setPath } from '../../util/kakaomap';

const Tracking: React.FC = () => {
  const mapRef = React.useRef<Map>(null);
  const [busStop, setbusStop] = React.useState<BusStop>();
  const history = useHistory<{ busStop: BusStop }>();
  const [tracker, settracker] = React.useState<Track | null>(null);
  const trackPositions = React.useRef<number[][]>([]);
  const polyline = React.useRef<any>(null);
  const circles = React.useRef<any>(null);

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
    return () => {
      trackPositions.current = [];
      polyline.current = null;

      setMapNull(circles.current);
      setMapNull(polyline.current);
    }
  }, [])

  const startTracking = () => {
    const tracking = new Track({
      onLocation: drawSpot
    });
    settracker(tracking);
    tracking.configureBackgroundGeolocation();
  }

  const stopTracking = () => {
    tracker?.stop();
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

  function drawSpot(location: Location) {
    const { latitude: lat, longitude: lng } = location.coords;
    const circle = drawCircle(lat, lng, false, 2.5);
    trackPositions.current.push([lat, lng]);
    circles.current.push(circles);

    if (polyline.current) {
      setPath(polyline.current, trackPositions.current);
    } else {
      polyline.current = setPolyline(1, [[lat,lng]], {endArrow: true});
    }

    setMap(circle, mapRef.current?.dmap);

    if (busStop) {
      const currPosi = { lat, lng };
      const dist = getDistance(busStop, currPosi, 'meters');
      console.log(`거리는 ${dist}m 남았음`);

      if (dist < 500) {
        notification()
      }
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
              <IonIcon icon={close} />
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

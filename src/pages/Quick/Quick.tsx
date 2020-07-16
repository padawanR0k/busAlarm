import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonText, IonAlert } from '@ionic/react';
import './Quick.css';
import BusStopItem, { BusStopItemProps } from '../../components/Molecules/BusStopItem/BusStopItem';
import { getMY_BUSSTOP } from 'components/Molecules/MapModal/MapModal';
import { App, Plugins } from '@capacitor/core';
import { useHistory } from 'react-router';

const Quick: React.FC = () => {
  const history = useHistory();
  const [showAlert, setshowAlert] = React.useState(false);
  const [busStops, setBusStops] = React.useState<BusStopItemProps[]>([]);
  const [selected, setselected] = React.useState<BusStopItemProps | null>(null);

  React.useEffect(() => {
    (async () => {
      const localStorage = await getMY_BUSSTOP();
      console.log(localStorage.value);

      setBusStops(localStorage.value ? JSON.parse(localStorage.value) : []);

    })();
  }, [])

  const openAlert = (busStop: BusStopItemProps) => {
    setselected(busStop);
    setshowAlert(true);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>버스 알람</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">버스 알람</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setshowAlert(false)}
          cssClass='my-custom-class'
          header={selected?.busStopName || '-'}
          subHeader={selected?.busStopNo || '-'}
          message={'목적지에 도착하면 알람이 울려요!'}
          buttons={[
            {
              text: '취소',
              role: 'cancel',
              handler: () => {
                setselected(null)
              }
            },
            {
              text: '시작',
              handler: () => {
                history.push({
                  pathname: '/tracking',
                  state: {
                    busStop: selected
                  }
                })
              }
            },
          ]}
        />

        <IonList>
          {
            busStops.length
              ?
              busStops.map((item) => (
                <BusStopItem
                  {...item}
                  key={item.busStopNo}
                  onClick={() => openAlert(item)} />
              ))
              : <IonText color="dark">저장한 목록이 없습니다</IonText>
          }
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Quick;

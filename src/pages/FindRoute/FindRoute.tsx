import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonSearchbar, IonItem, IonList, IonLabel, IonText } from '@ionic/react';
import GetBusStop, { IBusStopDetail } from 'api/BusStop/BusStop';
import './FindRoute.css';
import { debounce } from 'util/helper';
import BusStopItem from 'components/Molecules/BusStopItem/BusStopItem';
import MapModal from 'components/Molecules/MapModal/MapModal';

const FindRoute: React.FC = () => {
  const [keyword, setKeyword] = React.useState('');
  const [showModal, setshowModal] = React.useState(false);
  const [result, setResult] = React.useState<IBusStopDetail[]>([]);
  const [selected, setselected] = React.useState<IBusStopDetail | null>(null);

  const onChange = (value: string) => {
    setKeyword(value);
    debounce(searchBusStopByUniq)(value)

  }

  const searchBusStopByUniq = async (value: string) => {
    try {
      const res = await GetBusStop.getBusStopByUniq(value);
      if (res?.data.busStopLocationXyInfo?.list_total_count) {
        const { row } = res.data.busStopLocationXyInfo;
        setResult(row);
        console.log(row);
      } else {
        setResult([]);
      }

    } catch (error) {
      console.error(error);

    }
  }

  const clickItem = (stop: IBusStopDetail) => {
    setshowModal(true);
    setselected(stop);
  }

  return (
    <IonPage>

      <IonHeader>
        <IonToolbar>
          <IonTitle>정류장 찾기</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {
          selected
            ?
            <MapModal
              busStop={selected}
              showModal={showModal}
              setShowModal={setshowModal} />
            :
            null
        }

        <IonSearchbar
          value={keyword}
          onIonChange={e => onChange(e.detail.value!)}
          searchIcon="search-sharp"
          showCancelButton="focus" />

        <IonList>
          {
            result.length
              ?
              result.map(item => (
                <BusStopItem
                  key={item.STOP_NO}
                  onClick={() => clickItem(item)}
                  pathNo={'??'}
                  busStopNo={item.STOP_NO}
                  busStopName={item.STOP_NM} />
              ))
              : '검색결과가 없습니다.'
          }
        </IonList>


      </IonContent>
    </IonPage>
  );
};

export default FindRoute;

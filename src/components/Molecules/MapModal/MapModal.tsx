import * as React from 'react';
import { close } from 'ionicons/icons'
import { IonModal, IonButton, IonHeader, IonContent,  IonTitle, IonToolbar, IonIcon, IonButtons } from '@ionic/react';
import { Plugins } from '@capacitor/core';
import Map from 'components/Atom/Map/Map';
import { IBusStopDetail } from 'api/BusStop/BusStop';
import { setCenter } from 'util/kakaomap';
import { setLevel, drawCircle,  setMap } from '../../../util/kakaomap';
import { Coord } from 'classes/Coordinate';
import { BusStopItemProps, BusStop } from '../BusStopItem/BusStopItem';
/** */
interface Props {
    busStop: IBusStopDetail;
    showModal: boolean;
    setShowModal: (show: boolean) => void;
}

const MapModal: React.FC<Props> = (props) => {
    const ref = React.useRef<Map>(null);
    const setMapCenter = () => {
        console.log('bounds_changed');
        console.log(props.busStop);

        if (props.busStop) {
            const { busStop: { XCODE, YCODE } } = props;
            const coord = new Coord({ lat: YCODE, lng: XCODE});
            setTimeout(() => {
                setLevel(ref.current?.dmap, 2);
                setCenter(ref.current?.dmap, coord.coordObj);
                const circle = drawCircle(coord.lat, coord.lng, false, 5)
                setMap(circle, ref.current?.dmap);
            }, 100);
        }
    }

    const saveBusStop = async (stop: IBusStopDetail) => {
        setMY_BUSSTOP({
            busStopName: stop.STOP_NM,
            busStopNo: stop.STOP_NO,
            pathNo: '',
            lat: Number(stop.YCODE),
            lng: Number(stop.XCODE)
        })
        props.setShowModal(false);
    }

    React.useEffect(() => {
        if (props.showModal) {
            setMapCenter();
        }
    }, [props.showModal]);

    return (
        <div className="MapModal">
            <IonModal isOpen={props.showModal} cssClass='my-custom-class'>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>
                            {props.busStop?.STOP_NM}
                        </IonTitle>
                        <IonButtons slot="end">

                            <IonButton onClick={() => saveBusStop(props.busStop)}>
                                저장
                            </IonButton>

                            <IonButton onClick={() => props.setShowModal(false)}>
                                <IonIcon icon={close}></IonIcon>
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>

                <IonContent>
                    <Map func={{
                        // bounds_changed: () => setMapCenter()
                    }} ref={ref} >
                    </Map>

                </IonContent>
            </IonModal>
        </div>
    );
};

export default MapModal;

export async function getMY_BUSSTOP () {
    const list = await Plugins.Storage.get({ key: 'MY_LIST' });
    return list;
}
export async function setMY_BUSSTOP(stop: BusStop) {
    const list = await getMY_BUSSTOP();
    const OLD_LIST: BusStop[] = list.value ? JSON.parse(list.value) : [];

    if (OLD_LIST.find(item => item.busStopNo === stop.busStopNo)) {
        alert('저장목록에 이미  존재합니다');
    } else {
        await Plugins.Storage.set({
            key: 'MY_LIST',
            value: JSON.stringify([stop, ...OLD_LIST])
        });
    }
}
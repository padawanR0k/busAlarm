import * as React from 'react';
import { IonItem, IonChip, IonIcon, IonNote, IonLabel } from '@ionic/react';
import { pin } from 'ionicons/icons';

export interface BusStop extends Pick<BusStopItemProps, 'pathNo' | 'busStopNo' | 'busStopName'>{
    /** 위도 */
    lat: number;
    /** 경도 */
    lng: number;
}

/** */
export interface BusStopItemProps {
    /** 버스 번호 */
    pathNo: string;
    /** 정류장 번호 */
    busStopNo: string;
    /** 정류장 이름 */
    busStopName: string;

    onClick: Function;
}

const BusStopItem: React.FC<BusStopItemProps> = (props) => {
    const {
        pathNo,
        busStopNo,
        busStopName,
        onClick
    } = props;
    return (
        <IonItem onClick={() => onClick()} button className="BusStopItem">
            {busStopName}
            <IonChip color="secondary" >
                <IonIcon icon={pin} />
                <IonLabel>
                {pathNo}
                </IonLabel>
            </IonChip>

            <IonNote className="busStopNo" slot="end">{busStopNo}</IonNote>

        </IonItem>
    );
};

export default BusStopItem;
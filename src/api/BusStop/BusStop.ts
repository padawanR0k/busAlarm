import { GET } from "../request";

class GetBusStop {
    SEOUL_API_URL = "http://openapi.seoul.go.kr:8088";
    WS_API_URL = "http://ws.bus.go.kr";
    BUS_API_KEY = "63736e4c6c64626635337977697577";
    BUS_API_KEY2 = "i6qR6OijqAi2ejOYaYoOcjqna81q26fxRxZQVsLXJ6PRIZs9rzUTX2XtFncpq7G1oJRSWJVcpOqQvske3yoWsQ";

    PATH = {
        GET_BUSSTOP_BY_UNIQ: '/json/busStopLocationXyInfo',
        GET_BUSSTOP_BY_NAME: '/api/rest/stationinfo/getStationByName'
    }

    public getBusStopByUniq (uniq: string, page: number = 1, limit: number = 5)  {
        return GET<IGetBusStopByUniq>(`${this.SEOUL_API_URL}/${this.BUS_API_KEY}${this.PATH.GET_BUSSTOP_BY_UNIQ}/${page}/${limit}/${uniq}`);
    }

    public getBusStopByName (name: string)  {
        return GET<IGetBusStopByUniq>(`${this.WS_API_URL}/${this.PATH.GET_BUSSTOP_BY_NAME}`, {
            serviceKey: this.BUS_API_KEY2,
            stSrch: name
        });
    }

}

export default new GetBusStop();


interface IGetBusStopByUniq {
    busStopLocationXyInfo: BusStopLocationXyInfo;
}

interface BusStopLocationXyInfo {
    list_total_count: number;
    RESULT: RESULT;
    row: IBusStopDetail[];
}

export interface IBusStopDetail {
    STOP_NO: string;
    STOP_NM: string;
    XCODE: string;
    YCODE: string;
}

interface RESULT {
    CODE: string;
    MESSAGE: string;
}
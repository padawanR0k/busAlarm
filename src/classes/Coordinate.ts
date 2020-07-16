import { Coordinate } from "util/kakaomap";
import { getDistance } from "util/geo";

export class Coord {
    lat: number = 0;
    lng: number = 0;
    constructor(pos: Coordinate | number[]) {
        if (Array.isArray(pos)) {
            this.lat = Number(pos[0]);
            this.lng = Number(pos[1]);
        } else {
            this.lat = Number(pos.lat);
            this.lng = Number(pos.lng);
        }
    }

    getDistance(coord: Coordinate, units: typeof TemplateUnits) {
        return getDistance(this, coord, units);
    }

    get coordObj() {
        return {
            lat: this.lat,
            lng: this.lng
        };
    }

    get coordArr() {
        return [this.lat, this.lng];
    }
}
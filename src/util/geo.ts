import turf from 'turf';
import { Coordinate } from './kakaomap';
/**
 * 두 점 사이의 거리를 반환한다.
 * @param from 시작점
 * @param to 도착점
 * @param units 단위
 */
export function getDistance(from: Coordinate, to: Coordinate, units: typeof TemplateUnits) {
    const f = turf.point([Number(from.lng), Number(from.lat)]);
    const t = turf.point([Number(to.lng), Number(to.lat)]);
    return turf.distance(f, t, units);
}
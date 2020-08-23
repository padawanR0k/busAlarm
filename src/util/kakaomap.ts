import * as turf from 'turf'
declare var daum: any;
export type Coordinate = { lat: number | string, lng: number | string };
export type dmapEventType =
    'click'
    | 'dbclick'
    | 'rightclick'
    | 'drag'
    | 'dragstart'
    | 'dragend'
    | 'zoom_start'
    | 'zoom_end'
    | 'zoom_changed'
    | 'center_changed'
    | 'tilesloaded'
    | 'mousemove'
    | 'idle'
    | 'maptypeid_changed'
    | 'bounds_changed';

export type dampEventValue =
    | { event: 'click', value: Coordinate }
    | { event: 'dbclick', value: {} }
    | { event: 'rightclick', value: Coordinate }
    | { event: 'drag', value: null }
    | { event: 'dragstart', value: Coordinate }
    | { event: 'dragend', value: Coordinate }
    | { event: 'zoom_start', value: {} }
    | { event: 'zoom_end', value: {} }
    | { event: 'zoom_changed', value: Coordinate }
    | { event: 'center_changed', value: {} }
    | { event: 'tilesloaded', value: null }
    | { event: 'mousemove', value: {} }
    | { event: 'idle', value: {} }
    | { event: 'maptypeid_changed', value: {} }
    | { event: 'bounds_changed', value: null };

export type markerEventType =
    | 'click'
    | 'mouseover'
    | 'mouseout'
    | 'rightclick'
    | 'dragstart'
    | 'dragend';

export type markerEventValue =
    | { event: 'click', value: number }
    | { event: 'mouseover', value: number }
    | { event: 'mouseout', value: number }
    | { event: 'rightclick', value: number }
    | { event: 'dragstart', value: number }
    | { event: 'dragend', value: { no: number, coord: Coordinate } }
    ;

/**
 *  지도 초기화
 */
let map: any;
export const initmap = (el: HTMLDivElement, e: (Action: dampEventValue) => any, level?: number) => {
    checkMapSDK({
        loaded: () => {
            map = new daum.maps.Map(el, {
                center: new daum.maps.LatLng(37.5, 127.0),
                level: level || 9
            });

            daum.maps.event.addListener(map, 'click', (event: any) => {
                const output = { lat: event.latLng.getLat(), lng: event.latLng.getLng() };
                e({ event: 'click', value: output });
            });

            daum.maps.event.addListener(map, 'rightclick', (event: any) => {
                const output = { lat: event.latLng.getLat(), lng: event.latLng.getLng() };
                e({ event: 'rightclick', value: output });
            });

            daum.maps.event.addListener(map, 'drag', (event: any, a: any) => {
                e({ event: 'drag', value: null });
            });

            daum.maps.event.addListener(map, 'dragstart', () => {
                const center = map.getCenter();
                const output = { lat: center.getLat(), lng: center.getLng() };
                e({ event: 'dragstart', value: output });
            });

            daum.maps.event.addListener(map, 'dragend', () => {
                const center = map.getCenter();
                const output = { lat: center.getLat(), lng: center.getLng() };
                e({ event: 'dragend', value: output });
            });

            daum.maps.event.addListener(map, 'center_changed', () => {
                const center = map.getCenter();
                const output = { lat: center.getLat(), lng: center.getLng(), level: map.getLevel() };
                e({ event: 'center_changed', value: output });
            });
            daum.maps.event.addListener(map, 'zoom_changed', () => {
                const center = map.getCenter();
                const output = { lat: center.getLat(), lng: center.getLng(), level: map.getLevel() };
                e({ event: 'zoom_changed', value: output });
            });

            daum.maps.event.addListener(map, 'tilesloaded', () => {
                // do something

                e({ event: 'tilesloaded', value: null });
                map.relayout();
            });

            daum.maps.event.addListener(map, 'bounds_changed', () => {
                // do something
                const value = getBounds(map);
                e({ event: 'bounds_changed', value });
            });
        },
        fail: () => false
    });

    return map;
};

export function mapSDKloaded() {
    return typeof daum !== 'undefined' && daum !== null && daum.maps.Map;
}

export function checkMapSDK(funcs: { loaded: Function, fail: Function }) {
    if (mapSDKloaded()) {

        return funcs.loaded();
    } else {
        return funcs.fail();
    }
}

/**
 * 지도 센터 이동
 * @param lat 위도
 * @param lng 경도
 */
export const setCenter = (map: any, coord: Coordinate) => {
    if (map) {

        checkMapSDK({
            loaded: () => map.setCenter(new daum.maps.LatLng(coord.lat, coord.lng)),
            fail: () => false
        });
    } else {

    }
};

/**
 * 커스텀 오버레이 출력
 * @param content 내용
 * @param lat 위도
 * @param lng 경도
 */
export const makeCustomOverlay = (options: {
    content: string | HTMLElement,
    lat: number,
    lng: number,
}) => {
    const { lat, lng, content } = options;
    return checkMapSDK({
        loaded: () => {
            const option: any = {
                clickable: true,
                position: new daum.maps.LatLng(lat, lng),
                content,
                xAnchor: 0.5,
                yAnchor: 1,
                zIndex: 10
            };

            return new daum.maps.CustomOverlay(option);
        },
        fail: () => {
            return null;
        }
    });
};

/**
 * 커스텀 오버레이 컴포넌트 (정류장)
 * @param idx
 * @param alias
 * @param addr
 * @param jibun
 */
export const setStopTag = (idx: number, alias: string, addr: string, jibun: string) => {

    const content: string = `
    <div class="popover top fade in infowindow " style="display:block;width:305px;height:135px;top: -188px;left: -137px;" >
         <div class="arrow" style="border-top-color:#fff;"></div>
         <div class="popover-title fb">
            ${(idx * 1 + 1) + '. ' + alias}
         </div>
         <div class="popover-inner">
            <div class="popover-content">
            ${addr + jibun}
            </div>
         </div>
    </div>`;
    return content;
};

/**
 * 커스텀 오버레이 컴포넌트 (검색)
 * @param alias
 * @param addr
 */
export const setStopSelect = (alias: string, addr: string) => {

    if (addr === '') {
        addr = '주소가 확인되지 않습니다.';
    }
    const content = `<div class="popover show bs-popover-top" style="position: absolute; top: -140px; width: 300px;left:-130px;">
                            <div class="popover-inner">
                                <h3 class="popover-header">${alias}</h3>
                                <div class="popover-body">${addr}</div>
                            </div>
                            <span class="arrow" style="left:120px;"  ></span>
                        </div>`;
    return content;
};

/**
 * 커스텀 오버레이 컴포넌트 (검색)
 * @param alias
 * @param addr
 */
export const MarkerInfoOverLay = (info: { name: string, phone: string }) => {
    const content = `<div class="map-info top show">
                        <div class="arrow" style="border-top-color:#fff;">
                        </div>
                        <div class="info-title">${info.name || '이름없음'}</div>
                        <div class="info-inner">
                            <div class="info-content">${info.phone}</div>
                        </div>
                    </div>`;
    return content;
};

/**
 * 정류장 마커
 * @param no
 * @param lat
 * @param lng
 * @param zIndex
 * @param icon
 * @param draggable
 * @param e
 */
export const makeMarker = (
    info: {
        no: any,
        lat: number,
        lng: number,
        zIndex: number,
        icon: string,
        draggable: boolean,
        size?: { w: number, h: number }
        offset?: {
            x: number,
            y: number
        };
    },
    e: (e: markerEventValue) => void
) => {
    const { no, lat, lng, zIndex, icon, draggable, size, offset } = info;
    return checkMapSDK({
        loaded: () => {
            const markerOffset = offset
                ? new daum.maps.Point(offset.x, offset.y)
                : null;

            const MarkerSize = size
                ? new daum.maps.Size(size.w, size.h)
                : new daum.maps.Size(58, 71);

            const options: any = {};
            /*
                alt String : 마커 이미지의 alt 속성값을 정의한다.
                coords String : 마커의 클릭 또는 마우스오버 가능한 영역을 표현하는 좌표값
                offset Point : 마커의 좌표에 일치시킬 이미지 안의 좌표 (기본값: 이미지의 가운데 아래)
                shape String : 마커의 클릭 또는 마우스오버 가능한 영역의 모양
                spriteOrigin Point : 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
                spriteSize Size : 스프라이트 이미지의 전체 크기
            */

            if (markerOffset) {
                options.offset = markerOffset;
            }

            const marker = new daum.maps.Marker({
                title: no,
                map,
                position: new daum.maps.LatLng(lat, lng),
                zIndex,
                draggable,
                image: new daum.maps.MarkerImage(
                    icon,
                    MarkerSize,
                    options
                )
            });
            daum.maps.event.addListener(marker, 'click', () => {
                e({ event: 'click', value: no });
            });
            daum.maps.event.addListener(marker, 'mouseover', () => {
                e({ event: 'mouseover', value: no });
            });
            daum.maps.event.addListener(marker, 'mouseout', () => {
                e({ event: 'mouseout', value: no });
            });
            daum.maps.event.addListener(marker, 'dragend', () => {
                const a = marker.getPosition();
                e({
                    event: 'dragend',
                    value: {
                        no,
                        coord: {
                            lat: a.getLat(),
                            lng: a.getLng()
                        }
                    }
                });
            });
            daum.maps.event.addListener(marker, 'dragstart', () => {
                e({ event: 'dragstart', value: no });
            });
            return marker;

        },
        fail: () => {
            return null;
        }
    });
};

/**
 * 마커 위치 변경
 * @param marker
 * @param lat
 * @param lng
 */
export const setMarkerPosition = (marker: any, lat: number, lng: number) => {
    marker.setPosition(new daum.maps.LatLng(lat, lng));
};

/**
 * 마커의 이미지를 변경한다.
 */
export const setMarkerImage = (marker: any, imageUrl: string, size: { width: number, height: number }, offset?: { x: number, y: number }) => {
    const markerImage = new daum.maps.MarkerImage(imageUrl, new daum.maps.Size(size.width, size.height), {
        offset: offset ? new daum.maps.Point(offset.x, offset.y) : new daum.maps.Point(0, 0)
    });
    return marker.setImage(markerImage);
};

/**
 * 컴포넌트 위치 변경
 * @param component
 * @param lat
 * @param lng
 */
export const setPosition = (component: any, lat: number, lng: number) => {
    checkMapSDK({
        loaded: () => {
            component.setPosition(new daum.maps.LatLng(lat, lng));
        },
        fail: () => {
        }
    });
};

/**
 * 지도위 출력
 * @param value ex. 마커, 폴리라인
 * @param map  null일 경우 지도 위에서 사라짐
 */
export const setMap = (value: any, map: any | null) => {
    checkMapSDK({
        loaded: () => {
            value.setMap(map);
        },
        fail: () => {
        }
    });
};

// /**
//  * hover시 이미지 변경
//  * @param se
//  * @param event
//  * @param idx
//  * @param marker
//  */
// export const imageUpdate = (se: string, event: string, idx: number, marker: any) => {
//     const mi = makeMarkerImage(file + 'marker/' + se + (event === 'mouseover' ? '/hover' : '') + '/number' + (idx * 1 + 1) + '.png', { x: 36, y: 51 });
//     marker.setImage(mi);
// };

/**
 * 마커 이미지 수정
 * @param marker 마커객체
 * @param imgSrc 이미지 주소
 * @param size 이미즈 사이즈
 */
export const setImage = (marker: any, imgSrc: any, size: { x: number, y: number }) => {
    const imageObject = makeMarkerImage(imgSrc, size);
    marker.setImage(imageObject);
};

/**
 * 실제 다음 맵 이미지 객체 생성
 * @param url 이미지 주소
 * @param size 이미지 사이즈객체
 */
export function makeMarkerImage(url: string, size: { x: number, y: number }) {
    return new daum.maps.MarkerImage(url, makeSize(size.x, size.y));
}

/**
 * 마커 사이즈객체 생성
 * @param x 가로 너비
 * @param y 세로 길이
 */
export function makeSize(x: number, y: number) {
    return new daum.maps.Size(x, y);
}

/**
 * 폴리라인 출력
 * @param path
 */
export const setPolyline = (index: any, path: any[], style?: PolyLineStyle, callback?: Function) => {
    return checkMapSDK({
        loaded: () => {
            let defaultStyle: any = {
                strokeWeight: 5,
                strokeColor: '#02D3BD',
                strokeOpacity: 0.7,
                strokeStyle: 'solid'
            };
            if (style) {
                defaultStyle = { ...defaultStyle, ...style };
            }

            const polyline = new daum.maps.Polyline({
                path: transformToLatLngArray(path),
                ...defaultStyle
            });

            if (callback) {
                daum.maps.event.addListener(polyline, 'mouseover', (mouseEvent: any) => {
                    callback('mouseover', index);
                });
                daum.maps.event.addListener(polyline, 'mouseout', (mouseEvent: any) => {
                    callback('mouseout', index);
                });
                daum.maps.event.addListener(polyline, 'click', (mouseEvent: any) => {
                    callback('click', index);
                });
                // polyline.setMap(map);
            }

            return polyline;
        },
        fail: () => {
            return null;
        }
    });
};

export const setPath = (polyline: any, coords: number[][]) => {
    const newPath = coords.map(item => latlng(item[0], item[1]));
    polyline.setPath(newPath);
    return polyline;
};

/**
 * 다음지도 위경도 객체
 * @param lat
 * @param lng
 */
export const latlng = (lat: number, lng: number) => {
    return checkMapSDK({
        loaded: () => {
            return new daum.maps.LatLng(lat, lng);
        },
        fail: () => {
            return null;
        }
    });
};

/**
 * 다음지도 바운스 빈객체
 */
export const bounds = () => {
    return checkMapSDK({
        loaded: () => {
            return new daum.maps.LatLngBounds();
        },
        fail: () => {
            return null;
        }
    });
};

/**
 * 다음지도 센터 위경도 객체
 */
export const getMapCenter = () => {
    const center = map.getCenter();
    const output = { lat: center.getLat(), lng: center.getLng() };
    return output;
};

/**
 * 원 도형 생성
 */
export const drawCircle = (lat: number, lng: number, isResponsive: boolean, distance: number, style?: CircleStyle) => {
    return checkMapSDK({
        loaded: () => {
            let defaultStyle = {
                radius: isResponsive ? distance * 1000 : distance,
                strokeWeight: 5,
                strokeStyle: 'solid',
                fillOpacity: 0.5
            };
            if (style) {
                defaultStyle = applyStyle(defaultStyle, style);
            }
            const circle = new daum.maps.Circle({
                center: latlng(lat, lng),
                ...defaultStyle
            });
            return circle;

        },
        fail: () => {
            return null;

        }
    });
};

/**
 * 맵 center 반환
 */
export const getCenter = (map: any) => {
    if (map) {
        return checkMapSDK({
            loaded: () => {
                const LatLng = map.getCenter();
                return {
                    lat: LatLng.getLat(),
                    lng: LatLng.getLng(),
                };
            },
            fail: () => null
        });
    } else {
        return null;
    }
};

/**
 * 현재 맵 영역 반환
 */
export function getBounds(map: any) {
    return checkMapSDK({
        loaded: () => {
            return map.getBounds();
        },
        fail: () => {
            return null;
        }
    });
}

/**
 * 현황용 마커 생성
 */

// export const MakerForClustor = (lat: number, lng: number, key: string) => {
//     const marker = new daum.maps.Marker({
//         map,
//         position: new daum.maps.LatLng(lat, lng),
//         image: new daum.maps.MarkerImage(key === 'start' ? startSVG : endSVG , new daum.maps.Size(13, 13))
//     });
//     return marker;
// };

/**
 * 마커 제거
 */
export const setMapNull = (target: any) => {
    if (target !== undefined) {
        if (target instanceof Array) {
            target.map(t => t.setMap(null));
        } else {
            target.setMap(null);
        }
        return target;
    }
};

/**
 * 마커 클러스터러 생성
 */
export const makeClusterer = (markers: any, key: string) => {
    const style = (background: string) => {
        return {
            width: '20px', height: '20px',
            color: '#fff',
            lineHeight: '20px',
            background,
            borderRadius: '10px',
            textAlign: 'center'
        };
    };
    const Clusterer = new daum.maps.MarkerClusterer({
        map,
        markers,
        averageCenter: true,
        minLevel: 4,
        styles: [style(key === 'start' ? 'blue' : '#FF0000')]
    });
    return Clusterer;
};

/**
 * 지도 위에 마우스 커서가 위치할 경우 보여지는 커서의 스타일을 지정한다.
 * @param type 'move'  | 'url(/cursor.ico), default'
 */
export const setCursor = (type: string) => {
    return map.setCursor(type);
};

export const setVisible = (component: any, visible: boolean) => {
    if (typeof daum !== 'undefined' && daum !== null) {
        if (component !== null && component !== undefined) {
            component.setVisible(visible);
        }
    }
};

export const setBounds = (map: any, bs: any, padding?: {
    paddingTop?: number,
    paddingBottom?: number,
    paddingRight?: number,
    paddingLeft?: number,
}) => {
    let pd: number[] = [];

    if (padding) {
        pd = [
            (padding.paddingTop || 0),
            (padding.paddingRight || 0),
            (padding.paddingBottom || 0),
            (padding.paddingLeft || 0),
        ];
    }

    checkMapSDK({
        loaded: () => map.setBounds(bs, ...pd),
        fail: () => false
    });
};

/**
 * 맵의 줌레벨을 변경한다.
 * @param level 레벨
 */
export const setLevel = (map: any, level: number) => {
    checkMapSDK({
        loaded: () => map.setLevel(level),
        fail: () => false
    });
};

/**
 * 맵의 줌레벨을 조회한다.
 * @param level 레벨
 */
export const getLevel = (map: any) => {
    return checkMapSDK({
        loaded: () => map.getLevel(),
        fail: () => 0
    });
};

export const getLength = (polyline: any) => {
    checkMapSDK({
        loaded: () => {
            return polyline ? polyline.getLength() : 0;

        },
        fail: () => {
            return 0;
        }
    });
};

export const getVisible = (component: any) => {
    return checkMapSDK({
        loaded: () => {
            if (component !== null && component !== undefined) {
                return component.getVisible();
            } else {
                return false;
            }

        },
        fail: () => {
            return false;
        }
    });
};

export const setDraggable = (component: any, visible: boolean) => {
    checkMapSDK({
        loaded: () => {
            component && component.setDraggable(visible);
        },
        fail: () => {

        }
    });
};

export const setExtend = (component: any, latlng: any) => {
    checkMapSDK({
        loaded: () => {
            if (latlng !== null && component) {
                component.extend(latlng);
            }

        },
        fail: () => {

        }
    });
};

export const setContent = (component: any, content: any) => {
    return checkMapSDK({
        loaded: () => {
            if (component) {
                component.setContent(content);
            }
            return content;
        },
        fail: () => {

        }
    });
};

export const getContent = (marker: any) => {
    return checkMapSDK({
        loaded: () => {
            return marker ? marker.getContent() : null;
        },
        fail: () => {

        }
    });
};

/**
 * 컴포넌트 z-index 지정
 * @param component 대상
 * @param zIndex z-index
 */
export const setZIndex = (component: any, zIndex: number) => {
    checkMapSDK({
        loaded: () => {
            component && component.setZIndex(zIndex);
        },
        fail: () => {

        }
    });
};

/**
 * 컴포넌트 z-index GET
 * @param component 대상
 */
export const getZIndex = (component: any) => {
    checkMapSDK({
        loaded: () => {
            component && component.getZIndex();
        },
        fail: () => {

        }
    });
};

/**
 * 맵의 우측상단, 좌측하단 좌표를 이용해 현재 보이는 범위의 좌표값을 반환한다.
 * @param map map
 */
export const getMapSizePolygon = (map: any) => {
    const bounds = map.getBounds();
    const neLatLng = bounds.getNorthEast();
    const swLatLng = bounds.getSouthWest();
    const ne = `${neLatLng.getLng()} ${neLatLng.getLat()}`;
    const se = `${neLatLng.getLng()} ${swLatLng.getLat()}`;
    const sw = `${swLatLng.getLng()} ${swLatLng.getLat()}`;
    const nw = `${swLatLng.getLng()} ${neLatLng.getLat()}`;
    //   nw   ne
    //    .___.
    //    |   |
    // sw !___! se
    return {
        polygon: `Polygon((${ne}, ${se}, ${sw}, ${nw}, ${ne}))`
    };
};

/**
 * 다음맵 폴리곤 객체를 생성하여 리턴한다.
 * @param map 맵객체
 * @param path 좌표값으로 이루어진 배열
 * @param styleOptions 폴리곤 스타일 객체
 */
export const setPolygon = (map: any, path: any[], callback: Function, styleOptions?: PolygonStyle) => {
    if (!path.length) {
        alert('배열이 제대로된 값인지 확인해주세요');
    } else {

        const styles = Object.assign({
            strokeWeight: 1,
            strokeColor: '#6078ea',
            strokeOpacity: .8,
            strokeStyle: 'solid',
            fillColor: '#FFFFFF',
            // fillColor: '#6078ea',
            fillOpacity: 0.1,

        }, styleOptions);

        const polygon = new daum.maps.Polygon({
            map,
            path: transformToLatLngArray(path),
            ...styles
        });

        daum.maps.event.addListener(polygon, 'mouseover', (mouseEvent: any) => {
            callback('mouseover', mouseEvent);
        });
        daum.maps.event.addListener(polygon, 'mouseout', (mouseEvent: any) => {
            callback('mouseout', mouseEvent);
        });
        daum.maps.event.addListener(polygon, 'click', (mouseEvent: any) => {
            callback('click', mouseEvent);
        });
        polygon.setMap(map);

        return polygon;
    }
};

/**
 * 일반 좌표값들의 배열을 다음맵객체로 이루어진 배열로 변환함
 * @param path lat lng값을 가진 객체의 배열
 */
export function transformToLatLngArray(path: any[]) {
    return checkMapSDK({
        loaded: () => {
            if (path[0][0] > path[0][1]) {
                // console.log('turf 사용');

                path = path.map(item => {
                    const temp = item[0];
                    item[0] = item[1];
                    item[1] = temp;
                    return item;
                });
            }
            const paths = path.map((p) => {
                if (p.constructor === Object) {
                    return new daum.maps.LatLng(p.lat, p.lng);
                } else if (p.constructor === Array) {

                    return new daum.maps.LatLng(...p);
                } else {
                    // alert('좌표표배열을 확인하세요');
                }
            });
            // console.log(paths);

            return paths;
        },
        fail: () => {
            return path;
        }
    });
}

/**
 * 폴리곤의 중앙좌표를 구한다.
 * @param poly 폴리곤 좌표 ex) [[[[0,0],[0,10],[10,10],[10,0],[0,0]]]]
 * @param type 폴리곤 타입
 */
// export function centerOfPolygon(poly: any[], type: 'Polygon' | 'MultiPolygon') {
    // const polygon = type === 'Polygon' ? turf.polygon(poly) :
        // type === 'MultiPolygon' ? turf.multiPolygon(poly) : alert('잘못된 폴리곤 형태입니다! Polygon or MultiPolygon');
    // const center = turf.centerOfMass(polygon);
    // return center.geometry.coordinates;
// }

/**
 * 폴리곤의 옵션을 변경시킨다.
 * @param polygon 변경시킬 폴리곤
 * @param option 변경할 옵션
 */
export const setPolygonOption: any = (polygon: any, option: PolygonStyle): any => {
    // polygon.map((p: any) => p.setOptions(option));
    if (polygon) {
        polygon.setOptions(option);
        return polygon;
    }
};

/**
 * 폴리라인의 옵션을 변경시킨다.
 * @param polyline 변경시킬 폴리곤
 * @param option 변경할 옵션
 */
export const setPolylineOption: any = (polyline: any, option: PolyLineStyle): any => {
    // polyline.map((p: any) => p.setOptions(option));
    if (polyline) {
        polyline.setOptions(option);
        return polyline;
    }
};

export function applyStyle(defaultStyle: any, custom: any) {
    Object.keys(custom).map(key => defaultStyle[key] = custom[key]);
    return defaultStyle;
}

/**
 * 검색시 경유지 마커이미지 주소 생성 (최대 30개)
 * @param index 인덱스
 */
// export const makeWayPointImg = (index: number) => {
//     if (index < 31) {
//         return `${file}marker/path/number${index}.png`;
//     } else {
//         alert('더 이상 마커를 만들 수 없습니다.');
//         return '';
//     }
// };

/**
 * 좌표로 부드럽게 이동
 * @param map map
 * @param coords  좌표
 */
export const panTo = (map: any, coords: Coordinate) => {
    if (map) {
        const moveLatLng = latlng(Number(coords.lat), Number(coords.lng));
        checkMapSDK({
            loaded: () => map.panTo(moveLatLng),
            fail: () => false
        });
    }
};

export interface PolyLineStyle {
    strokeWeight?: number;
    strokeColor?: string;
    strokeOpacity?: number;
    strokeStyle?: string;
    zIndex?: number;
    endArrow?: boolean;
}

export interface PolygonStyle {
    strokeWeight?: number;
    strokeColor?: string;
    strokeOpacity?: number;
    strokeStyle?: string;
    fillColor?: string;
    fillOpacity?: number;
}

export interface CircleStyle {
    radius?: number;
    strokeWeight?: number;
    strokeStyle?: string;
    fillOpacity?: number;
    strokeColor?: string;
    fillColor?: string;

}

// 채리엇 색상표
export const polyLineColors: any = [
    'rgb(153,0,153)', 'rgb(139,34,82)', 'rgb(8,187,122)', 'rgb(4,15,102)', 'rgb(111,0,255)',
    'rgb(255,80,80)', 'rgb(244,123,16)', 'rgb(8,121,187)', 'rgb(50,187,33)', 'rgb(34,163,20)',
    'rgb(67,0,187)', 'rgb(0,10,187)', 'rgb(0,0,0)', 'rgb(182,0,182)', 'rgb(0,173,239)',
    'rgb(8,174,187)', 'rgb(255,0,0)', 'rgb(101,187,50)', 'rgb(85,56,187)', 'rgb(187,121,48)',
    'rgb(187,44,65)', 'rgb(168,0,255)', 'rgb(255,38,0)', 'rgb(42,43,158)', 'rgb(0,93,171)',
    'rgb(255,185,77)', 'rgb(102,51,153)', 'rgb(120,0,187)', 'rgb(0,0,255)', 'rgb(65,62,179)',
    'rgb(158,187,54)', 'rgb(187,8,115)', 'rgb(187,44,56)', 'rgb(187,51,49)', 'rgb(255,255,0)',
    'rgb(187,84,111)', 'rgb(33,43,187)', 'rgb(235,110,31)', 'rgb(0,249,0)', 'rgb(128,0,255)',
    'rgb(30,53,94)', 'rgb(116,187,61)', 'rgb(187,65,70)', 'rgb(202,43,11)', 'rgb(187,0,185)',
    'rgb(187,27,21)', 'rgb(26,0,187)'
];

/**
 * 리스트의 모든좌표가 맵에 보일 수 있는 맵바운드값을 가져옴
 * @param list 좌표값을 가진 배열
 */
export function getMapBounds(list: Required<Coordinate | number[]>[]) {
    const bs = bounds();
    if (bs) {
        list.map((item) => {
            if (item) {
                const ll = Array.isArray(item)
                    ? latlng(Number(item[0]), Number(item[1]))
                    : latlng(Number(item.lat), Number(item.lng));
                setExtend(bs, ll);
            }
        });
    }
    return bs;
}

/**
 *
 *
 * @param daummap 다음지도 객체
 * @param pixel 화면 width pixel
 */
export function getMeterPerPixel(daummap: any, pixel: number) {
    const bd = daummap.getBounds();
    const sw = bd.getSouthWest();
    const ne = bd.getNorthEast();
    const pl = [
        { lat: ne.getLat(), lng: ne.getLng() },
        { lat: ne.getLat(), lng: sw.getLng() }
    ];
    const dpl = setPolyline(1, pl);
    const distance = dpl.getLength() / 1000;
    const MPP = distance / pixel;
    // console.table({
    //     '현재 맵의 실제 너비': Math.round(distance * 1000),
    //     '픽셀당 거리': MPP,
    // });

    return MPP;  // (m/pixel)
}

/**
 *   *------*
 *   |      |
 *   |      |
 *   *______*
 *
 * @param mpp meterPerPixel
 * @param param1 마커 위도경도
 * @param param2 마커 너비높이
 */
export function getBoundary(mpp: number, { lat, lng }: Coordinate, { w: width, h: height }: { w: number, h: number }) {
    // console.table({ mpp, lat, lng, width, height });

    const pt = [Number(lng), Number(lat)];
    const point = turf.point(pt);
    const mk_width = width * .5;
    const mk_height = height * .5;
    const w1 = turf.destination(point, mpp * (mk_width) / 2, 90, 'kilometres');
    const w2 = turf.destination(point, mpp * (mk_width / 2), -90, 'kilometres');
    const h1 = turf.destination(point, mpp * mk_height, 0, 'kilometres');

    const pl1 = [
        { lat: w2.geometry?.coordinates[1], lng: w2.geometry?.coordinates[0] }, // sw
        { lat: h1.geometry?.coordinates[1], lng: w1.geometry?.coordinates[0] }, // ne
    ];
    // 미리 만들어 두었던 func으로 교체해도됨.
    const bd = new daum.maps.LatLngBounds(
        new daum.maps.LatLng(pl1[0].lat, pl1[0].lng),
        new daum.maps.LatLng(pl1[1].lat, pl1[1].lng)
    );
    return bd; // bound
}

/**
 * 육각형 버전
 * @param mpp
 * @param param1
 * @param param2
 */
export function getHexaBoundary(mpp: number, { lat, lng }: Coordinate, { w: width, h: height }: { w: number, h: number }) {
    /**
     *     h1
     *     * 4
     *  /      \
     * /*3      \*5
     * |        |
     * |*2      |*6
     *  \      /
     *   \    /
     * w2 \ /   w1
     *     *1
     */

    const mk_width = width;
    const mk_height = height;

    const pt = [Number(lng), Number(lat)];
    const point1 = turf.point(pt);
    const w1 = turf.destination(point1, mpp * (mk_width) / 2, 90, 'kilometres');
    const w2 = turf.destination(point1, mpp * (mk_width / 2), -90, 'kilometres');
    const h1 = turf.destination(point1, mpp * mk_height, 0, 'kilometres');
    const halfOfHeight = turf.destination(h1, mpp * (mk_height / 2), 180, 'kilometres');
    //  3/4 지점

    const threeQuaterOfHeight = turf.destination(point1, mpp * (mk_height / 4 * 3), 0, 'kilometres');

    // lat x |  lng  y
    const [w2Lat, w2Lng] = [w2.geometry?.coordinates[1]!, w2.geometry?.coordinates[0]!];
    const [w1Lat, w1Lng] = [w1.geometry?.coordinates[1]!, w1.geometry?.coordinates[0]!];
    const [h1Lat, h1Lng] = [h1.geometry?.coordinates[1]!, h1.geometry?.coordinates[0]!];
    const [halfOfHeightLat, halfOfHeightLng] = [halfOfHeight.geometry?.coordinates[1]!, halfOfHeight.geometry?.coordinates[0]!];
    const [threeQuaterOfHeightLat, threeQuaterOfHeightLng] = [threeQuaterOfHeight.geometry?.coordinates[1]!, threeQuaterOfHeight.geometry?.coordinates[0]!];

    const point2 = [halfOfHeightLat!, w2Lng!];
    const point3 = [threeQuaterOfHeightLat, w2Lng];
    const point4 = [h1Lat, Number(lng)];
    const point5 = [threeQuaterOfHeightLat, w1Lng];
    const point6 = [halfOfHeightLat, w1Lng];
    // w1 남동
    // w2 남서
    // h1 최상단
    const Points = [
        [Number(lat), Number(lng)],
        point2,
        point3,
        point4,
        point5,
        point6,
    ];
    return {
        Points
    };
}

// bound 값 입력해서 4개의 꼭지점 리스트로 출력
export function getPointList(bd: any, reverse: boolean) {
    const sw = bd.getSouthWest();
    const ne = bd.getNorthEast();
    const ptlist = reverse ?
        [
            [sw.getLng(), sw.getLat()],
            [sw.getLng(), ne.getLat()],
            [ne.getLng(), ne.getLat()],
            [ne.getLng(), sw.getLat()]
        ]
        :
        [
            [sw.getLat(), sw.getLng()],
            [ne.getLat(), sw.getLng()],
            [ne.getLat(), ne.getLng()],
            [sw.getLat(), ne.getLng()]
        ];
    return ptlist;
}

export function isSpotContained(bounds: any, spot: any) {
    return bounds.contain(spot);
}

export function relayout(map: any) {
    checkMapSDK({
        loaded: () => map.relayout(),
        fail: () => false
    });
}

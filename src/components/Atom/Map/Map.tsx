import * as React from 'react';
import './Map.css';
import { initmap, relayout, Coordinate, dampEventValue } from '../../../util/kakaomap';

type mapEvents = {
    click: (value: any) => void,
    rightclick: (value: any) => void,
    drag: (value: any) => void,
    dragend: (value: any) => void,
    dragstart: (value: any) => void,
    zoom_changed: (value: any) => void,
    tilesloaded: (value: any) => void,
    bounds_changed: (value: any) => void,
    center_changed: (value: any) => void,
    /** map 엘리먼트 크기 변경시 */
    resize: (width: number, height: number) => void;

    onRefClick: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
};

interface Props {
    func: Partial<mapEvents>;
    initZoom?: number;
}

interface States {
}

/** */
class Map extends React.Component<Props, States> {
    dmap: any;
    ref = React.createRef<HTMLDivElement>();
    prevWidth: number = 0;
    prevHeight: number = 0;
    constructor(props: Props) {
        super(props);
    }

    componentDidMount() {
        if (this.ref.current) {
            console.log(this.dmap);

            this.dmap = initmap(this.ref.current, this.mapEvents, this.props.initZoom || 3);
        }
    }
    mapEvents = (action: dampEventValue) => {
        switch (action.event) {
            case 'click':
                this.click(action.value);
                break;
            case 'rightclick':
                this.rightclick(action.value);
                break;
            case 'drag':
                this.drag(action.value);
                break;
            case 'dragend':
                this.dragend(action.value);
                break;
            case 'dragstart':
                this.dragstart(action.value);
                break;
            case 'zoom_changed':
                this.zoom_changed(action.value);
                break;
            case 'tilesloaded':
                this.tilesloaded(action.value);
                break;
            case 'bounds_changed':
                this.bounds_changed(action.value);
                break;
            case 'center_changed':
                this.center_changed(action.value);
                break;
            default:
                break;
        }
    }

    resize = (width: number, height: number) => {

        if ((this.prevWidth !== width) || (this.prevHeight !== height)) {

            relayout(this.dmap);
            this.props.func.resize && this.props.func.resize(width, height);
        }
    }

    click = (value: any) => {
        this.props.func.click && this.props.func.click(value);
    }

    rightclick = (value: any) => {
        this.props.func.rightclick && this.props.func.rightclick(value);
    }

    drag = (value: any) => {
        this.props.func.drag && this.props.func.drag(value);
    }

    dragend = (value: Coordinate) => {
        this.props.func.dragend && this.props.func.dragend(value);
    }

    dragstart = (value: Coordinate) => {
        this.props.func.dragstart && this.props.func.dragstart(value);
    }

    zoom_changed = (value: any) => {
        this.props.func.zoom_changed && this.props.func.zoom_changed(value);
    }

    tilesloaded = (value: any) => {
        this.props.func.tilesloaded && this.props.func.tilesloaded(value);
    }

    bounds_changed = (value: any) => {
        if (this.ref.current) {
            if (this.prevWidth !== this.ref.current.clientWidth || this.prevHeight !== this.ref.current.clientHeight) {

                relayout(this.dmap);
                this.prevWidth = this.ref.current.clientWidth;
                this.prevHeight = this.ref.current.clientHeight;
            }
        }
        this.props.func.bounds_changed && this.props.func.bounds_changed(value);
    }

    center_changed = (value: any) => {
        this.props.func.center_changed && this.props.func.center_changed(value);
    }
    render() {
        return (
            <div className="KaKaoMap" id="KaKaoMap" ref={this.ref}>
                {this.props.children && <div className="float">{this.props.children}</div>}
            </div>
        );
    }

}

export default Map;
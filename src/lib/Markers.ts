import { on } from "./Events";
import { library } from "./google-loader";

const { Marker } = await library.maps.importLibrary('marker');
const { InfoWindow } = await library.maps.importLibrary('maps');

export type MarkerIndiv = typeof library.maps.Marker;
export type MarkerGroup = MarkerIndiv[];
export type MarkerMap = typeof library.maps.Map;
export type MarkerBounds = typeof library.maps.LatLngBounds;
export class Markers {
    _markers: MarkerGroup;
    map: MarkerMap;
    _info: typeof InfoWindow;
    constructor(markers: MarkerGroup, map: MarkerMap, bounds:MarkerBounds) {
        this._info = new InfoWindow({
            content: '',
            disableAutoPan: true
        });

        this._markers = markers.map(m => {
            const position = m['Patient LatLng'];

            bounds.extend(position);

            const marker = new Marker({
                position,
                data: m,
                map
            });

            marker.addListener('click', () => {
                this._info.setContent(m['Patient LatLng'].name);
                this._info.open(map, marker);
            });

            return marker;
        });

        this.map = map;
        on('markers:reset', () => this.reset());
    }

    getVisible() {
        return this._markers.filter(m => m.getVisible());
    }

    setVisible(filter: (value: MarkerIndiv, index?: number, array?: MarkerGroup) => void) {
        this._markers.forEach(marker => marker.setVisible(filter(marker)));
    }

    filter(filter: (value: MarkerIndiv, index: number, array: MarkerGroup) => boolean) {
        return this._markers.filter(filter);
    }

    reset() {
        this.setVisible((m:MarkerIndiv) => m.setVisible(true));
    }

    all() {
        return this._markers;
    }
}
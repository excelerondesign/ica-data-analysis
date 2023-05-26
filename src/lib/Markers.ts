import { on } from "./Events";
import { library } from "./google-loader";
const { Marker } = await library.maps.importLibrary('marker');
export type MarkerIndiv = typeof library.maps.Marker;
export type MarkerGroup = MarkerIndiv[];
export type MarkerMap = typeof library.maps.Map;
export type MarkerBounds = typeof library.maps.LatLngBounds;
export class Markers {
    _markers: MarkerGroup;
    map: MarkerMap;
    constructor(markers: MarkerGroup, map: MarkerMap, bounds:MarkerBounds) {
        this._markers = markers.map(m => {
            const position = m['Patient LatLng'];

            bounds.extend(position);

            return new Marker({
                position,
                data: m,
                map
            });
        })
        this.map = map;
        on('markers:reset', () => this.reset());
    }

    getVisible() {
        return this._markers.filter(m => m.getVisible());
    }

    setVisible(filter: (value: MarkerIndiv, index: number, array: MarkerGroup) => void) {
        this._markers.forEach(filter);
    }

    filter(filter: (value: MarkerIndiv, index: number, array: MarkerGroup) => boolean) {
        return this._markers.filter(filter);
    }

    reset() {
        this.setVisible(Boolean);
    }

    all() {
        return this._markers;
    }
}
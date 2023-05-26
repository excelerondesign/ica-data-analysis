import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { Marker } from "@googlemaps/markerclusterer/dist/marker-utils";
import { library } from "./google-loader";


export class Clusterer {
    _self: MarkerClusterer;
    markers: typeof library.maps.Marker[];
    map: typeof library.maps.Map;
    constructor(markers:typeof library.maps.Marker[], map:typeof library.maps.Map) {
        this.markers = markers;
        this.map = map;
        this._self = new MarkerClusterer({ markers, map });
    }

    getHidden() {
        return this.markers.filter(m => !m.getVisible());
    }

    getVisible() {
        return this.markers.filter(m => m.getVisible());
    }

    refresh() {
        const newMarkers = this.markers.filter(m => m.getVisible());
        this._self.clearMarkers();
        this._self.addMarkers(newMarkers);
    }
}
import { convertToMeters, Clinic } from './data';
import { library } from './google-loader';
import { on, emit } from './Events';
// @ts-ignore
const { Circle } = await library.maps.importLibrary('maps');
const { spherical } = await library.maps.importLibrary('geometry');

export class Circles {
    __circles_: typeof Circle[];
    mapEl: HTMLDivElement;
    constructor(map, mapEl:HTMLDivElement, miRadius = 2.5, Clinics: Clinic[]) {
        const radius = convertToMeters(miRadius);

        this.__circles_ = Clinics.map(({ lat, lng, color, name }) => {
            return new Circle({
                center: { lat, lng },
                map,
                fillColor: color,
                fillOpacity: 0.75,
                strokeWeight: 3,
                strokeColor: color,
                strokeOpacity: 1,
                radius,
                name,
            });
        });

        on('circles:update', (({ radius }:{ radius: number }) => this.updateRadius(radius)));

        this.mapEl = mapEl;
    }

    showAll() {
        this.__circles_.forEach(c => c.setVisible(true));
    }

    hide(name:string|string[]) {
        if (name instanceof String) name = [name as string];

        this.__circles_.forEach((c) => c.setVisible(name.includes(c.name)));
    }

    updateRadius(newRadiusInMi:number) {
        const radius = convertToMeters(newRadiusInMi);
        this.__circles_.forEach(circle => circle.setRadius(radius));
        emit('filters:refresh');
    }

    calculateInCircle(marker, name:string|string[]) {
        if (name instanceof String) name = [name as string];


        const pos = marker.getPosition();

        const calcCircles = this.__circles_.filter(c => name.includes(c.name));;
        const results = calcCircles.map(c => {
            const center = c.getCenter();
            const distance = spherical.computeDistanceBetween(center, pos);

            return distance <= c.getRadius();
        })

        return results.every(Boolean);
        /*
        if (name) {
            const clinic = this.__circles_.filter(c => c.name === name)[0];

            const center = clinic.getCenter();

            const distance = spherical.computeDistanceBetween(center, pos);
            const radius = clinic.getRadius();
            return distance <= radius;
        }

        const results = this.__circles_.filter(c => {
            const center = c.getCenter();
            const distance = spherical.computeDistanceBetween(center, pos);
            const radius = c.getRadius();
            return distance <= radius;
        })

        return results;*/
    }

    calculateInBounds(marker, name = null) {
        
        if (name) {
            const clinic = this.__circles_.filter(c => c.name === name)[0];

            const bounds = clinic.getBounds();

            return bounds.contains(marker.getPosition());
        }

        const results = this.__circles_.filter(c => {
            const pos = marker.getPosition();

            const bounds = c.getBounds();

            return bounds.contains(pos);
        });

        return results;
    }

    get bounds() {
        return this.__circles_.map(circle => circle.getBounds());
    }
}
import { groq, useSanityClient } from "astro-sanity";

export const MapColors = ['#dfa','#adf','#e0f'];

type ClinicColor = {
    _type: string;
    rgb: {
        _type: string;
        a: number;
        b: number;
        r:number;
        g: number
    },
    hex: string;
    hsl: {
        _type: string;
        h: number;
        s: number;
        l: number;
        a: number
    }
    alpha: number;
    hsv: {
        _type: string;
        v: number;
        h: number;
        s: number;
        a: number;
    }
}
export type ClinicFetch = {
    name: string;
    lat: number;
    lng: number;
    color: ClinicColor;
}
export type Clinic = {
    name: string;
    lat: number;
    lng: number;
    color: string;
    // _color: ClinicColor;
}
export const Clinics:Clinic[] = [
    {
        name: 'Denver',
        lat: 39.754311,
        lng: -105.017387,
        color: '#dfa'
    },
    {
        name: 'Parker',
        lat: 39.55452,
        lng: -104.77081,
        color: '#e0f'
    },
    {
        name: 'Thornton',
        lat: 39.86675,
        lng: -104.98576,
        color: '#adf'
    }
];
/** Although it would be incredibly useful to get the clinics from a hook function like this, it doesn't seem to work with the sanity client */
/*
export const getClinics = async () => {
    const _clinics = await useSanityClient().fetch<ClinicFetch[]>(groq`*[_type == 'location']{ color, name, lat, lng }`);
    return _clinics.map<Clinic>(({ name, color, lat, lng }) => {
        const _color = color;
        return {
            name,
            lat,
            lng,
            color: color.hex,
            _color
        }
    })
}*/

const getRandomAlter = (base:number) => Math.random() > 0.5 ? base + Math.random() : base - Math.random();

const getRandomLatLng = (Clinics:Clinic[]) => {
    const clinicSeed = Math.random();
    const clinicBase = clinicSeed > 0.33 ? Clinics[0] : clinicSeed > 0.66 ? Clinics[1] : Clinics[2];
    
    const data = {
        ...clinicBase,
        lat: getRandomAlter(clinicBase.lat),
        lng: getRandomAlter(clinicBase.lng)
    };

    return data;
}

export const _markers = (Clinics:Clinic[]) => {
    const data = Array.from({ length: 1000 }, (x, i) => {
        return {
            ['Patient Gender']: Math.random() > 0.5 ? 'male' : 'female',
            ['Patient Acct No']: i,
            ['Patient LatLng']: getRandomLatLng(Clinics)
        }
    });

    return data;
}

export const convertToMeters = (mi:number) => mi * 1604.344;
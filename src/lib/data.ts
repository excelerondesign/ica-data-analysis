export const MapColors = ['#dfa','#adf','#e0f'];

export type Clinic = {
    name: string;
    lat: number;
    lng: number;
    color: string;
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

export const PossibleRaces = [
    'White',
    'Hispanic',
    'African American'
];

const getRandomIndex = (arr:unknown[]):number => Math.floor(Math.random() * arr.length);

export const _markers = (Clinics:Clinic[], supplemental:{}[]) => {
    const data = Array.from({ length: 1000 }, (x, i) => {
        const extraData = supplemental[i];
        const _markerData = {
            ['Patient Gender']: Math.random() > 0.5 ? 'male' : 'female',
            ['Patient Acct No']: i,
            ['Patient LatLng']: getRandomLatLng(Clinics),
            ['Patient Race']: PossibleRaces[getRandomIndex(PossibleRaces)],
            ...extraData
        }

        return _markerData;
    });

    return data;
}

export const convertToMeters = (mi:number) => mi * 1604.344;

export const cookies = {
    get(name:string):string {
        let value = '; '+document?.cookie;
        let parts = value.split('; '+name+'=');
        if (parts.length == 2) return parts.pop().split(";").shift();
    },
    set: (name:string, value:string) => document.cookie = `${name}=${value}`,
    remove: (name:string) => document.cookie = `${name}=null; path=/; max-age=0`,
}